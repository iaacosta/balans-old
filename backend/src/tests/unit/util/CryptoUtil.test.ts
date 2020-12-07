import { genSaltSync, hashSync } from 'bcrypt';
import { CryptoUtil } from '../../../utils';

jest.mock('typeorm');
jest.mock('type-graphql');

describe('CryptoUtil tests', () => {
  describe('hashing', () => {
    const testRaw = 'Hello world';

    it('should hash data on save', async () => {
      const hashed = await CryptoUtil.hashData(testRaw);
      expect(hashed).not.toBe(testRaw);
    });

    it('should match data on compare', async () => {
      const hashed = hashSync(testRaw, genSaltSync(10));
      await expect(
        CryptoUtil.verifyHash({ data: testRaw, hashed }),
      ).resolves.toBe(true);
    });

    it('should not match data on failed compare', async () => {
      const hashed = hashSync(testRaw, genSaltSync(10));
      await expect(
        CryptoUtil.verifyHash({ data: 'noop', hashed }),
      ).resolves.toBe(false);
    });
  });

  describe('encryption', () => {
    const testIv = 'b422f85422e3ec8b21bf69631ab6b6db';
    const testCipherKey = '72f47a5f6bcb1b96a9d77b2c2f1463395d4a3a325fada629';
    const testEncryption =
      'a1f5087130081e53c267f9f6d0d07fcd5595d10585c58ca326f4b4';
    const testDecrypted = 'Hello world';

    beforeAll(() => {
      process.env.CIPHER_PASSWORD = 'test';
    });

    it('should encrypt data correctly', async () => {
      const [encrypted] = await CryptoUtil.encryptData({
        hexInitVector: testIv,
        batch: [testDecrypted],
      });

      expect(encrypted).toBe(testEncryption);
    });

    it('should decrypt data correctly', async () => {
      const [decrypted] = await CryptoUtil.decryptData({
        hexInitVector: testIv,
        batch: [testEncryption],
      });

      expect(decrypted).toBe(testDecrypted);
    });

    it('should compute cipher key', async () => {
      const cipherKey = await CryptoUtil.getCipherKey();
      expect(cipherKey.toString('hex')).toBe(testCipherKey);
    });
  });
});
