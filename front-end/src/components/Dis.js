import React from "react";

class Dis extends React.Component {
  state={
    data : [],
    errorMessage: ""
  }


  addData = (data) => {
    const state = {
      ...this.state,
      ['data']: data
    }
    this.setState(state)
  }


  checkSession = () => {
    fetch('/usertrips') // Replace with your API endpoint
      .then((response) => response.json())
      .then((data) => {
        this.addData(data.json_list)
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  componentDidMount() {
    this.checkSession()
  }

  render() {
    return (
      <div>
        <h2>Welcome To Discussions</h2>
        <h4>{this.state.errorMessage}</h4>
        <div className="card-container">
          {this.state.data.map((disc) => (
            <div key={disc.id} className="card">
            <p className="card-field">Destination: {disc.destination}</p>
              {disc.comments.map((cmd) =>(
                <div key={cmd.id} className="cmd">
                 <p className="card-field">{cmd.msg}</p>
                </div>
              ))}
                </div>
          ))}
        <button onClick={this.props.toWelcomePage}>Go Back</button>
      </div>
      </div>
    )
  }
}

export default Dis;