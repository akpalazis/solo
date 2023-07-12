import React from 'react';
import Login from "./components/Login";
import User from "./components/User"
import SingUp from "./components/SingUp";
import "./App.css"
class Select extends React.Component {
  state = {
    page: ''
  };

  handleStateChange = () => {
    if (this.state.page === 'login') {
      this.setState({page: 'signup'})
    }else {
      this.setState({page: 'login'})
    }
  };

  onRegister = () => {
    this.setState({page:'registered'})
  }

  onLogout = () => {
    fetch('/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    })
      .then((response) => response.json())
      .then((data) => {})
      .catch((error) => {})
    this.setState({page:'login'})

  }

  userPage = () => {
    const state = {
      ...this.state,
      ['page']:'userPage'
    }
    this.setState(state)
  }

  checkSession = () => {
    fetch('/login') // Replace with your API endpoint
      .then((response) => response.json())
      .then((data) => {
        if (data.message === 'Access granted') {
          this.userPage()
        }
        else {
          this.onLogout()
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  componentDidMount() {
    this.checkSession()
  }

  render() {
    if (this.state.page === 'login') {
      return (
        <div className='ui segment'>
          <Login
            onUserPage = {this.userPage}
          />
          <button onClick={this.handleStateChange} className='submit-button'>Sign Up</button>
        </div>
      )
    }
    if (this.state.page === 'signup') {
        return (
          <div className='ui segment'>
            <SingUp
              registerHandler={this.onRegister}
            />
          <button onClick={this.handleStateChange}>Cancel</button>
          </div>
        )
    }
    if (this.state.page === 'registered') {
        return (
          <div className='ui segment'>
              <h1>Registered Successfully</h1>
              <Login
                onUserPage = {this.userPage}
              />
              <button onClick={this.handleStateChange} className='submit-button'>Sign Up</button>
          </div>
        )
    }
    if (this.state.page === 'userPage'){
      return (
        <div className='ui segment'>
          <h1>User Page</h1>
          <User
            onUserPage={this.userPage}
          />
          <button onClick={this.onLogout} className='submit-button'>Logout</button>
        </div>
      )
    }
  };
}


const Home = () => (
  <div className='ui segment'>
    <Select />
  </div>
);

export default Home;
