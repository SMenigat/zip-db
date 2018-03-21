const ZipDbEncryptor = require("../ZipDbEncryptor.js");

describe('ZipDbEncryptor', () => {
    let encryptor;
    let encryptedContent;
    let decryptedContent;
    beforeEach(() => {
        encryptor = new ZipDbEncryptor('my-secret-password');
        encryptedContent = encryptor.encrypt('secret content');
        decryptedContent = encryptor.decrypt(encryptedContent);
    });
    describe('encrypt(content)', () => {
        it('encrypts given content with aes-256-ctr', () => {
            expect(encryptedContent).toBe('9981c41f4db3c35dd3debcfd8878');
        });
    });
    describe('decrypt(encryptedContent)', () => {
        it('decrypts given content with aes-256-ctr', () => {
            expect(decryptedContent).toBe('secret content');
        });
    });
});