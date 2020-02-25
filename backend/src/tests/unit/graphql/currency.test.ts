/* eslint-disable no-empty */
import * as typeorm from 'typeorm';
import * as currencyModule from '../../../graphql/resolvers/currency';
import {
  creditAccountById,
  debitAccountById,
} from '../../../graphql/resolvers/account';

const exampleCurrency: any = {
  id: 0,
  name: 'Example Currency',
  debitAccounts: [1, 2, 3],
  creditAccounts: [1, 2],
};

const succesfulRepoStub: any = { findOne: jest.fn(() => exampleCurrency) };
const failedRepoStub: any = { findOne: jest.fn() };

jest.mock('../../../graphql/resolvers/account', () => ({
  debitAccountById: jest.fn(),
  creditAccountById: jest.fn(),
}));

describe('Currency resolvers', () => {
  const [find, findOne] = [jest.fn(() => []), jest.fn()];
  (typeorm as any).getRepository = jest.fn(() => ({ find, findOne }));
  const getRepository = typeorm.getRepository as jest.Mock;

  describe('currencyById', () => {
    const currencyResolverSpy = jest.spyOn(currencyModule, 'currencyResolver');

    afterEach(() => currencyResolverSpy.mockReset());
    afterAll(() => currencyResolverSpy.mockRestore());

    it('should call currencyResolver once', async () => {
      await currencyModule.currencyById(succesfulRepoStub, 0);
      expect(currencyResolverSpy).toHaveBeenCalledTimes(1);
    });

    it('should call currencyResolver with correct argument', async () => {
      await currencyModule.currencyById(succesfulRepoStub, 0);
      expect(currencyResolverSpy).toHaveBeenCalledWith(exampleCurrency);
    });

    it("should throw error if find doesn't succeed", async () =>
      expect(
        currencyModule.currencyById(failedRepoStub, 0),
      ).rejects.toBeTruthy());

    it("should not call currencyResolver if find doesn't succeed", async () => {
      try {
        await currencyModule.currencyById(failedRepoStub, 0);
      } catch (err) {}

      expect(currencyResolverSpy).not.toHaveBeenCalled();
    });
  });

  describe('currencyResolver', () => {
    it('should generate static properties correctly', () => {
      const currency = currencyModule.currencyResolver(exampleCurrency);
      expect(currency.id).toBe(exampleCurrency.id);
      expect(currency.name).toBe(exampleCurrency.name);
    });

    it('should call debitAccountById three times if executed mapping', () => {
      const currency = currencyModule.currencyResolver(exampleCurrency);
      currency.debitAccounts();
      expect(debitAccountById).toHaveBeenCalledTimes(3);
    });

    it('should call creditAccountById two times if executed mapping', () => {
      const currency = currencyModule.currencyResolver(exampleCurrency);
      currency.creditAccounts();
      expect(creditAccountById).toHaveBeenCalledTimes(2);
    });
  });

  describe('Query', () => {
    afterEach(() => {
      find.mockReset();
      findOne.mockReset();
    });

    it('should call find without args when invoked getCurrencies', async () => {
      await (currencyModule.default.Query.getCurrencies as any)();
      expect(find).toHaveBeenCalledTimes(1);
      expect(find).toHaveBeenCalledWith();
    });
  });
});
