// Action Types
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const SIGNUP = 'SIGNUP';
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const USER_PAGE = 'USER_PAGE';

// Action Creators
export const login = () => ({
  type: LOGIN,
});

export const signup = () => ({
  type: SIGNUP,
});

export const registerSuccess = () => ({
  type: REGISTER_SUCCESS,
});

export const userPage = () => ({
  type: USER_PAGE,
});

export const logout = () => ({
  type: LOGOUT,
});
