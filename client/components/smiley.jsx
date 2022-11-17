import React from 'react';

export default class Smiley extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userLoggedIn: JSON.parse(window.localStorage.getItem('account'))
    };
    this.createHappyLevel = this.createHappyLevel.bind(this);
  }

  createHappyLevel(rating) {
    const currentRating = parseInt(rating);
    if (currentRating >= 4) {
      return 'happy';
    } else if (currentRating >= 3) {
      return 'content';
    } else {
      return 'angry';
    }
  }

  componentDidMount() {
    if (!this.state.userLoggedIn) {
      window.location.hash = '#sign-up';
    }
  }

  render() {
    if (!this.state.userLoggedIn) {
      window.location.hash = '#sign-up';
      return null;
    }
    const happyLevel = this.createHappyLevel(this.props.currentRating);
    return (
      <a href={`#view-account?username=${this.state.userLoggedIn.account.username}`}>
        <i className={`fa-regular fa-3x fa-face-smile fa-face-smile-style ${happyLevel}`} />
      </a>
    );
  }
}
