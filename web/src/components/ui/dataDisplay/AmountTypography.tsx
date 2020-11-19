import React from 'react';
import { makeStyles, Typography, TypographyProps } from '@material-ui/core';
import clsx from 'clsx';
import { formatMoney } from 'accounting';

export const useAmountStyles = makeStyles((theme) => ({
  expense: { color: theme.palette.error.main },
  income: { color: theme.palette.success.main },
  neutral: { color: theme.palette.info.main },
}));

type Props = Omit<TypographyProps, 'children'> & {
  children: number;
  noColor?: boolean;
  formattingConditions?: {
    neutral?: (value: number) => boolean;
    expense?: (value: number) => boolean;
    income?: (value: number) => boolean;
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Return = React.ReactElement<any, any> | null;

const defaultFormattingConditions = {
  neutral: (value: number) => value === 0,
  expense: (value: number) => value < 0,
  income: (value: number) => value > 0,
};

const AmountTypography = ({
  className,
  children,
  noColor,
  formattingConditions: conditions,
  ...props
}: Props): Return => {
  const classes = useAmountStyles();
  const cls = clsx({
    [classes.expense]:
      !noColor &&
      (conditions?.expense ? conditions?.expense : defaultFormattingConditions.expense)(children),
    [classes.income]:
      !noColor &&
      (conditions?.income ? conditions?.income : defaultFormattingConditions.income)(children),
    [classes.neutral]:
      !noColor &&
      (conditions?.neutral ? conditions?.neutral : defaultFormattingConditions.neutral)(children),
  });

  return (
    <Typography {...props} className={clsx(className, cls)}>
      {formatMoney(children)}
    </Typography>
  );
};

export default AmountTypography;
