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
      route: parseRoute(window.location.hash),
      userLoggedIn: null,
      isAuthorizing: true
    };
    this.handleSignIn = this.handleSignIn.bind(this);
  }

  handleSignIn(result) {
    window.localStorage.setItem('account', JSON.stringify(result));
    this.setState({ userLoggedIn: result });
  }

  componentDidMount() {
    window.addEventListener('hashchange', event => {
      this.setState({
        route: parseRoute(window.location.hash)
      });
    });
    const account = window.localStorage.getItem('account');
    const userLoggedIn = account ? JSON.parse(account) : null;
    this.setState({ userLoggedIn, isAuthorizing: false });
  }

  renderPage() {
    if (this.state.route.path === 'sign-up') {
      return <CreateAccount userLoggedIn={this.state.userLoggedIn}/>;
    } else if (this.state.route.path === 'sign-in') {
      return <SignIn onSignIn={this.handleSignIn} />;
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
    if (this.state.isAuthorizing) return null;
    return (
      <>
        {this.renderPage()}
      </>
    );
  }
}
