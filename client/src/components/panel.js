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

class PanelHeader extends Component {
  render() {
    return (
      <div className="panel-header o-grid__cell o-grid__cell--width-100">
        {this.props.children}
      </div>
      )
  }
}

class PanelBody extends Component {
  render() {
    return (
      <div className="panel-body">
        {this.props.children}
      </div>
      )
  }
}

export {Panel, PanelHeader, PanelBody};
