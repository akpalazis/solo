import React from "react";
import {welcome,setTrips} from "../helpers/actions";
import {connect} from "react-redux";
import "./trips.scss"
import TripCard from "./TripCard";
class Trips extends React.Component {
  state = {
    errorMessage: ""
  };

  onError = (msg) => {
    const state =  Object.assign({}, this.state);
    state.errorMessage = msg;
    this.setState(state);
  };

  deleteTrip = (tripId)=>{
    fetch(`api/deletetrip/${tripId}`, {
      method: 'DELETE',
      headers: {
      'Content-Type': 'application/json'
      }
    })
      .then((response) => response.json())
      .then((data) => {
          this.props.setTrips(data.json_list)
      })
      .catch((error) => {
        this.onError(error.message);
    })
  }

  render() {
    return (
      <div>
      <h1>Welcome To Trip Planner</h1>
      <h4>{this.state.errorMessage}</h4>
      <form>
        <div className="container">
            {
              this.props.trips.map((trip) => (
                <div key={trip.id} className="card">
               <TripCard id={trip.id}
                         destination={trip.destination}
                         startDate={trip.startDate}
                         endDate={trip.endDate}
                         deleteTrip={this.deleteTrip}/>
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
  setTrips
};

export default connect(mapStateToProps, mapDispatchToProps)(Trips);