// Action Types
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const SIGNUP = 'SIGNUP';
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const USER_PAGE = 'USER_PAGE';
export const HOME = 'HOME';

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

export const home = () => ({
  type: HOME,
});


export const settings = () => ({
  type: SETTINGS,
});


export const WELCOME = 'WELCOME';
export const TRIPS = 'TRIPS';
export const ADD = 'ADD';
export const DISCUSSION = 'DISCUSSION';
export const SETTINGS = 'SETTINGS';

export const welcome = () => ({
  type: WELCOME,
});

export const trips = () => ({
  type: TRIPS,
});

export const add = () => ({
  type: ADD,
});

export const discussion = () => ({
  type: DISCUSSION,
});

export const SET_NOTIFICATIONS = "SET_NOTIFICATIONS";
export const SET_TRIPS = "SET_TRIPS";
export const SET_DISCUSSIONS = "SET_DISCUSSIONS";
export const SET_PROFILE_PICTURE_URL = "SET_PROFILE_PICTURE_URL";

export const setNotifications = (notifications) => ({
  type: SET_NOTIFICATIONS,
  notifications: notifications,
});

export const setTrips = (trips) => ({
  type: SET_TRIPS,
  trips: trips,
});

export const setDiscussions = (discussions) => ({
  type: SET_DISCUSSIONS,
  discussions: discussions,
});

export const setProfilePicture = (url) => ({
  type: SET_PROFILE_PICTURE_URL,
  url: url,
});

export const updateUsername = (username) => {
  return {
    type: 'UPDATE_USERNAME',
    username,
  };
};