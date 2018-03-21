const uniqid = require("uniqid");

class ZipDbCollection {
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
  getAll() {
    return Object.keys(this.data).map(key => this.data[key]);
  }
  getById(entityId) {
    return this.data[entityId];
  }
  removeById(entityId) {
    delete this.data[entityId];
  }
  truncate() {
    this.data = {};
  }
  updateById(id, entity) {
    const updatedEntity = Object.assign(
      entity, { id }
    );
    this.data[id] = updatedEntity;
    return updatedEntity;
  }
}

module.exports = ZipDbCollection;
