import React, { Component } from 'react';

class Test extends Component {
  state = {
    profilePictureUrl: '', // Store the URL of the profile picture
  };

  async componentDidMount() {
    // Replace 'username' with the actual username of the logged-in user
    const username = 'username';

    // Make an HTTP request to fetch the profile picture URL
    try {
      const response = await fetch(`api/test`);
      if (response.ok) {
        const data = await response.json();
        this.setState({ profilePictureUrl: data.profilePictureUrl });
        console.log(data.profilePictureUrl)
      } else {
        console.error('Error fetching profile picture:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching profile picture:', error);
    }
  }

  render() {
    return (
      <div>
        <img src={this.state.profilePictureUrl} alt="Profile" />
      </div>
    );
  }
}

export default Test;
