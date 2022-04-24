import React, {Component} from 'react';
import MapboxDraw from '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw';
import PropTypes from 'prop-types';

import CutLineMode from 'mapbox-gl-draw-cut-line-mode';
import CutLineControl from './cut-line-control';

const drawThemeDefault = require('@mapbox/mapbox-gl-draw/src/lib/theme');
import drawThemeOSM from './draw-theme-osm';


class Draw extends Component {
  constructor(props, context) {
    super(props, context);

    this.bindedOnMapReady = this.onMapReady.bind(this);
    this.bindedOnSelectionChange = this.onSelectionChange.bind(this);
    this.bindedOnUpdate = this.onUpdate.bind(this);
    this.bindedOnCreate = this.onCreate.bind(this);
    this.bindedOnDelete = this.onDelete.bind(this);
    this.bindedOnModeChange = this.onModeChange.bind(this);
  }

  componentDidMount() {
    this.map = this.context.map;
    if (this.map.loaded()) {
      this.load();
    } else {
      this.map.on('render', this.bindedOnMapReady);
    }
  }

  componentWillUnmount() {
    if (!this.map.removed) {
      this.map.off('draw.selectionchange', this.bindedOnSelectionChange);
      this.map.off('draw.update', this.bindedOnUpdate);
      this.map.off('draw.create', this.bindedOnCreate);
      this.map.off('draw.delete', this.bindedOnDelete);
      this.map.off('draw.modechange', this.bindedOnModeChange);

      this.draw.deleteAll();
      this.map.removeControl(this.cutLineControl);
      this.map.removeControl(this.draw);
    }
    delete this.draw;
  }

  onMapReady() {
    if (!this.map.loaded()) return;
    this.map.off('render', this.bindedOnMapReady)
    this.load();
  }

  load() {
    const options = {
      boxSelect: false,
      displayControlsDefault: false,
      controls: {
        point: true,
        line_string: true,
        trash: true
      },
      userProperties: true,
      styles: [...drawThemeDefault, ...drawThemeOSM]
    }

    // we hardcode the CutLineMode here so we encapsulate the code in
    // this module
    options.modes = {...MapboxDraw.modes, ...{cut_line: CutLineMode}};

    this.draw = new MapboxDraw(options);
    this.map.addControl(this.draw);

    this.cutLineControl = new CutLineControl();
    this.map.addControl(this.cutLineControl);

    this.map.on('draw.selectionchange', this.bindedOnSelectionChange);
    this.map.on('draw.update', this.bindedOnUpdate);
    this.map.on('draw.create', this.bindedOnCreate);
    this.map.on('draw.delete', this.bindedOnDelete);
    this.map.on('draw.modechange', this.bindedOnModeChange);

    this.draw.add(this.props.features);
  }

  onSelectionChange(selection) {
    if (typeof this.props.onSelectionChange === 'function') {
      this.props.onSelectionChange(selection.features);
    }
  }

  onUpdate(update) {
    if (typeof this.props.onFeatureUpdate === 'function') {
      this.props.onFeatureUpdate(update.features);
    }
  }

  onCreate(create) {
    if (typeof this.props.onFeatureCreate === 'function') {
      this.props.onFeatureCreate(create.features);
    }
  }

  onDelete(remove) {
    if (typeof this.props.onFeatureDelete === 'function') {
      this.props.onFeatureDelete(remove.features);
    }
  }

  onModeChange(modeChange) {
    if (typeof this.props.onModeChange === 'function') {
      this.props.onModeChange(modeChange.mode);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.features != this.props.features) {
      this.draw.set(nextProps.features);
    }

    if (nextProps.selectedFeatureById && nextProps.selectedFeatureById != this.props.selectedFeatureById) {
      this.draw.changeMode('simple_select', {featureIds: [nextProps.selectedFeatureById]});
    }

    if (nextProps.currentMode && nextProps.currentMode != this.props.currentMode) {
      if (this.draw.getMode() != nextProps.currentMode) {
        this.draw.changeMode(nextProps.currentMode);
      }
    }
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return null;
  }
}

Draw.contextTypes = {
  map: PropTypes.object
}

export default Draw
