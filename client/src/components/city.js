import React, {PureComponent} from 'react';
import {browserHistory} from 'react-router';

import {PanelHeader, PanelBody} from './panel';
import {Map, Source, Layer, Popup, Draw} from './map';

import Translate from 'react-translate-component';

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
  }

  componentWillMount() {
    MainStore.addChangeListener(this.bindedOnChange);
    CityStore.addChangeListener(this.bindedOnChange);
    CityViewStore.addChangeListener(this.bindedOnChange);
    EditorStore.addChangeListener(this.bindedOnChange);
  }

  componentWillUnmount() {
    MainStore.removeChangeListener(this.bindedOnChange);
    CityStore.removeChangeListener(this.bindedOnChange);
    CityViewStore.removeChangeListener(this.bindedOnChange);
    EditorStore.removeChangeListener(this.bindedOnChange);
  }

  componentDidMount() {
    CityStore.load(this.urlName, this.params());
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

  onMapLoad() {
    this.mapLoaded = true;
    this.forceUpdate();
  }

  onMapMove(geo) {
    if (this.state.playing) return;
    const newGeo = `${geo.lat},${geo.lon},${geo.zoom},${geo.bearing},${geo.pitch}`;
    this.updateParams({geo: newGeo});
    CityStore.storeGeoData(this.urlName, geo)
  }

  validFeatureValue(value) {
    return (value !== null && value !== 999999)
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

  /* ------------- */

  panelStyle() {
    const style = {display: this.state.main.displayPanel ? 'block' : 'none'};
    if (this.state.main.panelFullWidth) style.width = '100%';
    return style;
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
            />
            { this.mapLoaded && this.props.children }
          </div>
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
                this.state.clickedFeatures.features.map((feature) => {
                  const fProps = feature.properties;
                  const lineStyle = {color: fProps.lineLabelColor, backgroundColor: fProps.lineColor, marginLeft:5, boxShadow: (fProps.lineLabelColor === '#000' ? '0 0 1px rgba(0,0,0,0.5)' : null)};
                  return (
                    <div key={`${fProps.klass}_${fProps.id}`} className="c-text popup-feature-info">
                      <ul className="c-list c-list--unstyled">
                        <li className="c-list__item">
                          <strong>{fProps.name ? <Translate content="city.popup.station" with={{name: fProps.name}} /> : <Translate content="city.popup.track" />}</strong>
                          <span className="c-text--highlight line-label" style={lineStyle}>{fProps.line}</span>
                        </li>
                        { fProps.buildstart ? <li className="c-list__item"><Translate content="city.popup.buildstart" with={{year: fProps.buildstart}} /></li> : ''}
                        { this.validFeatureValue(fProps.opening) ? <li className="c-list__item"><Translate content="city.popup.opening" with={{year: fProps.opening}} /></li> : ''}
                        { this.validFeatureValue(fProps.closure) ? <li className="c-list__item"><Translate content="city.popup.closure" with={{year: fProps.closure}} /></li> : ''}
                        { fProps.length ? <li className="c-list__item"><Translate content="city.popup.length" with={{km: (parseFloat(fProps.length)/1000).toFixed(2)}} /></li> : ''}
                      </ul>
                    </div>
                  )
                })
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
                  selectedFeatureById={this.state.drawSelectedFeatureById}
                />
              }
          </Map>
        </div>
        );
  }
}

export default City
