import { createStore, combineReducers } from 'redux';

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

const tripsInitialState = {
    notifications: [],
};

const tripsReducer = (state = tripsInitialState, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATIONS':
      return {
        ...state,
        notifications: action.notifications,
      };
    case 'SET_TRIPS':
    return {
      ...state,
      trips: action.trips,
    };
    case 'SET_DISCUSSIONS':
    return {
      ...state,
      discussions: action.discussions,
    };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  login: loginReducer,
  user: userReducer,
  trips: tripsReducer
});

const store = createStore(rootReducer);

export default store;
