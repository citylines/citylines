import React, {PureComponent} from 'react';

class Avatar extends PureComponent {
  render() {
    let extraClasses;

    switch(this.props.size) {
      case 'inline-list':
        extraClasses = 'avatar-inline-list u-xsmall';
        break;
      case 'inline':
        extraClasses = 'u-xsmall';
        break;
      default:
        extraClasses = '';
    }

    return (
      <div className={`c-avatar ${extraClasses} avatar-shadow`}>
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
