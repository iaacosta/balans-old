import React from 'react';
import { Typography, makeStyles } from '@material-ui/core';
import ViewportContainer from '../components/ui/misc/ViewportContainer';
import CustomTabs from '../components/ui/navigation/CustomTabs';
import { useTabs } from '../hooks/utils/useTabs';
import Transactions from '../components/transactions/Transactions';
import Transfers from '../components/transfers/Transfers';

const useStyles = makeStyles((theme) => ({
  title: { marginBottom: theme.spacing(2) },
}));

const tabs = [
  { key: 'transactions' as const, label: 'Transactions' },
  { key: 'transfers' as const, label: 'Transfers' },
  { key: 'passive' as const, label: 'Passive transactions', disabled: true },
];

const Movements: React.FC = () => {
  const classes = useStyles();
  const { selected, change } = useTabs({
    tabs: tabs.map(({ key }) => key),
    initialTab: 'transactions',
  });

  return (
    <ViewportContainer>
      <Typography className={classes.title} variant="h5">
        My movements
      </Typography>
      <CustomTabs tabs={tabs} selected={selected} change={change} />
      {selected === 'transactions' && <Transactions />}
      {selected === 'transfers' && <Transfers />}
    </ViewportContainer>
  );
};

export default Movements;
