/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/ban-types */
/// <reference types="react-scripts" />
import { UsePaginationInstanceProps, UsePaginationOptions, UsePaginationState } from 'react-table';

type Object = Record<string, unknown>;

declare module 'react-table' {
  export interface TableOptions<D extends Object>
    extends UsePaginationOptions<D>,
      Record<string, any> {}

  export interface TableInstance<D extends Object = {}> extends UsePaginationInstanceProps<D> {}
  export interface TableState<D extends Object = {}> extends UsePaginationState<D> {}
}
