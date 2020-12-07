import crypto from 'crypto';

export const mockDecryption = (
  decryptedImplementation?: () => string,
): jest.SpyInstance => {
  const spy = jest.spyOn(crypto, 'createDecipheriv');

  spy.mockImplementation(
    () =>
      ({
        setAuthTag: () => null,
        final: () => '',
        update: decryptedImplementation || (() => 'decrypted'),
      } as any),
  );

  return spy;
};
