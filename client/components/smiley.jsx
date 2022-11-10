import React from 'react';

export default class Smiley extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: window.localStorage.getItem('username')
    };
    this.createHappyLevel = this.createHappyLevel.bind(this);
    this.handleLoad = this.handleLoad.bind(this);
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

  handleLoad(event) {

  }

  componentDidMount() {
    window.addEventListener('load', this.handleLoad);
  }

  render() {
    const happyLevel = this.createHappyLevel(this.props.currentRating);
    return (
      <a href={`#view-account?username=${this.state.username}`}>
        <i className={`fa-regular fa-4x fa-face-smile fa-face-smile-style ${happyLevel}`} />
      </a>
    );
  }
}
