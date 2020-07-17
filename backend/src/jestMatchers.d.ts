declare namespace jest {
  interface Matchers<R> {
    toBeSuccessful(): R;
    toBeRejected(): R;
    toBeRejectedByAuth(): R;
  }
}
