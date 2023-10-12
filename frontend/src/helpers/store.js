import { createStore, combineReducers } from 'redux';

const loginInitialState = {
  page: 'HOME',
};

function loginReducer(state = loginInitialState, action) {
  switch (action.type) {
    case 'HOME':
      return {...state, page:'home'}
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
    case 'SETTINGS':
      return {
        ...state,
      page:'settings'
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

const initialUsernameState = {
  username: '', // Initialize username to an empty string
};

const userNameReducer = (state = initialUsernameState, action) => {
  switch (action.type) {
    case 'UPDATE_USERNAME':
      return {
        ...state,
        username: action.username,
      };
    default:
      return state;
  }
};

const initialUrlState = {
    url: "",
};

const profilePictureReducer = (state= initialUrlState, action) => {
  switch (action.type){
    case "SET_PROFILE_PICTURE_URL":
      return {
        ...state,
        url: action.url
      }
  default:
    return state
}
};

const rootReducer = combineReducers({
  login: loginReducer,
  user: userReducer,
  trips: tripsReducer,
  userName: userNameReducer,
  profilePicture: profilePictureReducer
});

const store = createStore(rootReducer);

export default store;
