import React from "react";
import "./styles.css"
import Trips from "./Trips";
import AddTrip from "./AddTrip"
import Dis from "./Dis"

class User extends React.Component {
  state = {
    page: 'welcome'
  }

  tripPlaner = () => {
    const state = {
      ...this.state,
      ['page']: 'trips'
    }
    this.setState(state)
  }

  toWelcomePage = () => {
    const state = {
      ...this.state,
      ['page']: 'welcome'
    }
    this.setState(state)
  }

  addTrip = () => {
    const state = {
      ...this.state,
      ['page']: 'add'
    }
    this.setState(state)
  }

  disc = () => {
    const state = {
      ...this.state,
      ['page']: 'discussion'
    }
    this.setState(state)
  }

  handleSubmit(){
  }

  renderUser() {
    if (this.state.page === 'welcome') {
      return (
        <div>
          <h2>Welcome User</h2>
          <button onClick={this.tripPlaner}>Trip Planer</button>
          <button onClick={this.addTrip}>Add Trip</button>
          <button onClick={this.disc}>Discussions</button>
        </div>
      )
    }
    if (this.state.page === 'trips') {
      return (
        <div className='ui segment'>
          <Trips
            toWelcomePage={this.toWelcomePage}
          />
        </div>
      )
    }
    if (this.state.page === 'add') {
      return (
      <div className='ui segment'>
          <AddTrip
            toWelcomePage={this.toWelcomePage}
          />
        </div>
      )
    }
    if (this.state.page === 'discussion'){
      return(
      <div className= 'ui segment'>
        <Dis
          toWelcomePage={this.toWelcomePage}
        />
      </div>
      )
    }
  }

  render() {
    return (
      this.renderUser()
    )
  }
}

export default User;