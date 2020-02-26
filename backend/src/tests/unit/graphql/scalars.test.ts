import dayjs from 'dayjs';
import mockDate from 'mockdate';
import * as scalars from '../../../graphql/resolvers/scalars';

jest.mock('graphql', () => ({ GraphQLScalarType: jest.fn((arg) => arg) }));
jest.mock('graphql/language', () => ({
  Kind: {
    INT: 'INT',
    STRING: 'STRING',
    NULL: 'NULL',
  },
}));

const dateScalar = scalars.default.Date as any;

describe('scalars resolvers test', () => {
  describe('Date', () => {
    it('should parse normal value correctly', () =>
      expect(dateScalar.parseValue('2020-01-01').valueOf()).toBe(
        1577847600000,
      ));

    it('should serialize date value correctly', () =>
      expect(dateScalar.serialize(dayjs('2020-01-01'))).toBe(1577847600000));

    it('should parse string value correctly', () => {
      const parsed = dateScalar.parseLiteral({
        kind: 'STRING',
        value: '2020-01-01',
      });

      expect(parsed.valueOf()).toBe(1577847600000);
    });

    it('should parse int value correctly', () => {
      const parsed = dateScalar.parseLiteral({
        kind: 'INT',
        value: 1577847600000,
      });

      expect(parsed.valueOf()).toBe(1577847600000);
    });

    it('should parse any other value correctly', () => {
      mockDate.set('2020-01-01 00:00:00');
      const parsed = dateScalar.parseLiteral({ kind: 'NULL' });
      expect(parsed.valueOf()).toBe(1577847600000);
    });
  });
});
