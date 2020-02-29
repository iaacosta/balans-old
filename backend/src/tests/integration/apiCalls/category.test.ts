/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createConnection, Connection, getConnection } from 'typeorm';
import {
  query,
  mutate,
  seedCategories,
  category,
  seedSubCategories,
  getSubCategoriesRelatedToCategory,
} from '../../utils';
import { categories } from '../../utils/data.json';
import Category from '../../../models/Category';

const {
  GET_CATEGORIES,
  GET_CATEGORY,
  CREATE_CATEGORY,
  UPDATE_CATEGORY,
  DELETE_CATEGORY,
} = category;
console.log = jest.fn();

describe('category API calls', () => {
  let connection: Connection;

  beforeAll(async () => {
    connection = await createConnection();
  });

  beforeEach(() => seedCategories().then(seedSubCategories));
  afterAll(() => connection.close());

  describe('getCategories', () => {
    it('should get correct categories', async () => {
      const { data } = await query({ query: GET_CATEGORIES });

      expect(data!.getCategories).toHaveLength(3);

      categories.forEach((cat, idx) => {
        expect(data!.getCategories[idx]).toMatchObject({
          name: cat.name,
          type: cat.type,
          icon: cat.icon,
          subCategories: getSubCategoriesRelatedToCategory(cat.id),
        });
      });
    });
  });

  describe('getCategory', () => {
    it('should get correct category', async () => {
      const { data } = await query({
        query: GET_CATEGORY,
        variables: { id: 1 },
      });

      expect(data!.getCategory).toMatchObject({
        id: '1',
        name: categories[0].name,
        type: categories[0].type,
        icon: categories[0].icon,
      });
    });
  });

  describe('createCategory', () => {
    it('should create a category', async () => {
      await mutate({
        mutation: CREATE_CATEGORY,
        variables: { name: 'Created category', type: 'income', icon: 'ex4' },
      });

      const result = await getConnection()
        .createQueryBuilder()
        .select('category')
        .from(Category, 'category')
        .where('category.name = :name', { name: 'Created category' })
        .getOne();

      expect(result).not.toBeUndefined();
      expect(result).toMatchObject({
        name: 'Created category',
        type: 'income',
        icon: 'ex4',
      });
    });

    it('should not create a category', async () => {
      await mutate({
        mutation: CREATE_CATEGORY,
        variables: { name: '', type: 'not valid', icon: '' },
      });

      const result = await getConnection()
        .createQueryBuilder()
        .select('category')
        .from(Category, 'category')
        .where('category.name = :name', { name: 'CCR' })
        .getOne();

      expect(result).toBeUndefined();
    });
  });

  describe('updateCategory', () => {
    it('should update a category', async () => {
      await mutate({
        mutation: UPDATE_CATEGORY,
        variables: { id: 1, name: 'Modified category' },
      });

      const result = await getConnection()
        .createQueryBuilder()
        .select('category')
        .from(Category, 'category')
        .where('category.id = :id', { id: 1 })
        .getOne();

      expect(result).not.toBeUndefined();
      expect(result!.name).toBe('Modified category');
    });

    it('should not update a category', async () => {
      await mutate({
        mutation: UPDATE_CATEGORY,
        variables: { id: 1, name: '', type: 'Not valid', icon: '' },
      });

      const result = await getConnection()
        .createQueryBuilder()
        .select('category')
        .from(Category, 'category')
        .where('category.id = :id', { id: 1 })
        .getOne();

      expect(result).not.toBeUndefined();
      expect(result!.name).toBe('Example Category 1');
    });
  });

  describe('deleteCategory', () => {
    it('should delete a category ', async () => {
      await mutate({
        mutation: DELETE_CATEGORY,
        variables: { id: 1 },
      });

      const result = await getConnection()
        .createQueryBuilder()
        .select('category')
        .from(Category, 'category')
        .where('category.id = :id', { id: 1 })
        .getOne();

      expect(result).toBeUndefined();
    });
  });
});
