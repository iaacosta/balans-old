/* eslint-disable react-hooks/rules-of-hooks */
import React, { useMemo } from 'react';
import {
  makeStyles,
  Paper,
  Box,
  ListItemText,
  ListItem,
  ListItemSecondaryAction,
  Divider,
} from '@material-ui/core';
import { Restore as RestoreIcon } from '@material-ui/icons';
import { capitalize } from 'lodash';

import { deletedUsersQuery } from '../../graphql/users';
import { AllDeletedUsersQuery } from '../../@types/graphql';
import { useRedirectedQuery } from '../../hooks/graphql/useRedirectedQuery';
import VirtualizedList from '../ui/VirtualizedList';
import EnhancedIconButton from '../ui/EnhancedIconButton';
import { useRestoreUser } from '../../hooks/graphql/useRestoreUser';

const useStyles = makeStyles((theme) => ({
  list: { flex: 1 },
  container: { listStyle: 'none' },
  secondaryActions: {
    display: 'flex',
    '& > *:not(:last-child)': { marginRight: theme.spacing(1) },
  },
}));

const DeletedUsersList: React.FC = () => {
  const classes = useStyles();
  const { data, loading } = useRedirectedQuery<AllDeletedUsersQuery>(deletedUsersQuery);
  const users: AllDeletedUsersQuery['users'] = useMemo(() => data?.users || [], [data]);

  return (
    <Paper elevation={1} className={classes.list} square>
      <VirtualizedList data={users} loading={loading || !data}>
        {({ index, style, data: userData }) => {
          const { id, name, username, role } = userData[index];
          const [restoreUser, { loading: restoreLoading }] = useRestoreUser();
          return (
            <Box style={style} key={index}>
              <ListItem classes={{ container: classes.container }} component="div">
                <ListItemText
                  primary={`${name}`}
                  secondary={`@${username} / ${capitalize(role)}`}
                />
                <ListItemSecondaryAction className={classes.secondaryActions}>
                  <EnhancedIconButton
                    contained
                    disabled={restoreLoading}
                    onClick={() => restoreUser(id)}
                    color="success"
                  >
                    <RestoreIcon fontSize="small" />
                  </EnhancedIconButton>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider variant="middle" />
            </Box>
          );
        }}
      </VirtualizedList>
    </Paper>
  );
};

export default DeletedUsersList;
