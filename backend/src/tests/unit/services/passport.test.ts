import jwt from 'jsonwebtoken';
import * as typeorm from 'typeorm';

import { authenticateUser, getUserFromToken } from '../../../services/passport';
import { userFactory } from '../../factory/userFactory';
import TokenExpiredError from '../../../errors/TokenExpiredError';

const testUser = userFactory();
const tokenUser = { id: 1, role: testUser.role };
const token = 'mockToken';

describe('passport', () => {
  let verify: jest.SpyInstance;
  const getManager = jest.spyOn(typeorm, 'getManager').mockImplementation(
    () =>
      ({
        getRepository: () => ({
          findOne: async (id: number) => ({ ...testUser, id }),
        }),
      } as any),
  );

  beforeEach(() => {
    verify = jest
      .spyOn(jwt, 'verify')
      .mockImplementation(() => ({ user: tokenUser }));
    getManager.mockClear();
  });

  describe('getUserFromToken', () => {
    it('should call verify', async () => {
      await getUserFromToken(token, () => null);
      expect(verify).toHaveBeenCalledTimes(1);
      expect(verify).toHaveBeenCalledWith(token, expect.anything());
    });

    it('should call getManager', async () => {
      await getUserFromToken(token, () => null);
      expect(getManager).toHaveBeenCalledTimes(1);
    });

    it('should call done with found user', async () => {
      const done = jest.fn();
      await getUserFromToken(token, done);
      expect(done).toHaveBeenCalledTimes(1);
      expect(done).toHaveBeenCalledWith(null, {
        id: tokenUser.id,
        ...testUser,
      });
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
      ).toMatchObject(tokenUser);
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
