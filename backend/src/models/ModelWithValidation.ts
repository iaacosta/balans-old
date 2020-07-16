import { BeforeInsert } from 'typeorm';
import { validateOrReject } from 'class-validator';
import ValidationErrors from '../graphql/errors/ValidationErrors';

export default class ValidModel {
  @BeforeInsert()
  async validate() {
    try {
      await validateOrReject(this);
    } catch (validationErrors) {
      throw new ValidationErrors(
        this.constructor.name.toLowerCase(),
        validationErrors,
      );
    }
  }
}
