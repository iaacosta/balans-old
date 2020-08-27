/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { useTheme, Typography, Box } from '@material-ui/core';
import ContainerLoader from '../misc/ContainerLoader';

interface Props<T> {
  data: T[];
  loading: boolean;
  noEntriesLabel?: string;
  children: React.FC<Omit<ListChildComponentProps, 'data'> & { data: T[] }>;
}

const VirtualizedList = <T extends Record<string, unknown>>({
  data,
  loading,
  noEntriesLabel,
  children,
}: Props<T>): React.ReactElement<any, any> | null => {
  const theme = useTheme();

  if (loading) return <ContainerLoader />;
  if (data.length === 0)
    return (
      <Box m={2}>
        <Typography variant="caption" color="textSecondary">
          {noEntriesLabel || 'No entries'}
        </Typography>
      </Box>
    );

  return (
    <AutoSizer>
      {({ height, width }) => (
        <FixedSizeList
          height={height}
          width={width}
          itemSize={theme.spacing(9)}
          itemData={data}
          itemCount={data.length}
        >
          {children}
        </FixedSizeList>
      )}
    </AutoSizer>
  );
};

export default VirtualizedList;
