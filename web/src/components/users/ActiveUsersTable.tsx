import React, { useMemo } from 'react';
import { Column } from 'react-table';
import { capitalize, makeStyles } from '@material-ui/core';

import ActiveActionsCell from './ActiveActionCell';
import EnhancedTable from '../ui/dataDisplay/EnhancedTable';
import { useAllActiveUsers } from '../../hooks/graphql';

const useStyles = makeStyles(() => ({ table: { flex: 1 } }));

const ActiveUsersTable: React.FC = () => {
  const classes = useStyles();
  const { users, loading } = useAllActiveUsers();

  const columns: Column<typeof users[number]>[] = useMemo(
    () => [
      { Header: 'Name', accessor: 'name' },
      { Header: 'Email', accessor: 'email' },
      { Header: 'Username', accessor: 'username', Cell: ({ value }) => `@${value}` },
      { Header: 'Role', accessor: 'role', Cell: ({ value }) => capitalize(value) },
      { Header: 'Actions', id: 'actions', Cell: ActiveActionsCell },
    ],
    [],
  );

  return (
    <EnhancedTable className={classes.table} columns={columns} data={users} loading={loading} />
  );
};

export default ActiveUsersTable;
