import React from 'react';
import CreateAccount from './components/sign-up';
import ViewAccount from './components/view-account';
import ViewOtherAccount from './components/view-other-account';
import parseRoute from './lib/parseRoute';
import SignIn from './components/sign-in';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: null,
      route: parseRoute(window.location.hash),
      userLoggedIn: JSON.parse(window.localStorage.getItem('account'))
    };
  }

  componentDidMount() {
    window.addEventListener('hashchange', event => {
      this.setState({ route: parseRoute(window.location.hash) });
    });
  }

  renderPage() {
    if (this.state.route.path === 'sign-up') {
      return <CreateAccount userLoggedIn={this.state.userLoggedIn}/>;
    } else if (this.state.route.path === 'sign-in') {
      return <SignIn />;
    } else if (this.state.route.path === 'view-other-accounts') {
      return <ViewOtherAccount userLoggedIn={this.state.userLoggedIn} />;
    } else if (this.state.route.path === 'view-account') {
      const prevUsername = this.state.route.params.get('username');
      return <ViewAccount userLoggedIn={this.state.userLoggedIn} username={prevUsername} />;
    } else {
      window.location.hash = '#sign-up';
      return <CreateAccount userLoggedIn={this.state.userLoggedIn} />;
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
