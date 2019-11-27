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
      { (this.props.img) ?
       <img className="c-avatar__img" alt="placeholder" src={this.props.img}></img>
        :
       <div className="avatar-initials">{this.props.initials}</div>
      }
      </div>
    )
  }
}

export default Avatar
