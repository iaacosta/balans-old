import { MigrationInterface, QueryRunner } from 'typeorm';
import { groupBy, map, keyBy } from 'lodash';

import defaultCategories from '../static/defaultCategories.json';
import colors from '../constants/colors';

export class AddsColorToCategories1598807127767 implements MigrationInterface {
  name = 'AddsColorToCategories1598807127767';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "category" ADD "color" character varying NOT NULL DEFAULT '#000000'`,
    );

    const categories: { id: number; name: string }[] = await queryRunner.query(
      'SELECT id, name FROM "category"',
    );

    if (categories.length === 0) {
      await queryRunner.query(
        `ALTER TABLE "category" ALTER COLUMN "color" DROP DEFAULT`,
      );
      return;
    }

    const groupedCategories = groupBy(categories, 'name');
    const groupedDefaultCategories = keyBy(defaultCategories, 'name');
    const defaultColor = colors[0];

    await Promise.all(
      map(groupedCategories, (categories, key) =>
        queryRunner.query(`
          UPDATE "category" 
          SET color = '${groupedDefaultCategories[key]?.color || defaultColor}'
          WHERE id IN (${categories.map(({ id }) => id).join(',')})
        `),
      ),
    );

    await queryRunner.query(
      `ALTER TABLE "category" ALTER COLUMN "color" DROP DEFAULT`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "color"`);
  }
}
