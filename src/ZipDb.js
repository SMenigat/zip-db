const fs = require("fs");
const ZipDbCollection = require("./ZipDbCollection.js");
const ZipDbEncryptor = require("./ZipDbEncryptor.js");
const ZipDbCompressor = require("./ZipDbCompressor.js");

class ZipDb {
  constructor(databaseFilePath, password = "") {
    this.dbPath = databaseFilePath;

    // initialize compressor
    this.compressor = new ZipDbCompressor("zip-db");

    // initialize encryptor
    this.encryptor = new ZipDbEncryptor(password);

    // initialize default members
    this._initMembers();

    if (this.isExisting()) {
      // parse existing database file
      this.parseDbFile(this.dbPath);
    } else {
      // we persist the database with the default options
      // and create it that way
      this.persist();
    }
  }
  _initMembers() {
    this.version = 1;
    this.collections = new Map();
  }
  isExisting() {
    return fs.existsSync(this.dbPath);
  }
  parseDbFile(databaseFilePath) {
    const rawFileBody = fs.readFileSync(databaseFilePath, {
      encoding: "binary"
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
      this.collections = new Map();
      Object.keys(parsedBody.collections).forEach(colKey => {
        const collectionData = parsedBody.collections[colKey].data;

        // generate new Map from this collection object
        const collectionMap = new Map();
        Object.keys(collectionData).forEach(entityId => {
          const entity = collectionData[entityId.toString()];
          collectionMap.set(entityId.toString(), entity);
        });

        this.collections.set(colKey.toString(), new ZipDbCollection(
          colKey,
          collectionMap
        ));
      });
    }
  }
  createCollection(name) {
    if (this.hasCollection(name)) {
      return false;
    }
    const newCollection = new ZipDbCollection(name);
    this.collections.set(name, newCollection);
    return newCollection;
  }
  hasCollection(name) {
    return this.collections.has(name);
  }
  getAllCollections() {
    const allCollections = [];
    Array.from(this.collections.keys()).forEach(key => {
      allCollections.push(this.collections.get(key));
    });
    return allCollections;
  }
  getCollection(name) {
    return this.collections.get(name);
  }
  removeCollection(name) {
    this.collections.delete(name);
  }
  rollBack() {
    this._initMembers();
    this.parseDbFile(this.dbPath);
  }
  persist() {

    const objectifiedCollections = {};
    this.collections.forEach((collection, collectionName) => {
      const plainCollection = {
        name: collectionName.toString(),
        data: {},
      };
      collection.getAll().forEach((entity) => {
        plainCollection.data[entity.id.toString()] = entity;
      });
      objectifiedCollections[collectionName.toString()] = plainCollection;
    });

    // create clean database object from references
    const db = {
      version: this.version,
      collections: objectifiedCollections
    };

    // serialize the object
    const stringifiedDb = JSON.stringify(db);
    
    // encrypt the database content
    const encryptedDb = this.encryptor.encrypt(stringifiedDb);

    // zip the encrypted db content
    const compressedDb = this.compressor.compress(encryptedDb);

    // write back onto disk
    fs.writeFileSync(this.dbPath, compressedDb, {
      encoding: "binary"
    });
  }
  _debug() {
    console.log();
    console.log('--- ZipDB Debug Dump -------------------------');
    console.log('Verison: ', this.version);
    console.log('FilePath: ', this.dbPath);
    console.log();
    console.log('--- Collections ---');
    this.getAllCollections().forEach(col => {
      console.log(col.name);
      console.log(col.getAll());
      console.log();
    });
  }
}

module.exports = ZipDb;
