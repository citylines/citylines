import React, {Component} from 'react';
import Translate from 'react-translate-component';
import CitiesStore from '../stores/cities-store';
import queryString from 'query-string';

class CityData extends Component {
  constructor(props, context) {
    super(props, context);

    this.bindedOnChange = this.onChange.bind(this);

    this.state = {
      city: this.props.city,
      cities: []
    };
  }

  componentWillUnmount() {
    CitiesStore.removeChangeListener(this.bindedOnChange);
  }

  onChange() {
    this.setState(
      {cities: CitiesStore.getState().cities}
    );
  }

  getCityFromUrl() {
    const parsedUrl = queryString.parse(this.props.history.location.search);
    return parsedUrl.city;
  }

  componentDidMount() {
    CitiesStore.addChangeListener(this.bindedOnChange);
    CitiesStore.fetchCitiesWithContributors();
  }

  onCityChange(e) {
    this.setState({ city: e.target.value });
    this.props.history.push(`/data?city=${e.target.value.slice(1)}`);
  }

  currentCity() {
    if (!this.state.city) return;
    return this.state.cities.find(city => city.url == this.state.city);
  }

  currentCityLink(type) {
    const urlName = this.state.city.split('/')[1];

    let url;
    let extension;

    if (type == 'lines_systems_and_modes') {
      extension = 'json';
      url = `/api/data/${urlName}/${type}`;
    } else {
      extension = 'geojson';
      url = `/api/${urlName}/raw_source/${type}`;
    }

    const label = `${urlName}_${type}.${extension}`;

    return {
      url: url,
      label: label
    }
  }

  sendGAEvent(e) {
    const name = e.target.attributes.download.value;

    ga('send', 'event', 'data', 'city_download', name);
  }

  componentDidUpdate(prevProps, prevState) {
    const city = `/${this.getCityFromUrl()}`;
    if (city && prevState.city !== city) {
      this.setState({city})
    }
  }

  render() {
    return (
      <div>
        <p>
        <select className="c-field" value={this.state.city} onChange={this.onCityChange.bind(this)}>
          <Translate component="option" content="data.select_city" />
          {this.state.cities && this.state.cities.map(
            city => <option key={city.url} value={city.url}>{`${city.name}, ${city.country}`}</option>
          )}
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
              ['sections', 'stations', 'lines_systems_and_modes'].map(type =>
                <p key={this.currentCityLink(type).label}>
                  <a
                    className="c-link"
                    href={this.currentCityLink(type).url}
                    download={this.currentCityLink(type).label}
                    onClick={this.sendGAEvent}
                  >
                    {this.currentCityLink(type).label}
                  </a>
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
