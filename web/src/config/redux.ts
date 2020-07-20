import { createStore } from 'redux';

export const addToken = (token: string) => ({ type: 'ADD_TOKEN', token } as const);
export const removeToken = () => ({ type: 'REMOVE_TOKEN' } as const);

const initialState = {
  token: localStorage.getItem('x-auth') || null,
};

const baseReducer = (
  state: typeof initialState = initialState,
  action: ReturnType<typeof addToken | typeof removeToken>,
) => {
  switch (action.type) {
    case 'ADD_TOKEN':
      return { ...state, token: action.token };
    case 'REMOVE_TOKEN':
      return { ...state, token: null };
    default:
      return state;
  }
};

export const baseStore = createStore(baseReducer);
