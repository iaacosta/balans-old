import React from 'react';
import { Paper, Tabs, makeStyles, Tab } from '@material-ui/core';

type Props<T> = {
  tabs: { key: T; label: string }[];
  selected: T;
  change: (tab: T) => void;
};

const useStyles = makeStyles(() => ({
  paper: { display: 'inline-block', alignSelf: 'flex-start' },
}));

const CustomTabs = <T extends string>({ tabs, selected, change }: Props<T>): React.ReactElement => {
  const classes = useStyles();

  return (
    <Paper square className={classes.paper} elevation={1}>
      <Tabs textColor="secondary" value={selected} onChange={(event, value) => change(value as T)}>
        {tabs.map(({ key, label }) => (
          <Tab key={key} value={key} label={label} />
        ))}
      </Tabs>
    </Paper>
  );
};

export default CustomTabs;
