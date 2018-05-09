const uniqid = require("uniqid");

class ZipDbCollection {
  constructor(name, data = new Map()) {
    this.name = name;
    this.data = data;
  }
  add(entity) {
    const newId = uniqid();
    const newEntity = Object.assign(
      entity,
      {
        id: newId
      }
    );
    this.data.set(newId, newEntity);
    return newId;
  }
  getAll() {
    return Array.from(this.data.keys()).map(key => this.data.get(key));
  }
  getById(entityId) {
    return this.data.get(entityId.toString());
  }
  removeById(entityId) {
    this.data.delete(entityId.toString());
  }
  truncate() {
    this.data = new Map();
  }
  updateById(entityId, entity) {
    const updatedEntity = Object.assign(
      entity, { id: entityId }
    );
    this.data.set(entityId.toString(), updatedEntity);
    return updatedEntity;
  }
}

module.exports = ZipDbCollection;
