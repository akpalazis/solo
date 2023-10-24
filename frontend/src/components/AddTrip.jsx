import React from 'react'
import {setTrips, welcome} from "../helpers/actions";
import {connect} from "react-redux";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Select from "react-select";
import { countries } from 'country-list-json';

class AddTrip extends React.Component {
   state = {
     destination: "",
     startDate: null,
     endDate: null,
     errorMessage:""
  }

  onStartDate = (date_range) => {
     const [start,end] = date_range
      const state = {
        ...this.state,
        ["startDate"]: start,
        ["endDate"]: end
      }
      this.setState(state)
  }

  onDestinationChange = (selection) => {
      const destination = selection.value
      const state = {
        ...this.state,
        ["destination"]: destination
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

    fetch('api/addtrip', {
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
  const countryOptions = countries.map((country) => ({
    value: country.name,
    label: `${country.name} ${country.flag}`,
  }));
  const isButtonDisabled = !this.state.destination || !this.state.startDate || !this.state.endDate;
  return (
      <div>
        <h2>Welcome To Trip Planner</h2>
        <h3>Add New Trip</h3>
        <h4>{this.state.errorMessage}</h4>
        <form>
          <div>
            <label htmlFor="destination">Destination:</label>
            <Select
              value={countryOptions.find((option) => option.value === this.state.destination)}
              onChange={this.onDestinationChange}
              options={countryOptions}
              placeholder="Select Country"
            />
            <DatePicker
                name="startDate"
                selected={this.state.startDate}
                onChange={this.onStartDate}
                startDate={this.state.startDate}
                endDate={this.state.endDate}
                selectsRange
            />
          </div>
          <div>
          <button type="submit" onClick={this.addTrip} disabled={isButtonDisabled}>
            Add Trip
          </button>
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