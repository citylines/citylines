import React, {PureComponent} from 'react';
import {browserHistory} from 'react-router';
import {Link} from 'react-router';

import {Map, Draw} from './map';
import {Panel, PanelHeader, PanelBody} from './panel';
import FeatureViewer from './editor/feature-viewer';
import ModifiedFeaturesViewer from './editor/modified-features-viewer';

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
    this.bindedOnSelectionChange = this.onSelectionChange.bind(this);
    this.bindedOnFeaturePropsChange = this.onFeaturePropsChange.bind(this);
    this.bindedOnDrawLoad = this.onDrawLoad.bind(this);
    this.bindedOnModifiedFeatureClick = this.onModifiedFeatureClick.bind(this);
    this.bindedOnFeatureUpdate = this.onFeatureUpdate.bind(this);
    this.bindedOnFeatureCreate = this.onFeatureCreate.bind(this);
    this.bindedOnFeatureDelete = this.onFeatureDelete.bind(this);
    this.bindedOnDiscardChanges = this.onDiscardChanges.bind(this);
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
    this.mapLoaded = true;
    this.forceUpdate();
  }

  onMapMove(geo) {
    const newGeo = `${geo.lat},${geo.lon},${geo.zoom},${geo.bearing},${geo.pitch}`;
    this.updateParams({geo: newGeo});
    EditorStore.storeGeoData(this.urlName, geo);
  }

  onSelectionChange(features) {
    EditorStore.changeSelection(this.urlName, features);
  }

  onFeaturePropsChange(feature, modifiedKey, newValue) {
    EditorStore.setFeaturePropsChange(this.urlName, feature);
  }

  onDrawLoad(draw) {
    this.draw = draw;
  }

  onModifiedFeatureClick(id) {
    this.draw.changeMode('simple_select', {featureIds: [id]});
    this.onSelectionChange([this.draw.get(id)]);
  }

  onFeatureUpdate(features) {
    EditorStore.setFeatureGeoChange(this.urlName, features);
  }

  onFeatureCreate(features) {
    const createdFeatures = features.map((feature) => {
      const klass = feature.geometry.type === 'Point' ? 'Station' : 'Section';
      feature.properties.id = Date.now();
      feature.properties.klass = klass;
      feature.properties.opening = 0;
      feature.properties.buildstart = 0;
      feature.properties.closure = 999999;
      return feature;
    });

    EditorStore.setFeatureCreated(this.urlName, createdFeatures);
  }

  onFeatureDelete(features) {
    EditorStore.setFeatureDeleted(this.urlName, features);
  }

  onDiscardChanges() {
    this.draw.set(this.state.features);
    EditorStore.discardChanges(this.urlName);
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
            <div className="editor-cards-container">
              <FeatureViewer
                lines={this.state.lines}
                feature={this.state.selectedFeature}
                onFeatureChange={this.bindedOnFeaturePropsChange}
                />
              <ModifiedFeaturesViewer
                modifiedFeatures={this.state.modifiedFeatures}
                onClick={this.bindedOnModifiedFeatureClick}
                onDiscard={this.bindedOnDiscardChanges}
              />
            </div>
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
          { this.mapLoaded &&
            <Draw
              features={this.state.features}
              onSelectionChange={this.bindedOnSelectionChange}
              onDrawLoad={this.bindedOnDrawLoad}
              onFeatureUpdate={this.bindedOnFeatureUpdate}
              onFeatureCreate={this.bindedOnFeatureCreate}
              onFeatureDelete={this.bindedOnFeatureDelete}
            /> }
        </Map>
      </div>
    )
  }
}

export default Editor
