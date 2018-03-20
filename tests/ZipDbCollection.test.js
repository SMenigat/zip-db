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
  describe("add()", () => {
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
  describe("getById()", () => {
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
  describe("removeById()", () => {
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
    it('deletes all entities', () => {
        expect(Object.keys(col.data)).toHaveLength(3);
        col.truncate();
        expect(Object.keys(col.data)).toHaveLength(0);
    });
  });
});
