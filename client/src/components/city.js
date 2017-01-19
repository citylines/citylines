import React, {Component} from 'react';
import {browserHistory} from 'react-router';

import {Panel, PanelHeader, PanelBody} from './panel';
import LinesTree from './city/lines-tree';
import {Map, Source, Layer} from './map';
import Year from './city/year';

import MainStore from '../stores/main-store';
import CityStore from '../stores/city-store';

class City extends Component {
  constructor(props, context) {
    super(props, context);

    this.urlName = this.props.params.city_url_name;

    this.state = {
      main: MainStore.getState(),
      city: CityStore.getState(this.urlName)
    }

    this.bindedOnChange = this.onChange.bind(this);
    this.bindedOnYearChange = this.onYearChange.bind(this);
    this.bindedOnLineToggle = this.onLineToggle.bind(this);
    this.bindedOnLinesShownChange = this.onLinesShownChange.bind(this);
    this.bindedOnMouseMove = this.onMouseMove.bind(this);
    this.bindedOnMapMove = this.onMapMove.bind(this);
    this.bindedOnMapLoad = this.onMapLoad.bind(this);
  }

  componentWillMount() {
    MainStore.addChangeListener(this.bindedOnChange);
    CityStore.addChangeListener(this.bindedOnChange);
  }

  componentWillUnmount() {
    MainStore.removeChangeListener(this.bindedOnChange);
    CityStore.removeChangeListener(this.bindedOnChange);
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
    this.setState({
      main: MainStore.getState(),
      city: CityStore.getState(this.urlName)
    });
  }

  onMapLoad(map) {
    CityStore.loadStore(this.urlName);
  }

  onMapMove(geo) {
    if (this.state.city.playing) return;
    const newGeo = `${geo.lat},${geo.lon},${geo.zoom},${geo.bearing},${geo.pitch}`;
    this.updateParams({geo: newGeo});
  }

  onYearChange() {
    if (this.state.city.playing) return;
    const newYear = this.state.city.currentYear;
    this.updateParams({year: newYear});
  }

  onLineToggle(lineUrlName) {
    CityStore.toggleLine(this.urlName, lineUrlName);
  }

  onLinesShownChange() {
    const linesShown = this.state.city.linesShown.join(',');
    this.updateParams({lines: linesShown});
  }

  onMouseMove(point, features){
    CityStore.hover(this.urlName, features);
  }

  render() {
    return (
        <div className="o-grid o-panel">
          <Panel display={this.state.main.displayPanel}>
            <PanelHeader>
              <div className="panel-header-title">
                <h3 className="c-heading">{this.state.city.name}</h3>
              </div>
              <Year
                urlName={this.urlName}
                min={(this.state.city.config.years || {}).start}
                max={(this.state.city.config.years || {}).end}
                year={this.state.city.currentYear}
                playing={this.state.city.playing}
                onYearChange={this.bindedOnYearChange}
              />
            </PanelHeader>
            <PanelBody>
              <ul style={{marginLeft: "1em"}} className="c-tree">
                <LinesTree
                  name={'Líneas'}
                  defaultExpanded={true}
                  lines={this.state.city.lines}
                  linesShown={this.state.city.linesShown}
                  onLineToggle={this.bindedOnLineToggle}
                  onLinesShownChange={this.bindedOnLinesShownChange}
                />
              </ul>
            </PanelBody>
          </Panel>
          <Map
            mapboxAccessToken={this.state.city.config.mapbox_access_token}
            mapboxStyle={this.state.city.config.mapbox_style}
            center={this.state.city.config.coords}
            zoom={this.state.city.config.zoom}
            bearing={this.state.city.config.bearing}
            pitch={this.state.city.config.pitch}
            onLoad={this.bindedOnMapLoad}
            onMove={this.bindedOnMapMove}
            onMouseMove={this.bindedOnMouseMove}
            disableMouseEvents={this.state.city.playing} >
            { this.state.city.sources.map((source) => { return (
                <Source
                  key={source.name}
                  name={source.name}
                  data={source.data}
                />
              )
            }) }
            { this.state.city.layers.map((layer) => { return (
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
          </Map>
        </div>
        );
  }
}

export default City
