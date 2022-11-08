import React from 'react';
import CreateAccount from '../components/create-account';
import ViewAccount from '../components/view-account';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: null
    };
  }

  componentDidMount() {
    const username = window.localStorage.getItem('username');
    if (username) {
      this.setState({ username });
    }
  }

  render() {
    if (!this.state.username) {
      return <CreateAccount prevUsername={this.state.username} />;
    }
    return (
      <ViewAccount username={this.state.username}/>
    );
  }
}
