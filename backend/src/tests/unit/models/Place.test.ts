import { validateOrReject } from 'class-validator';

import Place from '../../../models/Place';

describe('Place model test', () => {
  it('should create Place object', () =>
    expect(new Place('Place', 0, 0)).not.toBeFalsy());

  it('should create Place that has correct attributes', () =>
    expect(new Place('Place', 0, 0)).toMatchObject({
      name: 'Place',
      latitude: 0,
      longitude: 0,
    }));

  describe('validation', () => {
    it('should not pass validation if name is empty', () => {
      const category = new Place('', 0, 0);
      expect(validateOrReject(category)).rejects.toBeTruthy();
    });

    it('should not pass validation if latitude is invalid', () => {
      const category = new Place('Place', 181, 0);
      expect(validateOrReject(category)).rejects.toBeTruthy();
    });

    it('should not pass validation if longitude is invalid', () => {
      const category = new Place('Place', 0, 181);
      expect(validateOrReject(category)).rejects.toBeTruthy();
    });

    it('should pass validation if longitude and latitude are valid', async () => {
      const category = new Place('Place', -90, 180);
      expect(await validateOrReject(category)).toBeUndefined();
    });
  });
});
