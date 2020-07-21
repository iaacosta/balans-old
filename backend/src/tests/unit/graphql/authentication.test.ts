/* eslint-disable no-multi-assign */
/* eslint-disable no-empty */
import * as typeorm from 'typeorm';
import * as classValidator from 'class-validator';

import * as model from '../../../models/User';
import Resolvers from '../../../graphql/resolvers/authenticationResolvers';
import { buildUser, userModelFactory } from '../../factory/userFactory';

describe('User resolvers', () => {
  let getRepository: jest.SpyInstance;
  let save: jest.Mock;
  let validateOrReject: jest.SpyInstance;
  let resolvers: Resolvers;

  const User = ((model.default as any) = jest.fn());
  const exampleUser = buildUser();

  beforeEach(() => {
    jest.resetModules();
    save = jest.fn(() => exampleUser);

    validateOrReject = jest
      .spyOn(classValidator, 'validateOrReject')
      .mockImplementation();

    getRepository = jest
      .spyOn(typeorm, 'getRepository')
      .mockImplementation(() => ({ save } as any));

    resolvers = new Resolvers();
  });

  afterEach(() => {
    getRepository.mockClear();
    validateOrReject.mockClear();
    save.mockClear();
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

    describe('signUp', () => {
      it('should construct new User when invoked', async () => {
        await resolvers.signUp(testUser);

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
        await resolvers.signUp(testUser);
        expect(save).toHaveBeenCalledTimes(1);
        expect(save).toHaveBeenCalledWith(instanceUser);
      });
    });
  });
});
