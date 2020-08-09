import { createStore } from 'redux';

export const addToken = (token: string) => ({ type: 'ADD_TOKEN', token } as const);
export const removeToken = () => ({ type: 'REMOVE_TOKEN' } as const);
export const expireToken = () => ({ type: 'EXPIRE_TOKEN' } as const);

export const initialState = {
  token: localStorage.getItem('x-auth') || null,
  tokenExpired: false,
};

const baseReducer = (
  state: typeof initialState = initialState,
  action: ReturnType<typeof addToken | typeof removeToken | typeof expireToken>,
) => {
  switch (action.type) {
    case 'ADD_TOKEN':
      return { ...state, token: action.token, tokenExpired: false };
    case 'REMOVE_TOKEN':
      return { ...state, token: null };
    case 'EXPIRE_TOKEN':
      return { ...state, token: null, tokenExpired: true };
    default:
      return state;
  }
};

export const baseStore = createStore(baseReducer);
