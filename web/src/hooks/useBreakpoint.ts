import { useTheme, useMediaQuery } from '@material-ui/core';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';

type Props = {
  layout: Breakpoint | number;
  towards?: 'down' | 'up';
};

export const useBreakpoint = ({ layout, towards }: Props): boolean => {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints[towards || 'down'](layout));
};
