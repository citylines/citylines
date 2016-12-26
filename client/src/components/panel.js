import React, {Component} from 'react';

class Panel extends Component {
  render() {
    const display = this.props.display ? 'block' : 'none';
    return (
      <div id="panel" style={{display: display}}>
        {this.props.children}
      </div>
      )
  }
}

export default Panel
