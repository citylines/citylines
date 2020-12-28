import React, {Component, PureComponent} from 'react';
import {Link} from 'react-router-dom';
import Translate from 'react-translate-component';
import downloadImgFromMapCanvas from '../lib/map-to-img.js';

class PanelHeader extends PureComponent {
  downloadImg() {
    downloadImgFromMapCanvas(this.props.urlName, this.props.map.getCanvas());
  }

  render() {
    const editPath = this.props.pathName.includes('/edit');
    const linkLabel = editPath ? <Translate content="city.stop_editing" /> : <Translate content="city.edit" />;
    const linkTo = editPath ? `/${this.props.urlName}` : `/${this.props.urlName}/edit`;

    return (
      <div className="panel-header o-grid__cell o-grid__cell--width-100">
        <div className="panel-header-title">
          <h2 className="c-heading">{this.props.name}</h2>
          <div className="commands">
            {!this.props.loading &&
              <Link className="c-link" to={linkTo}>{linkLabel}</Link>}
            {!this.props.loading && !editPath &&
              <Link className="c-link" to={`/compare?cities=${this.props.urlName},`}><Translate content="compare.link" /></Link>}
            {!this.props.loading && !editPath &&
              <Link className="c-link" to={`/data?city=${this.props.urlName}#city`}><Translate content="city.config.data"/></Link>}
            {!this.props.loading && !editPath && <a className="c-link" onClick={this.downloadImg.bind(this)}>Export</a>}
            {!this.props.loading && !editPath &&
              <Link className={`c-link ${this.props.displaySettings ? 'c-link--brand' : ''}`}
                to=''
                onClick={e => {e.preventDefault(); this.props.onToggleSettings()}} ><Translate content="city.config.title" /></Link>}
            {!this.props.loading && !editPath &&
              <Link className={`c-link ${this.props.displayShare ? 'c-link--brand' : ''}`}
                to=''
                onClick={e => {e.preventDefault(); this.props.onToggleShare()}} ><Translate content="city.share" /></Link>}
          </div>
        </div>
      </div>
    );
  }
}

class PanelBody extends Component {
  updateHeight() {
    const panel = this.refs.node.parentNode;
    const headerHeight = panel.children[0].clientHeight;
    const panelHeight = panel.clientHeight;
    const height = panelHeight - headerHeight;
    this.refs.node.style.setProperty('height', `${height}px`);
  }

  componentDidMount() {
    this.updateHeight();
  }

  componentDidUpdate() {
    this.updateHeight();
  }

  render() {
    return <div ref="node" className="panel-body">{this.props.children}</div>;
  }
}

export {PanelHeader, PanelBody};
