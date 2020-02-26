/* eslint-disable no-multi-assign */
/* eslint-disable no-empty */
import * as typeorm from 'typeorm';
import * as classValidator from 'class-validator';
import * as currencyResolvers from '../../../graphql/resolvers/currency';
import * as currencyModel from '../../../models/Currency';
import { creditAccountById } from '../../../graphql/resolvers/creditAccount';
import { debitAccountById } from '../../../graphql/resolvers/debitAccount';

const exampleCurrency: any = {
  id: 0,
  name: 'Example Currency',
  debitAccounts: [1, 2, 3],
  creditAccounts: [1, 2],
};

jest.mock('../../../graphql/resolvers/debitAccount', () => ({
  debitAccountById: jest.fn(),
}));

jest.mock('../../../graphql/resolvers/creditAccount', () => ({
  creditAccountById: jest.fn(),
}));

describe('Currency resolvers', () => {
  let getRepository: jest.SpyInstance;
  let currencyResolver: jest.SpyInstance;
  let currencyById: jest.SpyInstance;
  let validateOrReject: jest.SpyInstance;
  const Currency = ((currencyModel.default as any) = jest.fn());

  const [find, findOne, save, remove] = [
    jest.fn(() => [exampleCurrency]),
    jest.fn(() => exampleCurrency),
    jest.fn(() => exampleCurrency),
    jest.fn(() => 0),
  ];

  beforeEach(() => {
    validateOrReject = jest
      .spyOn(classValidator, 'validateOrReject')
      .mockImplementation();

    getRepository = jest
      .spyOn(typeorm, 'getRepository')
      .mockImplementation(() => ({ find, findOne, save, remove } as any));
  });

  afterEach(() => {
    getRepository.mockClear();
    validateOrReject.mockClear();
    find.mockClear();
    findOne.mockClear();
    save.mockClear();
    remove.mockClear();
    Currency.mockClear();
  });

  describe('currencyById', () => {
    const succesfulRepoStub: any = { findOne: jest.fn(() => exampleCurrency) };
    const failedRepoStub: any = { findOne: jest.fn() };

    beforeEach(() => {
      currencyResolver = jest.spyOn(currencyResolvers, 'currencyResolver');
    });

    afterEach(() => currencyResolver.mockClear());
    afterAll(() => currencyResolver.mockRestore());

    it('should call currencyResolver once', async () => {
      await currencyResolvers.currencyById(succesfulRepoStub, 0);
      expect(currencyResolver).toHaveBeenCalledTimes(1);
    });

    it('should call currencyResolver with correct argument', async () => {
      await currencyResolvers.currencyById(succesfulRepoStub, 0);
      expect(currencyResolver).toHaveBeenCalledWith(exampleCurrency);
    });

    it("should throw error if find doesn't succeed", async () =>
      expect(
        currencyResolvers.currencyById(failedRepoStub, 0),
      ).rejects.toBeTruthy());

    it("should not call currencyResolver if find doesn't succeed", async () => {
      try {
        await currencyResolvers.currencyById(failedRepoStub, 0);
      } catch (err) {}

      expect(currencyResolver).not.toHaveBeenCalled();
    });
  });

  describe('currencyResolver', () => {
    it('should generate static properties correctly', () => {
      const currency = currencyResolvers.currencyResolver(exampleCurrency);
      expect(currency.id).toBe(exampleCurrency.id);
      expect(currency.name).toBe(exampleCurrency.name);
    });

    it('should call debitAccountById three times if executed mapping', () => {
      const currency = currencyResolvers.currencyResolver(exampleCurrency);
      currency.debitAccounts();
      expect(debitAccountById).toHaveBeenCalledTimes(3);
    });

    it('should call creditAccountById two times if executed mapping', () => {
      const currency = currencyResolvers.currencyResolver(exampleCurrency);
      currency.creditAccounts();
      expect(creditAccountById).toHaveBeenCalledTimes(2);
    });
  });

  describe('Query', () => {
    describe('getCurrencies', () => {
      const getCurrencies = currencyResolvers.default.Query
        .getCurrencies as any;

      it('should call find when invoked getCurrencies', async () => {
        await getCurrencies();
        expect(find).toHaveBeenCalledTimes(1);
      });

      it('should map results of query into currencyResolver', async () => {
        currencyResolver = jest
          .spyOn(currencyResolvers, 'currencyResolver')
          .mockImplementation();

        getRepository.mockImplementation(() => ({ find: () => [1, 2, 3] }));
        await getCurrencies();
        expect(currencyResolver).toHaveBeenCalledTimes(3);

        /**
         * I put the next two arguments (number, index, list)
         * because of been called on a map
         */
        expect(currencyResolver).toHaveBeenNthCalledWith(1, 1, 0, [1, 2, 3]);
        expect(currencyResolver).toHaveBeenNthCalledWith(2, 2, 1, [1, 2, 3]);
        expect(currencyResolver).toHaveBeenNthCalledWith(3, 3, 2, [1, 2, 3]);
        currencyResolver.mockRestore();
      });
    });

    describe('getCurrency', () => {
      const getCurrency = currencyResolvers.default.Query.getCurrency as any;

      beforeEach(() => {
        currencyById = jest
          .spyOn(currencyResolvers, 'currencyById')
          .mockImplementation();

        getRepository.mockImplementation(() => 'Example repository');
      });

      afterEach(() => currencyById.mockClear());
      afterAll(() => currencyById.mockRestore());

      it('should call currencyById with correct id and repository', async () => {
        await getCurrency(null, { id: 0 });
        expect(currencyById).toHaveBeenCalledTimes(1);
        expect(currencyById).toHaveBeenCalledWith('Example repository', 0);
      });

      it('should call getRepository with Currency model', async () => {
        await getCurrency(null, { id: 0 });
        expect(getRepository).toHaveBeenCalledTimes(1);
        expect(getRepository).toHaveBeenCalledWith(Currency);
      });
    });
  });

  describe('Mutation', () => {
    describe('createCurrency', () => {
      const createCurrency = currencyResolvers.default.Mutation
        .createCurrency as any;

      it('should construct new Currency when invoked', async () => {
        await createCurrency(null, { name: 'Example' });
        expect(Currency).toHaveBeenCalledTimes(1);
        expect(Currency).toHaveBeenCalledWith('Example');
      });

      it('should call repository save method when invoked', async () => {
        await createCurrency(null, { name: 'Example' });
        expect(save).toHaveBeenCalledTimes(1);
        expect(save).toHaveBeenCalledWith(new Currency('Example'));
      });

      it('should call rejectOrValidate when invoked', async () => {
        await createCurrency(null, { name: 'Example' });
        expect(validateOrReject).toHaveBeenCalledTimes(1);
        expect(validateOrReject).toHaveBeenCalledWith(new Currency('Example'));
      });
    });

    describe('updateCurrency', () => {
      const updateCurrency = currencyResolvers.default.Mutation
        .updateCurrency as any;

      beforeEach(() => {
        currencyResolver = jest
          .spyOn(currencyResolvers, 'currencyResolver')
          .mockImplementation();
      });

      it('should call findOne method of getRepository', async () => {
        await updateCurrency(null, { id: 0 });
        expect(findOne).toHaveBeenCalledTimes(1);
        expect(findOne).toHaveBeenCalledWith(0);
      });

      it("should reject if find doesn't succeed", async () => {
        getRepository.mockImplementation(() => ({ findOne: () => null }));
        expect(updateCurrency(null, { id: 0 })).rejects.toBeTruthy();
      });

      it('should change attributes if given', async () => {
        const reference = { name: 'Not modified' };
        getRepository.mockImplementation(() => ({
          findOne: () => reference,
          save,
        }));

        await updateCurrency(null, { id: 0, name: 'Modified' });
        expect(reference.name).toBe('Modified');
      });

      it('should call save on happy path', async () => {
        await updateCurrency(null, { id: 0 });
        expect(save).toHaveBeenCalledTimes(1);
        expect(save).toHaveBeenCalledWith(exampleCurrency);
      });

      it('should call rejectOrValidate on happy path', async () => {
        await updateCurrency(null, { id: 0 });
        expect(validateOrReject).toHaveBeenCalledTimes(1);
        expect(validateOrReject).toHaveBeenCalledWith(exampleCurrency);
      });
    });

    describe('deleteCurrency', () => {
      const deleteCurrency = currencyResolvers.default.Mutation
        .deleteCurrency as any;

      beforeEach(() => {
        currencyResolver = jest
          .spyOn(currencyResolvers, 'currencyResolver')
          .mockImplementation();
      });

      it('should call findOne method of getRepository', async () => {
        await deleteCurrency(null, { id: 0 });
        expect(findOne).toHaveBeenCalledTimes(1);
        expect(findOne).toHaveBeenCalledWith(0);
      });

      it("should reject if find doesn't succeed", async () => {
        getRepository.mockImplementation(() => ({ findOne: () => null }));
        expect(deleteCurrency(null, { id: 0 })).rejects.toBeTruthy();
      });

      it('should call remove on happy path', async () => {
        await deleteCurrency(null, { id: 0, name: 'Modified' });
        expect(remove).toHaveBeenCalledTimes(1);
        expect(remove).toHaveBeenCalledWith(exampleCurrency);
      });
    });
  });
});
