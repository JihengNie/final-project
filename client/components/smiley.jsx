import React from 'react';

export default class Smiley extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: window.localStorage.getItem('username')
    };
    this.handleSmileClick = this.handleSmileClick.bind(this);
  }

  handleSmileClick() {
    window.location.hash = `#view-account?username=${this.state.username}`;
  }

  render() {
    return (
      <i onClick={this.handleSmileClick} className={`fa-regular fa-4x fa-face-smile fa-face-smile-style ${this.props.happyLevel}`} />
    );
  }
}
