import React from "react";
import {welcome} from "../helpers/actions";
import {connect} from "react-redux";

class Trips extends React.Component {
  state = {
    errorMessage: ""
  };



  onError = (msg) => {
    const state =  Object.assign({}, this.state);
    state.errorMessage = msg;
    this.setState(state);
  };

  deleteTrip(tripId){
    fetch(`/deletetrip/${tripId}`, {
      method: 'DELETE',
      headers: {
      'Content-Type': 'application/json'
      }
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response from the backend
        if (data.message === 'Trip deleted successfully') {
          this.onError(data.message) // TODO: change the error message to message, the delete is not an error message
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
      <h4>{this.state.errorMessage}</h4>
      <form>
          <div>
            {
              this.props.trips.map((trip) => (
              <div key={trip.id} className="card">
                <div className="destination">
                  <p>
                    Destination: {trip.destination}
                    <label onClick={() => this.deleteTrip(trip.id)}> [x] </label>
                  </p>
                </div>
              </div>
            ))}
          </div>
          <button onClick={this.props.welcome}>Go Back</button>
      </form>
    </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    trips: state.trips.trips
  };
};

const mapDispatchToProps = {
  welcome,
};

export default connect(mapStateToProps, mapDispatchToProps)(Trips);