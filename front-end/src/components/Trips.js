import React from "react";

class Trips extends React.Component {
  state = {
    data: [],
    errorMessage: ""
  };

  addData = (data) => {
    this.setState({data : data})
  }

  checkSession = () => {
    fetch('/trips') // Replace with your API endpoint
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
          this.checkSession()
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
              this.state.data.map((trip) => (
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
          <button onClick={this.props.toWelcomePage}>Go Back</button>
      </form>
    </div>
    )
  }
}

export default Trips;