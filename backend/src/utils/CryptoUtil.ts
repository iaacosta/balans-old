import {
  scrypt as callbackScrypt,
  createCipheriv,
  createDecipheriv,
} from 'crypto';
import { compare, genSalt, hash } from 'bcrypt';
import { promisify } from 'util';
import encryption from '../constants/encryption';

const scrypt = promisify<string, string, number, Buffer>(callbackScrypt);

export type EncryptionData = {
  hexInitVector: string;
  batch: string[];
};

export type VerifyHashData = {
  data: string;
  hashed: string;
};

export class CryptoUtil {
  static async encryptData({
    hexInitVector,
    batch,
  }: EncryptionData): Promise<string[]> {
    const cipherKey = await CryptoUtil.getCipherKey();
    const initVector = Buffer.from(hexInitVector, 'hex');

    return batch.map((credential) => {
      const cipher = createCipheriv(
        encryption.cipherAlgorithm,
        cipherKey,
        initVector,
      );

      const encrypted =
        cipher.update(credential, 'utf8', 'hex') + cipher.final('hex');

      return `${cipher.getAuthTag().toString('hex')}${encrypted}`;
    });
  }

  static async decryptData({
    batch,
    hexInitVector,
  }: EncryptionData): Promise<string[]> {
    const cipherKey = await CryptoUtil.getCipherKey();
    const initVector = Buffer.from(hexInitVector, 'hex');

    return batch.map((credential) => {
      const decipher = createDecipheriv(
        encryption.cipherAlgorithm,
        cipherKey,
        initVector,
      );

      decipher.setAuthTag(Buffer.from(credential.slice(0, 32), 'hex'));
      const decrypted =
        decipher.update(credential.slice(32), 'hex', 'utf8') +
        decipher.final('utf8');

      return decrypted;
    });
  }

  static async hashData(data: string): Promise<string> {
    const salt = await genSalt(10);
    return hash(data, salt);
  }

  static async verifyHash({ data, hashed }: VerifyHashData): Promise<boolean> {
    try {
      const equal = await compare(data, hashed);
      return equal;
    } catch (err) {
      return false;
    }
  }

  static getCipherKey(): Promise<Buffer> {
    const cipherPassword = process.env.CIPHER_PASSWORD!;
    return scrypt(cipherPassword, 'salt', 24);
  }
}
