/* eslint-disable @typescript-eslint/no-unused-vars */
declare namespace jest {
  interface Matchers<R> {
    toBeSuccessful(): R;
    toBeRejected(): R;
    toBeRejectedByAuth(): R;
  }
}
