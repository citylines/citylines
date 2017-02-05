import React, {PureComponent} from 'react';
import {browserHistory} from 'react-router';
import {Link} from 'react-router';

import {PanelHeader, PanelBody} from './panel';
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
    this.bindedOnFeaturePropsChange = this.onFeaturePropsChange.bind(this);
    this.bindedOnModifiedFeatureClick = this.onModifiedFeatureClick.bind(this);
    this.bindedOnDiscardChanges = this.onDiscardChanges.bind(this);
    this.bindedOnSaveChanges = this.onSaveChanges.bind(this);
    this.bindedToggleMode = this.toggleMode.bind(this);
    this.bindedOnLineSave = this.onLineSave.bind(this);
    this.bindedOnLineDelete = this.onLineDelete.bind(this);
    this.bindedOnLineCreate = this.onLineCreate.bind(this);
  }

  componentWillMount() {
    EditorStore.addChangeListener(this.bindedOnChange);
  }

  componentWillUnmount() {
    MainStore.unsetPanelFullWidth();
    EditorStore.unload(this.urlName);
    EditorStore.removeChangeListener(this.bindedOnChange);
  }

  onChange() {
    this.setState(EditorStore.getState(this.urlName));
  }

  componentDidMount() {
    EditorStore.load(this.urlName);
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

  onSelectionChange(features) {
    EditorStore.changeSelection(this.urlName, features);
  }

  onFeaturePropsChange(feature, modifiedKey, newValue) {
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

  onLineSave(args) {
    EditorStore.updateLine(this.urlName, args);
  }

  onLineDelete(lineUrlName) {
    EditorStore.deleteLine(this.urlName, lineUrlName);
  }

  onLineCreate(args) {
    EditorStore.createLine(this.urlName, args);
  }

  render() {
    return (
      <div style={{height:'100%'}}>
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
            <LinesEditor lines={this.state.lines}
                         onSave={this.bindedOnLineSave}
                         onDelete={this.bindedOnLineDelete}
                         onCreate={this.bindedOnLineCreate}/>
            }
          </PanelBody>
      </div>
    )
  }
}

export default Editor
