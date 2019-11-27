import React, {PureComponent} from 'react';

class Avatar extends PureComponent {
  render() {
    let extraClasses;

    switch(this.props.size) {
      case 'inline-list':
        extraClasses = 'avatar-inline-list u-xsmall';
        break;
      case 'inline':
        extraClasses = 'avatar-inline u-xsmall';
        break;
      default:
        extraClasses = 'avatar-main';
    }

    return (
      <div className={`c-avatar ${extraClasses}`}>
      <img className="c-avatar__img" alt="placeholder" src="https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50"></img>
      </div>
    )
  }
}

export default Avatar
