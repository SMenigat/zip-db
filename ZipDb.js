const fs = require("fs");
const ZipDbCollection = require("./ZipDbCollection.js");
const ZipDbEncryptor = require("./ZipDbEncryptor.js");
const ZipDbCompressor = require("./ZipDbCompressor.js");

class ZipDb {
  constructor(databaseFilePath, password = '') {
    this.dbPath = databaseFilePath;

    // initialize compressor
    this.compressor = new ZipDbCompressor('zip-db');

    // initialize encryptor
    this.encryptor = new ZipDbEncryptor(password);

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
    const rawFileBody = fs.readFileSync(databaseFilePath, {
      encoding: 'binary',
    });

    // unzip first
    const unzippedFileBody = this.compressor.decompress(rawFileBody);

    // decrypt raw file body
    const decryptedFileBody = this.encryptor.decrypt(unzippedFileBody);

    // parse decrypted body
    const parsedBody = JSON.parse(decryptedFileBody);

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

    // encrypt the database content
    const encryptedDb = this.encryptor.encrypt(stringifiedDb);

    // zip the encrypted db content
    const compressedDb = this.compressor.compress(encryptedDb);

    // write back onto disk
    fs.writeFileSync(this.dbPath, compressedDb, {
      encoding: 'binary',
    });
  }
}

module.exports = ZipDb;
