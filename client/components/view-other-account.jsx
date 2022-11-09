import React from 'react';
import Smiley from './smiley';
import AccountCard from './account-card';

export default class ViewOtherAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photoUrl: null,
      happyLevel: null,
      currentRating: null
    };
    this.handleHomeClick = this.handleHomeClick.bind(this);
  }

  handleHomeClick() {
    window.location.hash = '#view-other-accounts';
  }

  render() {
    return (
      <div className='container'>
        <div className='row flex-center'>
          <div className='column-third-always left-align '>
            <i onClick={this.handleHomeClick} className="fa-solid fa-house-chimney fa-4x fa-house-style" />
          </div>
          <div className='column-third-always'>
            <Smiley happyLevel={this.props.happyLevel}/>
          </div>
          <div className='column-third-always' />
        </div>
        <div className='flex-center row-no-wrap'>
          <i className="fa-solid fa-chevron-left chevron-style left" />
          <div className='none-focus-cards'>
            <AccountCard username="Jane Smith" hideName={true} hideStars={true} className='none-focus-cards' />
          </div>
          <AccountCard username="John Smith" />
          <div className='none-focus-cards'>
            <AccountCard username="After HashRouting" hideName={true} hideStars={true} className='none-focus-cards overflow' />
          </div>
          <i className="fa-solid fa-chevron-right chevron-style right" />
        </div>
      </div>
    );
  }
}
