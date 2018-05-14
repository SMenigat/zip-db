const NodeZip = require("node-zip");
const ExceptionTypes = require("../ExceptionTypes");
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
    if (
      zip.files &&
      zip.files[this.fileName] &&
      zip.files[this.fileName]._data
    ) {
      const unzippedContent = zip.files[this.fileName]._data;
      return unzippedContent;
    } else {
      throw ExceptionTypes.UNZIP_ERROR;
    }
  }
}

module.exports = ZipDbCompressor;
