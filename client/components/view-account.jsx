import React from 'react';

export default class ViewAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'Jane Doe',
      imgSrc: '/images/image-1667858069738.png',
      happyLevel: 'happy',
      currentRating: 5
    };
    this.calculatingStars = this.calculatingStars.bind(this);
  }

  // calculatingStars(state) {
  //   if (state.happyLevel === 'happy') {

  //   }
  // }

  render() {
    const starIconNetural = <i className="fa-solid fa-star fa-star-style" />;
    const starIconHappy = <i className="fa-solid fa-star fa-star-style happy" />;
    const starIconContent = <i className="fa-solid fa-star fa-star-style content" />;
    const starIconAngry = <i className="fa-solid fa-star fa-star-style angry" />;
    const halfStarHappy = (
      <div className="star-div">
        {starIconNetural} <span className="half-star-happy">{starIconNetural}</span>
      </div>
    );
    const halfStarContent = (
      <div className="star-div">
        {starIconNetural} <span className="half-star-content">{starIconNetural}</span>
      </div>
    );
    const halfStarAngry = (
      <div className="star-div">
        {starIconNetural} <span className="half-star-angry">{starIconNetural}</span>
      </div>
    );
    return (
      <div className='container'>
        <div className='row flex-center'>
          <div className='column-full'>
            <i className="fa-regular fa-4x fa-face-smile fa-face-smile-style angry" />
          </div>
        </div>
        <div className='row'>
          <div className='column-full flex-center'>
            <h1 className='view-profile-name'>{this.state.name}</h1>
          </div>
          <div className='column-full'>
            <div className='column-full image-upload-holder flex-center'>
              <img src={this.state.imgSrc} />
            </div>
          </div>
          <div className='column-full flex-center fa-star-holder'>
            {halfStarHappy} {halfStarContent}{halfStarAngry}
            {starIconHappy} {starIconContent} {starIconAngry}
          </div>
        </div>
      </div>
    );
  }
}
