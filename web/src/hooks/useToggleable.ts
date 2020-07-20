/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useState } from 'react';

type Props = { initialToggled?: boolean };

export const useToggleable = ({ initialToggled = false }: Props = {}) => {
  const [toggled, setToggled] = useState(initialToggled);
  const toggle = () => setToggled(!toggled);
  return { toggled, toggle };
};
