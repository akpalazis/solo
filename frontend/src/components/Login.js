import React from "react";
import {home, userPage,updateUsername} from "../helpers/actions"
import {connect} from "react-redux";

class Login extends React.Component {
  state = {
    'username':"",
    'password':"",
    'errorMessage':""
  }


  onInputChange = evt => {
    const { name, value } = evt.target
    const state = {
    ...this.state,
    [name]: value
    }
    this.setState(state);
  };

  onError = (msg) => {
    this.setState(
      {password:"",
            errorMessage:msg
            }
      );
  };

  sendLoginRequest = (event) => {
    event.preventDefault();
    const {username, password} = this.state;
    fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({username: username, password: password})
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response from the backend
        if (data.message === 'Login successful') {
          this.props.updateUsername(username);
          this.props.userPage()
        } else {
          this.onError("Username or Password is invalid... Try again!")
        }
      })
      .catch((error) => {
        this.onError(error.message);
    })
  };

  render() {
    return(
      <div>
        <h2>Login Page</h2>
        <h3>{this.state.errorMessage}</h3>
        <form>
          <div>
            <label>Username:</label>
          </div>
          <div>
            <input
              placeholder="Username"
              name="username"
              value={this.state.username}
              onChange={this.onInputChange}
            />
          </div>
          <div>
            <label>Password:</label>
          </div>
          <div>
            <input
              placeholder="Password"
              name="password"
              value={this.state.password}
              onChange={this.onInputChange}
            />
          </div>
          <div>
            <button onClick={this.sendLoginRequest}>Login</button>
            <button onClick={this.props.home}>Cancel</button>
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    page: state.page,
  };
};

const mapDispatchToProps = {
  home,
  userPage,
  updateUsername
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);


