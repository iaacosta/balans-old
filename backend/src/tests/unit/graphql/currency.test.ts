/* eslint-disable no-multi-assign */
/* eslint-disable no-empty */
import * as typeorm from 'typeorm';
import * as classValidator from 'class-validator';
import * as currencyResolvers from '../../../graphql/resolvers/currency';
import * as currencyModel from '../../../models/Currency';
import { accountsById } from '../../../graphql/resolvers/account';

const exampleCurrency: any = {
  id: 0,
  name: 'Example Currency',
  accounts: [{ id: 1 }, { id: 2 }, { id: 3 }],
};

jest.mock('../../../graphql/resolvers/account', () => ({
  accountsById: jest.fn(),
}));

describe('Currency resolvers', () => {
  let getRepository: jest.SpyInstance;
  let currencyResolver: jest.SpyInstance;
  let currencyById: jest.SpyInstance;
  let validateOrReject: jest.SpyInstance;
  let find: jest.Mock;
  let findOne: jest.Mock;
  let save: jest.Mock;
  let remove: jest.Mock;
  const Currency = ((currencyModel.default as any) = jest.fn());

  beforeEach(() => {
    find = jest.fn(() => [exampleCurrency]);
    findOne = jest.fn(() => exampleCurrency);
    save = jest.fn(() => exampleCurrency);
    remove = jest.fn(() => 0);

    validateOrReject = jest
      .spyOn(classValidator, 'validateOrReject')
      .mockImplementation();

    getRepository = jest
      .spyOn(typeorm, 'getRepository')
      .mockImplementation(() => ({ find, findOne, save, remove } as any));
  });

  afterEach(() => {
    (accountsById as jest.Mock).mockClear();
    getRepository.mockClear();
    validateOrReject.mockClear();
    find.mockClear();
    findOne.mockClear();
    save.mockClear();
    remove.mockClear();
    Currency.mockClear();
  });

  describe('currencyById', () => {
    beforeEach(() => {
      currencyResolver = jest.spyOn(currencyResolvers, 'currencyResolver');
    });

    afterEach(() => currencyResolver.mockClear());
    afterAll(() => currencyResolver.mockRestore());

    it('should call currencyResolver once', async () => {
      findOne.mockImplementation(() => exampleCurrency);
      await currencyResolvers.currencyById(0);
      expect(currencyResolver).toHaveBeenCalledTimes(1);
    });

    it('should call currencyResolver with correct argument', async () => {
      findOne.mockImplementation(() => exampleCurrency);
      await currencyResolvers.currencyById(0);
      expect(currencyResolver).toHaveBeenCalledWith(exampleCurrency);
    });

    it("should throw error if find doesn't succeed", async () => {
      findOne.mockImplementation(() => null);

      expect(currencyResolvers.currencyById(0)).rejects.toBeTruthy();
    });

    it("should not call currencyResolver if find doesn't succeed", async () => {
      findOne.mockImplementation(() => null);

      try {
        await currencyResolvers.currencyById(0);
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

    it('should call accountsById one time with correct arguments', () => {
      const currency = currencyResolvers.currencyResolver(exampleCurrency);
      currency.accounts();
      expect(accountsById).toHaveBeenCalledTimes(1);
      expect(accountsById).toHaveBeenCalledWith([1, 2, 3]);
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
        expect(currencyResolver).toHaveBeenNthCalledWith(1, 1);
        expect(currencyResolver).toHaveBeenNthCalledWith(2, 2);
        expect(currencyResolver).toHaveBeenNthCalledWith(3, 3);
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

      it('should call currencyById with correct id', async () => {
        await getCurrency(null, { id: 0 });
        expect(currencyById).toHaveBeenCalledTimes(1);
        expect(currencyById).toHaveBeenCalledWith(0);
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
