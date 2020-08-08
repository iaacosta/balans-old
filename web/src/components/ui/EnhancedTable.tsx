import React from 'react';
import { Column, useTable } from 'react-table';
import {
  Table,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
  withStyles,
  Typography,
  TableContainer,
  Paper,
} from '@material-ui/core';
import ContainerLoader from './ContainerLoader';

type Props<T extends Record<string, unknown>> = {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  noEntriesLabel?: string;
};

const EnhancedCell = withStyles((theme) => ({
  head: {
    ...theme.typography.subtitle2,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
}))(TableCell);

const EnhancedTable = <T extends Record<string, unknown>>({
  data,
  columns,
  loading,
  noEntriesLabel,
}: Props<T>): React.ReactElement => {
  const { getTableProps, getTableBodyProps, headers, rows, prepareRow } = useTable({
    columns,
    data,
  });

  let Body = (
    <TableRow>
      <TableCell colSpan={columns.length}>
        <ContainerLoader />
      </TableCell>
    </TableRow>
  );

  if (!loading && rows.length > 0) {
    Body = (
      <>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <TableRow {...row.getRowProps()}>
              {row.cells.map(({ getCellProps, render }) => (
                <EnhancedCell {...getCellProps()} variant="body">
                  {render('Cell')}
                </EnhancedCell>
              ))}
            </TableRow>
          );
        })}
      </>
    );
  } else if (!loading && rows.length === 0) {
    Body = (
      <TableRow>
        <TableCell>
          <Typography variant="caption" color="textSecondary">
            {noEntriesLabel || 'No entries'}
          </Typography>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableContainer component={Paper} elevation={1}>
      <Table {...getTableProps()}>
        <TableHead>
          <TableRow>
            {headers.map(({ getHeaderProps, render }) => (
              <EnhancedCell {...getHeaderProps()} variant="head">
                {render('Header')}
              </EnhancedCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody {...getTableBodyProps()}>{Body}</TableBody>
      </Table>
    </TableContainer>
  );
};

export default EnhancedTable;
