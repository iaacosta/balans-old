import { validateOrReject } from 'class-validator';

import Currency from '../../../models/Currency';

describe('Currency model test', () => {
  it('should create Currency object', () =>
    expect(new Currency('Example Currency')).not.toBeFalsy());

  it('should create Currency that has correct attributes', () => {
    expect(new Currency('Example Currency')).toMatchObject({
      name: 'Example Currency',
    });
  });

  it('should not pass validation if name is larger than 3 chars', () => {
    const currency = new Currency('Example');
    expect(validateOrReject(currency)).rejects.toBeTruthy();
  });

  it('should not pass validation if name is shorter than 3 chars', () => {
    const currency = new Currency('Ex');
    expect(validateOrReject(currency)).rejects.toBeTruthy();
  });

  it('should pass validation if name has 3 chars', async () => {
    const currency = new Currency('CLP');
    expect(await validateOrReject(currency)).toBeUndefined();
  });
});
