/* eslint-disable no-multi-assign */
/* eslint-disable no-empty */
import * as typeorm from 'typeorm';
import * as classValidator from 'class-validator';
import * as resolvers from '../../../graphql/resolvers/subCategory';
import * as model from '../../../models/SubCategory';
import { categoryById } from '../../../graphql/resolvers/category';

const exampleSubCat: any = {
  id: 0,
  name: 'Example SubCategory',
  category: { id: 0 },
  debitAccounts: [1, 2, 3],
  creditAccounts: [1, 2],
};

jest.mock('../../../graphql/resolvers/category', () => ({
  categoryById: jest.fn(),
}));

describe('SubCategory resolvers', () => {
  let getRepository: jest.SpyInstance;
  let subCategoryResolver: jest.SpyInstance;
  let subCategoryById: jest.SpyInstance;
  let find: jest.Mock;
  let findOne: jest.Mock;
  let save: jest.Mock;
  let remove: jest.Mock;
  let validateOrReject: jest.SpyInstance;
  const SubCategory = ((model.default as any) = jest.fn());

  beforeEach(() => {
    find = jest.fn(() => [exampleSubCat]);
    findOne = jest.fn(() => exampleSubCat);
    save = jest.fn(() => exampleSubCat);
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
    SubCategory.mockClear();
  });

  describe('subCategoryById', () => {
    beforeEach(() => {
      subCategoryResolver = jest.spyOn(resolvers, 'subCategoryResolver');
    });

    afterEach(() => subCategoryResolver.mockClear());
    afterAll(() => subCategoryResolver.mockRestore());

    it('should call subCategoryResolver once', async () => {
      getRepository.mockImplementation(() => ({
        findOne: () => exampleSubCat,
      }));
      await resolvers.subCategoryById(0);
      expect(subCategoryResolver).toHaveBeenCalledTimes(1);
    });

    it('should call subCategoryResolver with correct argument', async () => {
      getRepository.mockImplementation(() => ({
        findOne: () => exampleSubCat,
      }));
      await resolvers.subCategoryById(0);
      expect(subCategoryResolver).toHaveBeenCalledWith(exampleSubCat);
    });

    it("should throw error if find doesn't succeed", async () => {
      getRepository.mockImplementation(() => ({ findOne: () => null }));
      expect(resolvers.subCategoryById(0)).rejects.toBeTruthy();
    });

    it("should not call subCategoryResolver if find doesn't succeed", async () => {
      getRepository.mockImplementation(() => ({ findOne: () => null }));

      try {
        await resolvers.subCategoryById(0);
      } catch (err) {}

      expect(subCategoryResolver).not.toHaveBeenCalled();
    });
  });

  describe('subCategoriesById', () => {
    beforeEach(() => {
      subCategoryResolver = jest.spyOn(resolvers, 'subCategoryResolver');
    });

    afterEach(() => subCategoryResolver.mockClear());
    afterAll(() => subCategoryResolver.mockRestore());

    it('should call subCategoryResolver twice', async () => {
      find.mockImplementation(() => [exampleSubCat, exampleSubCat]);
      await resolvers.subCategoriesById([1, 2]);
      expect(subCategoryResolver).toHaveBeenCalledTimes(2);
    });

    it('should call subCategoryResolver with correct arguments', async () => {
      const ret = [exampleSubCat, exampleSubCat];
      find.mockImplementation(() => ret);
      await resolvers.subCategoriesById([1, 2]);

      expect(subCategoryResolver).toHaveBeenNthCalledWith(1, exampleSubCat);
      expect(subCategoryResolver).toHaveBeenNthCalledWith(2, exampleSubCat);
    });

    it('should return an empty list if no ids given', async () =>
      expect(await resolvers.subCategoriesById([])).toHaveLength(0));

    it('should not call find nor subCategoryResolver if no ids given', async () => {
      await resolvers.subCategoriesById([]);

      expect(find).not.toHaveBeenCalled();
      expect(subCategoryResolver).not.toHaveBeenCalled();
    });
  });

  describe('subCategoryResolver', () => {
    it('should generate static properties correctly', () => {
      const subCategory = resolvers.subCategoryResolver(exampleSubCat);
      expect(subCategory.id).toBe(exampleSubCat.id);
      expect(subCategory.name).toBe(exampleSubCat.name);
    });

    it('should call categoryById one time correctly', () => {
      const subCategory = resolvers.subCategoryResolver(exampleSubCat);
      subCategory.category();
      expect(categoryById).toHaveBeenCalledTimes(1);
    });
  });

  describe('Query', () => {
    describe('getSubCategories', () => {
      const getSubCategories = resolvers.default.Query.getSubCategories as any;

      it('should call find when invoked getSubCategories', async () => {
        await getSubCategories();
        expect(find).toHaveBeenCalledTimes(1);
      });

      it('should map results of query into subCategoryResolver', async () => {
        subCategoryResolver = jest
          .spyOn(resolvers, 'subCategoryResolver')
          .mockImplementation();

        getRepository.mockImplementation(() => ({ find: () => [1, 2, 3] }));
        await getSubCategories();
        expect(subCategoryResolver).toHaveBeenCalledTimes(3);

        /**
         * I put the next two arguments (number, index, list)
         * because of been called on a map
         */
        expect(subCategoryResolver).toHaveBeenNthCalledWith(1, 1, 0, [1, 2, 3]);
        expect(subCategoryResolver).toHaveBeenNthCalledWith(2, 2, 1, [1, 2, 3]);
        expect(subCategoryResolver).toHaveBeenNthCalledWith(3, 3, 2, [1, 2, 3]);
        subCategoryResolver.mockRestore();
      });
    });

    describe('getSubCategory', () => {
      const getSubCategory = resolvers.default.Query.getSubCategory as any;

      beforeEach(() => {
        subCategoryById = jest
          .spyOn(resolvers, 'subCategoryById')
          .mockImplementation();
      });

      afterEach(() => subCategoryById.mockClear());
      afterAll(() => subCategoryById.mockRestore());

      it('should call subCategoryById with correct id', async () => {
        await getSubCategory(null, { id: 0 });
        expect(subCategoryById).toHaveBeenCalledTimes(1);
        expect(subCategoryById).toHaveBeenCalledWith(0);
      });
    });
  });

  describe('Mutation', () => {
    describe('createSubCategory', () => {
      const createSubCategory = resolvers.default.Mutation
        .createSubCategory as any;

      beforeEach(() => findOne.mockImplementation(() => 'Example category'));

      it('should construct new SubCategory when invoked', async () => {
        await createSubCategory(null, {
          name: 'Example sub category',
          categoryId: 1,
        });

        expect(SubCategory).toHaveBeenCalledTimes(1);
        expect(SubCategory).toHaveBeenCalledWith(
          'Example sub category',
          'Example category',
        );
      });

      it('should call repository save method when invoked', async () => {
        await createSubCategory(null, {
          name: 'Example sub category',
          categoryId: 1,
        });

        expect(save).toHaveBeenCalledTimes(1);
        expect(save).toHaveBeenCalledWith(
          new SubCategory('Example sub category', 'Example category'),
        );
      });

      it('should call rejectOrValidate when invoked', async () => {
        await createSubCategory(null, {
          name: 'Example sub category',
          categoryId: 1,
        });

        expect(validateOrReject).toHaveBeenCalledTimes(1);
        expect(validateOrReject).toHaveBeenCalledWith(
          new SubCategory('Example sub category', 'Example category'),
        );
      });

      it('should reject if no sub category found', async () => {
        findOne.mockImplementation(() => null);
        expect(createSubCategory(null, { id: 0 })).rejects.toBeTruthy();
      });
    });

    describe('updateSubCategory', () => {
      const updateSubCategory = resolvers.default.Mutation
        .updateSubCategory as any;
      beforeEach(() => {
        subCategoryResolver = jest
          .spyOn(resolvers, 'subCategoryResolver')
          .mockImplementation();
      });

      it('should call findOne method of getRepository', async () => {
        await updateSubCategory(null, { id: 0 });
        expect(findOne).toHaveBeenCalledTimes(1);
        expect(findOne).toHaveBeenCalledWith(0, { relations: ['category'] });
      });

      it("should reject if find doesn't succeed", async () => {
        getRepository.mockImplementation(() => ({ findOne: () => null }));
        expect(updateSubCategory(null, { id: 0 })).rejects.toBeTruthy();
      });

      it('should change base attributes if given', async () => {
        const reference = { name: 'Not modified' };
        findOne.mockImplementation(() => reference);
        await updateSubCategory(null, { id: 0, name: 'Modified' });
        expect(reference.name).toBe('Modified');
      });

      it('should change category if id given', async () => {
        const reference = { category: { id: 0, name: 'Not modified' } };

        findOne.mockImplementation(() => reference);
        getRepository.mockImplementation((_model: jest.Mock) => {
          if (_model === SubCategory) return { findOne, save };
          return { findOne: () => ({ id: 1, name: 'Modified' }) };
        });

        await updateSubCategory(null, { id: 0, categoryId: 1 });
        expect(reference.category).toMatchObject({ id: 1, name: 'Modified' });
      });

      it('should reject if no category found with given id', async () => {
        getRepository.mockImplementation((_model: jest.Mock) => {
          if (_model === SubCategory) return { findOne };
          return { findOne: () => null };
        });

        expect(
          updateSubCategory(null, { id: 0, categoryId: 1 }),
        ).rejects.toBeTruthy();
      });

      it('should call save on happy path', async () => {
        await updateSubCategory(null, { id: 0 });
        expect(save).toHaveBeenCalledTimes(1);
        expect(save).toHaveBeenCalledWith(exampleSubCat);
      });

      it('should call validateOrReject on happy path', async () => {
        await updateSubCategory(null, { id: 0 });
        expect(validateOrReject).toHaveBeenCalledTimes(1);
        expect(validateOrReject).toHaveBeenCalledWith(exampleSubCat);
      });
    });

    describe('deleteSubCategory', () => {
      const deleteSubCategory = resolvers.default.Mutation
        .deleteSubCategory as any;
      beforeEach(() => {
        subCategoryResolver = jest
          .spyOn(resolvers, 'subCategoryResolver')
          .mockImplementation();
      });

      it('should call findOne method of getRepository', async () => {
        await deleteSubCategory(null, { id: 0 });
        expect(findOne).toHaveBeenCalledTimes(1);
        expect(findOne).toHaveBeenCalledWith(0);
      });

      it("should reject if find doesn't succeed", async () => {
        getRepository.mockImplementation(() => ({ findOne: () => null }));
        expect(deleteSubCategory(null, { id: 0 })).rejects.toBeTruthy();
      });

      it('should call remove on happy path', async () => {
        await deleteSubCategory(null, { id: 0, name: 'Modified' });
        expect(remove).toHaveBeenCalledTimes(1);
        expect(remove).toHaveBeenCalledWith(exampleSubCat);
      });
    });
  });
});
