import { compare, genSalt, hash } from 'bcrypt';

export type VerifyHashData = {
  data: string;
  hashed: string;
};

export class CryptoUtil {
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
}
