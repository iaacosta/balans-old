import React from 'react';
import { CellProps } from 'react-table';
import { Box, makeStyles } from '@material-ui/core';
import { Delete as DeleteIcon, Edit as EditIcon } from '@material-ui/icons';

import { MyTransfersQuery } from '../../@types/graphql';
import EnhancedIconButton from '../ui/misc/EnhancedIconButton';
import { useDeleteTransfer } from '../../hooks/graphql';

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
  const [deleteTransfer, { loading }] = useDeleteTransfer();
  const { operationId } = row.original.from;

  return (
    <Box className={classes.wrapper}>
      <EnhancedIconButton
        data-testid={`updateTransfer${operationId}`}
        contained
        disabled
        color="info"
      >
        <EditIcon />
      </EnhancedIconButton>
      <EnhancedIconButton
        contained
        disabled={loading}
        onClick={() => deleteTransfer(operationId)}
        data-testid={`deleteTransfer${operationId}`}
        color="error"
      >
        <DeleteIcon />
      </EnhancedIconButton>
    </Box>
  );
};

export default TransferActionCell;
