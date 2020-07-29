import React from 'react';
import CityBase from './city-base';

import {Switch, Redirect, Route} from 'react-router-dom';
import PropTypes from 'prop-types';

import CutLineMode from 'mapbox-gl-draw-cut-line-mode';

import {PanelHeader, PanelBody} from './panel';
import {Map, Source, Popup, Draw} from './map';

import Translate from 'react-translate-component';
import FeaturePopupContent from './city/feature-popup-content';

import MainStore from '../stores/main-store';
import CityStore from '../stores/city-store';
import CityViewStore from '../stores/city-view-store';
import EditorStore from '../stores/editor-store';

import CityView from './city/city-view';
const Editor = React.lazy(() => import('./editor'));

class City extends CityBase {
  constructor(props, context) {
    super(props, context);

    this.urlName = this.props.match.params.city_url_name;

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

  componentWillUnmount() {
    CityStore.unload(this.urlName);
    MainStore.removeChangeListener(this.bindedOnChange);
    CityStore.removeChangeListener(this.bindedOnChange);
    CityViewStore.removeChangeListener(this.bindedOnChange);
    EditorStore.removeChangeListener(this.bindedOnChange);
  }

  componentDidMount() {
    MainStore.addChangeListener(this.bindedOnChange);
    CityStore.addChangeListener(this.bindedOnChange);
    CityViewStore.addChangeListener(this.bindedOnChange);
    EditorStore.addChangeListener(this.bindedOnChange);

    MainStore.setLoading();
    CityStore.load(this.urlName, this.params());
  }

  UNSAFE_componentWillUpdate(nextProps, nextState) {
    if (nextState && nextState.error) {
      MainStore.unsetLoading();
      this.props.history.push(`/error?path=${this.urlName}`);
    }
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

  onSatelliteToggle(style) {
    const mapStyle = style == 'satellite' ? style : null;
    this.updateParams({map: mapStyle});
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

  toggleSettings() {
    this.setState({displaySettings: !this.state.displaySettings, displayShare: false});
  }

  toggleShare() {
    this.setState({displaySettings: false, displayShare: !this.state.displayShare});
  }

  render() {
    if (!this.state) return null;

    return (
        <div className="o-grid o-panel">
          <div id="panel" style={this.panelStyle()}>
            <PanelHeader
              name={this.state.name}
              pathName={this.props.location.pathname}
              urlName={this.urlName}
              loading={this.state.main.loading}
              onToggleSettings={this.toggleSettings.bind(this)}
              displaySettings={this.state.displaySettings}
              onToggleShare={this.toggleShare.bind(this)}
              displayShare={this.state.displayShare}
            />
            <Switch>
              <Route exact path="/:city_url_name"
                render={props => <CityView {...props} displaySettings={this.state.displaySettings} displayShare={this.state.displayShare} />} />
              <Route path="/:city_url_name/edit">
                { MainStore.userLoggedIn() ? <Editor city_url_name={this.urlName} /> : <Redirect to="/auth" /> }
              </Route>
            </Switch>
          </div>
          <main className="o-grid__cell o-grid__cell--width-100 o-panel-container">
          <Map
            mapboxAccessToken={this.state.mapbox_access_token}
            mapboxStyle={this.state.mapbox_style}
            mapStyle={this.state.map}
            center={this.state.coords}
            zoom={this.state.zoom}
            bearing={this.state.bearing}
            pitch={this.state.pitch}
            mouseEventsLayerNames={this.state.mouseEventsLayerNames}
            onLoad={this.bindedOnMapLoad}
            onMove={this.bindedOnMapMove}
            onMouseMove={this.bindedOnMouseMove}
            onMouseClick={this.bindedOnMouseClick}
            onSatelliteToggle={this.onSatelliteToggle.bind(this)}
            disableMouseEvents={this.state.playing} >
            { this.state.sources && this.state.sources.map((source) =>
              <Source
                key={source.name}
                name={source.name}
                data={source.data}
                layers={source.layers}
              />
            ) }
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
        </div>
        );
  }
}

City.childContextTypes = {
  cityName: PropTypes.string
}

export default City
