import React, {Component} from 'react';
import {Panel, PanelHeader, PanelBody} from './panel';
import Map from './map';
import MainStore from '../stores/main-store';
import CityStore from '../stores/city-store';

import Style from '../lib/style';
import LinesMapper from '../lib/lines-mapper';

class City extends Component {
  constructor(props, context) {
    super(props, context);

    this.urlName = this.props.params.city_url_name;

    this.state = {
      main: MainStore.getState(),
      city: CityStore.getState(this.urlName)
    }

    this.bindedOnChange = this.onChange.bind(this);
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
    CityStore.load(this.urlName);
  }

  onChange() {
    this.setState({
      main: MainStore.getState(),
      city: CityStore.getState(this.urlName)
    });
  }

  onMapLoaded(map) {
    const style = new Style(this.state.city.style);
    const lines = this.state.city.lines.map(line => line.url_name); // this has to be filtered with a linesShown array (perhaps the one belonging to LinesMapper);
    const linesMapper = new LinesMapper({map: map, style: style, lines: lines});
    linesMapper.setYear(2004);
  }

  render() {
    return (
        <div className="o-grid o-panel">
          <Panel display={this.state.main.displayPanel}>
            <PanelHeader>
              <h3 className="c-heading">{this.state.city.name}</h3>
            </PanelHeader>
            <PanelBody>
              {"Some body"}
            </PanelBody>
          </Panel>
          <Map
            mapboxAccessToken={this.state.city.config.mapbox_access_token}
            mapboxStyle={this.state.city.config.mapbox_style}
            center={this.state.city.config.coords}
            zoom={this.state.city.config.zoom}
            bearing={this.state.city.config.bearing}
            pitch={this.state.city.config.pitch}
            onLoad={this.onMapLoaded.bind(this)}
          />
        </div>
        );
  }
}

export default City
