import { createContext } from 'react';

const initialState = {
  onClose: (() => null) as () => void,
};

const DialogFormContext = createContext(initialState);

export type DialogFormContextType = typeof initialState;
export default DialogFormContext;
