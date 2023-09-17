import React from 'react';
import { connect } from 'react-redux';
import Login from "./Login";
import SingUp from "./SingUp";
import User from "./User";
import {login, userPage, home, signup} from '../helpers/actions';

class Select extends React.Component {
  componentDidMount() {
    this.checkSeason();
  }

  checkSeason = () => {
    fetch('/home') // Replace with your API endpoint
      .then((response) => response.json())
      .then((data) => {
        console.log(data.message)
        if (data.message === 'Access granted') {
          this.props.userPage();
        } else {
          this.props.home();
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

   render() {
    if (this.props.page === 'home'){
      return(
      <div>
        <h1>Hello, React!</h1>
        <p>This is a simple React component.</p>
        <button onClick={this.props.login}>Login</button>
        <button onClick={this.props.signup}>SingUp</button>
      </div>
      )
    }
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
  home,
  signup
};

export default connect(mapStateToProps, mapDispatchToProps)(Select);
