/* eslint-disable no-multi-assign */
/* eslint-disable no-empty */
import * as typeorm from 'typeorm';
import * as classValidator from 'class-validator';
import * as resolvers from '../../../graphql/resolvers/account';
import * as model from '../../../models/Account';
import { currencyById } from '../../../graphql/resolvers/currency';
import { incomesById } from '../../../graphql/resolvers/income';

const exampleAccount: any = {
  id: 0,
  type: 'credit',
  name: 'Example Account 1',
  bank: 'Example Bank 1',
  initialBalance: 0,
  currency: { id: 0 },
  incomes: [{ id: 1 }, { id: 2 }, { id: 3 }],
  billingDay: 15,
  paymentDay: 1,
};

jest.mock('../../../graphql/resolvers/currency', () => ({
  currencyById: jest.fn(),
}));

jest.mock('../../../graphql/resolvers/income', () => ({
  incomesById: jest.fn(),
}));

describe('Debit account resolvers', () => {
  let getRepository: jest.SpyInstance;
  let accountResolver: jest.SpyInstance;
  let accountById: jest.SpyInstance;
  let validateOrReject: jest.SpyInstance;
  let find: jest.Mock;
  let findOne: jest.Mock;
  let save: jest.Mock;
  let remove: jest.Mock;

  const Account = ((model.default as any) = jest.fn());

  beforeEach(() => {
    find = jest.fn(() => [exampleAccount]);
    findOne = jest.fn(() => exampleAccount);
    save = jest.fn(() => exampleAccount);
    remove = jest.fn(() => 0);

    getRepository = jest
      .spyOn(typeorm, 'getRepository')
      .mockImplementation(() => ({ find, findOne, save, remove } as any));

    validateOrReject = jest
      .spyOn(classValidator, 'validateOrReject')
      .mockImplementation();
  });

  afterEach(() => {
    (currencyById as jest.Mock).mockClear();
    (incomesById as jest.Mock).mockClear();
    getRepository.mockClear();
    validateOrReject.mockClear();
    find.mockClear();
    findOne.mockClear();
    save.mockClear();
    remove.mockClear();
    Account.mockClear();
  });

  describe('accountById', () => {
    beforeEach(() => {
      accountResolver = jest.spyOn(resolvers, 'accountResolver');
    });

    afterEach(() => accountResolver.mockClear());
    afterAll(() => accountResolver.mockRestore());

    it('should call accountResolver once', async () => {
      findOne.mockImplementation(() => exampleAccount);
      await resolvers.accountById(0);
      expect(accountResolver).toHaveBeenCalledTimes(1);
    });

    it('should call accountResolver with correct argument', async () => {
      findOne.mockImplementation(() => exampleAccount);
      await resolvers.accountById(0);
      expect(accountResolver).toHaveBeenCalledWith(exampleAccount);
    });

    it("should throw error if find doesn't succeed", async () => {
      findOne.mockImplementation(() => null);

      expect(resolvers.accountById(0)).rejects.toBeTruthy();
    });

    it("should not call accountResolver if find doesn't succeed", async () => {
      findOne.mockImplementation(() => null);

      try {
        await resolvers.accountById(0);
      } catch (err) {}

      expect(accountResolver).not.toHaveBeenCalled();
    });
  });

  describe('accountsById', () => {
    beforeEach(() => {
      accountResolver = jest.spyOn(resolvers, 'accountResolver');
    });

    afterEach(() => accountResolver.mockClear());
    afterAll(() => accountResolver.mockRestore());

    it('should call accountResolver twice', async () => {
      find.mockImplementation(() => [exampleAccount, exampleAccount]);
      await resolvers.accountsById([1, 2]);
      expect(accountResolver).toHaveBeenCalledTimes(2);
    });

    it('should call accountResolver with correct arguments', async () => {
      const ret = [exampleAccount, exampleAccount];
      find.mockImplementation(() => ret);
      await resolvers.accountsById([1, 2]);

      expect(accountResolver).toHaveBeenNthCalledWith(1, exampleAccount);
      expect(accountResolver).toHaveBeenNthCalledWith(2, exampleAccount);
    });

    it('should return an empty list if no ids given', async () =>
      expect(await resolvers.accountsById([])).toHaveLength(0));

    it('should not call find nor accountResolver if no ids given', async () => {
      await resolvers.accountsById([]);

      expect(find).not.toHaveBeenCalled();
      expect(accountResolver).not.toHaveBeenCalled();
    });
  });

  describe('accountResolver', () => {
    it('should generate static properties correctly', () => {
      const account = resolvers.accountResolver(exampleAccount);
      expect(account.id).toBe(exampleAccount.id);
      expect(account.type).toBe(exampleAccount.type);
      expect(account.name).toBe(exampleAccount.name);
      expect(account.bank).toBe(exampleAccount.bank);
      expect(account.initialBalance).toBe(exampleAccount.initialBalance);
      expect(account.paymentDay).toBe(exampleAccount.paymentDay);
      expect(account.billingDay).toBe(exampleAccount.billingDay);
    });

    it('should call currencyById one time if executed mapping', () => {
      const account = resolvers.accountResolver(exampleAccount);
      account.currency();
      expect(currencyById).toHaveBeenCalledTimes(1);
    });

    it('should call incomesById one time with correct arguments', () => {
      const account = resolvers.accountResolver(exampleAccount);
      account.incomes();
      expect(incomesById).toHaveBeenCalledTimes(1);
      expect(incomesById).toHaveBeenCalledWith([1, 2, 3]);
    });
  });

  describe('Query', () => {
    describe('getAccounts', () => {
      const getAccounts = resolvers.default.Query.getAccounts as any;

      it('should call find when invoked getAccounts', async () => {
        await getAccounts();
        expect(find).toHaveBeenCalledTimes(1);
      });

      it('should map results of query into accountResolver', async () => {
        accountResolver = jest
          .spyOn(resolvers, 'accountResolver')
          .mockImplementation();

        getRepository.mockImplementation(() => ({ find: () => [1, 2] }));
        await getAccounts();
        expect(accountResolver).toHaveBeenCalledTimes(2);
        expect(accountResolver).toHaveBeenNthCalledWith(1, 1);
        expect(accountResolver).toHaveBeenNthCalledWith(2, 2);
        accountResolver.mockRestore();
      });
    });

    describe('getAccount', () => {
      const getAccount = resolvers.default.Query.getAccount as any;

      beforeEach(() => {
        accountById = jest.spyOn(resolvers, 'accountById').mockImplementation();
      });

      afterEach(() => accountById.mockClear());
      afterAll(() => accountById.mockRestore());

      it('should call accountById with correct id and repository', async () => {
        await getAccount(null, { id: 0 });
        expect(accountById).toHaveBeenCalledTimes(1);
        expect(accountById).toHaveBeenCalledWith(0);
      });
    });
  });

  describe('Mutation', () => {
    describe('createAccount', () => {
      const createAccount = resolvers.default.Mutation.createAccount as any;

      it('should construct new Account when invoked', async () => {
        findOne.mockImplementation(() => 'exampleCurrency');

        await createAccount(null, {
          type: 'credit',
          name: 'Example',
          bank: 'Example',
          initialBalance: 0,
          currencyId: 0,
          billingDay: 15,
          paymentDay: 1,
        });

        expect(Account).toHaveBeenCalledTimes(1);
        expect(Account).toHaveBeenCalledWith(
          'credit',
          'Example',
          'Example',
          0,
          'exampleCurrency' /* Result of mock */,
          15,
          1,
        );
      });

      it('should call repository save method when invoked', async () => {
        await createAccount(null, { name: 'Example' });
        expect(save).toHaveBeenCalledTimes(1);
        expect(save).toHaveBeenCalledWith(new Account('Example'));
      });

      it('should reject if no currency found', async () => {
        getRepository.mockImplementation(() => ({ findOne: () => null }));
        expect(createAccount(null, { id: 0 })).rejects.toBeTruthy();
      });

      it('should call rejectOrValidate when invoked', async () => {
        await createAccount(null, { name: 'Example' });
        expect(validateOrReject).toHaveBeenCalledTimes(1);
        expect(validateOrReject).toHaveBeenCalledWith(new Account('Example'));
      });
    });

    describe('updateAccount', () => {
      const updateAccount = resolvers.default.Mutation.updateAccount as any;

      beforeEach(() => {
        accountResolver = jest
          .spyOn(resolvers, 'accountResolver')
          .mockImplementation();
      });

      afterEach(() => accountResolver.mockClear());

      it('should call findOne method of getRepository', async () => {
        await updateAccount(null, { id: 0 });
        expect(findOne).toHaveBeenCalledTimes(1);
        expect(findOne).toHaveBeenCalledWith(0, {
          relations: ['currency', 'incomes'],
        });
      });

      it("should reject if find doesn't succeed", async () => {
        getRepository.mockImplementation(() => ({ findOne: () => null }));
        expect(updateAccount(null, { id: 0 })).rejects.toBeTruthy();
      });

      it('should change base attributes if given', async () => {
        const reference = {
          type: 'credit',
          name: 'Not modified',
          bank: 'Not modified',
          initialBalance: 1,
          billingDay: 1,
          paymentDay: 15,
        };

        findOne.mockImplementation(() => reference);

        await updateAccount(null, {
          id: 0,
          type: 'debit',
          name: 'Modified',
          bank: 'Modified',
          initialBalance: 0,
          billingDay: 2,
          paymentDay: 18,
        });

        expect(reference.type).toBe('credit');
        expect(reference.name).toBe('Modified');
        expect(reference.bank).toBe('Modified');
        expect(reference.initialBalance).toBe(0);
        expect(reference.billingDay).toBe(2);
        expect(reference.paymentDay).toBe(18);
      });

      it('should change currency if id given', async () => {
        const reference = { currency: { id: 0, name: 'Not modified' } };

        findOne.mockImplementation(() => reference);
        getRepository.mockImplementation((_model: jest.Mock) => {
          if (_model === Account) return { findOne, save };
          return { findOne: () => ({ id: 1, name: 'Modified' }) };
        });

        await updateAccount(null, { id: 0, currencyId: 1 });
        expect(reference.currency).toMatchObject({ id: 1, name: 'Modified' });
      });

      it('should reject if no currency found with given id', async () => {
        getRepository.mockImplementation((_model: jest.Mock) => {
          if (_model === Account) return { findOne };
          return { findOne: () => null };
        });

        expect(
          updateAccount(null, { id: 0, currencyId: 1 }),
        ).rejects.toBeTruthy();
      });

      it('should call save on happy path', async () => {
        await updateAccount(null, { id: 0 });
        expect(save).toHaveBeenCalledTimes(1);
        expect(save).toHaveBeenCalledWith(exampleAccount);
      });

      it('should call rejectOrValidate on happy path', async () => {
        await updateAccount(null, { id: 0 });
        expect(validateOrReject).toHaveBeenCalledTimes(1);
        expect(validateOrReject).toHaveBeenCalledWith(exampleAccount);
      });

      it('should wrap result on accountResolver on happy path', async () => {
        save.mockImplementation(() => 'dummy');
        await updateAccount(null, { id: 0 });
        expect(accountResolver).toHaveBeenCalledTimes(1);
        expect(accountResolver).toHaveBeenCalledWith('dummy');
      });
    });

    describe('deleteAccount', () => {
      const deleteAccount = resolvers.default.Mutation.deleteAccount as any;

      beforeEach(() => {
        accountResolver = jest
          .spyOn(resolvers, 'accountResolver')
          .mockImplementation();
      });

      it('should call findOne method of getRepository', async () => {
        await deleteAccount(null, { id: 0 });
        expect(findOne).toHaveBeenCalledTimes(1);
        expect(findOne).toHaveBeenCalledWith(0);
      });

      it("should reject if find doesn't succeed", async () => {
        getRepository.mockImplementation(() => ({ findOne: () => null }));
        expect(deleteAccount(null, { id: 0 })).rejects.toBeTruthy();
      });

      it('should call remove on happy path', async () => {
        await deleteAccount(null, { id: 0, name: 'Modified' });
        expect(remove).toHaveBeenCalledTimes(1);
        expect(remove).toHaveBeenCalledWith(findOne());
      });
    });
  });
});
