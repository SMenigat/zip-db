const ZipDbCompressor = require("../ZipDbCompressor.js");

describe("ZipDbCompressor", () => {
  let compressor;
  const zipB64DynamicPart = "UEsDBAoAAAAIAKdmdUypMMX+CQAAAAcAAAAIAAAAZmlsZW5hbWVLzs8rSc0rAQBQSwECFAAKAAAACACnZnVMqTDF";
  const zipB64RelevantFileString = "kAAAAHAAAACAAAAAAAAAAAAAAAAAAAAAAAZmlsZW5hbWVQSwUGAAAAAAEAAQA2AAAALwAAAAAA";
  const zipB64 = `${zipB64DynamicPart}/g${zipB64RelevantFileString}`;
  beforeEach(() => {
    compressor = new ZipDbCompressor("filename");
  });
  describe("compress(content)", () => {
    it("returns compressed binary content", () => {
      const compressedContent = compressor.compress("content");
      const comparableBinaryContent = btoa(compressedContent);
      // remove dynamic part
      const fileRelevantBinaryContent = comparableBinaryContent.substring(zipB64DynamicPart.length + 2);
      expect(fileRelevantBinaryContent).toContain(zipB64RelevantFileString);
    });
  });
  describe("decompress(rawContent)", () => {
    it("returns decompressed string content", () => {
      const binaryContent = atob(zipB64);
      const decompressedContent = compressor.decompress(binaryContent);
      expect(decompressedContent).toEqual("content");
    });
  });
});
