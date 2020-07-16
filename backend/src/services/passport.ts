import passport from 'passport';
import { Strategy as BearerStrategy } from 'passport-http-bearer';

passport.use(
  new BearerStrategy((token, done) => {
    done(null, { name: 'example user' });
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
