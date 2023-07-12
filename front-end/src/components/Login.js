import React from "react";

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
    const state = {
    ...this.state,
      ['password']:"",
      ['errorMessage']: msg
    }
    this.setState(state);
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
          this.props.onUserPage()
        } else {
          this.onError("Username or Password is invalid... Try again!")
        }
      })
      .catch((error) => {
        this.onError(error.message);
    })
  };

  renderLoginForm(){
    return(
      <div>
        <h2>Login Page</h2>
        <h3>{this.state.errorMessage}</h3>
        <form onSubmit={this.sendLoginRequest}>
          <div>
          <label>Username:</label>
          </div>
            <div>
            <input
              placeholder="Username"
              name="username"
              value={this.state.username}
              onChange={this.onInputChange}
              className='input'
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
                className='input'
              />
                        </div>
            <button type="submit" className='submit-button'>Login</button>
        </form>
      </div>
    );
  }

  render() {
    return(
      this.renderLoginForm()
    )
  }
}

export default Login;