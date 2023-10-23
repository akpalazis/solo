import React from "react";
import {welcome} from "../helpers/actions";
import {connect} from "react-redux";

class Discussion extends React.Component {
  state = {
    errorMessage: "",
  };

  markDiscussionAsRead = (notification_id) => {
    fetch(`api/markasread/${notification_id}`, {
      method: 'PUT',
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
    })
    .catch((error) => {
      console.log(error.message);
    });
  };
  render() {
    return (
      <div>
        <h2>Welcome To Discussions</h2>
        <h4>{this.state.errorMessage}</h4>
         <ul>
          {this.props.trips.discussions.map((discussion, index) => {
            const isUnread = !this.props.trips.notifications[index].is_read;
            return (
              <li
                key={discussion.id}
                className={isUnread ? 'unread' : ''}
                onClick={() => this.markDiscussionAsRead(this.props.trips.notifications[index].id)}
              >
                <span style={{ fontWeight: isUnread ? 'bold' : 'normal' }}>
                  {discussion.destination}
                </span>
              </li>
            );
          })}
        </ul>
        <button onClick={this.props.welcome}>Go Back</button>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    trips: state.trips
  };
};

const mapDispatchToProps = {
  welcome,
};

export default connect(mapStateToProps, mapDispatchToProps)(Discussion);
