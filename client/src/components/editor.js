import React, {PureComponent} from 'react';
import {browserHistory} from 'react-router';
import {Link} from 'react-router';

import {Map} from './map';
import {Panel, PanelHeader, PanelBody} from './panel';

import EditorStore from '../stores/editor-store';
import MainStore from '../stores/main-store';

class Editor extends PureComponent {
  constructor(props, context) {
    super(props, context);

    this.urlName = this.props.params.city_url_name;
    this.state = EditorStore.getState(this.urlName);

    this.bindedOnChange = this.onChange.bind(this);
    this.bindedOnMapLoad = this.onMapLoad.bind(this);
    this.bindedOnMapMove = this.onMapMove.bind(this);
  }

  componentWillMount() {
    MainStore.addChangeListener(this.bindedOnChange);
    EditorStore.addChangeListener(this.bindedOnChange);
  }

  componentWillUnmount() {
    MainStore.removeChangeListener(this.bindedOnChange);
    EditorStore.removeChangeListener(this.bindedOnChange);
  }

  onChange() {
    this.setState(EditorStore.getState(this.urlName));
  }

  componentDidMount() {
    EditorStore.load(this.urlName, this.params());
  }

  params() {
    return this.props.location.query;
  }

  updateParams(newParams) {
    const params = Object.assign({}, this.params(), newParams);

    // If new params are equal to the current ones, we don't push the state to the
    // browser history
    if (JSON.stringify(params) === JSON.stringify(this.params())) return;

    browserHistory.push({...this.props.location, query: params});
  }

  onMapLoad() {
    //TODO
  }

  onMapMove(geo) {
    const newGeo = `${geo.lat},${geo.lon},${geo.zoom},${geo.bearing},${geo.pitch}`;
    this.updateParams({geo: newGeo});
    EditorStore.storeGeoData(this.urlName, geo);
  }

  render() {
    return (
      <div className="o-grid o-panel">
        <Panel display={this.state.main.displayPanel}>
          <PanelHeader>
            <div className="panel-header-title">
              <h3 className="c-heading">{this.state.name}</h3>
              <Link className="c-link" to={`/${this.urlName}`}>Volver</Link>
            </div>
          </PanelHeader>
          <PanelBody>
          </PanelBody>
        </Panel>
        <Map
          mapboxAccessToken={this.state.config.mapbox_access_token}
          mapboxStyle={this.state.config.mapbox_style}
          center={this.state.config.coords}
          zoom={this.state.config.zoom}
          bearing={this.state.config.bearing}
          pitch={this.state.config.pitch}
          onLoad={this.bindedOnMapLoad}
          onMove={this.bindedOnMapMove}>
        </Map>
      </div>
    )
  }
}

export default Editor
