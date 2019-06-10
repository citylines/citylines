import React, {PureComponent} from 'react';
import {browserHistory} from 'react-router';
import PropTypes from 'prop-types';

import CutLineMode from 'mapbox-gl-draw-cut-line-mode';

import {PanelHeader, PanelBody} from './panel';
import {Map, Source, Layer, Popup, Draw} from './map';
import Tags from './tags';

import Translate from 'react-translate-component';
import FeaturePopupContent from './city/feature-popup-content';

import MainStore from '../stores/main-store';
import CityStore from '../stores/city-store';
import CityViewStore from '../stores/city-view-store';
import EditorStore from '../stores/editor-store';

class City extends PureComponent {
  constructor(props, context) {
    super(props, context);

    this.urlName = this.props.params.city_url_name;

    this.bindedOnChange = this.onChange.bind(this);
    this.bindedOnMapMove = this.onMapMove.bind(this);
    this.bindedOnMapLoad = this.onMapLoad.bind(this);
    this.bindedOnMouseMove = this.onMouseMove.bind(this);
    this.bindedOnMouseClick = this.onMouseClick.bind(this);
    this.bindedOnPopupClose = this.onPopupClose.bind(this);

    this.bindedOnSelectionChange = this.onSelectionChange.bind(this);
    this.bindedOnFeatureUpdate = this.onFeatureUpdate.bind(this);
    this.bindedOnFeatureCreate = this.onFeatureCreate.bind(this);
    this.bindedOnFeatureDelete = this.onFeatureDelete.bind(this);
    this.bindedOnDrawModeChange = this.onDrawModeChange.bind(this);
  }

  getChildContext() {
    return {cityName: this.state && this.state.name};
  }

  componentWillMount() {
    MainStore.addChangeListener(this.bindedOnChange);
    CityStore.addChangeListener(this.bindedOnChange);
    CityViewStore.addChangeListener(this.bindedOnChange);
    EditorStore.addChangeListener(this.bindedOnChange);
  }

  componentWillUnmount() {
    CityStore.unload(this.urlName);
    MainStore.removeChangeListener(this.bindedOnChange);
    CityStore.removeChangeListener(this.bindedOnChange);
    CityViewStore.removeChangeListener(this.bindedOnChange);
    EditorStore.removeChangeListener(this.bindedOnChange);
  }

  componentDidMount() {
    MainStore.setLoading();
    CityStore.load(this.urlName, this.params());
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState && nextState.error) {
      MainStore.unsetLoading();
      browserHistory.push(`/error?path=${this.urlName}`);
    }
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

  onChange() {
    this.setState(CityStore.getState(this.urlName));
  }

  onMapLoad(map) {
    const geo = this.getGeoFromMap(map);
    CityStore.setGeoData(this.urlName, geo);
  }

  onMapMove(map) {
    if (this.state.playing) return;

    const geo = this.getGeoFromMap(map);
    CityStore.setGeoData(this.urlName, geo);

    const newGeo = `${geo.lat},${geo.lon},${geo.zoom},${geo.bearing},${geo.pitch}`;
    this.updateParams({geo: newGeo});
  }

  getGeoFromMap(map) {
    const center = map.getCenter();

    return {
      lat: center.lat.toFixed(6),
      lon: center.lng.toFixed(6),
      bounds: map.getBounds().toArray(),
      zoom: map.getZoom().toFixed(2),
      bearing: map.getBearing().toFixed(2),
      pitch: map.getPitch().toFixed(2)
    }
  }

  onMouseMove(point, features) {
    CityViewStore.hover(this.urlName, features);
  }

  onMouseClick(point, features) {
    CityViewStore.clickFeatures(this.urlName, point, features);
  }

  onPopupClose() {
    CityViewStore.unClickFeatures(this.urlName);
  }

  /* Draw Listeners */

  onSelectionChange(features) {
    EditorStore.changeSelection(this.urlName, features);
  }

  onFeatureUpdate(features) {
    EditorStore.setFeatureGeoChange(this.urlName, features);
  }

  onFeatureCreate(features) {
    EditorStore.setFeatureCreated(this.urlName, features);
  }

  onFeatureDelete(features) {
    EditorStore.setFeatureDeleted(this.urlName, features);
  }

  onDrawModeChange(mode) {
    EditorStore.setMode(this.urlName, mode);
  }

  /* ------------- */

  panelStyle() {
    const style = {visibility: this.state.main.displayPanel ? 'visible' : 'hidden'};
    if (this.state.main.panelFullWidth) style.width = '100%';
    return style;
  }

  render() {
    if (!this.state) return null;

    return (
        <div className="o-grid o-panel">
          { this.state.name && <Tags
            title="city.title"
            description="city.description"
            interpolations={{city: this.state.name}}
          /> }
          <div id="panel" style={this.panelStyle()}>
            <PanelHeader
              name={this.state.name}
              pathName={this.props.location.pathname}
              urlName={this.urlName}
              loading={this.state.main.loading}
            />
            { this.props.children }
          </div>
          <main className="o-grid__cell o-grid__cell--width-100 o-panel-container">
          <Map
            mapboxAccessToken={this.state.mapbox_access_token}
            mapboxStyle={this.state.mapbox_style}
            center={this.state.coords}
            zoom={this.state.zoom}
            bearing={this.state.bearing}
            pitch={this.state.pitch}
            mouseEventsLayerNames={this.state.mouseEventsLayerNames}
            onLoad={this.bindedOnMapLoad}
            onMove={this.bindedOnMapMove}
            onMouseMove={this.bindedOnMouseMove}
            onMouseClick={this.bindedOnMouseClick}
            disableMouseEvents={this.state.playing} >
            { this.state.sources && this.state.sources.map((source) => { return (
                <Source
                  key={source.name}
                  name={source.name}
                  data={source.data}
                />
              )
            }) }
            { this.state.layers && this.state.layers.map((layer) => { return (
                <Layer
                  key={layer.id}
                  id={layer.id}
                  source={layer.source}
                  type={layer.type}
                  paint={layer.paint}
                  filter={layer.filter}
                />
              )
            }) }
            { this.state.clickedFeatures && (<Popup
              point={this.state.clickedFeatures.point}
              onClose={this.bindedOnPopupClose}>
              <div>
              {
                this.state.clickedFeatures.features.map((f,i) =>
                    <FeaturePopupContent
                      key={`${f.properties.klass}-${f.properties.id}-${f.properties.line_url_name}`}
                      feature={f}
                      index={i} />)
              }
              </div>
              </Popup>) }
              { this.state.drawFeatures &&
                <Draw
                  features={this.state.drawFeatures}
                  onSelectionChange={this.bindedOnSelectionChange}
                  onFeatureUpdate={this.bindedOnFeatureUpdate}
                  onFeatureCreate={this.bindedOnFeatureCreate}
                  onFeatureDelete={this.bindedOnFeatureDelete}
                  onModeChange={this.bindedOnDrawModeChange}
                  selectedFeatureById={this.state.drawSelectedFeatureById}
                  customModes={{cut_line: CutLineMode}}
                  currentMode={this.state.drawCurrentMode}
                />
              }
          </Map>
          </main>
          { this.state.drawFeatures &&
            <div className="mapboxgl-ctrl-group mapboxgl-ctrl cut-line">
              <button
                className="mapbox-gl-draw_ctrl-draw-btn fa fa-cut"
                onClick={() => EditorStore.setMode(this.urlName, 'cut_line')} />
            </div>
          }
        </div>
        );
  }
}

City.childContextTypes = {
  cityName: PropTypes.string
}

export default City
