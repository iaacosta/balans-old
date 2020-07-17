/* eslint-disable no-restricted-syntax */

const checkIfSuccessful = (response: any) => {
  if (response.data) {
    for (const [query, _response] of Object.entries(response.data)) {
      if (_response) return [true, query];
    }
  }

  return [false, null];
};

expect.extend({
  toBeSuccessful: (response) => {
    if (!response.data || response.errors) {
      return {
        pass: false,
        message: () => `response was rejected: '${response.errors[0].message}'`,
      };
    }

    return { pass: true, message: () => 'OK' };
  },
  toBeRejected: (response) => {
    const [successful, query] = checkIfSuccessful(response);
    if (successful) {
      return {
        pass: false,
        message: () => `query '${query}' is defined in data field`,
      };
    }

    return { pass: true, message: () => 'OK' };
  },
  toBeRejectedByAuth: (response) => {
    if (response.errors) {
      for (const error of Object.values(response.errors as any[])) {
        if (error.extensions.code === 'UNAUTHENTICATED') {
          return { pass: true, message: () => 'OK' };
        }
      }
    }

    return {
      pass: false,
      message: () => "response wasn't rejected by authentication",
    };
  },
});
