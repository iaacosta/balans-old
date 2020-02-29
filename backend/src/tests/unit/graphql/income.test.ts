/* eslint-disable no-multi-assign */
/* eslint-disable no-empty */
import * as typeorm from 'typeorm';
import * as classValidator from 'class-validator';
import * as resolvers from '../../../graphql/resolvers/income';
import * as model from '../../../models/Income';
import { subCategoryById } from '../../../graphql/resolvers/subCategory';
import { accountById } from '../../../graphql/resolvers/account';

const exampleIncome: any = {
  id: 0,
  amount: 1000,
  date: '2020-01-01T03:00:00',
  description: 'example',
  account: { id: 0 },
  subCategory: { id: 0 },
};

jest.mock('../../../graphql/resolvers/subCategory', () => ({
  subCategoryById: jest.fn(),
}));

jest.mock('../../../graphql/resolvers/account', () => ({
  accountById: jest.fn(),
}));

describe('Income resolvers', () => {
  let getRepository: jest.SpyInstance;
  let incomeResolver: jest.SpyInstance;
  let incomeById: jest.SpyInstance;
  let find: jest.Mock;
  let findOne: jest.Mock;
  let save: jest.Mock;
  let remove: jest.Mock;
  let validateOrReject: jest.SpyInstance;
  const Income = ((model.default as any) = jest.fn());

  beforeEach(() => {
    find = jest.fn(() => [exampleIncome]);
    findOne = jest.fn(() => exampleIncome);
    save = jest.fn(() => exampleIncome);
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
    getRepository.mockClear();
    validateOrReject.mockClear();
    find.mockClear();
    findOne.mockClear();
    save.mockClear();
    remove.mockClear();
    Income.mockClear();
  });

  describe('incomeById', () => {
    beforeEach(() => {
      incomeResolver = jest.spyOn(resolvers, 'incomeResolver');
    });

    afterEach(() => incomeResolver.mockClear());
    afterAll(() => incomeResolver.mockRestore());

    it('should call incomeResolver once', async () => {
      getRepository.mockImplementation(() => ({
        findOne: () => exampleIncome,
      }));

      await resolvers.incomeById(0);
      expect(incomeResolver).toHaveBeenCalledTimes(1);
    });

    it('should call incomeResolver with correct argument', async () => {
      getRepository.mockImplementation(() => ({
        findOne: () => exampleIncome,
      }));

      await resolvers.incomeById(0);
      expect(incomeResolver).toHaveBeenCalledWith(exampleIncome);
    });

    it("should throw error if find doesn't succeed", async () => {
      getRepository.mockImplementation(() => ({ findOne: () => null }));
      expect(resolvers.incomeById(0)).rejects.toBeTruthy();
    });

    it("should not call incomeResolver if find doesn't succeed", async () => {
      getRepository.mockImplementation(() => ({ findOne: () => null }));

      try {
        await resolvers.incomeById(0);
      } catch (err) {}

      expect(incomeResolver).not.toHaveBeenCalled();
    });
  });

  describe('incomesById', () => {
    beforeEach(() => {
      incomeResolver = jest.spyOn(resolvers, 'incomeResolver');
    });

    afterEach(() => incomeResolver.mockClear());
    afterAll(() => incomeResolver.mockRestore());

    it('should call incomeResolver twice', async () => {
      find.mockImplementation(() => [exampleIncome, exampleIncome]);
      await resolvers.incomesById([1, 2]);
      expect(incomeResolver).toHaveBeenCalledTimes(2);
    });

    it('should call incomeResolver with correct arguments', async () => {
      const ret = [exampleIncome, exampleIncome];
      find.mockImplementation(() => ret);
      await resolvers.incomesById([1, 2]);

      expect(incomeResolver).toHaveBeenNthCalledWith(1, exampleIncome);
      expect(incomeResolver).toHaveBeenNthCalledWith(2, exampleIncome);
    });

    it('should return an empty list if no ids given', async () =>
      expect(await resolvers.incomesById([])).toHaveLength(0));

    it('should not call find nor incomeResolver if no ids given', async () => {
      await resolvers.incomesById([]);

      expect(find).not.toHaveBeenCalled();
      expect(incomeResolver).not.toHaveBeenCalled();
    });
  });

  describe('incomeResolver', () => {
    it('should generate static properties correctly', () => {
      const income = resolvers.incomeResolver(exampleIncome);
      expect(income.id).toBe(exampleIncome.id);
      expect(income.amount).toBe(exampleIncome.amount);
      expect(income.date).toBe(exampleIncome.date);
      expect(income.description).toBe(exampleIncome.description);
    });

    it('should call subCategoryById one time correctly', () => {
      const income = resolvers.incomeResolver(exampleIncome);
      income.subCategory();
      expect(subCategoryById).toHaveBeenCalledTimes(1);
      expect(subCategoryById).toHaveBeenCalledWith(0);
    });

    it('should call accountById one time correctly', () => {
      const income = resolvers.incomeResolver(exampleIncome);
      income.account();
      expect(accountById).toHaveBeenCalledTimes(1);
      expect(accountById).toHaveBeenCalledWith(0);
    });
  });

  describe('Query', () => {
    describe('getIncomes', () => {
      const getIncomes = resolvers.default.Query.getIncomes as any;

      it('should call find when invoked getIncomes', async () => {
        await getIncomes();
        expect(find).toHaveBeenCalledTimes(1);
        expect(find).toBeCalledWith({
          relations: ['subCategory', 'account'],
          order: { id: 1 },
        });
      });

      it('should map results of query into incomeResolver', async () => {
        incomeResolver = jest
          .spyOn(resolvers, 'incomeResolver')
          .mockImplementation();

        getRepository.mockImplementation(() => ({ find: () => [1, 2, 3] }));
        await getIncomes();
        expect(incomeResolver).toHaveBeenCalledTimes(3);

        /**
         * I put the next two arguments (number, index, list)
         * because of been called on a map
         */
        expect(incomeResolver).toHaveBeenNthCalledWith(1, 1, 0, [1, 2, 3]);
        expect(incomeResolver).toHaveBeenNthCalledWith(2, 2, 1, [1, 2, 3]);
        expect(incomeResolver).toHaveBeenNthCalledWith(3, 3, 2, [1, 2, 3]);
        incomeResolver.mockRestore();
      });
    });

    describe('getIncome', () => {
      const getIncome = resolvers.default.Query.getIncome as any;

      beforeEach(() => {
        incomeById = jest.spyOn(resolvers, 'incomeById').mockImplementation();
      });

      afterEach(() => incomeById.mockClear());
      afterAll(() => incomeById.mockRestore());

      it('should call incomeById with correct id', async () => {
        await getIncome(null, { id: 0 });
        expect(incomeById).toHaveBeenCalledTimes(1);
        expect(incomeById).toHaveBeenCalledWith(0);
      });
    });
  });

  describe('Mutation', () => {
    describe('createIncome', () => {
      const createIncome = resolvers.default.Mutation.createIncome as any;

      beforeEach(() => findOne.mockImplementation(() => 'example relation'));

      it('should construct new Income when invoked', async () => {
        await createIncome(null, {
          amount: 1000,
          date: 'example',
          accountId: 1,
          subCategoryId: 1,
        });

        expect(Income).toHaveBeenCalledTimes(1);
        expect(Income).toHaveBeenCalledWith(
          1000,
          'example',
          'example relation',
          'example relation',
          undefined,
        );
      });

      it('should call repository save method when invoked', async () => {
        await createIncome(null, {
          amount: 1000,
          date: 'example',
          accountId: 1,
          subCategoryId: 1,
        });

        expect(save).toHaveBeenCalledTimes(1);
        expect(save).toHaveBeenCalledWith(new Income());
      });

      it('should call rejectOrValidate when invoked', async () => {
        await createIncome(null, {
          amount: 1000,
          date: 'example',
          accountId: 1,
          subCategoryId: 1,
        });

        expect(validateOrReject).toHaveBeenCalledTimes(1);
        expect(validateOrReject).toHaveBeenCalledWith(new Income());
      });

      it('should reject if no income found', async () => {
        findOne.mockImplementation(() => null);
        expect(createIncome(null, { id: 0 })).rejects.toBeTruthy();
      });
    });

    describe('updateIncome', () => {
      const updateIncome = resolvers.default.Mutation.updateIncome as any;

      beforeEach(() => {
        incomeResolver = jest
          .spyOn(resolvers, 'incomeResolver')
          .mockImplementation();
      });

      it('should call findOne method of getRepository', async () => {
        await updateIncome(null, { id: 0 });
        expect(findOne).toHaveBeenCalledTimes(1);
        expect(findOne).toHaveBeenCalledWith(0, {
          relations: ['account', 'subCategory'],
        });
      });

      it("should reject if find doesn't succeed", async () => {
        getRepository.mockImplementation(() => ({ findOne: () => null }));
        expect(updateIncome(null, { id: 0 })).rejects.toBeTruthy();
      });

      it('should change base attributes if given', async () => {
        const reference = {
          amount: 1000,
          date: 'example',
          description: 'Example description',
        };

        findOne.mockImplementation(() => reference);
        await updateIncome(null, {
          id: 0,
          amount: 0,
          date: 'example2',
          description: 'Modified description',
        });

        expect(reference.amount).toBe(0);
        expect(reference.date).toBe('example2');
        expect(reference.description).toBe('Modified description');
      });

      it('should change subCategory if id given', async () => {
        const reference = { subCategory: { id: 0, name: 'Not modified' } };

        findOne.mockImplementation(() => reference);
        getRepository.mockImplementation((_model: jest.Mock) => {
          if (_model === Income) return { findOne, save };
          return { findOne: () => ({ id: 1, name: 'Modified' }) };
        });

        await updateIncome(null, { id: 0, subCategoryId: 1 });
        expect(reference.subCategory).toMatchObject({
          id: 1,
          name: 'Modified',
        });
      });

      it('should change account if id given', async () => {
        const reference = { account: { id: 0, name: 'Not modified' } };

        findOne.mockImplementation(() => reference);
        getRepository.mockImplementation((_model: jest.Mock) => {
          if (_model === Income) return { findOne, save };
          return { findOne: () => ({ id: 1, name: 'Modified' }) };
        });

        await updateIncome(null, { id: 0, accountId: 1 });
        expect(reference.account).toMatchObject({
          id: 1,
          name: 'Modified',
        });
      });

      it('should reject if no subCategory found with given id', async () => {
        getRepository.mockImplementation((_model: jest.Mock) => {
          if (_model === Income) return { findOne };
          return { findOne: () => null };
        });

        expect(
          updateIncome(null, { id: 0, subCategoryId: 1 }),
        ).rejects.toBeTruthy();
      });

      it('should reject if no account found with given id', async () => {
        getRepository.mockImplementation((_model: jest.Mock) => {
          if (_model === Income) return { findOne };
          return { findOne: () => null };
        });

        expect(
          updateIncome(null, { id: 0, accountId: 1 }),
        ).rejects.toBeTruthy();
      });

      it('should call save on happy path', async () => {
        await updateIncome(null, { id: 0 });
        expect(save).toHaveBeenCalledTimes(1);
        expect(save).toHaveBeenCalledWith(exampleIncome);
      });

      it('should call validateOrReject on happy path', async () => {
        await updateIncome(null, { id: 0 });
        expect(validateOrReject).toHaveBeenCalledTimes(1);
        expect(validateOrReject).toHaveBeenCalledWith(exampleIncome);
      });
    });

    describe('deleteIncome', () => {
      const deleteIncome = resolvers.default.Mutation.deleteIncome as any;
      beforeEach(() => {
        incomeResolver = jest
          .spyOn(resolvers, 'incomeResolver')
          .mockImplementation();
      });

      it('should call findOne method of getRepository', async () => {
        await deleteIncome(null, { id: 0 });
        expect(findOne).toHaveBeenCalledTimes(1);
        expect(findOne).toHaveBeenCalledWith(0);
      });

      it("should reject if find doesn't succeed", async () => {
        getRepository.mockImplementation(() => ({ findOne: () => null }));
        expect(deleteIncome(null, { id: 0 })).rejects.toBeTruthy();
      });

      it('should call remove on happy path', async () => {
        await deleteIncome(null, { id: 0, name: 'Modified' });
        expect(remove).toHaveBeenCalledTimes(1);
        expect(remove).toHaveBeenCalledWith(exampleIncome);
      });
    });
  });
});
