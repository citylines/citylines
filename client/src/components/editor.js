import React from 'react';
import CityBase from './city-base';
import PropTypes from 'prop-types';

import Translate from 'react-translate-component';

import {PanelHeader, PanelBody} from './panel';
import FeatureViewer from './editor/feature-viewer';
import ModifiedFeaturesViewer from './editor/modified-features-viewer';
import LinesEditor from './editor/lines-editor';
import OSMImporter from './editor/osm-importer';
import NoLinesAlert from './editor/no-lines-alert';
import GeneralAlert from './editor/general-alert';
import Discussion from './editor/discussion';

import CityStore from '../stores/city-store';
import EditorStore from '../stores/editor-store';
import MainStore from '../stores/main-store';
import Tags from './tags';

class Editor extends CityBase {
  constructor(props, context) {
    super(props, context);

    this.modes = {
      EDIT_FEATURES: 'edit_features',
      EDIT_LINES: 'edit_lines',
      DISCUSSION: 'discussion'
    }

    this.currentMode = this.modes.EDIT_FEATURES;

    this.urlName = this.props.city_url_name;
    this.state = EditorStore.getState(this.urlName);

    this.bindedOnChange = this.onChange.bind(this);
    this.bindedOnFeaturePropsChange = this.onFeaturePropsChange.bind(this);
    this.bindedOnModifiedFeatureClick = this.onModifiedFeatureClick.bind(this);
    this.bindedOnDiscardChanges = this.onDiscardChanges.bind(this);
    this.bindedOnSaveChanges = this.onSaveChanges.bind(this);
    this.bindedToggleMode = this.toggleMode.bind(this);
    this.bindedOnLineSave = this.onLineSave.bind(this);
    this.bindedOnLineDelete = this.onLineDelete.bind(this);
    this.bindedOnLineCreate = this.onLineCreate.bind(this);
    this.bindedOnSystemSave = this.onSystemSave.bind(this);
    this.bindedOnCreateSystem = this.onCreateSystem.bind(this);
    this.bindedOnSystemDelete = this.onSystemDelete.bind(this);
    this.bindedOnImportFromOSMClick = this.onImportFromOSMClick.bind(this);
  }

  componentWillUnmount() {
    MainStore.unsetPanelFullWidth();
    EditorStore.unload(this.urlName);
    EditorStore.removeChangeListener(this.bindedOnChange);
    CityStore.removeChangeListener(this.bindedOnChange);
  }

  onChange() {
    const cityState = CityStore.getState(this.urlName);

    this.setState({...EditorStore.getState(this.urlName),
                   zoom: cityState.zoom,
                   bounds: cityState.bounds});
  }

  componentDidMount() {
    EditorStore.addChangeListener(this.bindedOnChange);
    CityStore.addChangeListener(this.bindedOnChange);

    MainStore.setLoading();
    EditorStore.load(this.urlName).then(() => {
      MainStore.unsetLoading();
      EditorStore.getNumberOfDiscussionMsgs(this.urlName);
    });
  }

  onSelectionChange(features) {
    EditorStore.changeSelection(this.urlName, features);
  }

  onFeaturePropsChange(feature) {
    EditorStore.setFeaturePropsChange(this.urlName, feature);
  }

  onModifiedFeatureClick(klass, id) {
    EditorStore.setSelectedFeature(this.urlName, klass, id);
  }

  onDiscardChanges() {
    EditorStore.discardChanges(this.urlName);
  }

  onSaveChanges() {
    EditorStore.saveChanges(this.urlName);
  }

  toggleMode(e) {
    const target = e.currentTarget.name;

    if (target === this.currentMode) return;

    this.currentMode = target;
    if (target === this.modes.EDIT_FEATURES) {
      MainStore.unsetPanelFullWidth();
    } else {
      MainStore.setPanelFullWidth();
    }

    this.forceUpdate();
  }

  onLineSave(args) {
    EditorStore.updateLine(this.urlName, args);
  }

  onLineDelete(lineUrlName) {
    EditorStore.deleteLine(this.urlName, lineUrlName);
  }

  onLineCreate(args) {
    EditorStore.createLine(this.urlName, args);
  }

  onSystemSave(args) {
    EditorStore.updateSystem(this.urlName, args);
  }

  onSystemDelete(systemId) {
    EditorStore.deleteSystem(this.urlName, systemId);
  }

  onCreateSystem(args) {
    EditorStore.createSystem(this.urlName, args);
  }

  onImportFromOSMClick(route) {
    const bounds = {
      w: this.state.bounds[0][0],
      s: this.state.bounds[0][1],
      e: this.state.bounds[1][0],
      n: this.state.bounds[1][1]
    }
    EditorStore.importFromOSM(this.urlName, route, bounds);
  }

  onCloseGeneralAlert() {
    EditorStore.closeGeneralAlert(this.urlName);
  }

  discussionMsgsSign(mode) {
    if (mode != this.modes.DISCUSSION || !this.state.numberOfDiscussionMsgs) {
      return '';
    }
    return `(${this.state.numberOfDiscussionMsgs})`;
  }

  render() {
    if (!this.state.systems) return null;

    return (
          <PanelBody>
            <Tags title={'editor.title'} interpolations={{city: this.context.cityName}} />
            <span className="c-input-group edit-mode-buttons">
              {
                Object.values(this.modes).map(mode => <button
                  key={mode}
                  name={mode}
                  className={`c-button c-button--ghost-error u-small ${this.currentMode == mode ? 'c-button--active' : ''}`}
                  onClick={this.bindedToggleMode}>
                    <Translate content={`editor.${mode}`} /> {this.discussionMsgsSign(mode)}
                </button>)
              }
            </span>
            { this.currentMode === this.modes.EDIT_FEATURES &&
              <div className="editor-cards-container">
                { this.state.displayGeneralAlert && <GeneralAlert onClose={this.onCloseGeneralAlert.bind(this)}/> }
                { this.state.lines && this.state.lines.length == 0 ? <NoLinesAlert /> : "" }
                <FeatureViewer
                  lines={this.state.lines}
                  systems={this.state.systems}
                  feature={this.state.selectedFeature}
                  onFeatureChange={this.bindedOnFeaturePropsChange}
                  />
                <ModifiedFeaturesViewer
                  modifiedFeatures={this.state.modifiedFeatures}
                  savingData={this.state.savingData}
                  onClick={this.bindedOnModifiedFeatureClick}
                  onDiscard={this.bindedOnDiscardChanges}
                  onSave={this.bindedOnSaveChanges}
                />
                <OSMImporter
                  zoom={this.state.zoom}
                  onImport={this.bindedOnImportFromOSMClick}
                  savingData={this.state.savingData}
                />
              </div> }
            { this.currentMode === this.modes.EDIT_LINES &&
                <LinesEditor lines={this.state.lines}
                  systems={this.state.systems}
                  transportModes={this.state.transportModes}
                  onSave={this.bindedOnLineSave}
                  onDelete={this.bindedOnLineDelete}
                  onCreate={this.bindedOnLineCreate}
                  onSystemSave={this.bindedOnSystemSave}
                  onCreateSystem={this.bindedOnCreateSystem}
                  onSystemDelete={this.bindedOnSystemDelete}
              /> }
            { this.currentMode === this.modes.DISCUSSION &&
                <Discussion urlName={this.urlName} /> }
          </PanelBody>
    )
  }
}

Editor.contextTypes = {
  cityName: PropTypes.string
}

export default Editor
