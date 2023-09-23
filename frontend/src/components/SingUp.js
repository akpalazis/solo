import React from "react";
import {login, registerSuccess,home} from "../helpers/actions";
import {connect} from "react-redux";

class SingUp extends React.Component{
  state = {
    username: "",
    password:"",
    userNameError: "",
  }

  onError = (msg) => {
    const state =  Object.assign({}, this.state);
    state.errorMessage = msg;
    this.setState(state);
  };

  onInputSingUpChange = evt => {
    const state =  Object.assign({}, this.state);
    state[evt.target.name] = evt.target.value;
    state.updated_at =
    this.setState(state);
  };

  onUserNameError = () => {
    const state =  Object.assign({}, this.state);
    state.userNameError = "Username already exists";
    this.setState(state);
  };

  clearErrors = () => {
    const state = Object.assign({},this.state);
    state.userNameError = "";
    state.emailError = "";
    this.setState(state)
  }

  sendSingUpRequest = (event) => {
    event.preventDefault();
    this.clearErrors()
    fetch('/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({username:this.state.username,
                                  password:this.state.password,
                                })
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response from the backend
        if (data.message === "User already exists") {
          this.onUserNameError()
        }
        if (data.message === "Account Created Successfully") {
          this.props.registerSuccess()
        }
      })
      .catch((error) => {
        this.onError(error.message);
    })
  };

  renderSingUpForm(){
    return (
        <div>
          <h2>Sign Up Page</h2>
          <h3>{this.state.userNameError}</h3>
          <form>
          <div>
            <label className>Username:</label>
          </div>
          <div>
            <input
              placeholder="Username"
              name="username"
              value={this.state.username}
              onChange={this.onInputSingUpChange}
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
              onChange={this.onInputSingUpChange}
            />
          </div>
          <div>
              <button onClick = {this.sendSingUpRequest}>SignUp</button>
            <button onClick={this.props.home}>Cancel</button>
          </div>
        </form>
        </div>
      );
  }
  render() {
    return(
      this.renderSingUpForm()
    )
  }
}
const mapStateToProps = (state) => {
  return {
    page: state.page,
  };
};

const mapDispatchToProps = {
  registerSuccess,
  login,
  home
};

export default connect(mapStateToProps, mapDispatchToProps)(SingUp);


