import React from "react";
import {login, registerSuccess,home} from "../helpers/actions";
import {connect} from "react-redux";

class SingUp extends React.Component {
  state = {
    name: "",
    lastName:"",
    username: "",
    password: "",
    repeatPassword: "",
    email: "",
    dateOfBirth: "",
    userNameError: "",
    isUsernameAvailable: null,
  }

  onError = (msg) => {
    const state = Object.assign({}, this.state);
    state.errorMessage = msg;
    this.setState(state);
  };

  onInputSingUpChange = evt => {
    const state = Object.assign({}, this.state);
      state[evt.target.name] = evt.target.value;
      if (evt.target.name === 'username') {
        this.checkUserNameAvailability(evt.target.value)
      }
    this.setState(state);
  };

  onUserNameError = () => {
    const state = Object.assign({}, this.state);
    state.userNameError = "Username already exists";
    this.setState(state);
  };

  clearErrors = () => {
    const state = Object.assign({}, this.state);
    state.userNameError = "";
    state.emailError = "";
    this.setState(state)
  }


  sendSingUpRequest = (event) => {
    event.preventDefault();
    this.clearErrors()
    const formData = new FormData()
    formData.append('name', this.state.name)
    formData.append('lastName', this.state.lastName)
    formData.append('username', this.state.username)
    formData.append('password', this.state.password)
    formData.append('email', this.state.email)
    formData.append('dateOfBirth', this.state.dateOfBirth)

    fetch('/signup', {
      method: 'POST',
      body: formData
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

  renderSingUpForm() {
    return (
      <div>
        <h2>Sign Up Page</h2>
        <h3>{this.state.userNameError}</h3>
        <form>
          <div>
            <label>Name:</label>
            <input
              placeholder="Name"
              name="name"
              value={this.state.name}
              onChange = {this.onInputSingUpChange}
            />
          </div>
          <div>
            <label>Last Name:</label>
            <input
              placeholder="Last Name"
              name="lastName"
              value={this.state.lastName}
              onChange = {this.onInputSingUpChange}
            />
          </div>
          <div>
            <label>Email:</label>
          <input
            placeholder="Email"
            name="email"
            value={this.state.email}
            type="email"
            onChange = {this.onInputSingUpChange}
          />
          </div>
          <div>
          <label>Date of Birth:</label>
            <input
              type="date"
              name="dateOfBirth"
              value={this.state.dateOfBirth}
              onChange={this.onInputSingUpChange}
            />
          </div>
          <div>
            <label>Username:</label>
            <input
              placeholder="Username"
              name="username"
              value={this.state.username}
              onChange={this.onInputSingUpChange}
            />
            {this.state.username && !this.state.isUsernameAvailable && (
              <p>Username is already taken.</p>
            )}
          </div>
          <div>
            <label>Password:</label>
            <input
              placeholder="Password"
              name="password"
              type = "password"
              value={this.state.password}
              onChange={this.onInputSingUpChange}
            />
          </div>
          <div>
        <label>Repeat Password:</label>
        <input
          placeholder="Repeat Password"
          name="repeatPassword"
          type="password"
          value={this.state.repeatPassword}
          onChange={this.onInputSingUpChange}
        />
        {this.state.password && this.state.repeatPassword && this.state.password !== this.state.repeatPassword && (
    <p>Passwords do not match.</p>
  )}
      </div>
          <div>
            <button onClick={this.sendSingUpRequest}>SignUp</button>
            <button onClick={this.props.home}>Cancel</button>
          </div>
        </form>
      </div>
    );
  }

  render() {
    return (
      this.renderSingUpForm()
    )
  }

  checkUserNameAvailability(username) {
    // Make an API request to check username availability
    fetch(`/check-username?username=${username}`, {
      method: 'POST',
      body: username
    })

      .then((response) => response.json())
      .then((data) => {
        // Handle the response from the backend
        const isUsernameAvailable = data.isAvailable;
        this.setState({ isUsernameAvailable });
      })
      .catch((error) => {
        // Handle errors here
      });
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


