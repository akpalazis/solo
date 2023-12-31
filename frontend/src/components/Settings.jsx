import React from "react";
import {connect} from "react-redux";
import {setProfilePicture, welcome} from "../helpers/actions";


class Settings extends React.Component{
  state = {
    profilePicture:""
  }

  onProfilePictureChange = evt => {
    const state =  Object.assign({}, this.state);
    state[evt.target.name] = evt.target.files[0];
    this.setState(state);
  };

  onSave = (event) => {
    event.preventDefault();
    const formData = new FormData()
    formData.append('picture',this.state.profilePicture)

    fetch('api/change-profile-picture', {
      method: 'POST',
      body: formData
    })
      .then((response) => response.json())
      .then((data) => {
        const url = `/storage${data.url}`;
        this.props.setProfilePicture(url)
        this.props.welcome()
        }
      )
      .catch((error) => {
        console.log(error.message);
    })
  };

  renderSettingsForm(){
    return (
        <div>
          <h2>Settings Page</h2>

          <input
              name="profilePicture"
              type="file"
              accept="image/*"
              onChange={this.onProfilePictureChange}
            />

          <button onClick={this.onSave}>Save</button>
          <button onClick={this.props.welcome}>Back</button>



      </div>
      );
  }
  render() {
    return(
      this.renderSettingsForm()
    )
  }
}
const mapStateToProps = (state) => {
  return {
    page: state.page,
  };
};

const mapDispatchToProps = {
  welcome,
  setProfilePicture
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);


