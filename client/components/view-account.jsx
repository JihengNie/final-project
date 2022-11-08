import React from 'react';

export default class ViewAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: props.username,
      photoUrl: null,
      happyLevel: null,
      currentRating: null
    };
    this.calculatingStars = this.calculatingStars.bind(this);
    this.moodStar = this.moodStar.bind(this);
    this.smileyFaceColor = this.smileyFaceColor.bind(this);
  }

  smileyFaceColor(state) {
    return (<i className={`fa-regular fa-4x fa-face-smile fa-face-smile-style ${state.happyLevel}`} />);
  }

  moodStar(state) {
    if (state.happyLevel !== 'happy' && state.happyLevel !== 'angry' && state.happyLevel !== 'content') {
      state.happyLevel = 'happy';
    }
    const fullStar = <i className={`fa-solid fa-star fa-star-style ${state.happyLevel}`} />;
    const neturalStar = <i className="fa-solid fa-star fa-star-style" />;
    const halfStar = (
      <div className="star-div">
        {neturalStar} <span className={`half-star-${state.happyLevel}`}>{neturalStar}</span>
      </div>
    );
    const starArray = [neturalStar, fullStar, halfStar];
    return starArray;
  }

  calculatingStars(state) {
    const starArray = this.moodStar(this.state);
    const fiveStarArray = [];
    for (let i = 0; i < Math.floor(state.currentRating); i++) {
      fiveStarArray.push(starArray[1]);
    }
    if (Math.floor(state.currentRating) < state.currentRating) {
      fiveStarArray.push(starArray[2]);
    }
    while (fiveStarArray.length < 5) {
      fiveStarArray.push(starArray[0]);
    }
    return (
      <>
        {fiveStarArray[0]} {fiveStarArray[1]} {fiveStarArray[2]} {fiveStarArray[3]} {fiveStarArray[4]}
      </>
    );
  }

  componentDidMount() {
    const requestObj = {
      method: 'GET'
    };
    fetch(`/api/accounts/${this.state.username}`, requestObj)
      .then(result => result.json())
      .then(result => {
        this.setState({
          currentRating: result.currentRating,
          happyLevel: result.happyLevel,
          photoUrl: result.photoUrl
        });
      })
      .catch(err => console.error(err));
  }

  render() {
    return (
      <div className='container'>
        <div className='row flex-center'>
          <div className='column-full'>
            {this.smileyFaceColor(this.state)}
          </div>
        </div>
        <div className='row'>
          <div className='column-full flex-center'>
            <h1 className='view-profile-name'>{this.state.username}</h1>
          </div>
          <div className='column-full'>
            <div className='column-full image-upload-holder flex-center'>
              <img src={this.state.photoUrl} />
            </div>
          </div>
          <div className='column-full flex-center fa-star-holder'>
            {this.calculatingStars(this.state)}
          </div>
        </div>
      </div>
    );
  }
}
