import passport from 'passport';
import {
  Strategy as BearerStrategy,
  VerifyFunction,
} from 'passport-http-bearer';
import jwt from 'jsonwebtoken';
import { getManager } from 'typeorm';
import { ApolloError } from 'apollo-server-express';
import User from '../models/User';
import TokenExpiredError from '../errors/TokenExpiredError';

export const getUserFromToken: VerifyFunction = (token, done) => {
  try {
    const { user } = jwt.verify(token, process.env.SECRET!) as { user: User };
    return getManager()
      .getRepository(User)
      .findOne(user.id)
      .then((dbUser) => done(null, dbUser))
      .catch((err) => done(new ApolloError(err)));
  } catch (err) {
    done(new TokenExpiredError());
    return null;
  }
};

passport.use(new BearerStrategy(getUserFromToken));

// eslint-disable-next-line no-undef
export const authenticateUser = (req: Express.Request): Promise<User | null> =>
  new Promise((resolve, reject) =>
    passport.authenticate('bearer', { session: false }, (err, user) => {
      if (err) reject(err);
      resolve(user || null);
    })(req),
  );
