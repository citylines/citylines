import React, {Component} from 'react';
import Translate from 'react-translate-component';
import CitiesStore from '../stores/cities-store';

class CityData extends Component {
  constructor(props, context) {
    super(props, context);

    this.bindedOnChange = this.onChange.bind(this);

    this.state = {
      city: this.props.city,
      cities: []
    };
  }

  componentWillMount() {
    CitiesStore.addChangeListener(this.bindedOnChange);
  }

  componentWillUnmount() {
    CitiesStore.removeChangeListener(this.bindedOnChange);
  }

  onChange() {
    this.setState(
      {cities: CitiesStore.getState().cities}
    );
  }

  componentDidMount() {
    CitiesStore.fetchCities();
  }

  onCityChange(e) {
    this.setState({city: e.target.value});
  }

  currentCity() {
    if (!this.state.city) return;
    return this.state.cities.find(city => city.url == this.state.city);
  }

  currentCityLink(type) {
    const urlName = this.state.city.substr(1);
    const url = `/api/${urlName}/raw_source/${type}`;
    const label = `${urlName}_${type}.geojson`;

    return {
      url: url,
      label: label
    }
  }

  render() {
    console.log(this.state)
    return (
      <div>
        <p>
        <select className="c-field" value={this.state.city} onChange={this.onCityChange.bind(this)}>
          <option>Seleccionar ciudad</option>
          {this.state.cities && this.state.cities
            .filter(city => city.length > 0)
            .sort((city1, city2) => city2.length - city1.length)
            .map(city => <option key={city.url} value={city.url}>{`${city.name}, ${city.country}`}</option>)}
        </select>
        </p>

        { this.currentCity() && this.currentCity().systems.length > 0 &&
          <p>
            {this.currentCity().systems.join(', ')}
          </p>
        }

        { this.currentCity() &&
          <div>
            {
              ['sections', 'stations' ].map(type =>
                <p>
                  <a className="c-link" href={this.currentCityLink(type).url} download={this.currentCityLink(type).label}>{this.currentCityLink(type).label}</a>
                </p>
              )
            }
          </div>
        }
      </div>
    )
  }
}

export default CityData
