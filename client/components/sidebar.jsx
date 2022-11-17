import React from 'react';

export default class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      closeSidebar: false
    };

    this.handleCloseClick = this.handleCloseClick.bind(this);
    this.handleLogOutClick = this.handleLogOutClick.bind(this);
  }

  handleCloseClick() {
    this.props.handleChange();
    this.setState({ closeSidebar: true });
  }

  handleLogOutClick() {
    localStorage.clear();
  }

  render() {
    if (this.state.closeSidebar) {
      return;
    }
    return (
      <>
        <div className='sidebar-background' />
        <div className='sidebar flex-between'>
          <div className='column-half-always'>
            <i onClick={this.handleCloseClick} className="fa-solid fa-3x fa-caret-left close-sidebar"/>
          </div>
          <div className='column-half-always log-out-icon-holder'>
            <a href='#sign-in' className='remove-style'>
              <i onClick={this.handleLogOutClick} className="fa-solid fa-3x fa-right-from-bracket"/>
            </a>
          </div>
        </div>
      </>
    );
  }
}
