import React from "react";
import {welcome,setTrips} from "../helpers/actions";
import {connect} from "react-redux";

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
      destination
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
      .then((response) => {
        if (response.status === 201){
          response.json().then((data) => {
            this.props.setTrips(data.json_list)
            this.props.welcome()
          })
        } else{
          response.json().then((data) => {
            this.onError(data.message)
          })
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
        <form>
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
          <div>
          <button type="submit" onClick={this.addTrip}>Add Trip</button>
          <button onClick={this.props.welcome}>Go Back</button>
          </div>
        </form>
      </div>
    );
  }
}

const mapDispatchToProps = {
  welcome,
  setTrips
};

export default connect(null, mapDispatchToProps)(AddTrip);