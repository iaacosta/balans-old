import React, { useMemo } from 'react';
import { Column } from 'react-table';
import { capitalize, makeStyles } from '@material-ui/core';

import EnhancedTable from '../ui/dataDisplay/EnhancedTable';
import DeletedActionsCell from './DeletedActionCell';
import { useAllDeletedUsers } from '../../hooks/graphql';

const useStyles = makeStyles(() => ({ table: { flex: 1 } }));

const DeletedUsersTable: React.FC = () => {
  const classes = useStyles();
  const { users, loading } = useAllDeletedUsers();

  const columns: Column<typeof users[number]>[] = useMemo(
    () => [
      { Header: 'Name', accessor: 'name' },
      { Header: 'Email', accessor: 'email' },
      { Header: 'Username', accessor: 'username', Cell: ({ value }) => `@${value}` },
      { Header: 'Role', accessor: 'role', Cell: ({ value }) => capitalize(value) },
      { Header: 'Actions', id: 'actions', Cell: DeletedActionsCell },
    ],
    [],
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
