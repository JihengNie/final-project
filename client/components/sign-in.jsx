import React from 'react';

export default class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: null,
      password: null,
      token: null
    };
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDemoClick = this.handleDemoClick.bind(this);
  }

  handleDemoClick() {
    this.setState({
      username: 'Bob Ross',
      password: 'Password'
    });
  }

  handleUsernameChange(event) {
    this.setState({ username: event.target.value });
  }

  handlePasswordChange(event) {
    this.setState({ password: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();

    const data = {
      username: this.state.username,
      password: this.state.password
    };
    const requestObj = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    };
    fetch('/api/auth/sign-in', requestObj)
      .then(result => result.json())
      .then(result => {
        window.localStorage.setItem('account', JSON.stringify(result));
        this.setState({
          token: result.token,
          username: '',
          password: ''
        });
        window.location.hash = `#view-account?username=${result.account.username}`;
      })
      .catch(err => console.error(err));
    event.target.reset();
  }

  render() {
    return (
      <div className='container'>
        <div className='row flex-center'>
          <div className='column-full flex-center'>
            <h1 className='view-profile-name log-in-header'> Sign In</h1>
          </div>
        </div>
        <div className='row'>
          <div className='column-full'>
            <form className='flex-center-column' onSubmit={this.handleSubmit}>
              <div>
                <label htmlFor='newUsername'>
                  <input
                    value={this.state.username ? this.state.username : ''}
                    autoFocus
                    autoComplete="off"
                    onChange={this.handleUsernameChange}
                    className='new-user-name-style'
                    type='text'
                    placeholder='Enter name'
                    name='newUsername'
                    required />
                </label>
              </div>
              <div>
                <label htmlFor='newPassword'>
                  <input
                    value={this.state.password ? this.state.password : ''}
                    autoComplete="off"
                    onChange={this.handlePasswordChange}
                    className='new-user-name-style'
                    type='password'
                    placeholder='Password'
                    name='newPassword'
                    required />
                </label>
              </div>
              <div className='column-full fa-check-holder flex-center'>
                <label>
                  <i htmlFor='profileSubmit' className="fa-solid fa-2x fa-check fa-check-style" />
                  <input id='profileSubmit' type='submit' />
                </label>
                <a href='#sign-up' className='log-in-nav'> Sign up</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
