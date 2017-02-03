import React, {PureComponent} from 'react';
import {browserHistory} from 'react-router';
import {Link} from 'react-router';

import {Map, Draw} from './map';
import {Panel, PanelHeader, PanelBody} from './panel';
import FeatureViewer from './editor/feature-viewer';
import ModifiedFeaturesViewer from './editor/modified-features-viewer';
import LinesEditor from './editor/lines-editor';

import EditorStore from '../stores/editor-store';
import MainStore from '../stores/main-store';

class Editor extends PureComponent {
  constructor(props, context) {
    super(props, context);

    this.modes = {
      EDIT_FEATURES: 'edit-features',
      EDIT_LINES: 'edit-lines'
    }

    this.currentMode = this.modes.EDIT_FEATURES;

    this.urlName = this.props.params.city_url_name;
    this.state = EditorStore.getState(this.urlName);

    this.bindedOnChange = this.onChange.bind(this);
    this.bindedOnMapLoad = this.onMapLoad.bind(this);
    this.bindedOnMapMove = this.onMapMove.bind(this);
    this.bindedOnSelectionChange = this.onSelectionChange.bind(this);
    this.bindedOnFeaturePropsChange = this.onFeaturePropsChange.bind(this);
    this.bindedOnModifiedFeatureClick = this.onModifiedFeatureClick.bind(this);
    this.bindedOnFeatureUpdate = this.onFeatureUpdate.bind(this);
    this.bindedOnFeatureCreate = this.onFeatureCreate.bind(this);
    this.bindedOnFeatureDelete = this.onFeatureDelete.bind(this);
    this.bindedOnDiscardChanges = this.onDiscardChanges.bind(this);
    this.bindedOnSaveChanges = this.onSaveChanges.bind(this);
    this.bindedToggleMode = this.toggleMode.bind(this);
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
    MainStore.unsetPanelFullWidth();
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

  onModifiedFeatureClick(klass, id) {
    EditorStore.setSelectedFeature(this.urlName, klass, id);
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
      if (klass == 'Station') feature.properties.name = '';
      return feature;
    });

    EditorStore.setFeatureCreated(this.urlName, createdFeatures);
  }

  onFeatureDelete(features) {
    EditorStore.setFeatureDeleted(this.urlName, features);
  }

  onDiscardChanges() {
    EditorStore.discardChanges(this.urlName);
  }

  onSaveChanges() {
    EditorStore.saveChanges(this.urlName);
  }

  toggleMode(e) {
    if (e.target.name === this.currentMode) return;

    if (this.currentMode === this.modes.EDIT_LINES) {
      this.currentMode = this.modes.EDIT_FEATURES;
      MainStore.unsetPanelFullWidth();
    } else {
      this.currentMode = this.modes.EDIT_LINES;
      MainStore.setPanelFullWidth();
    }

    this.forceUpdate();
  }

  render() {
    return (
      <div className="o-grid o-panel">
        <Panel display={this.state.main.displayPanel} fullWidth={this.state.main.panelFullWidth}>
          <PanelHeader>
            <div className="panel-header-title">
              <h3 className="c-heading">{this.state.name}</h3>
              <Link className="c-link" to={`/${this.urlName}`}>Volver</Link>
            </div>
            <span className="c-input-group">
              <button name={this.modes.EDIT_FEATURES}
                      className={`c-button c-button--ghost-error ${this.currentMode == this.modes.EDIT_FEATURES ? 'c-button--active' : null}`}
                      onClick={this.bindedToggleMode}>
                Editar elementos
              </button>
              <button name={this.modes.EDIT_LINES}
                      className={`c-button c-button--ghost-error ${this.currentMode == this.modes.EDIT_LINES ? 'c-button--active' : null}`}
                      onClick={this.bindedToggleMode}>
                Editar líneas
              </button>
            </span>
          </PanelHeader>
          <PanelBody>
            { this.currentMode === this.modes.EDIT_FEATURES ?
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
                onSave={this.bindedOnSaveChanges}
              />
            </div>
            :
            <LinesEditor lines={this.state.lines}/>
            }
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
              selectedFeatureById={this.state.selectedFeatureById}
            /> }
        </Map>
      </div>
    )
  }
}

export default Editor
