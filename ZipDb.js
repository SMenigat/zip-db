const fs = require("fs");
const ZipDbCollection = require("./ZipDbCollection.js");

class ZipDb {
  constructor(databaseFilePath) {
    this.dbPath = databaseFilePath;

    // initialize default members
    this.version = 1;
    this.collections = {};

    if (this.isExisting()) {
      // parse existing database file
      this.parseDbFile(this.dbPath);
    } else {
      // we persist the database with the default options
      // and create it that way
      this.persist();
    }
  }
  isExisting() {
    return fs.existsSync(this.dbPath);
  }
  parseDbFile(databaseFilePath) {
    const rawFileBody = fs.readFileSync(databaseFilePath);
    const parsedBody = JSON.parse(rawFileBody);

    // parse version
    if (parsedBody.version) {
      this.version = parsedBody.version;
    }

    // initialize collections
    if (parsedBody.collections) {
      Object.keys(parsedBody.collections).forEach(colKey => {
        this.collections[colKey] = new ZipDbCollection(
          colKey,
          parsedBody.collections[colKey].data
        );
      });
    }
  }
  hasCollection(name) {
    return !!this.collections[name];
  }
  getCollection(name) {
    return this.collections[name];
  }
  createCollection(name) {
    if (this.hasCollection(name)) {
      return false;
    }
    const newCollection = new ZipDbCollection(name);
    this.collections[name] = newCollection;
    return newCollection;
  }
  persist() {
    // create clean database object from references
    const db = {
      version: this.version,
      collections: this.collections
    };

    // serialize the object
    const stringifiedDb = JSON.stringify(db);

    // write back onto disk
    fs.writeFileSync(this.dbPath, stringifiedDb);
  }
}

module.exports = ZipDb;
