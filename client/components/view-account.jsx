import React from 'react';
import Smiley from './smiley';
import AccountCard from './account-card';

export default class ViewAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentRating: null
    };
  }

  componentDidMount() {
    const requestObj = {
      method: 'GET'
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

  render() {
    return (
      <div className='container'>
        <div className='row flex-center'>
          <div className='column-third-always left-align '>
            <a href='#view-other-accounts'><i className="fa-solid fa-house-chimney fa-4x fa-house-style" /></a>
          </div>
          <div className='column-third-always'>
            <Smiley currentRating={this.state.currentRating} />
          </div>
          <div className='column-third-always' />
        </div>
        <AccountCard username={this.props.username} view="current-user" hideNewRating={true}/>
      </div>
    );
  }
}
