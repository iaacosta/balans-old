import passport from 'passport';
import { Strategy as BearerStrategy } from 'passport-http-bearer';
import { getRepository } from 'typeorm';
import jwt from 'jsonwebtoken';

import User from '../models/User';

passport.use(
  new BearerStrategy(async (token, done) => {
    try {
      const { id } = jwt.verify(token, process.env.SECRET!) as { id: number };
      const user = await getRepository(User).findOne(id, {
        select: ['id', 'role'],
      });

      if (!user) done(null, null);
      done(null, user);
    } catch (err) {
      done(err);
    }
  }),
);

export default (req: Express.Request): Promise<User | null> =>
  new Promise((resolve, reject) =>
    passport.authenticate('bearer', { session: false }, (err, user) => {
      if (err) reject(err);
      resolve(user || null);
    })(req),
  );
