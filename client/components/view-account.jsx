import React from 'react';
import Smiley from './smiley';
import AccountCard from './account-card';
import Sidebar from './sidebar';

export default class ViewAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentRating: null,
      sidebar: false,
      followingList: null
    };

    this.displayingPage = this.displayingPage.bind(this);
    this.handleUserClick = this.handleUserClick.bind(this);
  }

  handleUserClick() {
    this.setState({ sidebar: !this.state.sidebar });
    const requestObj = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        token: this.props.userLoggedIn.token
      }
    };
    fetch('/api/followers', requestObj)
      .then(result => result.json())
      .then(result => {
        this.setState({ followingList: result });
      })
      .catch(err => console.error(err));
  }

  componentDidUpdate(prevProps) {
    if (this.props.username !== prevProps.username) {
      const requestObj = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          token: this.props.userLoggedIn.token
        }
      };
      fetch(`/api/accounts/${this.props.username}`, requestObj)
        .then(result => result.json())
        .then(result => {
          this.setState({
            currentRating: result.currentRating
          });
        })
        .catch(err => console.error(err));
      fetch('/api/followers', requestObj)
        .then(result => result.json())
        .then(result => {
          this.setState({ followingList: result });
        })
        .catch(err => console.error(err));
    }
  }

  componentDidMount() {
    const requestObj = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        token: this.props.userLoggedIn.token
      }
    };
    fetch(`/api/accounts/${this.props.username}`, requestObj)
      .then(result => result.json())
      .then(result => {
        this.setState({
          currentRating: result.currentRating
        });
      })
      .catch(err => console.error(err));

    fetch('/api/followers', requestObj)
      .then(result => result.json())
      .then(result => {
        this.setState({ followingList: result });
      })
      .catch(err => console.error(err));
  }

  displayingPage() {
    return (
      <>
        <div className='container'>
          <div className='row flex-center'>
            <div className='column-third-always left-align '>
              <a href='#view-other-accounts'><i className="fa-solid fa-house-chimney fa-3x fa-house-style" /></a>
            </div>
            <div className='column-third-always'>
              <Smiley userLoggedIn={this.props.userLoggedIn} currentRating={this.state.currentRating} />
            </div>
            <div className='column-third-always'>
              <i onClick={this.handleUserClick} className="fa-solid fa-users  fa-3x fa-users-style" />
            </div>
          </div>
          <AccountCard userLoggedIn={this.props.userLoggedIn} username={this.props.username} view="current-user" hideNewRating={true} displayCurrentUserRating={true} />
        </div>
        {this.state.sidebar ? <Sidebar followerList={this.state.followingList} closeSidebar={this.state.sidebar} handleChange={this.handleUserClick}/> : null}
      </>
    );
  }

  render() {
    if (!this.props.userLoggedIn) {
      window.location.hash = '#sign-up';
      return null;
    }
    return (
      this.displayingPage()
    );
  }
}
