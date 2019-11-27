import React, {PureComponent} from 'react';

class Avatar extends PureComponent {
  render() {
    return (
      <div className="c-avatar main-user-avatar">
      <img className="c-avatar__img" alt="placeholder" src="https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50"></img>
      </div>
    )
  }
}

export default Avatar
