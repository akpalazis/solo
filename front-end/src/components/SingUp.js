import React from "react";

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

  onEmailError = () => {
    const state =  Object.assign({}, this.state);
    state.emailError = "Email already exist";
    this.setState(state);
  };

  onConflictError = () => {
    const state = Object.assign({},this.state);
    state.userNameError = "Username already exists";
    state.emailError = "Email already exist";
    this.setState(state)
  }

  clearErrors = () => {
    const state = Object.assign({},this.state);
    state.userNameError = "";
    state.emailError = "";
    this.setState(state)
  }

  sendSingUpRequest = (event) => {
    event.preventDefault();
    this.clearErrors()
    fetch('/singup', {
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
          this.props.registerHandler()
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
          <form>
            <div>
            <label>Username:</label>
            <input
              placeholder="username"
              name="username"
              value={this.state.username}
              onChange={this.onInputSingUpChange}
            />
            {this.state.userNameError}
            </div>
            <div>
              <label>Password:</label>
            <input
              placeholder="password"
              name="password"
              value={this.state.password}
              onChange={this.onInputSingUpChange}
            />
            </div>
            <button type="submit" onClick = {this.sendSingUpRequest} className='submit-button'>Sign Up</button>
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

export default SingUp;