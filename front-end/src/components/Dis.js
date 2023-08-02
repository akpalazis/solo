import React from "react";
import {welcome} from "../helpers/actions";
import {connect} from "react-redux";

class Dis extends React.Component {
  state = {
    data: [],
    errorMessage: "",
  };

  addData = (data) => {
    this.setState({ data: data });
  };

  checkSession = () => {
    fetch('/usertrips') // Replace with your API endpoint
      .then((response) => response.json())
      .then((data) => {
        this.addData(data.json_list);
      })
      .catch((error) => {
        console.error('Error:', error);
        this.setState({ errorMessage: 'Error fetching data.' });
      });
  };

  componentDidMount() {
    this.checkSession();
  }

  markDiscussionAsRead =(notification_id) =>{
    fetch(`/markasread/${notification_id}`, {
      method: 'PUT', // Assuming you use PUT method to update the discussion's is_read status
      })
      .then((response) => response.json())
      .then((data) => {
        this.checkSession(); // Fetch updated data after marking discussion as read
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  render() {
    return (
      <div>
        <h2>Welcome To Discussions</h2>
        <h4>{this.state.errorMessage}</h4>
        <ul>
          {this.state.data.map((discussion, index) => {
            const isUnread = !this.props.alerts[index].is_read;
            return (
              <li
                key={discussion.id}
                className={isUnread ? 'unread' : ''}
                onClick={() => this.markDiscussionAsRead(this.props.alerts[index].id)}
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
    alerts: state.alert.notifications
  };
};

const mapDispatchToProps = {
  welcome,
};

export default connect(mapStateToProps, mapDispatchToProps)(Dis);
