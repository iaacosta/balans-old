import React from 'react';
import { Card, CardContent, Typography, Box, makeStyles } from '@material-ui/core';

import { MyFintualGoalsQuery } from '../../@types/graphql';
import { useLocale } from '../../hooks/utils/useLocale';
import AmountTypography from '../ui/dataDisplay/AmountTypography';

interface Props {
  goal: MyFintualGoalsQuery['goals'][number];
}

const useStyles = makeStyles((theme) => ({
  balance: { marginTop: theme.spacing(2) },
  type: { margin: theme.spacing(0, 0, 1, 1), lineHeight: theme.typography.body2.lineHeight },
  actions: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  buttons: { display: 'flex', '& > *:not(:last-child)': { marginRight: theme.spacing(1) } },
  subBalance: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subBalanceAnnotation: { fontSize: 10, opacity: 0.6 },
  subBalanceOperand: { opacity: 0.5 },
  subBalanceWrapper: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: -theme.spacing(2),
    opacity: 0.8,
    '& > *:not(:last-child)': { marginRight: theme.spacing(2) },
  },
}));

const FintualGoalCard: React.FC<Props> = ({ goal: { name, value, profit, deposited } }) => {
  const classes = useStyles();
  const { locale } = useLocale();

  return (
    <>
      <Card>
        <CardContent>
          <Typography variant="body2" color="textSecondary">
            {name}
          </Typography>
          <AmountTypography className={classes.balance} variant="h2" noColor>
            {value}
          </AmountTypography>
          <Box className={classes.subBalanceWrapper}>
            <Box className={classes.subBalance}>
              <AmountTypography variant="subtitle1">{deposited}</AmountTypography>
              <Typography className={classes.subBalanceAnnotation} variant="body2">
                Depositado
              </Typography>
            </Box>
            <Typography className={classes.subBalanceOperand} variant="subtitle1">
              +
            </Typography>
            <Box className={classes.subBalance}>
              <AmountTypography variant="subtitle1">{profit}</AmountTypography>
              <Typography className={classes.subBalanceAnnotation} variant="body2">
                Rentabilidad
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </>
  );
};

export default FintualGoalCard;
