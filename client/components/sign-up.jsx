import React from 'react';

export default class CreateAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imgSrc: null,
      username: null,
      accountId: null,
      password: null,
      userLoggedIn: JSON.parse(window.localStorage.getItem('account'))
    };
    this.fileInputRef = React.createRef();
    this.handleUpload = this.handleUpload.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleUpload(event) {
    this.setState({ imgSrc: URL.createObjectURL(event.target.files[0]) });
  }

  handleUsernameChange(event) {
    this.setState({ username: event.target.value });
  }

  handlePasswordChange(event) {
    this.setState({ password: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();

    const form = new FormData();
    form.append('username', this.state.username);
    form.append('password', this.state.password);
    form.append('image', this.fileInputRef.current.files[0]);
    const requestObj = {
      method: 'POST',
      body: form
    };
    fetch('/api/auth/sign-up', requestObj)
      .then(result => result.json())
      .then(result => {
        this.setState({
          username: '',
          password: ''
        });
      })
      .catch(err => console.error(err));
    this.setState({ imgSrc: null });
    event.target.reset();
    window.location.hash = '#sign-in';
  }

  componentDidMount() {
    if (this.state.userLoggedIn) {
      this.setState({ username: this.state.userLoggedIn.account.username });
      window.location.hash = `#view-account?username=${this.state.userLoggedIn.account.username}`;
    }
  }

  render() {
    return (
      <div className='container'>
        <div className='row flex-center'>
          <div className='column-full flex-center'>
            <h1 className='view-profile-name log-in-header'> Sign Up</h1>
          </div>
        </div>
        <div className='row'>
          <div className='column-full'>
            <form className='flex-center-column' onSubmit={this.handleSubmit}>
              <div>
                <label htmlFor='newUsername'>
                  <input
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
                    autoComplete="off"
                    onChange={this.handlePasswordChange}
                    className='new-user-name-style'
                    type='password'
                    placeholder='Password'
                    name='newPassword'
                    required />
                </label>

              </div>
              <div className='column-full image-upload-holder flex-center'>
                <label htmlFor='new-profile-img'>
                  {this.state.imgSrc
                    ? <img src={this.state.imgSrc} />
                    : <i className="fa-regular fa-image fa-3x fa-image-style"/>}
                </label>
                <input
                    onChange={this.handleUpload}
                    id='new-profile-img'
                    type='file'
                    name='profileImg'
                    ref={this.fileInputRef}
                    required
                    accept=".png, .jpg, .jpeg, .gif" />
              </div>
              <div className='column-full fa-check-holder flex-center'>
                <label>
                  <i htmlFor='profileSubmit' className="fa-solid fa-2x fa-check fa-check-style" />
                  <input id='profileSubmit' type='submit'/>
                </label>
                <a href='#sign-in' className='log-in-nav'> Sign in</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
