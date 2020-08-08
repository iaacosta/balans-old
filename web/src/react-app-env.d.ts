/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/ban-types */
/// <reference types="react-scripts" />
import { UsePaginationInstanceProps, UsePaginationOptions, UsePaginationState } from 'react-table';

type Object = Record<string, unknown>;
declare module 'react-table' {
  // take this file as-is, or comment out the sections that don't apply to your plugin configuration

  export interface TableOptions<D extends Object>
    extends UsePaginationOptions<D>,
      Record<string, any> {}

  export interface TableInstance<D extends Object = {}> extends UsePaginationInstanceProps<D> {}
  export interface TableState<D extends Object = {}> extends UsePaginationState<D> {}

  export interface Column<D extends Object = {}> {}
  export interface ColumnInstance<D extends Object = {}> {}
  export interface Cell<D extends Object = {}> {}
  export interface Row<D extends Object = {}> {}
}
