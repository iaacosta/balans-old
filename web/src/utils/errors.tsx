import React from 'react';
import { capitalize, map } from 'lodash';
import { Typography } from '@material-ui/core';
import { ApolloError } from '@apollo/client';

export const handleError = (
  error: ApolloError,
  callback: (body: React.ReactNode) => unknown,
): void => {
  const [{ extensions }] = error.graphQLErrors;
  let body: React.ReactNode = error.message;

  if (extensions) {
    const { code, fields } = extensions;

    if (code === 'VALIDATION_ERROR') {
      body = map(fields, (value, idx) => (
        <Typography key={idx} variant="body2">
          {capitalize(value)}
        </Typography>
      ));
    } else {
      /* nothing special yet */
    }
  }

  callback(body);
};
