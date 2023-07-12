import React from "react";

class AddTrip extends React.Component {
   state = {
     destination: "",
     errorMessage:""
  }

  onChange =(event) => {
   const {name, value} = event.target
    const state = {
     ...this.state,
     [name] : value
   }
   this.setState(state)
  }

  onError = (msg) => {
    const state =  Object.assign({}, this.state);
    state.errorMessage = msg;
    this.setState(state);
  };

  addTrip = (event) => {
    event.preventDefault();
    const {
      destination,
      startDate,
      description,
      endDate
    } = this.state;

    fetch('/addtrip', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
        {
          destination : destination,
        })
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response from the backend
        if (data.message === 'Trip added successful') {
          this.props.toWelcomePage()
        } else {
          this.onError(data.message)
        }
      })
      .catch((error) => {
        this.onError(error.message);
    })
  };

  render() {
    return (
      <div>
        <h2>Welcome To Trip Planner</h2>
        <h3>Add New Trip</h3>
        <h4>{this.state.errorMessage}</h4>
        <form onSubmit={this.handleSubmit}>
          <div>
            <label htmlFor="destination">Destination:</label>
            <input
              type="text"
              name="destination"
              value={this.state.destination}
              onChange={this.onChange}
              required
            />
          </div>
          <button type="submit" onClick={this.addTrip}>Add Trip</button>
          <button onClick={this.props.toWelcomePage}>Go Back</button>
        </form>
      </div>
    );
  }
}

export default AddTrip;