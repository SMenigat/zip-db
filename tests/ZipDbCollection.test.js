const ZipDbCollection = require("../ZipDbCollection.js");

describe("ZipDbCollection", () => {
  let col;
  beforeEach(() => {
    col = new ZipDbCollection("fruits");
  });
  it("can be initialized", () => {
    expect(col).toEqual({
      name: "fruits",
      data: {}
    });
  });
  describe("add(entity)", () => {
    let id;
    beforeEach(() => {
      id = col.add({ name: "Banana" });
    });
    it("adds a new entity to the collection", () => {
      expect(col.data[id]).toEqual({
        id,
        name: "Banana"
      });
    });
    it("returns id of added entity", () => {
      expect(id).toEqual(expect.any(String));
    });
  });
  describe("getAll()", () => {
    beforeEach(() => {
      col.add({ name: "Banana" });
      col.add({ name: "Melon" });
    });
    it("returns a array holding all the data", () => {
      expect(col.getAll()).toEqual([
        {
          id: expect.any(String),
          name: "Banana"
        },
        {
          id: expect.any(String),
          name: "Melon"
        }
      ]);
    });
  });
  describe("getById(id)", () => {
    let id;
    beforeEach(() => {
      id = col.add({ name: "Banana" });
    });
    it("returns entity", () => {
      const entity = col.getById(id);
      expect(entity).toEqual({
        id,
        name: "Banana"
      });
    });
  });
  describe("removeById(id)", () => {
    let appleId;
    let melonId;
    beforeEach(() => {
      appleId = col.add({ name: "Apple" });
      const bananaId = col.add({ name: "Banana" });
      melonId = col.add({ name: "Melon" });
      col.removeById(bananaId);
    });
    it("removes entity", () => {
      expect(col.data).toEqual({
        [appleId]: {
          id: appleId,
          name: "Apple"
        },
        [melonId]: {
          id: melonId,
          name: "Melon"
        }
      });
    });
  });
  describe("tuncate()", () => {
    beforeEach(() => {
      col.add({ name: "Apple" });
      col.add({ name: "Banana" });
      col.add({ name: "Melon" });
    });
    it("deletes all entities", () => {
      expect(Object.keys(col.data)).toHaveLength(3);
      col.truncate();
      expect(Object.keys(col.data)).toHaveLength(0);
    });
  });
  describe("updateById(id, entity)", () => {
    let appleId;
    let bananaId;
    let melonId;
    beforeEach(() => {
      appleId = col.add({ name: "Apple" });
      bananaId = col.add({ name: "Banana" });
      melonId = col.add({ name: "Melon" });
    });
    it("updates entity within collection", () => {
      col.updateById(melonId, { name: "Honeymelon" });
      expect(col.data).toEqual({
        [appleId]: {
          id: appleId,
          name: "Apple"
        },
        [bananaId]: {
          id: bananaId,
          name: "Banana"
        },
        [melonId]: {
          id: melonId,
          name: "Honeymelon"
        }
      });
    });
    it("returns updated entity", () => {
      const updatedEntity = col.updateById(melonId, { name: "Honeymelon" });
      expect(updatedEntity).toEqual({
        id: melonId,
        name: "Honeymelon"
      });
    });
  });
});
