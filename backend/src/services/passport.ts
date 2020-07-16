import passport from 'passport';
import { Strategy as BearerStrategy } from 'passport-http-bearer';
import { getRepository } from 'typeorm';
import jwt from 'jsonwebtoken';

import User from '../models/User';

passport.use(
  new BearerStrategy(async (token, done) => {
    try {
      const { id } = jwt.verify(token, process.env.SECRET!) as { id: number };
      const user = await getRepository(User).findOne(id);
      if (!user) done(null, null);
      done(null, user);
    } catch (err) {
      done(err);
    }
  }),
);

export const authenticateUser = (
  req: Express.Request,
): Promise<object | null> =>
  new Promise((resolve, reject) =>
    passport.authenticate('bearer', { session: false }, (err, user) => {
      if (err) reject(err);
      resolve(user || null);
    })(req),
  );
