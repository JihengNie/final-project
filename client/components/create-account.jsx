import React from 'react';
import ViewAccount from '../components/view-account';

export default class CreateAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imgSrc: null,
      username: null
    };
    this.fileInputRef = React.createRef();
    this.handleUpload = this.handleUpload.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleUpload(event) {
    this.setState({ imgSrc: URL.createObjectURL(event.target.files[0]) });
  }

  handleUsernameChange(event) {
    this.setState({ username: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const form = new FormData();
    form.append('newUsername', this.state.username);
    form.append('image', this.fileInputRef.current.files[0]);
    const requestObj = {
      method: 'POST',
      body: form
    };
    fetch('/api/uploads', requestObj)
      .then(result => result.json())
      .then(result => {
        this.setState({
          username: ''
        });
        this.fileInputRef.current.value = null;
        window.localStorage.setItem('username', this.state.username);
      })
      .catch(err => console.error(err));
    this.setState({ imgSrc: null });
    event.target.reset();
  }

  render() {
    const currentUsername = window.localStorage.getItem('username');
    if (currentUsername) {
      return <ViewAccount username={currentUsername} />;
    }
    return (
      <div className='container'>
        <div className='row flex-center'>
          <div className='column-full'>
            <i className="fa-regular fa-4x fa-face-smile fa-face-smile-style" />
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
                    accept=".png, .jpg, .jpeg, .gif" />
              </div>
              <div className='column-full fa-check-holder'>
                <label>
                  <i htmlFor='profileSubmit' className="fa-solid fa-2x fa-check fa-check-style" />
                  <input id='profileSubmit' type='submit'/>
                </label>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
