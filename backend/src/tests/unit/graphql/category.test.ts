/* eslint-disable no-multi-assign */
/* eslint-disable no-empty */
import * as typeorm from 'typeorm';
import * as classValidator from 'class-validator';
import * as categoryResolvers from '../../../graphql/resolvers/category';
import * as categoryModel from '../../../models/Category';

const exampleCategory: any = {
  id: 0,
  name: 'Example Category',
  debitAccounts: [1, 2, 3],
  creditAccounts: [1, 2],
};

describe('Category resolvers', () => {
  let getRepository: jest.SpyInstance;
  let categoryResolver: jest.SpyInstance;
  let categoryById: jest.SpyInstance;
  let find: jest.Mock;
  let findOne: jest.Mock;
  let save: jest.Mock;
  let remove: jest.Mock;
  let validateOrReject: jest.SpyInstance;
  const Category = ((categoryModel.default as any) = jest.fn());

  beforeEach(() => {
    find = jest.fn(() => [exampleCategory]);
    findOne = jest.fn(() => exampleCategory);
    save = jest.fn(() => exampleCategory);
    remove = jest.fn(() => 0);

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
    Category.mockClear();
  });

  describe('categoryById', () => {
    beforeEach(() => {
      categoryResolver = jest.spyOn(categoryResolvers, 'categoryResolver');
    });

    afterEach(() => categoryResolver.mockClear());
    afterAll(() => categoryResolver.mockRestore());

    it('should call categoryResolver once', async () => {
      getRepository.mockImplementation(() => ({
        findOne: () => exampleCategory,
      }));
      await categoryResolvers.categoryById(0);
      expect(categoryResolver).toHaveBeenCalledTimes(1);
    });

    it('should call categoryResolver with correct argument', async () => {
      getRepository.mockImplementation(() => ({
        findOne: () => exampleCategory,
      }));
      await categoryResolvers.categoryById(0);
      expect(categoryResolver).toHaveBeenCalledWith(exampleCategory);
    });

    it("should throw error if find doesn't succeed", async () => {
      getRepository.mockImplementation(() => ({ findOne: () => null }));
      expect(categoryResolvers.categoryById(0)).rejects.toBeTruthy();
    });

    it("should not call categoryResolver if find doesn't succeed", async () => {
      getRepository.mockImplementation(() => ({ findOne: () => null }));

      try {
        await categoryResolvers.categoryById(0);
      } catch (err) {}

      expect(categoryResolver).not.toHaveBeenCalled();
    });
  });

  describe('categoryResolver', () => {
    it('should generate static properties correctly', () => {
      const category = categoryResolvers.categoryResolver(exampleCategory);
      expect(category.id).toBe(exampleCategory.id);
      expect(category.name).toBe(exampleCategory.name);
    });
  });

  describe('Query', () => {
    describe('getCategories', () => {
      const getCategories = categoryResolvers.default.Query
        .getCategories as any;

      it('should call find when invoked getCategories', async () => {
        await getCategories();
        expect(find).toHaveBeenCalledTimes(1);
      });

      it('should map results of query into categoryResolver', async () => {
        categoryResolver = jest
          .spyOn(categoryResolvers, 'categoryResolver')
          .mockImplementation();

        getRepository.mockImplementation(() => ({ find: () => [1, 2, 3] }));
        await getCategories();
        expect(categoryResolver).toHaveBeenCalledTimes(3);

        /**
         * I put the next two arguments (number, index, list)
         * because of been called on a map
         */
        expect(categoryResolver).toHaveBeenNthCalledWith(1, 1, 0, [1, 2, 3]);
        expect(categoryResolver).toHaveBeenNthCalledWith(2, 2, 1, [1, 2, 3]);
        expect(categoryResolver).toHaveBeenNthCalledWith(3, 3, 2, [1, 2, 3]);
        categoryResolver.mockRestore();
      });
    });

    describe('getCategory', () => {
      const getCategory = categoryResolvers.default.Query.getCategory as any;

      beforeEach(() => {
        categoryById = jest
          .spyOn(categoryResolvers, 'categoryById')
          .mockImplementation();
      });

      afterEach(() => categoryById.mockClear());
      afterAll(() => categoryById.mockRestore());

      it('should call categoryById with correct id', async () => {
        await getCategory(null, { id: 0 });
        expect(categoryById).toHaveBeenCalledTimes(1);
        expect(categoryById).toHaveBeenCalledWith(0);
      });
    });
  });

  describe('Mutation', () => {
    describe('createCategory', () => {
      const createCategory = categoryResolvers.default.Mutation
        .createCategory as any;

      it('should construct new Category when invoked', async () => {
        await createCategory(null, {
          name: 'Example',
          type: 'income',
          icon: 'ex',
        });

        expect(Category).toHaveBeenCalledTimes(1);
        expect(Category).toHaveBeenCalledWith('Example', 'income', 'ex');
      });

      it('should call repository save method when invoked', async () => {
        await createCategory(null, {
          name: 'Example',
          type: 'income',
          icon: 'ex',
        });

        expect(save).toHaveBeenCalledTimes(1);
        expect(save).toHaveBeenCalledWith(
          new Category('Example', 'income', 'ex'),
        );
      });

      it('should call rejectOrValidate when invoked', async () => {
        await createCategory(null, {
          name: 'Example',
          type: 'income',
          icon: 'ex',
        });

        expect(validateOrReject).toHaveBeenCalledTimes(1);
        expect(validateOrReject).toHaveBeenCalledWith(
          new Category('Example', 'income', 'ex'),
        );
      });
    });

    describe('updateCategory', () => {
      const updateCategory = categoryResolvers.default.Mutation
        .updateCategory as any;

      beforeEach(() => {
        categoryResolver = jest
          .spyOn(categoryResolvers, 'categoryResolver')
          .mockImplementation();
      });

      it('should call findOne method of getRepository', async () => {
        await updateCategory(null, { id: 0 });
        expect(findOne).toHaveBeenCalledTimes(1);
        expect(findOne).toHaveBeenCalledWith(0);
      });

      it("should reject if find doesn't succeed", async () => {
        getRepository.mockImplementation(() => ({ findOne: () => null }));
        expect(updateCategory(null, { id: 0 })).rejects.toBeTruthy();
      });

      it('should change attributes if given', async () => {
        const reference = { name: 'Not modified', type: 'expense', icon: 'ex' };

        getRepository.mockImplementation(() => ({
          findOne: () => reference,
          save,
        }));

        await updateCategory(null, {
          id: 0,
          name: 'Modified',
          type: 'income',
          icon: 'ex2',
        });

        expect(reference.name).toBe('Modified');
        expect(reference.type).toBe('income');
        expect(reference.icon).toBe('ex2');
      });

      it('should call save on happy path', async () => {
        await updateCategory(null, { id: 0 });
        expect(save).toHaveBeenCalledTimes(1);
        expect(save).toHaveBeenCalledWith(exampleCategory);
      });

      it('should call rejectOrValidate on happy path', async () => {
        await updateCategory(null, { id: 0 });
        expect(validateOrReject).toHaveBeenCalledTimes(1);
        expect(validateOrReject).toHaveBeenCalledWith(exampleCategory);
      });
    });

    describe('deleteCategory', () => {
      const deleteCategory = categoryResolvers.default.Mutation
        .deleteCategory as any;

      beforeEach(() => {
        categoryResolver = jest
          .spyOn(categoryResolvers, 'categoryResolver')
          .mockImplementation();
      });

      it('should call findOne method of getRepository', async () => {
        await deleteCategory(null, { id: 0 });
        expect(findOne).toHaveBeenCalledTimes(1);
        expect(findOne).toHaveBeenCalledWith(0);
      });

      it("should reject if find doesn't succeed", async () => {
        getRepository.mockImplementation(() => ({ findOne: () => null }));
        expect(deleteCategory(null, { id: 0 })).rejects.toBeTruthy();
      });

      it('should call remove on happy path', async () => {
        await deleteCategory(null, { id: 0, name: 'Modified' });
        expect(remove).toHaveBeenCalledTimes(1);
        expect(remove).toHaveBeenCalledWith(exampleCategory);
      });
    });
  });
});
