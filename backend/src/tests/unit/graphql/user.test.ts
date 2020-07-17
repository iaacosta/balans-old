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
  let remove: jest.Mock;
  let validateOrReject: jest.SpyInstance;
  let resolvers: Resolvers;

  const User = ((model.default as any) = jest.fn());
  const exampleUser = buildUser();

  beforeEach(() => {
    jest.resetModules();

    find = jest.fn(() => [exampleUser]);
    findOneOrFail = jest.fn(() => exampleUser);
    save = jest.fn(() => exampleUser);
    remove = jest.fn(() => 0);

    validateOrReject = jest
      .spyOn(classValidator, 'validateOrReject')
      .mockImplementation();

    getRepository = jest
      .spyOn(typeorm, 'getRepository')
      .mockImplementation(() => ({ find, findOneOrFail, save, remove } as any));

    resolvers = new Resolvers();
  });

  afterEach(() => {
    getRepository.mockClear();
    validateOrReject.mockClear();
    find.mockClear();
    findOneOrFail.mockClear();
    save.mockClear();
    remove.mockClear();
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
        const testId = 1;
        await resolvers.user({ id: testId });
        expect(findOneOrFail).toHaveBeenCalledTimes(1);
        expect(findOneOrFail).toHaveBeenCalledWith(testId);
      });
    });

    describe('me', () => {
      it('should call user with correct id', async () => {
        const testId = 1;
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
      const testId = 1;
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
      const testId = 1;
      beforeEach(() => findOneOrFail.mockImplementation(() => testUser));

      it('should call findOneOrFail when invoked', async () => {
        await resolvers.deleteUser({ id: testId });
        expect(findOneOrFail).toHaveBeenCalledTimes(1);
        expect(findOneOrFail).toHaveBeenCalledWith(testId);
      });

      it('should call remove when invoked', async () => {
        await resolvers.deleteUser({ id: testId });
        expect(remove).toHaveBeenCalledTimes(1);
        expect(remove).toHaveBeenCalledWith(testUser);
      });
    });
  });
});
