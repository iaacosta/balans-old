import React, { useMemo } from 'react';
import { Typography, makeStyles } from '@material-ui/core';
import ViewportContainer from '../components/ui/misc/ViewportContainer';
import CustomTabs from '../components/ui/navigation/CustomTabs';
import { useTabs } from '../hooks/utils/useTabs';
import Transactions from '../components/transactions/Transactions';
import Transfers from '../components/transfers/Transfers';
import { useLocale } from '../hooks/utils/useLocale';

const useStyles = makeStyles((theme) => ({
  title: { marginBottom: theme.spacing(2) },
}));

const Movements: React.FC = () => {
  const classes = useStyles();
  const { locale } = useLocale();

  const tabs = useMemo(
    () => [
      { key: 'transactions' as const, label: locale('movements:tabs:transactions') },
      { key: 'transfers' as const, label: locale('movements:tabs:transfers') },
      { key: 'passive' as const, label: locale('movements:tabs:passive'), disabled: true },
    ],
    [locale],
  );

  const { selected, change } = useTabs({
    tabs: tabs.map(({ key }) => key),
    initialTab: 'transactions',
  });

  return (
    <ViewportContainer>
      <Typography className={classes.title} variant="h5">
        {locale('movements:title')}
      </Typography>
      <CustomTabs tabs={tabs} selected={selected} change={change} />
      {selected === 'transactions' && <Transactions />}
      {selected === 'transfers' && <Transfers />}
    </ViewportContainer>
  );
};

export default Movements;
