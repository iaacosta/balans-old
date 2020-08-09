import passport from 'passport';
import {
  Strategy as BearerStrategy,
  VerifyFunction,
} from 'passport-http-bearer';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import TokenExpiredError from '../errors/TokenExpiredError';

export type ContextUser = Promise<Pick<User, 'role' | 'id'> | null>;
export const getUserFromToken: VerifyFunction = (token, done) => {
  try {
    const { user } = jwt.verify(token, process.env.SECRET!) as { user: User };
    if (!user) done(null, null);
    else done(null, user);
  } catch (err) {
    done(new TokenExpiredError());
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
