import React from "react";
import Trips from "./Trips";
import AddTrip from "./AddTrip"
import Dis from "./Discussion"
import Settings from "./Settings"
import io from "socket.io-client";
import {
  add,
  discussion,
  logout,
  setDiscussions,
  setNotifications,
  setProfilePicture,
  settings,
  setTrips,
  trips,
  welcome
} from "../helpers/actions";
import {connect} from "react-redux";
import "./users.scss"

class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      n_notification: 0,
      socket: null,
      username: "",
    };
  }

  changeNotificationNumber = (n) => {
    this.setState({n_notification: n})
  }

  changeImage = (img) => {
    this.props.setProfilePicture(img)
  }

  manipulateAlerts = (data) => {
    const unreadNotifications = data.filter((notification) => !notification.is_read);
    const n = unreadNotifications.length;
    this.changeNotificationNumber(n)
  }

  checkForAlerts = () => {
    fetch('api/notifications')
      .then((response) => response.json())
      .then((data) => {
        const json_list = data.json_list
        this.manipulateAlerts(json_list)
        this.props.setNotifications(json_list)
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    fetch('api/userdiscussion') // Replace with your API endpoint
      .then((response) => response.json())
      .then((data) => {
        this.props.setDiscussions(data.json_list);
      })
      .catch((error) => {
        console.error('Error:', error);
        this.setState({errorMessage: 'Error fetching data.'});
      });
  }

  setSocket = (socket) => {
    this.setState({socket: socket})
  }

  componentDidMount() {
    const socket = io("http://127.0.0.1:5000")
    this.setSocket(socket)
    const msg = "alert"
    socket.emit('subscribe_alert', msg);

    socket.on('new_alert', (data) => {
      this.checkForAlerts()
    });
    this.checkForAlerts()

    fetch('api/trips') // Replace with your API endpoint
      .then((response) => response.json())
      .then((data) => {
        this.props.setTrips(data.json_list)
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    fetch(`api/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `{
        getUrl {
          imageUrl
        }
      }`,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        const url = `/storage${json.data.getUrl.imageUrl}`;
        this.changeImage(url);
      })
    .catch((error) => {
    console.error('Error:', error);
    });
  }

  unsubscribe() {
    if (this.state.socket) {
      this.state.socket.on('unsubscribe_alert', () => {})
      this.state.socket.disconnect();
      this.setState({socket:null})
    }
  }

  goToLogOut = () => {
    this.unsubscribe()
    this.props.logout()
  }

  onLogout = () => {
    fetch('api/logout', {
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
        <h1>Welcome {this.props.username} !!!</h1>

          <div className="container">
          <img
            src={this.props.profilePicture.url}
            alt="User Profile"
            className="profile-image"
          />
          </div>
      <div>
        <button onClick={this.props.trips}>Trip Planer</button>
        <button onClick={this.props.add}>Add Trip</button>
        <button onClick={this.props.discussion}>
          Discussion
          <div>
            {
              this.state.n_notification > 0 &&
              <span className="badge">
              {
                this.state.n_notification}
              </span>
            }
          </div>
        </button>
        <button onClick={this.props.settings}>User Settings</button>
        <button onClick={this.onLogout}>Logout</button>
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
    if (this.props.userPage.page === 'settings'){
      return(
      <div className= 'ui segment'>
        <Settings/>
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
    username: state.userName.username,
    profilePicture : state.profilePicture
  };
};

const mapDispatchToProps = {
  logout,
  welcome,
  trips,
  add,
  discussion,
  settings,
  setNotifications,
  setTrips,
  setDiscussions,
  setProfilePicture
};

export default connect(mapStateToProps, mapDispatchToProps)(User);