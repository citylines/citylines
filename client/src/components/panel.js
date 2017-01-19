import React, {PureComponent} from 'react';

class Panel extends PureComponent {
  render() {
    const display = this.props.display ? 'block' : 'none';
    return (
      <div id="panel" style={{display: display}}>
        {this.props.children}
      </div>
      )
  }
}

class PanelHeader extends PureComponent {
  render() {
    return (
      <div className="panel-header o-grid__cell o-grid__cell--width-100">
        {this.props.children}
      </div>
      )
  }
}

class PanelBody extends PureComponent {
  render() {
    return (
      <div className="panel-body">
        {this.props.children}
      </div>
      )
  }
}

export {Panel, PanelHeader, PanelBody};
