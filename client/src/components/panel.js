import React, {Component, PureComponent} from 'react';
import {Link} from 'react-router';

class Panel extends Component {
  render() {
    const style = {display: this.props.display ? 'block' : 'none'};
    if (this.props.fullWidth) style.width = '100%';

    return <div id="panel" style={style}>{this.props.children}</div>;
  }
}

class PanelHeader extends PureComponent {
  render() {
    const editPath = this.props.pathName.includes('/edit');
    const linkLabel = editPath ? 'Dejar de editar' : 'Editar';
    const linkTo = editPath ? `/${this.props.urlName}` : `/${this.props.urlName}/edit`;

    return (
      <div className="panel-header o-grid__cell o-grid__cell--width-100">
        <div className="panel-header-title">
          <h3 className="c-heading">{this.props.name}</h3>
          <Link className="c-link" to={linkTo}>{linkLabel}</Link>
        </div>
      </div>
    );
  }
}

class PanelBody extends Component {
  componentDidMount() {
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
