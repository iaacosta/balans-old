import React from 'react';
import { Column, useTable, usePagination } from 'react-table';
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
  makeStyles,
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import ContainerLoader from './ContainerLoader';

type Props<T extends Record<string, unknown>> = {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  noEntriesLabel?: string;
  className?: string;
};

const EnhancedCell = withStyles((theme) => ({
  head: {
    ...theme.typography.subtitle2,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
}))(TableCell);

const useStyles = makeStyles((theme) => ({
  root: { marginTop: theme.spacing(2) },
  ul: { justifyContent: 'center' },
}));

const EnhancedTable = <T extends Record<string, unknown>>({
  data,
  columns,
  loading,
  noEntriesLabel,
  className,
}: Props<T>): React.ReactElement => {
  const classes = useStyles();
  const {
    getTableProps,
    getTableBodyProps,
    headers,
    rows,
    prepareRow,
    pageCount,
    gotoPage,
    page,
    state: { pageIndex },
  } = useTable({ columns, data, initialState: { pageSize: 8 } }, usePagination);

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
        {page.map((row) => {
          prepareRow(row);
          return (
            <TableRow {...row.getRowProps()} data-testid={`row${row.original.id}`}>
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
        <TableCell colSpan={columns.length}>
          <Typography variant="caption" color="textSecondary">
            {noEntriesLabel || 'No entries'}
          </Typography>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <>
      <TableContainer className={className} component={Paper} elevation={1}>
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
      <Pagination
        classes={classes}
        count={pageCount}
        page={pageIndex + 1}
        color="secondary"
        onChange={(event, newPage) => gotoPage(newPage - 1)}
      />
    </>
  );
};

export default EnhancedTable;
