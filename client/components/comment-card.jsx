import React from 'react';

export default class CreateComment extends React.Component {
  render() {
    return (
      <div className='comment-image-holder'>
        <img src={this.props.photoUrl} />
        <span className='comment-text-style'> {this.props.comment} </span>
      </div>
    );
  }
}
