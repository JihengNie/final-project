import React from 'react';
import Smiley from './smiley';
import AccountCard from './account-card';

export default class ViewAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      happyLevel: null
    };
    this.handleHomeClick = this.handleHomeClick.bind(this);
  }

  handleHomeClick() {
    window.location.hash = '#view-other-accounts';
  }

  componentDidMount() {
    const requestObj = {
      method: 'GET'
    };
    fetch(`/api/accounts/${this.props.username}`, requestObj)
      .then(result => result.json())
      .then(result => {
        this.setState({
          happyLevel: result.happyLevel
        });
      })
      .catch(err => console.error(err));
  }

  render() {
    return (
      <div className='container'>
        <div className='row flex-center'>
          <div className='column-third-always left-align '>
            <i onClick={this.handleHomeClick} className="fa-solid fa-house-chimney fa-4x fa-house-style" />
          </div>
          <div className='column-third-always'>
            <Smiley happyLevel={this.state.happyLevel} />
          </div>
          <div className='column-third-always' />
        </div>
        <AccountCard username={this.props.username} view="current-user"/>
      </div>
    );
  }
}
