import React from 'react';

export default function CreateAccount(props) {
  return (
    <div className='container'>
      <div className='row flex-center'>
        <div className='column-full'>
          <i className="fa-regular fa-4x fa-face-smile" />
        </div>
      </div>
      <div className='row'>
        <div className='column-full'>
          <form className='flex-center-column '>
            <div>
              <label htmlFor='newUserName'>
                <input className='new-user-name-style'
                  type='text'
                  placeholder='Enter name'
                  name='newName'
                  required />
              </label>
            </div>
            <div className='column-full image-upload-holder flex-center'>
              <label htmlFor='new-profile-img'>
                <i className="fa-regular fa-image fa-3x"/>
              </label>
              <input id='new-profile-img' name='profileImg' type='file' accept=".png, .jpg, .jpeg, .gif"/>
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
