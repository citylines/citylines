import React, {Component} from 'react';
import {Panel, PanelHeader, PanelBody} from './panel';
import Map from './map';
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
    CityStore.load(this.urlName, this.props.location.query);
  }

  onChange() {
    this.setState({
      main: MainStore.getState(),
      city: CityStore.getState(this.urlName)
    });
  }

  onMapLoaded(map) {
    CityStore.setMap(this.urlName, map);
  }

  render() {
    return (
        <div className="o-grid o-panel">
          <Panel display={this.state.main.displayPanel}>
            <PanelHeader>
              <h3 className="c-heading">{this.state.city.name}</h3>
              { (this.state.city.currentYear) ?
              <Year
                urlName={this.urlName}
                min={(this.state.city.config.years || {}).start}
                max={(this.state.city.config.years || {}).end}
                year={this.state.city.currentYear}
                playing={this.state.city.playing}
              />
                : null }
            </PanelHeader>
            <PanelBody>
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

class Year extends Component {
  toggleAnimation() {
    CityStore.toggleAnimation(this.props.urlName, (year) => {
      this.refs.slider.value = year;
      this.refs.currentYear.value = year;
    });
  }

  render() {
    const icon = this.props.playing ? 'fa-pause' : 'fa-play';

    return (
    <div>
      <div className="c-input-group c-input-group--right">
        <div className="o-field">
          <input ref="currentYear" className="c-field" type="number" value={this.props.year}/>
        </div>
        <button ref="action" className="c-button c-button--ghost" onClick={this.toggleAnimation.bind(this)}> <span className={`fa ${icon}`}></span> </button>
      </div>
      <input ref="slider"
        type="range"
        className="c-range"
        min={this.props.min}
        max={this.props.max}
        value={this.props.year} />
     </div>
     )
  }
}

export default City
