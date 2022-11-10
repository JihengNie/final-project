import React from 'react';
import Smiley from './smiley';

export default class AccountCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photoUrl: null,
      happyLevel: 'happy',
      currentRating: null
    };
    this.calculatingStars = this.calculatingStars.bind(this);
    this.moodStar = this.moodStar.bind(this);
    this.smileyFaceColor = this.smileyFaceColor.bind(this);
    this.displayingName = this.displayingName.bind(this);
    this.displayingRating = this.displayingRating.bind(this);
    this.createHappyLevel = this.createHappyLevel.bind(this);
  }

  smileyFaceColor(state) {
    return <Smiley currentRating={state.currentRating} />;
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

  moodStar(state) {
    if (state.happyLevel !== 'happy' && state.happyLevel !== 'angry' && state.happyLevel !== 'content') {
      state.happyLevel = 'happy';
    }
    const fullStar = <i className={`fa-solid fa-star fa-star-style ${state.happyLevel}`} />;
    const neturalStar = <i className="fa-solid fa-star fa-star-style" />;
    const halfStar = (
      <div className="star-div">
        {neturalStar} <span className={`half-star ${state.happyLevel}`}>{neturalStar}</span>
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
    if (this.props.hideStars) {
      return;
    }
    return (
      <>
        {fiveStarArray[0]} {fiveStarArray[1]} {fiveStarArray[2]} {fiveStarArray[3]} {fiveStarArray[4]}
      </>
    );
  }

  displayingRating() {
    if (this.props.hideRating) {
      return;
    }
    return <h1> {this.state.currentRating}</h1>;
  }

  displayingName() {
    if (this.props.hideName) {
      return;
    }
    return <h1 className='view-profile-name'>{this.props.username}</h1>;
  }

  componentDidMount() {
    const requestObj = {
      method: 'GET'
    };
    fetch(`/api/accounts/${this.props.username}`, requestObj)
      .then(result => result.json())
      .then(result => {
        this.setState({
          currentRating: result.currentRating,
          photoUrl: result.photoUrl,
          happyLevel: this.createHappyLevel(result.currentRating)
        });
      })
      .catch(err => console.error(err));
  }

  componentDidUpdate(prevProps) {
    if (this.props.username !== prevProps.username) {
      const requestObj = {
        method: 'GET'
      };
      fetch(`/api/accounts/${this.props.username}`, requestObj)
        .then(result => result.json())
        .then(result => {
          this.setState({
            currentRating: result.currentRating,
            photoUrl: result.photoUrl,
            happyLevel: this.createHappyLevel(result.currentRating)
          });
        })
        .catch(err => console.error(err));
    }
  }

  render() {
    return (
      <div className='row max-width-500px '>
        <div className='column-full flex-center'>
          {this.displayingName()}
        </div>
        <div className='column-full user-rating-style'>
          {this.displayingRating()}
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
    );
  }
}
