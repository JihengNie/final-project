import React from 'react';
import Smiley from './smiley';
import AccountCard from './account-card';
import Sidebar from './sidebar';

export default class ViewOtherAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: null,
      otherUsers: null,
      currentRating: null,
      userLoggedIn: JSON.parse(window.localStorage.getItem('account')),
      sidebar: false,
      currentIndex: 1,
      followingList: null
    };
    this.handleDirectionClick = this.handleDirectionClick.bind(this);
    this.handleUserClick = this.handleUserClick.bind(this);
    this.updatingFollowerState = this.updatingFollowerState.bind(this);
  }

  handleUserClick() {
    const requestObj = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        token: this.state.userLoggedIn.token
      }
    };
    this.setState({ sidebar: !this.state.sidebar });
    fetch(`/api/followers/${this.state.userLoggedIn.account.accountId}`, requestObj)
      .then(result => result.json())
      .then(result => {
        this.setState({ followingList: result });
      })
      .catch(err => console.error(err));
  }

  handleDirectionClick(event) {
    if (event.target.className.includes('left')) {
      let currentIndex = this.state.currentIndex - 1;
      if (currentIndex < 0) {
        currentIndex = this.state.otherUsers.length - 1;
      }
      this.setState({
        currentIndex
      });
    } else if (event.target.className.includes('right')) {
      let currentIndex = this.state.currentIndex + 1;
      if (currentIndex > this.state.otherUsers.length - 1) {
        currentIndex = 0;
      }
      this.setState({
        currentIndex
      });
    }
  }

  updatingFollowerState() {
    const requestObj = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        token: this.state.userLoggedIn.token
      }
    };
    fetch(`/api/followers/${this.state.userLoggedIn.account.accountId}`, requestObj)
      .then(result => result.json())
      .then(result => {
        this.setState({ followingList: result });
      })
      .catch(err => console.error(err));
  }

  componentDidMount() {
    if (!this.state.userLoggedIn) {
      window.location.hash = '#sign-up';
      return null;
    }
    const requestObj = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        token: this.state.userLoggedIn.token
      }
    };
    fetch(`/api/accounts/${this.state.userLoggedIn.account.username}`, requestObj)
      .then(result => result.json())
      .then(result => {
        this.setState({
          currentRating: result.currentRating
        });
      })
      .catch(err => console.error(err));

    fetch('/api/other-accounts/', requestObj)
      .then(result => result.json())
      .then(result => {
        const otherUsers = result.map(item => item.username);
        otherUsers.splice(otherUsers.indexOf(this.state.username), 1);
        this.setState({
          otherUsers
        });
      })
      .catch(err => console.error(err));

    fetch(`/api/followers/${this.state.userLoggedIn.account.accountId}`, requestObj)
      .then(result => result.json())
      .then(result => {
        this.setState({ followingList: result });
      })
      .catch(err => console.error(err));
  }

  render() {
    if (!this.state.userLoggedIn) {
      window.location.hash = '#sign-up';
      return null;
    }
    const otherUsers = this.state.otherUsers;
    if (otherUsers) {
      const currentIndex = this.state.currentIndex;
      const userCurrentIndex = otherUsers[currentIndex];
      let userPreviousIndex = otherUsers[currentIndex - 1];
      let userNextIndex = otherUsers[currentIndex + 1];
      if (currentIndex - 1 < 0) {
        userPreviousIndex = otherUsers[otherUsers.length - 1];
      }
      if (currentIndex + 1 > (otherUsers.length - 1)) {
        userNextIndex = otherUsers[0];
      }
      return (
        <>
          <div className='container'>
            <div className='row flex-center'>
              <div className='column-third-always left-align '>
                <a href='#view-other-accounts'><i className="fa-solid fa-house-chimney fa-3x fa-house-style" /></a>
              </div>
              <div className='column-third-always'>
                <Smiley currentRating={this.state.currentRating}/>
              </div>
              <div className='column-third-always'>
                <i onClick={this.handleUserClick} className="fa-solid fa-users  fa-3x fa-users-style" />
              </div>
            </div>
            <div className='flex-center row-no-wrap'>
              <i onClick={this.handleDirectionClick} className="fa-solid fa-chevron-left chevron-style left" />
              <div className='none-focus-cards left'>
                <AccountCard username={userPreviousIndex} hideNewRating={true} hideRating={true} hideName={true} hideStars={true} className='none-focus-cards' />
              </div>
              <AccountCard username={userCurrentIndex} updating={this.updatingFollowerState}/>
              <div className='none-focus-cards right'>
                <AccountCard username={userNextIndex} hideNewRating={true} hideRating={true} hideName={true} hideStars={true} className='none-focus-cards overflow' />
              </div>
              <i onClick={this.handleDirectionClick} className="fa-solid fa-chevron-right chevron-style right" />
            </div>
          </div>
          {this.state.sidebar ? <Sidebar followerList={this.state.followingList} closeSidebar={this.state.sidebar} handleChange={this.handleUserClick} /> : null}
        </>
      );
    }
  }
}
