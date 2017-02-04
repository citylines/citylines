import React, {Component} from 'react';

class Panel extends Component {
  render() {
    const style = {display: this.props.display ? 'block' : 'none'};
    if (this.props.fullWidth) style.width = '100%';

    return <div id="panel" style={style}>{this.props.children}</div>;
  }
}

const PanelHeader = (props) => <div className="panel-header o-grid__cell o-grid__cell--width-100">{props.children}</div>;

class PanelBody extends Component {
  componentDidUpdate() {
    const panel = this.refs.node.parentNode;
    const headerHeight = panel.children[0].clientHeight;
    const panelHeight = panel.clientHeight;
    const height = panelHeight - headerHeight;
    this.refs.node.style.setProperty('height', `${height}px`);
  }

  render() {
    return <div ref="node" className="panel-body">{this.props.children}</div>;
  }
}

export {Panel, PanelHeader, PanelBody};
