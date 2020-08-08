import React, { useEffect, useMemo } from 'react';
import { Column } from 'react-table';
import { capitalize } from '@material-ui/core';
import { useQuery } from '@apollo/client';
import { useSnackbar } from 'notistack';
import { useHistory } from 'react-router-dom';

import { usersQuery } from '../../graphql/users';
import { AllUsersQuery } from '../../@types/graphql';
import routing from '../../constants/routing';
import ActiveActionsCell from './ActiveActionCell';
import EnhancedTable from '../ui/EnhancedTable';

const ActiveUsersTable: React.FC = () => {
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const { data, loading, error } = useQuery<AllUsersQuery>(usersQuery);

  const users: AllUsersQuery['users'] = useMemo(() => data?.users || [], [data]);
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

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
      history.push(routing.authenticated.dashboard);
    }
  }, [error, enqueueSnackbar, history]);

  return <EnhancedTable columns={columns} data={users} loading={loading} />;
};

export default ActiveUsersTable;
