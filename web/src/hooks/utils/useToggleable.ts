import { useState } from 'react';

type Props = { initialToggled?: boolean };
type Returns = {
  toggled: boolean;
  toggle: () => void;
  set: (value: boolean) => void;
};

export const useToggleable = ({ initialToggled = false }: Props = {}): Returns => {
  const [toggled, setToggled] = useState(initialToggled);
  const toggle = () => setToggled(!toggled);
  return { toggled, toggle, set: setToggled };
};
