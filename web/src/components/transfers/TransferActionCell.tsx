import React from 'react';
import { CellProps } from 'react-table';
import { Box, makeStyles } from '@material-ui/core';
import { Delete as DeleteIcon, Edit as EditIcon } from '@material-ui/icons';

import { MyTransfersQuery } from '../../@types/graphql';
import EnhancedIconButton from '../ui/misc/EnhancedIconButton';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    '& > *:not(:last-child)': { marginRight: theme.spacing(2) },
  },
}));

const TransferActionCell: React.FC<CellProps<MyTransfersQuery['transfers'][number]>> = ({
  row,
}) => {
  const classes = useStyles();
  const { id } = row.original.from;

  return (
    <Box className={classes.wrapper}>
      <EnhancedIconButton data-testid={`updateTransfer${id}`} contained disabled color="info">
        <EditIcon />
      </EnhancedIconButton>
      <EnhancedIconButton contained disabled data-testid={`deleteTransfer${id}`} color="error">
        <DeleteIcon />
      </EnhancedIconButton>
    </Box>
  );
};

export default TransferActionCell;
