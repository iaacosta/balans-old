/* eslint-disable no-multi-assign */
/* eslint-disable no-empty */
import * as typeorm from 'typeorm';
import * as classValidator from 'class-validator';
import * as resolvers from '../../../graphql/resolvers/expense';
import * as model from '../../../models/Expense';
import { subCategoryById } from '../../../graphql/resolvers/subCategory';
import { accountById } from '../../../graphql/resolvers/account';
import { placeById } from '../../../graphql/resolvers/place';

const exampleExpense: any = {
  id: 0,
  amount: 1000,
  date: '2020-01-01T03:00:00',
  description: 'example',
  installments: 1,
  account: { id: 0 },
  subCategory: { id: 0 },
  place: { id: 0 },
};

jest.mock('../../../graphql/resolvers/subCategory', () => ({
  subCategoryById: jest.fn(),
}));

jest.mock('../../../graphql/resolvers/account', () => ({
  accountById: jest.fn(),
}));

jest.mock('../../../graphql/resolvers/place', () => ({
  placeById: jest.fn(),
}));

describe('Expense resolvers', () => {
  let getRepository: jest.SpyInstance;
  let expenseResolver: jest.SpyInstance;
  let expenseById: jest.SpyInstance;
  let find: jest.Mock;
  let findOne: jest.Mock;
  let save: jest.Mock;
  let remove: jest.Mock;
  let validateOrReject: jest.SpyInstance;
  const Expense = ((model.default as any) = jest.fn());

  beforeEach(() => {
    find = jest.fn(() => [exampleExpense]);
    findOne = jest.fn(() => exampleExpense);
    save = jest.fn(() => exampleExpense);
    remove = jest.fn(() => 0);

    validateOrReject = jest
      .spyOn(classValidator, 'validateOrReject')
      .mockImplementation();

    getRepository = jest
      .spyOn(typeorm, 'getRepository')
      .mockImplementation(() => ({ find, findOne, save, remove } as any));
  });

  afterEach(() => {
    (subCategoryById as jest.Mock).mockClear();
    (accountById as jest.Mock).mockClear();
    (placeById as jest.Mock).mockClear();
    getRepository.mockClear();
    validateOrReject.mockClear();
    find.mockClear();
    findOne.mockClear();
    save.mockClear();
    remove.mockClear();
    Expense.mockClear();
  });

  describe('expenseById', () => {
    beforeEach(() => {
      expenseResolver = jest.spyOn(resolvers, 'expenseResolver');
    });

    afterEach(() => expenseResolver.mockClear());
    afterAll(() => expenseResolver.mockRestore());

    it('should call expenseResolver once', async () => {
      getRepository.mockImplementation(() => ({
        findOne: () => exampleExpense,
      }));

      await resolvers.expenseById(0);
      expect(expenseResolver).toHaveBeenCalledTimes(1);
    });

    it('should call expenseResolver with correct argument', async () => {
      getRepository.mockImplementation(() => ({
        findOne: () => exampleExpense,
      }));

      await resolvers.expenseById(0);
      expect(expenseResolver).toHaveBeenCalledWith(exampleExpense);
    });

    it("should throw error if find doesn't succeed", async () => {
      getRepository.mockImplementation(() => ({ findOne: () => null }));
      expect(resolvers.expenseById(0)).rejects.toBeTruthy();
    });

    it("should not call expenseResolver if find doesn't succeed", async () => {
      getRepository.mockImplementation(() => ({ findOne: () => null }));

      try {
        await resolvers.expenseById(0);
      } catch (err) {}

      expect(expenseResolver).not.toHaveBeenCalled();
    });
  });

  describe('expensesById', () => {
    beforeEach(() => {
      expenseResolver = jest.spyOn(resolvers, 'expenseResolver');
    });

    afterEach(() => expenseResolver.mockClear());
    afterAll(() => expenseResolver.mockRestore());

    it('should call expenseResolver twice', async () => {
      find.mockImplementation(() => [exampleExpense, exampleExpense]);
      await resolvers.expensesById([1, 2]);
      expect(expenseResolver).toHaveBeenCalledTimes(2);
    });

    it('should call expenseResolver with correct arguments', async () => {
      const ret = [exampleExpense, exampleExpense];
      find.mockImplementation(() => ret);
      await resolvers.expensesById([1, 2]);

      expect(expenseResolver).toHaveBeenNthCalledWith(1, exampleExpense);
      expect(expenseResolver).toHaveBeenNthCalledWith(2, exampleExpense);
    });

    it('should return an empty list if no ids given', async () =>
      expect(await resolvers.expensesById([])).toHaveLength(0));

    it('should not call find nor expenseResolver if no ids given', async () => {
      await resolvers.expensesById([]);

      expect(find).not.toHaveBeenCalled();
      expect(expenseResolver).not.toHaveBeenCalled();
    });
  });

  describe('expenseResolver', () => {
    it('should generate static properties correctly', () => {
      const expense = resolvers.expenseResolver(exampleExpense);
      expect(expense.id).toBe(exampleExpense.id);
      expect(expense.amount).toBe(exampleExpense.amount);
      expect(expense.date).toBe(exampleExpense.date);
      expect(expense.description).toBe(exampleExpense.description);
      expect(expense.installments).toBe(exampleExpense.installments);
    });

    it('should call subCategoryById one time correctly', () => {
      const expense = resolvers.expenseResolver(exampleExpense);
      expense.subCategory();
      expect(subCategoryById).toHaveBeenCalledTimes(1);
      expect(subCategoryById).toHaveBeenCalledWith(0);
    });

    it('should call accountById one time correctly', () => {
      const expense = resolvers.expenseResolver(exampleExpense);
      expense.account();
      expect(accountById).toHaveBeenCalledTimes(1);
      expect(accountById).toHaveBeenCalledWith(0);
    });

    it('should call placeById one time correctly', () => {
      const expense = resolvers.expenseResolver(exampleExpense);
      expense.place();
      expect(placeById).toHaveBeenCalledTimes(1);
      expect(placeById).toHaveBeenCalledWith(0);
    });
  });

  describe('Query', () => {
    describe('getExpenses', () => {
      const getExpenses = resolvers.default.Query.getExpenses as any;

      it('should call find when invoked getExpenses', async () => {
        await getExpenses();
        expect(find).toHaveBeenCalledTimes(1);
        expect(find).toBeCalledWith({
          relations: ['account', 'subCategory', 'place'],
          order: { id: 1 },
        });
      });

      it('should map results of query into expenseResolver', async () => {
        expenseResolver = jest
          .spyOn(resolvers, 'expenseResolver')
          .mockImplementation();

        getRepository.mockImplementation(() => ({ find: () => [1, 2, 3] }));
        await getExpenses();
        expect(expenseResolver).toHaveBeenCalledTimes(3);

        /**
         * I put the next two arguments (number, index, list)
         * because of been called on a map
         */
        expect(expenseResolver).toHaveBeenNthCalledWith(1, 1, 0, [1, 2, 3]);
        expect(expenseResolver).toHaveBeenNthCalledWith(2, 2, 1, [1, 2, 3]);
        expect(expenseResolver).toHaveBeenNthCalledWith(3, 3, 2, [1, 2, 3]);
        expenseResolver.mockRestore();
      });
    });

    describe('getExpense', () => {
      const getExpense = resolvers.default.Query.getExpense as any;

      beforeEach(() => {
        expenseById = jest.spyOn(resolvers, 'expenseById').mockImplementation();
      });

      afterEach(() => expenseById.mockClear());
      afterAll(() => expenseById.mockRestore());

      it('should call expenseById with correct id', async () => {
        await getExpense(null, { id: 0 });
        expect(expenseById).toHaveBeenCalledTimes(1);
        expect(expenseById).toHaveBeenCalledWith(0);
      });
    });
  });

  describe('Mutation', () => {
    describe('createExpense', () => {
      const createExpense = resolvers.default.Mutation.createExpense as any;

      beforeEach(() => findOne.mockImplementation(() => 'example relation'));

      it('should construct new Expense when invoked', async () => {
        await createExpense(null, {
          amount: 1000,
          date: 'example',
          accountId: 1,
          subCategoryId: 1,
          placeId: 1,
        });

        expect(Expense).toHaveBeenCalledTimes(1);
        expect(Expense).toHaveBeenCalledWith(
          1000,
          'example',
          'example relation',
          'example relation',
          'example relation',
          undefined,
          undefined,
        );
      });

      it('should call repository save method when invoked', async () => {
        await createExpense(null, {
          amount: 1000,
          date: 'example',
          accountId: 1,
          subCategoryId: 1,
        });

        expect(save).toHaveBeenCalledTimes(1);
        expect(save).toHaveBeenCalledWith(new Expense());
      });

      it('should call rejectOrValidate when invoked', async () => {
        await createExpense(null, {
          amount: 1000,
          date: 'example',
          accountId: 1,
          subCategoryId: 1,
        });

        expect(validateOrReject).toHaveBeenCalledTimes(1);
        expect(validateOrReject).toHaveBeenCalledWith(new Expense());
      });

      it('should reject if no sub category found', async () => {
        findOne.mockImplementation((id) => {
          if (id === 1) return false;
          return true;
        });

        expect(
          createExpense(null, {
            id: 0,
            subCategoryId: 1,
            accountId: 2,
            placeId: 2,
          }),
        ).rejects.toBeTruthy();
      });

      it('should reject if no account found', async () => {
        findOne.mockImplementation((id) => {
          if (id === 1) return false;
          return true;
        });

        expect(
          createExpense(null, {
            id: 0,
            subCategoryId: 2,
            accountId: 1,
            placeId: 2,
          }),
        ).rejects.toBeTruthy();
      });

      it('should reject if no place found', async () => {
        findOne.mockImplementation((id) => {
          if (id === 1) return false;
          return true;
        });

        expect(
          createExpense(null, {
            id: 0,
            subCategoryId: 2,
            accountId: 2,
            placeId: 1,
          }),
        ).rejects.toBeTruthy();
      });
    });

    describe('updateExpense', () => {
      const updateExpense = resolvers.default.Mutation.updateExpense as any;

      beforeEach(() => {
        expenseResolver = jest
          .spyOn(resolvers, 'expenseResolver')
          .mockImplementation();
      });

      it('should call findOne method of getRepository', async () => {
        await updateExpense(null, { id: 0 });
        expect(findOne).toHaveBeenCalledTimes(1);
        expect(findOne).toHaveBeenCalledWith(0, {
          relations: ['account', 'subCategory', 'place'],
        });
      });

      it("should reject if find doesn't succeed", async () => {
        getRepository.mockImplementation(() => ({ findOne: () => null }));
        expect(updateExpense(null, { id: 0 })).rejects.toBeTruthy();
      });

      it('should change base attributes if given', async () => {
        const reference = {
          amount: 1000,
          date: 'example',
          description: 'Example description',
          installments: 1,
        };

        findOne.mockImplementation(() => reference);
        await updateExpense(null, {
          id: 0,
          amount: 0,
          date: 'example2',
          description: 'Modified description',
          installments: 2,
        });

        expect(reference.amount).toBe(0);
        expect(reference.date).toBe('example2');
        expect(reference.description).toBe('Modified description');
        expect(reference.installments).toBe(2);
      });

      it('should change subCategory if id given', async () => {
        const reference = { subCategory: { id: 0, name: 'Not modified' } };

        findOne.mockImplementation(() => reference);
        getRepository.mockImplementation((_model: jest.Mock) => {
          if (_model === Expense) return { findOne, save };
          return { findOne: () => ({ id: 1, name: 'Modified' }) };
        });

        await updateExpense(null, { id: 0, subCategoryId: 1 });
        expect(reference.subCategory).toMatchObject({
          id: 1,
          name: 'Modified',
        });
      });

      it('should change account if id given', async () => {
        const reference = { account: { id: 0, name: 'Not modified' } };

        findOne.mockImplementation(() => reference);
        getRepository.mockImplementation((_model: jest.Mock) => {
          if (_model === Expense) return { findOne, save };
          return { findOne: () => ({ id: 1, name: 'Modified' }) };
        });

        await updateExpense(null, { id: 0, accountId: 1 });
        expect(reference.account).toMatchObject({
          id: 1,
          name: 'Modified',
        });
      });

      it('should change place if id given', async () => {
        const reference = { place: { id: 0, name: 'Not modified' } };

        findOne.mockImplementation(() => reference);
        getRepository.mockImplementation((_model: jest.Mock) => {
          if (_model === Expense) return { findOne, save };
          return { findOne: () => ({ id: 1, name: 'Modified' }) };
        });

        await updateExpense(null, { id: 0, placeId: 1 });
        expect(reference.place).toMatchObject({
          id: 1,
          name: 'Modified',
        });
      });

      it('should reject if no subCategory found with given id', async () => {
        getRepository.mockImplementation((_model: jest.Mock) => {
          if (_model === Expense) return { findOne };
          return { findOne: () => null };
        });

        expect(
          updateExpense(null, { id: 0, subCategoryId: 1 }),
        ).rejects.toBeTruthy();
      });

      it('should reject if no account found with given id', async () => {
        getRepository.mockImplementation((_model: jest.Mock) => {
          if (_model === Expense) return { findOne };
          return { findOne: () => null };
        });

        expect(
          updateExpense(null, { id: 0, accountId: 1 }),
        ).rejects.toBeTruthy();
      });

      it('should reject if no place found with given id', async () => {
        getRepository.mockImplementation((_model: jest.Mock) => {
          if (_model === Expense) return { findOne };
          return { findOne: () => null };
        });

        expect(updateExpense(null, { id: 0, placeId: 1 })).rejects.toBeTruthy();
      });

      it('should call save on happy path', async () => {
        await updateExpense(null, { id: 0 });
        expect(save).toHaveBeenCalledTimes(1);
        expect(save).toHaveBeenCalledWith(exampleExpense);
      });

      it('should call validateOrReject on happy path', async () => {
        await updateExpense(null, { id: 0 });
        expect(validateOrReject).toHaveBeenCalledTimes(1);
        expect(validateOrReject).toHaveBeenCalledWith(exampleExpense);
      });
    });

    describe('deleteExpense', () => {
      const deleteExpense = resolvers.default.Mutation.deleteExpense as any;
      beforeEach(() => {
        expenseResolver = jest
          .spyOn(resolvers, 'expenseResolver')
          .mockImplementation();
      });

      it('should call findOne method of getRepository', async () => {
        await deleteExpense(null, { id: 0 });
        expect(findOne).toHaveBeenCalledTimes(1);
        expect(findOne).toHaveBeenCalledWith(0);
      });

      it("should reject if find doesn't succeed", async () => {
        getRepository.mockImplementation(() => ({ findOne: () => null }));
        expect(deleteExpense(null, { id: 0 })).rejects.toBeTruthy();
      });

      it('should call remove on happy path', async () => {
        await deleteExpense(null, { id: 0, name: 'Modified' });
        expect(remove).toHaveBeenCalledTimes(1);
        expect(remove).toHaveBeenCalledWith(exampleExpense);
      });
    });
  });
});
