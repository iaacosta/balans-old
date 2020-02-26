import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';

dayjs.extend(utc);

export default {
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'A date custom scalar type parsed with dayjs',
    parseValue: dayjs,
    serialize: (value) => dayjs(value).valueOf(),
    parseLiteral(ast) {
      if (ast.kind === Kind.INT || ast.kind === Kind.STRING) {
        return dayjs(ast.value);
      }
      return dayjs();
    },
  }),
};
