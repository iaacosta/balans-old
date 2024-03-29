/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react';
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

import { useRestoreUser, useAllDeletedUsers } from '../../hooks/graphql';
import VirtualizedList from '../ui/dataDisplay/VirtualizedList';
import EnhancedIconButton from '../ui/misc/EnhancedIconButton';

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
  const { users, loading } = useAllDeletedUsers();

  return (
    <Paper elevation={1} className={classes.list} square>
      <VirtualizedList data={users} loading={loading}>
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
