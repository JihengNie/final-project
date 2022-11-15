import React from 'react';
import CreateAccount from './components/create-account';
import ViewAccount from './components/view-account';
import ViewOtherAccount from './components/view-other-account';
import parseRoute from './lib/parseRoute';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: null,
      route: parseRoute(window.location.hash)
    };
  }

  componentDidMount() {
    window.location.hash = '#create-account';
    const previousUsername = window.localStorage.getItem('username');
    if (previousUsername) {
      this.setState({ username: previousUsername });
      window.location.hash = `#view-account?username=${previousUsername}`;
    }
    window.addEventListener('hashchange', event => {
      this.setState({ route: parseRoute(window.location.hash) });
    });
  }

  renderPage() {
    if (this.state.route.path === 'create-account') {
      return <CreateAccount/>;
    } else if (this.state.route.path === 'user-account') {
      const accountUsername = this.state.route.params.get('username');
      return <ViewAccount username={accountUsername} />;
    } else if (this.state.route.path === 'view-other-accounts') {
      return <ViewOtherAccount />;
    } else if (this.state.route.path === 'view-account') {
      const prevUsername = this.state.route.params.get('username');
      return <ViewAccount username={prevUsername} />;
    } else {
      return <CreateAccount/>;
    }
  }

  render() {
    return (
      <>
        {this.renderPage()}
      </>
    );
  }
}
