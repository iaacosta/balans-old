import { useState } from 'react';
import { ElementOf } from '../@types/helpers';

type Props<T extends ReadonlyArray<string>> = {
  tabs: T;
  initialTab: ElementOf<T>;
};

type Returns<T extends ReadonlyArray<string>> = {
  selected: ElementOf<T>;
  selectedIndex: number;
  change: (tab: ElementOf<T>) => void;
};

export const useTabs = <T extends ReadonlyArray<string>>({
  tabs,
  initialTab,
}: Props<T>): Returns<T> => {
  const [selectedTab, setSelectedTab] = useState(initialTab ? tabs.indexOf(initialTab) : 0);

  const changeTab = (tab: ElementOf<T>) => setSelectedTab(tabs.indexOf(tab));

  return {
    selected: tabs[selectedTab] as ElementOf<T>,
    selectedIndex: selectedTab,
    change: changeTab,
  };
};
