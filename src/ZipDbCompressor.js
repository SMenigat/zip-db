const NodeZip = require("node-zip");

class ZipDbCompressor {
  constructor(fileName) {
    this.fileName = fileName;
  }

  compress(contents) {
    const zip = new NodeZip();
    zip.file(this.fileName, contents);
    const compressedContent = zip.generate({
      base64: false,
      compression: "DEFLATE"
    });
    return compressedContent;
  }

  decompress(rawContents) {
    const zip = new NodeZip(rawContents, { base64: false, checkCRC32: true });
    const unzippedContent = zip.files[this.fileName]._data;
    return unzippedContent;
  }
}

module.exports = ZipDbCompressor;
