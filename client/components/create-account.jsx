import React from 'react';

export default class CreateAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imgSrc: null,
      username: ''
    };
    this.handleUpload = this.handleUpload.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
  }

  handleUpload(event) {
    this.setState({ imgSrc: URL.createObjectURL(event.target.files[0]) });
  }

  handleUsernameChange(event) {
    this.setState({ username: event.target.value });
  }

  render() {
    let img = '';
    if (this.state.imgSrc) {
      img = <>
        <label htmlFor='new-profile-img'>
          <img src={this.state.imgSrc} />
        </label>
        <input
          onChange={this.handleUpload}
          id='new-profile-img'
          name='profileImg'
          type='file'
          accept=".png, .jpg, .jpeg, .gif" />
      </>;
    } else {
      img = <>
        <label htmlFor='new-profile-img'>
          <i className="fa-regular fa-image fa-3x"/>
        </label>
        <input
        onChange={this.handleUpload}
        id='new-profile-img'
        name='profileImg'
        type='file'
        accept=".png, .jpg, .jpeg, .gif"/>
      </>;
    }
    return (
      <div className='container'>
        <div className='row flex-center'>
          <div className='column-full'>
            <i className="fa-regular fa-4x fa-face-smile" />
          </div>
        </div>
        <div className='row'>
          <div className='column-full'>
            <form className='flex-center-column'>
              <div>
                <label htmlFor='newUsername'>
                  <input
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
                {img}
              </div>
              <div className='column-full check-holder'>
                <label>
                  <i htmlFor='profileSubmit' className="fa-solid fa-2x fa-check" />
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
