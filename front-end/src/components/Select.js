import React from 'react';
import { connect } from 'react-redux';
import Login from "./Login";
import SingUp from "./SingUp";
import User from "./User";
import { login, userPage } from '../helpers/actions';

class Select extends React.Component {
  componentDidMount() {
    this.checkSeason();
  }

  checkSeason = () => {
    fetch('/login') // Replace with your API endpoint
      .then((response) => response.json())
      .then((data) => {
        if (data.message === 'Access granted') {
          this.props.userPage();
        } else {
          this.props.login();
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

   render() {
    if (this.props.page === 'login') {
      return (
        <div className='ui segment'>
          <Login/>
        </div>
      )
    }
    if (this.props.page === 'signup') {
        return (
          <div className='ui segment'>
            <SingUp/>
          </div>
        )
    }
    if (this.props.page === 'registered') {
        return (
          <div className='ui segment'>
              <h1>Registered Successfully</h1>
              <Login/>
          </div>
        )
    }
    if (this.props.page === 'logout') {
        return (
          <div className='ui segment'>
              <h1>Logged out Successfully!!!</h1>
              <Login/>
          </div>
        )
    }
    if (this.props.page === 'userPage'){
      return (
        <div className='ui segment'>
          <h1>User Page</h1>
          <User/>
        </div>
      )
    }
  };
}

const mapStateToProps = (state) => {
  return {
    page: state.login.page,
  };
};

const mapDispatchToProps = {
  login,
  userPage,
};

export default connect(mapStateToProps, mapDispatchToProps)(Select);
