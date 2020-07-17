/* eslint-disable no-multi-assign */
import { validateOrReject } from 'class-validator';
import { hash, genSalt } from 'bcrypt';
import { AuthenticationError } from 'apollo-server-express';

import { userModelFactory } from '../../factory/userFactory';

describe('User model test', () => {
  it('should create User object', () =>
    expect(userModelFactory().user).not.toBeFalsy());

  it('should create User that has correct attributes', () => {
    const { user, factoryUser } = userModelFactory();
    expect(user.firstName).toBe(factoryUser.firstName);
    expect(user.lastName).toBe(factoryUser.lastName);
    expect(user.password).toBe(factoryUser.password);
    expect(user.email).toBe(factoryUser.email);
    expect(user.username).toBe(factoryUser.username);
    expect(user.role).toBe(factoryUser.role);
  });

  describe('validation', () => {
    it('should pass validation if everything is correct', async () => {
      expect(await validateOrReject(userModelFactory())).toBeUndefined();
    });

    it('should not pass validation if password is less than 6 characters', async () => {
      const { user } = userModelFactory({ password: 'noop' });
      await expect(validateOrReject(user)).rejects.toBeTruthy();
    });

    it('should not pass validation if username is less than 6 characters', async () => {
      const { user } = userModelFactory({ username: 'noop' });
      await expect(validateOrReject(user)).rejects.toBeTruthy();
    });

    it("should not pass validation if email isn't valid", async () => {
      const { user } = userModelFactory({ email: 'notValidEmail' });
      await expect(validateOrReject(user)).rejects.toBeTruthy();
    });

    it("should not pass validation if role isn't admin or user", async () => {
      const { user } = userModelFactory({ role: 'god' as any });
      await expect(validateOrReject(user)).rejects.toBeTruthy();
    });

    it("should not pass validation if username isn't alphanumeric", async () => {
      const { user } = userModelFactory({ username: '___' });
      await expect(validateOrReject(user)).rejects.toBeTruthy();
    });
  });

  describe('methods', () => {
    describe('verifyPassword', () => {
      it('should verify a correct password', async () => {
        const { user, factoryUser } = userModelFactory();
        user.password = await hash(user.password, await genSalt(10));

        await expect(
          user.verifyPassword(factoryUser.password),
        ).resolves.toBeUndefined();
      });

      it('should verify an incorrect password', async () => {
        const { user } = userModelFactory();
        user.password = await hash(user.password, await genSalt(10));
        await expect(user.verifyPassword('nope')).rejects.toThrowError(
          AuthenticationError,
        );
      });
    });

    describe('name', () => {
      it('should compose name correctly', () => {
        const { user, factoryUser } = userModelFactory();
        expect(user.name()).toBe(
          `${factoryUser.firstName} ${factoryUser.lastName}`,
        );
      });
    });
  });
});
