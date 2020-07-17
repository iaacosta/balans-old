import passport from 'passport';
import {
  Strategy as BearerStrategy,
  VerifyFunction,
} from 'passport-http-bearer';
import { getRepository } from 'typeorm';
import jwt from 'jsonwebtoken';
import User from '../models/User';

export type ContextUser = Promise<Pick<User, 'role' | 'id'> | null>;
export const getUserFromToken: VerifyFunction = async (token, done) => {
  try {
    const { id } = jwt.verify(token, process.env.SECRET!) as { id: number };
    const user = await getRepository(User).findOne(id, {
      select: ['id', 'role'],
    });

    if (!user) done(null, null);
    else done(null, user);
  } catch (err) {
    done(err);
  }
};

passport.use(new BearerStrategy(getUserFromToken));

export const authenticateUser = (req: Express.Request): ContextUser =>
  new Promise((resolve, reject) =>
    passport.authenticate('bearer', { session: false }, (err, user) => {
      if (err) reject(err);
      resolve(user || null);
    })(req),
  );
