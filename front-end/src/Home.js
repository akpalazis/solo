import React from 'react';
import { Provider } from 'react-redux';
import Select from './components/Select';
import store from './helpers/store'; // Import the store from the store.js file

const Home = () => (
  <Provider store={store}>
    <div className='ui segment'>
      <Select />
    </div>
  </Provider>
);

export default Home;
