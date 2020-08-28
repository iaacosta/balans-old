/* eslint-disable @typescript-eslint/no-explicit-any */
import { InMemoryCache, FieldMergeFunction } from '@apollo/client';

const defaultMerge: FieldMergeFunction<any, any> = (existing, incoming) => incoming;

export default new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        users: { merge: defaultMerge },
        myAccounts: { merge: defaultMerge },
        myTransactions: { merge: defaultMerge },
        deletedUsers: { merge: defaultMerge },
      },
    },
  },
});
