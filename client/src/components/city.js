import React, {Component} from 'react';
import {Panel, PanelHeader, PanelBody} from './panel';
import Map from './map';
import MainStore from '../stores/main-store';

class City extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      main: MainStore.getState()
    }

    this.bindedOnChange = this.onChange.bind(this);
  }

  componentWillMount() {
    MainStore.addChangeListener(this.bindedOnChange);
  }

  componentWillUnmount() {
    MainStore.removeChangeListener(this.bindedOnChange);
  }

  onChange() {
    this.setState({
      main: MainStore.getState()
    });
  }

  render() {
    return (
        <div className="o-grid o-panel">
          <Panel display={this.state.main.displayPanel}>
            <PanelHeader>
              <h3 className="c-heading">{this.props.params.city_url_name}</h3>
            </PanelHeader>
            <PanelBody>
              {"Some body"}
            </PanelBody>
          </Panel>
          <Map
            mapboxAccessToken="pk.eyJ1IjoiYnJ1bm9zYWxlcm5vIiwiYSI6IlJxeWpheTAifQ.yoZDrB8Hrn4TvSzcVUFHBA"
            mapboxStyle="mapbox://styles/brunosalerno/cisc8knym001z2xpbkd7zqjoh"
            center={[-58.4122003, -34.6050499]}
            zoom={12}
            bearing={0}
            pitch={0}
          />
        </div>
        );
  }
}

export default City
