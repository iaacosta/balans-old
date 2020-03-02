import { createConnection, Connection, getConnection } from 'typeorm';
import {
  query,
  mutate,
  subCategory,
  getCategoryById,
  getSubCategoriesRelatedToCategory,
  getIncomesRelated,
  getExpensesRelated,
  seedTestDatabase,
  createPgClient,
} from '../../utils';
import { subCategories } from '../../utils/data.json';
import SubCategory from '../../../models/SubCategory';

const {
  GET_SUBCATEGORIES,
  GET_SUBCATEGORY,
  GET_SUBCATEGORY_NESTED,
  CREATE_SUBCATEGORY,
  UPDATE_SUBCATEGORY,
  DELETE_SUBCATEGORY,
} = subCategory;
console.log = jest.fn();

describe('sub category API calls', () => {
  let connection: Connection;
  const pgClient = createPgClient();

  beforeAll(async () => {
    connection = await createConnection();
    await pgClient.connect();
  });

  beforeEach(() => seedTestDatabase(pgClient));

  afterAll(() => {
    connection.close();
    pgClient.end();
  });

  describe('getSubCategories', () => {
    it('should get correct sub categories', async () => {
      const { data } = await query({ query: GET_SUBCATEGORIES });
      expect(data!.getSubCategories).toHaveLength(3);

      subCategories.forEach((subCat, idx) => {
        const category = getCategoryById(subCat.categoryId)!;
        const incomes = getIncomesRelated(subCat.id, 'subCategory')!;
        const expenses = getExpensesRelated(subCat.id, 'subCategory')!;

        expect(data!.getSubCategories[idx]).toMatchObject({
          id: subCat.id.toString(),
          name: subCat.name,
          category: { ...category, id: category.id.toString() },
          incomes,
          expenses,
        });
      });
    });
  });

  describe('getSubCategory', () => {
    it('should get correct sub category', async () => {
      const { data } = await query({
        query: GET_SUBCATEGORY,
        variables: { id: 1 },
      });

      const shouldCategory = getCategoryById(subCategories[0].id)!;
      const incomes = getIncomesRelated(subCategories[0].id, 'subCategory')!;
      const expenses = getExpensesRelated(subCategories[0].id, 'subCategory')!;

      expect(data!.getSubCategory).toMatchObject({
        id: subCategories[0].id.toString(),
        name: subCategories[0].name,
        category: { ...shouldCategory, id: shouldCategory.id.toString() },
        incomes,
        expenses,
      });
    });

    it('should get nested sub category', async () => {
      const { data } = await query({
        query: GET_SUBCATEGORY_NESTED,
        variables: { id: 1 },
      });

      const shouldCategory = getCategoryById(subCategories[0].id)!;
      const shouldSubCategories = getSubCategoriesRelatedToCategory(
        shouldCategory.id,
      );

      expect(data!.getSubCategory).toMatchObject({
        id: subCategories[0].id.toString(),
        name: subCategories[0].name,
        category: {
          ...shouldCategory,
          id: shouldCategory.id.toString(),
          subCategories: shouldSubCategories,
        },
      });
    });
  });

  describe('createSubCategory', () => {
    it('should create a sub category', async () => {
      const exampleAccount = {
        name: 'Created sub category',
        categoryId: 1,
      };

      await mutate({
        mutation: CREATE_SUBCATEGORY,
        variables: exampleAccount,
      });

      const result = await getConnection()
        .getRepository(SubCategory)
        .createQueryBuilder('sub_category')
        .leftJoinAndSelect('sub_category.category', 'category')
        .where('sub_category.name = :name', { name: 'Created sub category' })
        .getOne();

      expect(result).not.toBeUndefined();
      expect(result).toMatchObject({
        name: exampleAccount.name,
        category: getCategoryById(exampleAccount.categoryId),
      });
    });

    it('should not create a sub category', async () => {
      const exampleAccount = { name: '' };

      await mutate({
        mutation: CREATE_SUBCATEGORY,
        variables: exampleAccount,
      });

      const result = await getConnection()
        .getRepository(SubCategory)
        .createQueryBuilder('sub_category')
        .leftJoinAndSelect('sub_category.category', 'category')
        .where('sub_category.name = :name', { name: 'Created sub category' })
        .getOne();

      expect(result).toBeUndefined();
    });
  });

  describe('updateSubCategory', () => {
    it('should update a sub category', async () => {
      await mutate({
        mutation: UPDATE_SUBCATEGORY,
        variables: { id: 1, name: 'Modified sub category', categoryId: 2 },
      });

      const result = await getConnection()
        .getRepository(SubCategory)
        .createQueryBuilder('sub_category')
        .leftJoinAndSelect('sub_category.category', 'category')
        .where('sub_category.id = :id', { id: 1 })
        .getOne();

      expect(result).not.toBeUndefined();
      expect(result!.name).toBe('Modified sub category');
      expect(result!.category).toMatchObject(getCategoryById(2)!);
    });
  });

  describe('deleteCurrency', () => {
    it('should delete a sub category', async () => {
      await mutate({
        mutation: DELETE_SUBCATEGORY,
        variables: { id: 1 },
      });

      const result = await getConnection()
        .createQueryBuilder()
        .select('sub_category')
        .from(SubCategory, 'sub_category')
        .where('sub_category.id = :id', { id: 1 })
        .getOne();

      expect(result).toBeUndefined();
    });
  });
});
