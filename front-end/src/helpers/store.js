import { createStore, combineReducers } from 'redux';
import React from "react";

const loginInitialState = {
  page: 'login',
};

function loginReducer(state = loginInitialState, action) {
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

const userInitialState = {
      page: 'welcome',
};


const userReducer = (state = userInitialState, action) => {
  switch (action.type) {
    case 'WELCOME':
      return {
        ...state,
        page: 'welcome',
      };
    case 'TRIPS':
      return {
        ...state,
        page: 'trips',
      };
    case 'ADD':
      return {
        ...state,
        page: 'add',
      }
    case 'DISCUSSION':
      return {
        ...state,
      page:'discussion'
      }
    default:
      return state;
  }
};

const alertInitialState = {
    notifications: [],
};

const alertReducer = (state = alertInitialState, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATIONS':
      return {
        ...state,
        notifications: action.notifications,
      };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  login: loginReducer,
  user: userReducer,
  alert: alertReducer
});

const store = createStore(rootReducer);

export default store;
