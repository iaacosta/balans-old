/* eslint-disable no-multi-assign */
/* eslint-disable no-empty */
import * as typeorm from 'typeorm';
import * as resolvers from '../../../graphql/resolvers/debitAccount';
import * as debitAccountModel from '../../../models/DebitAccount';
import { currencyById } from '../../../graphql/resolvers/currency';

const exampleDebitAccount: any = {
  id: 0,
  name: 'Example Account 1',
  bank: 'Example Bank 1',
  initialBalance: 0,
  allowsNegative: true,
  currency: { id: 0, name: 'Example' },
};

jest.mock('../../../graphql/resolvers/currency', () => ({
  currencyById: jest.fn(),
}));

describe('Debit account resolvers', () => {
  let getRepository: jest.SpyInstance;
  let debitAccountResolver: jest.SpyInstance;
  let debitAccountById: jest.SpyInstance;
  let find: jest.Mock;
  let findOne: jest.Mock;
  let save: jest.Mock;
  let remove: jest.Mock;

  const DebitAccount = ((debitAccountModel.default as any) = jest.fn());

  beforeEach(() => {
    find = jest.fn(() => [exampleDebitAccount]);
    findOne = jest.fn(() => exampleDebitAccount);
    save = jest.fn(() => exampleDebitAccount);
    remove = jest.fn(() => '0');
    getRepository = jest
      .spyOn(typeorm, 'getRepository')
      .mockImplementation(() => ({ find, findOne, save, remove } as any));
  });

  afterEach(() => {
    getRepository.mockClear();
    find.mockClear();
    findOne.mockClear();
    save.mockClear();
    remove.mockClear();
    DebitAccount.mockClear();
  });

  describe('debitAccountById', () => {
    const nullRepo: any = { findOne: jest.fn() };
    const happyPathRepo: any = {
      findOne: jest.fn(() => exampleDebitAccount),
    };

    beforeEach(() => {
      debitAccountResolver = jest.spyOn(resolvers, 'debitAccountResolver');
    });

    afterEach(() => debitAccountResolver.mockClear());
    afterAll(() => debitAccountResolver.mockRestore());

    it('should call debitAccountResolver once', async () => {
      await resolvers.debitAccountById(happyPathRepo, 0);
      expect(debitAccountResolver).toHaveBeenCalledTimes(1);
    });

    it('should call debitAccountResolver with correct argument', async () => {
      await resolvers.debitAccountById(happyPathRepo, 0);
      expect(debitAccountResolver).toHaveBeenCalledWith(exampleDebitAccount);
    });

    it("should throw error if find doesn't succeed", async () =>
      expect(resolvers.debitAccountById(nullRepo, 0)).rejects.toBeTruthy());

    it("should not call debitAccountResolver if find doesn't succeed", async () => {
      try {
        await resolvers.debitAccountById(nullRepo, 0);
      } catch (err) {}

      expect(debitAccountResolver).not.toHaveBeenCalled();
    });
  });

  describe('debitAccountResolver', () => {
    it('should generate static properties correctly', () => {
      const debitAccount = resolvers.debitAccountResolver(exampleDebitAccount);
      expect(debitAccount.id).toBe(exampleDebitAccount.id);
      expect(debitAccount.name).toBe(exampleDebitAccount.name);
      expect(debitAccount.bank).toBe(exampleDebitAccount.bank);
      expect(debitAccount.initialBalance).toBe(
        exampleDebitAccount.initialBalance,
      );
      expect(debitAccount.allowsNegative).toBe(
        exampleDebitAccount.allowsNegative,
      );
    });

    it('should call currencyById one time if executed mapping', () => {
      const debitAccount = resolvers.debitAccountResolver(exampleDebitAccount);
      debitAccount.currency();
      expect(currencyById).toHaveBeenCalledTimes(1);
    });
  });

  describe('Query', () => {
    describe('getDebitAccounts', () => {
      const getDebitAccounts = resolvers.default.Query.getDebitAccounts as any;

      it('should call find when invoked getDebitAccounts', async () => {
        await getDebitAccounts();
        expect(find).toHaveBeenCalledTimes(1);
      });

      it('should map results of query into debitAccountResolver', async () => {
        debitAccountResolver = jest
          .spyOn(resolvers, 'debitAccountResolver')
          .mockImplementation();

        getRepository.mockImplementation(() => ({ find: () => [1, 2] }));
        await getDebitAccounts();
        expect(debitAccountResolver).toHaveBeenCalledTimes(2);

        /**
         * I put the next two arguments (number, index, list)
         * because of been called on a map
         */
        expect(debitAccountResolver).toHaveBeenNthCalledWith(1, 1, 0, [1, 2]);
        expect(debitAccountResolver).toHaveBeenNthCalledWith(2, 2, 1, [1, 2]);
        debitAccountResolver.mockRestore();
      });
    });

    describe('getDebitAccount', () => {
      const getDebitAccount = resolvers.default.Query.getDebitAccount as any;

      beforeEach(() => {
        debitAccountById = jest
          .spyOn(resolvers, 'debitAccountById')
          .mockImplementation();

        getRepository.mockImplementation(() => 'Example repository');
      });

      afterEach(() => debitAccountById.mockClear());
      afterAll(() => debitAccountById.mockRestore());

      it('should call debitAccountById with correct id and repository', async () => {
        await getDebitAccount(null, { id: 0 });
        expect(debitAccountById).toHaveBeenCalledTimes(1);
        expect(debitAccountById).toHaveBeenCalledWith('Example repository', 0);
      });

      it('should call Currency model on getRepository', async () => {
        await getDebitAccount(null, { id: 0 });
        expect(getRepository).toHaveBeenCalledTimes(1);
        expect(getRepository).toHaveBeenCalledWith(DebitAccount);
      });
    });
  });

  describe('Mutation', () => {
    describe('createDebitAccount', () => {
      const createDebitAccount = resolvers.default.Mutation
        .createDebitAccount as any;

      it('should construct new DebitAccount when invoked', async () => {
        findOne.mockImplementation(() => 'exampleCurrency');

        await createDebitAccount(null, {
          name: 'Example',
          bank: 'Example',
          initialBalance: 0,
          allowsNegative: true,
          currencyId: 0,
        });

        expect(DebitAccount).toHaveBeenCalledTimes(1);
        expect(DebitAccount).toHaveBeenCalledWith(
          'Example',
          'Example',
          0,
          true,
          'exampleCurrency' /* Result of mock */,
        );
      });

      it('should call repository save method when invoked', async () => {
        await createDebitAccount(null, { name: 'Example' });
        expect(save).toHaveBeenCalledTimes(1);
        expect(save).toHaveBeenCalledWith(new DebitAccount('Example'));
      });

      it('should reject if no account found', async () => {
        getRepository.mockImplementation(() => ({ findOne: () => null }));
        expect(createDebitAccount(null, { id: 0 })).rejects.toBeTruthy();
      });
    });

    describe('updateDebitAccount', () => {
      const updateDebitAccount = resolvers.default.Mutation
        .updateDebitAccount as any;

      beforeEach(() => {
        debitAccountResolver = jest
          .spyOn(resolvers, 'debitAccountResolver')
          .mockImplementation();
      });

      afterEach(() => debitAccountResolver.mockClear());

      it('should call findOne method of getRepository', async () => {
        await updateDebitAccount(null, { id: 0 });
        expect(findOne).toHaveBeenCalledTimes(1);
        expect(findOne).toHaveBeenCalledWith(0, { relations: ['currency'] });
      });

      it("should reject if find doesn't succeed", async () => {
        getRepository.mockImplementation(() => ({ findOne: () => null }));
        expect(updateDebitAccount(null, { id: 0 })).rejects.toBeTruthy();
      });

      it('should change base attributes if given', async () => {
        const reference = {
          name: 'Not modified',
          bank: 'Not modified',
          initialBalance: 1,
          allowsNegative: true,
        };

        findOne.mockImplementation(() => reference);

        await updateDebitAccount(null, {
          id: 0,
          name: 'Modified',
          bank: 'Modified',
          initialBalance: 0,
          allowsNegative: false,
        });

        expect(reference.name).toBe('Modified');
        expect(reference.bank).toBe('Modified');
        expect(reference.initialBalance).toBe(0);
        expect(reference.allowsNegative).toBe(true);
      });

      it('should change currency if id given', async () => {
        const reference = { currency: { id: 0, name: 'Not modified' } };

        findOne.mockImplementation(() => reference);
        getRepository.mockImplementation((model: jest.Mock) => {
          if (model === DebitAccount) return { findOne, save };
          return { findOne: () => ({ id: 1, name: 'Modified' }) };
        });

        await updateDebitAccount(null, { id: 0, currencyId: 1 });
        expect(reference.currency).toMatchObject({ id: 1, name: 'Modified' });
      });

      it('should reject if no currency found with given id', async () => {
        getRepository.mockImplementation((model: jest.Mock) => {
          if (model === DebitAccount) return { findOne };
          return { findOne: () => null };
        });

        expect(
          updateDebitAccount(null, { id: 0, currencyId: 1 }),
        ).rejects.toBeTruthy();
      });

      it('should call save on happy path', async () => {
        await updateDebitAccount(null, { id: 0 });
        expect(save).toHaveBeenCalledTimes(1);
        expect(save).toHaveBeenCalledWith(exampleDebitAccount);
      });

      it('should wrap result on debitAccountResolver on happy path', async () => {
        save.mockImplementation(() => 'dummy');
        await updateDebitAccount(null, { id: 0 });
        expect(debitAccountResolver).toHaveBeenCalledTimes(1);
        expect(debitAccountResolver).toHaveBeenCalledWith('dummy');
      });
    });

    describe('deleteDebitAccount', () => {
      const deleteDebitAccount = resolvers.default.Mutation
        .deleteDebitAccount as any;

      beforeEach(() => {
        debitAccountResolver = jest
          .spyOn(resolvers, 'debitAccountResolver')
          .mockImplementation();
      });

      it('should call findOne method of getRepository', async () => {
        await deleteDebitAccount(null, { id: 0 });
        expect(findOne).toHaveBeenCalledTimes(1);
        expect(findOne).toHaveBeenCalledWith(0);
      });

      it("should reject if find doesn't succeed", async () => {
        getRepository.mockImplementation(() => ({ findOne: () => null }));
        expect(deleteDebitAccount(null, { id: 0 })).rejects.toBeTruthy();
      });

      it('should call remove on happy path', async () => {
        await deleteDebitAccount(null, { id: 0, name: 'Modified' });
        expect(remove).toHaveBeenCalledTimes(1);
        expect(remove).toHaveBeenCalledWith(findOne());
      });
    });
  });
});
