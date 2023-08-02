import React from "react";
import Trips from "./Trips";
import AddTrip from "./AddTrip"
import Dis from "./Dis"
import io from "socket.io-client";
import {add, discussion, logout, setNotifications, trips, welcome} from "../helpers/actions";
import {connect} from "react-redux";

class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      n_notification:0,
      socket: null,
    };
  }

  changeNotificationNumber = (n) => {
    this.setState({n_notification: n})
  }

  setNotifications = (notifications) => {
    this.props.setNotifications(notifications)
  }

  manipulateAlerts= (data) => {
    const unreadNotifications = data.filter((notification) => !notification.is_read);
    const n = unreadNotifications.length;
    this.changeNotificationNumber(n)
    this.setNotifications(data)
  }

  checkForAlerts = () => {
    fetch('/notifications') // Replace with your API endpoint
      .then((response) => response.json())
      .then((data) => {
        this.manipulateAlerts(data.json_list);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  setSocket = (socket) => {
    this.setState({socket:socket})
  }

  componentDidMount() {
    const socket = io("http://127.0.0.1:5000")
    this.setSocket(socket)
    const msg = "alert"
    socket.emit('subscribe_alert', msg); // Type annotation to resolve the error

    socket.on('new_alert', (data) => {
      this.checkForAlerts()
    });
    this.checkForAlerts()
  }

  componentWillUnmount() {
    // Clean up socket connection
    if (this.state.socket) {
      this.state.socket.on('unsubscribe_alert', () => {})
      this.state.socket.disconnect();
      this.setState({socket:null})
    }
  }

  goToLogOut = () => {
    this.props.page.logout()
  }

  onLogout = () => {
    fetch('/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === 'Logged Out Successfully'){
              this.goToLogOut()
        }
      })
      .catch((error) => {
        console.error('Logout error:', error);
        // Handle any errors that occurred during the logout request
      });
  };

  renderUser() {
    if (this.props.userPage.page === 'welcome') {
      return (
        <div>
          <div className="user-welcome-container">
        <h2 className="welcome-message">Welcome ...!</h2>
      </div>
      <div className="buttons-container">
        <button onClick={this.props.trips}>Trip Planer</button>
        <button onClick={this.props.add}>Add Trip</button>
        <button className="notification-icon" onClick={this.props.discussion}>
          <div>
            {this.state.n_notification > 0 && <span className="badge">
              <i className="fa fa-bell"/>
              {this.state.n_notification}</span>}
          </div>
          Discussion
        </button>
        <button onClick={this.onLogout} className='submit-button'>Logout</button>
      </div>
    </div>
      )
    }
    if (this.props.userPage.page === 'trips') {
      return (
        <div className='ui segment'>
          <Trips/>
        </div>
      )
    }
    if (this.props.userPage.page === 'add') {
      return (
      <div className='ui segment'>
          <AddTrip/>
        </div>
      )
    }
    if (this.props.userPage.page === 'discussion'){
      return(
      <div className= 'ui segment'>
        <Dis/>
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

const mapStateToProps = (state) => {
  return {
    page: state.login.page,
    userPage: state.user,
  };
};

const mapDispatchToProps = {
  logout,
  welcome,
  trips,
  add,
  discussion,
  setNotifications
};

export default connect(mapStateToProps, mapDispatchToProps)(User);