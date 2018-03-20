const uniqid = require("uniqid");

class JsonDbCollection {
  constructor(name, data = {}) {
    this.name = name;
    this.data = data;
  }
  add(entity) {
    const newId = uniqid();
    this.data[newId] = Object.assign(
      {
        id: newId
      },
      entity
    );
    return newId;
  }
  getById(entityId) {
    return this.data[entityId];
  }
  removeById(entityId) {
    delete this.data[entityId];
  }
  getAll() {
    return Object.keys(this.data).map(key => this.data[key]);
  }
  truncate() {
    this.data = {};
  }
}

module.exports = JsonDbCollection;
