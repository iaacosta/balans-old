import jwt from 'jsonwebtoken';
import * as typeorm from 'typeorm';

import { authenticateUser, getUserFromToken } from '../../../services/passport';
import { buildUser } from '../../factory/userFactory';

const foundUser = buildUser();
const token = 'mockToken';

describe('passport', () => {
  let verify: jest.SpyInstance;

  beforeEach(() => {
    verify = jest.spyOn(jwt, 'verify').mockImplementation(() => ({ id: 1 }));
  });

  describe('getUserFromToken', () => {
    it('should call verify', async () => {
      await getUserFromToken(token, () => null);
      expect(verify).toHaveBeenCalledTimes(1);
      expect(verify).toHaveBeenCalledWith(token, expect.anything());
    });

    it('should call done with found user', async () => {
      const findOne = jest.fn(() => foundUser);
      jest
        .spyOn(typeorm, 'getRepository')
        .mockImplementation(() => ({ findOne } as any));
      const done = jest.fn();
      await getUserFromToken(token, done);
      expect(done).toHaveBeenCalledTimes(1);
      expect(done).toHaveBeenCalledWith(null, foundUser);
    });

    it('should call done with not found user', async () => {
      const findOne = jest.fn(() => null);
      jest
        .spyOn(typeorm, 'getRepository')
        .mockImplementation(() => ({ findOne } as any));

      const done = jest.fn();
      await getUserFromToken(token, done);
      expect(done).toHaveBeenCalledTimes(1);
      expect(done).toHaveBeenCalledWith(null, null);
    });

    it('should call done with error', async () => {
      const error = new Error('noop');
      jest.spyOn(typeorm, 'getRepository').mockImplementation(
        () =>
          ({
            findOne: async () => {
              throw error;
            },
          } as any),
      );

      const done = jest.fn();
      await getUserFromToken(token, done);
      expect(done).toHaveBeenCalledTimes(1);
      expect(done).toHaveBeenCalledWith(error);
    });
  });

  describe('authenticateUser', () => {
    it('should authenticate correctly if token given', async () => {
      jest
        .spyOn(typeorm, 'getRepository')
        .mockImplementation(
          () => ({ findOne: jest.fn(() => foundUser) } as any),
        );

      expect(
        await authenticateUser({
          headers: { authorization: 'Bearer example' },
        } as any),
      ).toMatchObject(foundUser);
    });

    it('should not authenticate if not found', async () => {
      jest
        .spyOn(typeorm, 'getRepository')
        .mockImplementation(() => ({ findOne: jest.fn(() => null) } as any));

      expect(
        await authenticateUser({
          headers: { authorization: 'Bearer example' },
        } as any),
      ).toBeNull();
    });

    it('should not authenticate if no token given', async () => {
      expect(await authenticateUser({ headers: {} } as any)).toBeNull();
    });

    it('should not authenticate if error', async () => {
      const error = new Error('noop');
      jest.spyOn(typeorm, 'getRepository').mockImplementation(
        () =>
          ({
            findOne: async () => {
              throw error;
            },
          } as any),
      );

      await expect(
        authenticateUser({
          headers: { authorization: 'Bearer example' },
        } as any),
      ).rejects.toBeTruthy();
    });
  });
});
