import jwt from 'jsonwebtoken';

import { authenticateUser, getUserFromToken } from '../../../services/passport';
import { userFactory } from '../../factory/userFactory';
import TokenExpiredError from '../../../errors/TokenExpiredError';

const foundUser = userFactory();
const token = 'mockToken';

describe('passport', () => {
  let verify: jest.SpyInstance;

  beforeEach(() => {
    verify = jest
      .spyOn(jwt, 'verify')
      .mockImplementation(() => ({ user: foundUser }));
  });

  describe('getUserFromToken', () => {
    it('should call verify', () => {
      getUserFromToken(token, () => null);
      expect(verify).toHaveBeenCalledTimes(1);
      expect(verify).toHaveBeenCalledWith(token, expect.anything());
    });

    it('should call done with found user', () => {
      const done = jest.fn();
      getUserFromToken(token, done);
      expect(done).toHaveBeenCalledTimes(1);
      expect(done).toHaveBeenCalledWith(null, foundUser);
    });

    it('should call done with error', async () => {
      jest.spyOn(jwt, 'verify').mockImplementation(() => {
        throw new Error('noop');
      });
      const done = jest.fn();
      await getUserFromToken(token, done);
      expect(done).toHaveBeenCalledTimes(1);
      expect(done.mock.calls[0][0]).toBeInstanceOf(TokenExpiredError);
    });
  });

  describe('authenticateUser', () => {
    it('should authenticate correctly if token given', async () => {
      expect(
        await authenticateUser({
          headers: { authorization: 'Bearer example' },
        } as any),
      ).toMatchObject(foundUser);
    });

    it('should not authenticate if no token given', async () => {
      expect(await authenticateUser({ headers: {} } as any)).toBeNull();
    });

    it('should not authenticate if error', async () => {
      verify = jest.spyOn(jwt, 'verify').mockImplementation(() => {
        throw new Error('noop');
      });

      await expect(
        authenticateUser({
          headers: { authorization: 'Bearer example' },
        } as any),
      ).rejects.toBeTruthy();
    });
  });
});
