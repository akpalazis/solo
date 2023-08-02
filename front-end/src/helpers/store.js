import { createStore } from 'redux';

const initialState = {
  page: 'login',
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, page: 'login' };
    case 'LOGOUT':
      return { ...state,page: 'logout'}
    case 'SIGNUP':
      return { ...state, page: 'signup' };
    case 'REGISTER_SUCCESS':
      return { ...state, page: 'registered' };
    case 'USER_PAGE':
      return { ...state, page: 'userPage' };
    default:
      return state;
  }
}

const store = createStore(reducer);

export default store;
