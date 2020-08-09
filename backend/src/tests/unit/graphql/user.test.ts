/* eslint-disable no-multi-assign */
/* eslint-disable no-empty */
import * as typeorm from 'typeorm';
import * as classValidator from 'class-validator';
import { UserInputError } from 'apollo-server-express';

import * as model from '../../../models/User';
import Resolvers from '../../../graphql/resolvers/userResolvers';
import { buildUser, userModelFactory } from '../../factory/userFactory';

describe('User resolvers', () => {
  let getRepository: jest.SpyInstance;
  let find: jest.Mock;
  let findOneOrFail: jest.Mock;
  let save: jest.Mock;
  let softRemove: jest.Mock;
  let recover: jest.Mock;
  let validateOrReject: jest.SpyInstance;
  let resolvers: Resolvers;

  const User = ((model.default as any) = jest.fn());
  const exampleUser = buildUser();

  beforeEach(() => {
    jest.resetModules();

    find = jest.fn(() => [exampleUser]);
    findOneOrFail = jest.fn(() => exampleUser);
    save = jest.fn(() => exampleUser);
    softRemove = jest.fn(() => 0);
    recover = jest.fn(() => exampleUser);

    validateOrReject = jest
      .spyOn(classValidator, 'validateOrReject')
      .mockImplementation();

    getRepository = jest
      .spyOn(typeorm, 'getRepository')
      .mockImplementation(
        () => ({ find, findOneOrFail, save, softRemove, recover } as any),
      );

    resolvers = new Resolvers();
  });

  afterEach(() => {
    getRepository.mockClear();
    validateOrReject.mockClear();
    find.mockClear();
    findOneOrFail.mockClear();
    save.mockClear();
    softRemove.mockClear();
  });

  describe('Query', () => {
    describe('users', () => {
      it('should call find when invoked users', async () => {
        await resolvers.users();
        expect(find).toHaveBeenCalledTimes(1);
      });
    });

    describe('user', () => {
      it('should call user with correct id', async () => {
        const testId = '1';
        await resolvers.user(testId);
        expect(findOneOrFail).toHaveBeenCalledTimes(1);
        expect(findOneOrFail).toHaveBeenCalledWith(testId);
      });
    });

    describe('deletedUsers', () => {
      it('should call find when invoked users', async () => {
        await resolvers.deletedUsers();
        expect(find).toHaveBeenCalledTimes(1);
        const args = find.mock.calls[0][0];
        expect(args.withDeleted).toBe(true);
      });
    });

    describe('me', () => {
      it('should call user with correct id', async () => {
        const testId = '1';
        await resolvers.me({ currentUser: { id: testId } } as any);
        expect(findOneOrFail).toHaveBeenCalledTimes(1);
        expect(findOneOrFail).toHaveBeenCalledWith(testId);
      });
    });
  });

  describe('Mutation', () => {
    let testUser: ReturnType<typeof buildUser>;
    let instanceUser: model.default;

    beforeEach(() => {
      const { user, factoryUser } = userModelFactory();
      testUser = factoryUser;
      instanceUser = user;
      User.mockClear();
    });

    describe('createUser', () => {
      it('should construct new User when invoked', async () => {
        await resolvers.createUser(testUser);

        expect(User).toHaveBeenCalledTimes(1);
        expect(User).toHaveBeenCalledWith(
          testUser.firstName,
          testUser.lastName,
          testUser.password,
          testUser.email,
          testUser.username,
        );
      });

      it('should call repository save method when invoked', async () => {
        await resolvers.createUser(testUser);
        expect(save).toHaveBeenCalledTimes(1);
        expect(save).toHaveBeenCalledWith(instanceUser);
      });
    });

    describe('updateUser', () => {
      const testId = 1;
      const testPassword = 'example';

      beforeEach(() => findOneOrFail.mockImplementation(() => testUser));

      it('should call findOneOrFail when invoked', async () => {
        await resolvers.updateUser({ id: testId, password: testPassword });
        expect(findOneOrFail).toHaveBeenCalledTimes(1);
        expect(findOneOrFail).toHaveBeenCalledWith(testId);
      });

      it('should throw error if no changes given', async () => {
        await expect(resolvers.updateUser({ id: testId })).rejects.toThrowError(
          UserInputError,
        );
      });

      it('should call repository save method if changes given', async () => {
        await resolvers.updateUser({ id: testId, password: testPassword });
        expect(save).toHaveBeenCalledTimes(1);
        expect(save).toHaveBeenCalledWith({
          ...testUser,
          password: testPassword,
        });
      });
    });

    describe('updateMe', () => {
      const verifyPassword = jest.fn();
      const testId = '1';
      const testPassword = 'example';

      beforeEach(() => {
        verifyPassword.mockClear();
        findOneOrFail.mockImplementation(() => ({
          ...testUser,
          verifyPassword,
        }));
      });

      it('should call findOneOrFail when invoked', async () => {
        await resolvers.updateMe(
          { currentPassword: testUser.password, password: testPassword },
          { currentUser: { id: testId } } as any,
        );
        expect(findOneOrFail).toHaveBeenCalledTimes(1);
        expect(findOneOrFail).toHaveBeenCalledWith(testId);
      });

      it('should throw error if no changes given', async () => {
        await expect(
          resolvers.updateMe({ currentPassword: testUser.password }, {
            currentUser: { id: testId },
          } as any),
        ).rejects.toThrowError(UserInputError);
      });

      it('should call repository save method if changes given', async () => {
        await resolvers.updateMe(
          { currentPassword: testUser.password, password: testPassword },
          { currentUser: { id: testId } } as any,
        );
        expect(save).toHaveBeenCalledTimes(1);
        expect(save).toHaveBeenCalledWith({
          ...testUser,
          password: testPassword,
          /* bypass mock */
          verifyPassword,
        });
      });
    });

    describe('deleteUser', () => {
      const testId = '1';
      beforeEach(() => findOneOrFail.mockImplementation(() => testUser));

      it('should call findOneOrFail when invoked', async () => {
        await resolvers.deleteUser(testId);
        expect(findOneOrFail).toHaveBeenCalledTimes(1);
        expect(findOneOrFail).toHaveBeenCalledWith(testId);
      });

      it('should call remove when invoked', async () => {
        await resolvers.deleteUser(testId);
        expect(softRemove).toHaveBeenCalledTimes(1);
        expect(softRemove).toHaveBeenCalledWith(testUser);
      });
    });

    describe('restoreUser', () => {
      const testId = '1';
      beforeEach(() => findOneOrFail.mockImplementation(() => testUser));

      it('should call findOneOrFail when invoked', async () => {
        await resolvers.restoreUser(testId);
        expect(findOneOrFail).toHaveBeenCalledTimes(1);
        expect(findOneOrFail).toHaveBeenCalledWith(testId, {
          withDeleted: true,
        });
      });

      it('should call recover when invoked', async () => {
        await resolvers.restoreUser(testId);
        expect(recover).toHaveBeenCalledTimes(1);
        expect(recover).toHaveBeenCalledWith(testUser);
      });
    });
  });
});
