import { createStore } from 'redux';

export const addToken = (token: string) => ({ type: 'ADD_TOKEN', token } as const);

const initialState = {
  token: localStorage.getItem('x-auth') || null,
};

const baseReducer = (
  state: typeof initialState = initialState,
  action: ReturnType<typeof addToken>,
) => {
  switch (action.type) {
    case 'ADD_TOKEN':
      return { ...state, token: action.token };
    default:
      return state;
  }
};

export const baseStore = createStore(baseReducer);
