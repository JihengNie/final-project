import React from 'react';

export default class Smiley extends React.Component {
  render() {
    return (
      <i className={`fa-regular fa-4x fa-face-smile fa-face-smile-style ${this.props.happyLevel}`} />
    );
  }
}
