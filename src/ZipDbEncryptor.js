const crypto = require("crypto");

class ZipDbEncryptor {
  constructor(password) {
    this.password = password;
  }
  encrypt(content) {
    var cipher = crypto.createCipher("aes-256-ctr", this.password);
    var encryptedContent = cipher.update(content, "utf8", "hex");
    encryptedContent += cipher.final("hex");
    return encryptedContent;
  }
  decrypt(content) {
    var decipher = crypto.createDecipher("aes-256-ctr", this.password);
    var decriptedContent = decipher.update(content, "hex", "utf8");
    decriptedContent += decipher.final("utf8");
    return decriptedContent;
  }
}

module.exports = ZipDbEncryptor;
