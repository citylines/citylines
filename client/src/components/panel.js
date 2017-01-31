import React, {Component} from 'react';

const Panel = (props) => <div id="panel" style={{display: props.display ? 'block' : 'none'}}>{props.children}</div>;

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
