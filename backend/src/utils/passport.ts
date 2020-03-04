import passport, { Strategy } from 'passport';
import { compare } from 'bcrypt';
import { Request } from 'express';

class PasswordStrategy extends Strategy {
  name: string;

  constructor() {
    super();
    this.name = 'password';
  }

  static getPassword(authorization: string | undefined) {
    if (!authorization) throw new Error('no authorization given');

    const [keyword, password] = authorization.split(' ');

    if (keyword !== 'Password') throw new Error('invalid header');
    if (!password || password.length === 0) {
      throw new Error('no password given');
    }

    return password;
  }

  async authenticate({ headers }: Request) {
    let password: string;

    try {
      password = PasswordStrategy.getPassword(headers.authorization);
    } catch (err) {
      return this.error(err.message);
    }

    try {
      const same = await compare(
        password,
        '$2b$10$tk3xtM0wjzn4tD2n2t/HqOp1N5lygumLw8X9PAW5wfWSwAmo/zEci',
      );

      if (!same) return this.error('wrong password');
      return this.success({});
    } catch (err) {
      return this.error('hash error');
    }
  }
}

passport.use(new PasswordStrategy());

export default passport;
