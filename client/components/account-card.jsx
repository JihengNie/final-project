import React from 'react';
import Smiley from './smiley';
import parseRoute from './../lib/parseRoute';
import CreateComment from './comment-card';

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
      userLoggedInId: null,
      accountId: null,
      newComment: null,
      route: parseRoute(window.location.hash),
      toggleCommentBox: false,
      comment: null
    };
    this.displayingStars = this.displayingStars.bind(this);
    this.moodStar = this.moodStar.bind(this);
    this.smileyFaceColor = this.smileyFaceColor.bind(this);
    this.displayingName = this.displayingName.bind(this);
    this.displayingRating = this.displayingRating.bind(this);
    this.displayingNewRating = this.displayingNewRating.bind(this);
    this.displayingCommentAndRating = this.displayingCommentAndRating.bind(this);
    this.createHappyLevel = this.createHappyLevel.bind(this);
    this.handleStarHover = this.handleStarHover.bind(this);
    this.handleStarClick = this.handleStarClick.bind(this);
    this.handleCheckClick = this.handleCheckClick.bind(this);
    this.handleXClick = this.handleXClick.bind(this);
    this.handleCommentClick = this.handleCommentClick.bind(this);
    this.handleCommentChange = this.handleCommentChange.bind(this);
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

  displayingCommentAndRating() {
    const currentFiveStarRating = (
      <div className='flex-center fa-star-holder'>
        {this.displayingStars(this.state.happyLevel, this.state.currentRating)}
      </div>
    );
    const newFiveStarRating = (
      <div className='flex-center-column'>
        {this.displayingNewRating()}
      </div>
    );
    if (this.props.hideComment) {
      return <img src={this.state.photoUrl} />;
    }

    if (this.state.route.path === 'view-account' && this.state.toggleCommentBox) {
      const commentsInArray = this.state.comment.map(items => {
        return (
          <CreateComment
          key={this.state.comment.indexOf(items)}
          photoUrl={items.photoUrl}
          comment={items.comment} />
        );
      });
      return (
        <div className='column-full image-upload-holder comment-card-holder'>
          {commentsInArray}
        </div>
      );
    }

    if (this.state.toggleCommentBox) {
      return (
        <div className='column-full image-upload-holder flex-center'>
          <div className='comment-style '>
            <textarea onChange={this.handleCommentChange} className='comment-input-style'
              type='textarea'
              name="comment"
              autoComplete='off'
              autoFocus
              placeholder="Leave a comment" />
            <div className='column-full'>
              {newFiveStarRating}
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <>
          <div className='column-full image-upload-holder flex-center'>
            <img src={this.state.photoUrl} />
          </div>
          <div className='column-full'>
            {currentFiveStarRating}
          </div>
        </>
      );
    }
  }

  displayingRating() {
    if (this.props.hideRating) {
      return;
    }
    return <h1> {this.state.currentRating}
      <i onClick={this.handleCommentClick} className="fa-solid fa-comment fa-comment-style" />
    </h1>;
  }

  handleCommentChange(event) {
    this.setState({ newComment: event.target.value });
  }

  handleCommentClick() {
    this.setState({ toggleCommentBox: !this.state.toggleCommentBox });
  }

  handleXClick() {
    this.setState({ toggleCommentBox: false });
  }

  handleCheckClick() {
    const data = {
      whoRated: this.state.userLoggedInId,
      ratedWho: this.state.accountId,
      rating: (this.state.ratingValue / 2),
      comment: this.state.newComment,
      whoComment: this.state.userLoggedInId,
      commentWho: this.state.accountId
    };
    const requestObj = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    };
    fetch('/api/uploads/ratings', requestObj)
      .then(result => {
        this.setState({
          ratingValue: 0,
          ratingClicked: false
        });
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
      })
      .catch(err => console.error(err));

    const requestObj2 = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    };

    fetch('/api/uploads/comments', requestObj2)
      .then(result => result.json())
      .then(result => {
        this.setState({
          toggleCommentBox: false,
          newComment: null
        });

      })
      .catch(err => console.error(err));
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
    if (this.props.hideNewRating) {
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
    if (this.state.route.path === 'view-other-accounts') {
      return <a href={`#view-account?username=${this.props.username}`} className='view-profile-name'>{this.props.username}</a>;
    } else {
      return <h1 href={`#view-account?username=${this.props.username}`} className='view-profile-name'>{this.props.username}</h1>;
    }
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
          happyLevel: this.createHappyLevel(result.currentRating),
          accountId: result.accountId
        });
      })
      .catch(err => console.error(err));

    fetch(`/api/accounts/${this.state.userLoggedIn}`, requestObj)
      .then(result => result.json())
      .then(result => {
        this.setState({
          userLoggedInId: result.accountId
        });
      })
      .catch(err => console.error(err));

    fetch(`/api/comments/${this.props.username}`, requestObj)
      .then(result => result.json())
      .then(result => {
        this.setState({
          comment: result
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
            happyLevel: this.createHappyLevel(result.currentRating),
            accountId: result.accountId
          });
        })
        .catch(err => console.error(err));
      this.setState({
        ratingValue: 0
      });
      fetch(`/api/comments/${this.props.username}`, requestObj)
        .then(result => result.json())
        .then(result => {
          this.setState({
            comment: result
          });
        })
        .catch(err => console.error(err));
      this.setState({ toggleCommentBox: false });
    }
  }

  render() {
    return (
      <div className='row max-width-500px '>
        <div className='column-full flex-center'>
          {this.displayingName()}
        </div>
        <div className='column-full user-rating-style'>
          <div className='row flex-center'>
            <div className='column-full user-rating-text-style'>
              {this.displayingRating()}
            </div>
          </div>
        </div>
        {this.displayingCommentAndRating()}
      </div>
    );
  }
}
