import { MigrationInterface, QueryRunner } from 'typeorm';
import defaultCategories from '../static/defaultCategories.json';

export class CreateDefaultCategories1598672670752
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const users = (await queryRunner.query('SELECT id FROM "user"')) as {
      id: number;
    }[];

    if (users.length === 0) return;

    const categories = users
      .map(({ id }) =>
        defaultCategories.map((category) => ({ ...category, userId: id })),
      )
      .flat();

    const queryCategories = categories
      .map(({ name, type, userId }) => `'${name}','${type}',${userId}`)
      .join('),(');

    await queryRunner.query(
      `INSERT INTO category("name", "type", "userId") VALUES (${queryCategories})`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DELETE FROM category');
  }
}
