export type ElementOf<T extends ReadonlyArray<unknown>> = T extends ReadonlyArray<infer ElementOf>
  ? ElementOf
  : never;
