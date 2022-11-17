import React from 'react';
import Smiley from './smiley';
import AccountCard from './account-card';

export default class ViewAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentRating: null,
      userLoggedIn: JSON.parse(window.localStorage.getItem('account'))
    };

    this.displayingPage = this.displayingPage.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.username !== prevProps.username) {
      const requestObj = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          token: this.state.userLoggedIn.token
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
    }
  }

  componentDidMount() {
    const requestObj = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        token: this.state.userLoggedIn.token
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
  }

  displayingPage() {
    return (<div className='container'>
      <div className='row flex-center'>
        <div className='column-third-always left-align '>
          <a href='#view-other-accounts'><i className="fa-solid fa-house-chimney fa-3x fa-house-style" /></a>
        </div>
        <div className='column-third-always'>
          <Smiley currentRating={this.state.currentRating} />
        </div>
        <div className='column-third-always' />
      </div>
      <AccountCard username={this.props.username} view="current-user" hideNewRating={true} displayCurrentUserRating={true} />
    </div>);
  }

  render() {
    if (!this.state.userLoggedIn) {
      window.location.hash = '#sign-up';
      return null;
    }
    return (
      this.displayingPage()
    );
  }
}
