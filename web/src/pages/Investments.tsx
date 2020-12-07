import { makeStyles, Paper, Typography } from '@material-ui/core';
import React from 'react';
import FintualGoals from '../components/investments/FintualGoals';
import ViewportContainer from '../components/ui/misc/ViewportContainer';
import CustomTabs from '../components/ui/navigation/CustomTabs';
import { useLocale } from '../hooks/utils/useLocale';
import { useTabs } from '../hooks/utils/useTabs';

const useStyles = makeStyles((theme) => ({
  main: { maxWidth: theme.spacing(150) },
  title: { marginBottom: theme.spacing(2) },
  accounts: {
    flex: 1,
    padding: theme.spacing(4),
    overflow: 'auto',
    [theme.breakpoints.down('xs')]: { padding: theme.spacing(2) },
  },
  buttonWrapper: { display: 'flex', justifyContent: 'flex-end', marginTop: theme.spacing(2) },
}));

const tabs = [
  { key: 'fintual' as const, label: 'Fintual' },
  { key: 'buda' as const, label: 'Buda', disabled: true },
];

const Investments: React.FC = () => {
  const classes = useStyles();
  const { locale } = useLocale();
  const { selected, change } = useTabs({
    tabs: tabs.map(({ key }) => key),
    initialTab: 'fintual',
  });

  return (
    <ViewportContainer className={classes.main}>
      <Typography className={classes.title} variant="h5">
        {locale('elements:plural:investment')}
      </Typography>
      <CustomTabs tabs={tabs} selected={selected} change={change} />
      <Paper className={classes.accounts} square elevation={1}>
        {selected === 'fintual' && <FintualGoals />}
      </Paper>
    </ViewportContainer>
  );
};

export default Investments;
