import React from 'react';

export default class FollowerList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userLoggedIn: JSON.parse(window.localStorage.getItem('account')),
      followerList: this.props.followerList
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.followerList !== prevProps.followerList) {
      this.setState({ followerList: this.props.followerList });
    }
  }

  render() {
    const followers = this.state.followerList.map((item, index) => {
      return (
        <div key={index} className='follower-card-holder'>
          <div className='sidebar-image-holder'>
            <img src={item.photoUrl} />
            <a href={`#view-account?username=${item.username}`} className='sidebar-text-style'> {item.username} </a>
          </div>
        </div>
      );
    });
    return followers;
  }
}
