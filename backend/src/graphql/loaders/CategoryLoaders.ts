import DataLoader from 'dataloader';
import { getRepository } from 'typeorm';
import { keyBy } from 'lodash';
import Category from '../../models/Category';

export class CategoriesByIdLoader extends DataLoader<number, Category | null> {
  constructor() {
    super(async (categoryIds) => {
      const categories = await getRepository(Category)
        .createQueryBuilder('category')
        .select()
        .where('id IN (:...categoryIds)', { categoryIds })
        .getMany();

      const categoriesById = keyBy(categories, 'id');

      return categoryIds.map((id) => categoriesById[id] || null);
    });
  }
}
