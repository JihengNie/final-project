import React from 'react';
import Smiley from './smiley';

export default class AccountCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photoUrl: null,
      happyLevel: 'happy',
      currentRating: null,
      ratingValue: 0,
      ratingUsername: this.props.username,
      ratingClicked: false,
      userLoggedIn: window.localStorage.getItem('username'),
      currentUsername: this.props.username,
      toggleStarSystem: false
    };
    this.displayingStars = this.displayingStars.bind(this);
    this.moodStar = this.moodStar.bind(this);
    this.smileyFaceColor = this.smileyFaceColor.bind(this);
    this.displayingName = this.displayingName.bind(this);
    this.displayingRating = this.displayingRating.bind(this);
    this.createHappyLevel = this.createHappyLevel.bind(this);
    this.displayingNewRating = this.displayingNewRating.bind(this);
    this.handleStarHover = this.handleStarHover.bind(this);
    this.handleStarClick = this.handleStarClick.bind(this);
    this.handleCheckClick = this.handleCheckClick.bind(this);
    this.handleXClick = this.handleXClick.bind(this);
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

  moodStar(happyLevel) {
    if (happyLevel !== 'happy' && happyLevel !== 'angry' && happyLevel !== 'content') {
      happyLevel = 'happy';
    }
    const fullStar = <i className={`fa-solid fa-star fa-star-style ${happyLevel}`} />;
    const neturalStar = <i className="fa-solid fa-star fa-star-style" />;
    const halfStar = (
      <div className="star-div">
        {neturalStar} <span className={`half-star ${happyLevel}`}>{neturalStar}</span>
      </div>
    );
    const starArray = [neturalStar, fullStar, halfStar];
    return starArray;
  }

  displayingStars(happyLevel, rating) {
    if (this.props.hideStars) {
      return;
    }
    const starArray = this.moodStar(happyLevel);
    const fiveStarArray = [];
    for (let i = 0; i < Math.floor(rating); i++) {
      fiveStarArray.push(starArray[1]);
    }
    if (Math.floor(rating) < rating) {
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

  displayingRating() {
    if (this.props.hideRating) {
      return;
    }
    return <h1> {this.state.currentRating}</h1>;
  }

  handleXClick() {
    this.setState({ toggleStarSystem: true });
  }

  handleCheckClick() {
    const form = new FormData();
    form.append('whoRated', this.state.userLoggedIn);
    form.append('ratedWho', this.props.username);
    form.append('rating', this.state.ratingValue / 2);
    const requestObj = {
      method: 'POST',
      body: form
    };
    fetch('/api/uploads/ratings', requestObj)
      .then(result => result.json())
      .then(result => {
        this.setState({
          ratingValue: 0,
          ratingClicked: false
        });

        const requestObj3 = {
          method: 'GET'
        };
        fetch(`/api/accounts/new-ratings/${this.props.username}`, requestObj3)
          .then(result => result.json())
          .then(result => {
            if (result.updatedRating) {
              this.setState({
                currentRating: result.updatedRating
              });
              const requestObj2 = {
                method: 'PUT'
              };
              fetch(`/api/accounts/new-rating/${this.props.username}&${result.updatedRating}`, requestObj2)
                .then(result => result.json())
                // .then(result => { })
                .catch(err => console.error(err));
            }
          })
          .catch(err => console.error(err));
      })
      .catch(err => console.error(err));
    this.setState({ toggleStarSystem: true });
  }

  handleStarClick(event) {
    const newRatingValue = event.target.parentNode.id;
    this.setState({
      ratingClicked: true,
      ratingValue: newRatingValue
    });
  }

  handleStarHover(event) {
    if (this.state.ratingClicked) {
      return;
    }
    if (event.target.id) {
      this.setState({ ratingValue: event.target.id });
    }
  }

  displayingNewRating() {
    if (this.props.hideNewRating || this.state.toggleStarSystem) {
      return;
    }
    const fiveStarsArray = [];
    for (let i = 1; i < 10; i = i + 2) {
      fiveStarsArray.push(
        <div className="star-div">
          <span className={`half-star ${this.state.ratingValue < i ? 'netural' : 'happy'}`}>
            <label onMouseEnter={this.handleStarHover} id={i} htmlFor={`rating${i}`}>
              <i className="fa-solid fa-star fa-star-style rating-stars"/>
            </label>
          </span>
          <span>
            <label id={i + 1} htmlFor={`rating${i + 1}`}>
              <i onMouseEnter={this.handleStarHover} id={i + 1}
                className={`fa-solid fa-star fa-star-style rating-stars
                ${this.state.ratingValue < i + 1 ? 'netural' : 'happy'}`} />
            </label>
          </span>
        </div>
      );
    }
    const fiveStars = <> {fiveStarsArray[0]} {fiveStarsArray[1]} {fiveStarsArray[2]} {fiveStarsArray[3]} {fiveStarsArray[4]} </>;
    return (
      <>
        <div className='column-full'>
          <div onClick={this.handleStarClick} className='fa-star-holder flex-center'>
            {fiveStars}
          </div>
        </div>
        <div className='fa-check-holder flex-center'>
          <i onClick={this.handleXClick} className="fa-solid fa-2x fa-x fa-check-style rating-buttons-x-style" />
          <i onClick={this.handleCheckClick} className="fa-solid fa-2x fa-check fa-check-style" />
        </div>
      </>
    );
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
        <div className='column-full'>
          <div className='flex-center-column'>
            {this.displayingNewRating()}
          </div>
          <div className='flex-center fa-star-holder'>
            {this.displayingStars(this.state.happyLevel, this.state.currentRating)}
          </div>
        </div>
      </div>
    );
  }
}
