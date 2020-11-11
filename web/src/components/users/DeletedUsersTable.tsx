import React, { useMemo } from 'react';
import { Column } from 'react-table';
import { capitalize, makeStyles } from '@material-ui/core';

import EnhancedTable from '../ui/dataDisplay/EnhancedTable';
import DeletedActionsCell from './DeletedActionCell';
import { useAllDeletedUsers } from '../../hooks/graphql';
import { useLocale } from '../../hooks/utils/useLocale';

const useStyles = makeStyles(() => ({ table: { flex: 1 } }));

const DeletedUsersTable: React.FC = () => {
  const classes = useStyles();
  const { locale } = useLocale();
  const { users, loading } = useAllDeletedUsers();

  const columns: Column<typeof users[number]>[] = useMemo(
    () => [
      {
        Header: locale('users:form:name'),
        accessor: 'name',
      },
      {
        Header: locale('auth:signUpPage:email'),
        accessor: 'email',
      },
      {
        Header: locale('auth:common:username'),
        accessor: 'username',
        Cell: ({ value }) => `@${value}`,
      },
      {
        Header: locale('users:form:role'),
        accessor: 'role',
        Cell: ({ value }) => capitalize(value),
      },
      {
        Header: locale('tables:actions'),
        id: 'actions',
        Cell: DeletedActionsCell,
      },
    ],
    [locale],
  );

  return (
    <EnhancedTable
      className={classes.table}
      columns={columns}
      data={users}
      loading={loading}
      noEntriesLabel="No deleted users available"
    />
  );
};

export default DeletedUsersTable;
