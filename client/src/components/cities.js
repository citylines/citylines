import React, {Component} from 'react';
import {Link} from 'react-router';
import Diacritics from 'diacritics';
import CitiesStore from '../stores/cities-store'
import Translate from 'react-translate-component';

class CityItem extends Component {
  render() {
    return (
      <div className="c-card">
      <header className="c-card__header">
          <h3 className="c-heading">
          <Link className="c-link c-link--primary" to={this.props.url}>{this.props.name}</Link>, {this.props.state ? `${this.props.state},` : ''} {this.props.country}
          <div className="c-heading__sub"><Translate content="cities.city_item" with={{lines: this.props.lines_count, contributors: this.props.contributors_count}} /></div>
          </h3>
          </header>
          <div className="c-card__body"></div>
      </div>
    )
  }
}

class Cities extends Component {
  constructor(props, context) {
    super(props, context);

    this.bindedSortCities = this.sortCities.bind(this);
    this.bindedOnChange = this.onChange.bind(this);
    this.state = CitiesStore.getState();
  }

  componentWillMount() {
    CitiesStore.addChangeListener(this.bindedOnChange);
  }

  componentWillUnmount() {
    CitiesStore.removeChangeListener(this.bindedOnChange);
  }

  onChange() {
    this.setState(CitiesStore.getState());
  }

  componentDidMount() {
    CitiesStore.fetchCities();
  }

  onInputChange(e) {
    CitiesStore.setValue(e.target.value)
  }

  filterCities() {
    if (this.state.value == '') {
      return this.state.cities;
    }

    const regex = new RegExp(Diacritics.remove(this.state.value), 'i');
    return this.state.cities.filter((city) =>
        regex.test(Diacritics.remove(city.name)) ||
        (city.state && regex.test(Diacritics.remove(city.state))) ||
        regex.test(Diacritics.remove(city.country))
        );
  }

  cityIndex(city) {
    return (city.contributors_count + city.lines_count) / 2
  }

  sortCities(a,b) {
    return this.cityIndex(a) > this.cityIndex(b) ? -1 : 1
  }

  render() {
    const cities = this.filterCities().sort(this.bindedSortCities).map((city) => {
      return (
        <CityItem
          key={`${city.name}-${city.state}-${city.country}`}
          name={city.name}
          state={city.state}
          country={city.country}
          lines_count={city.lines_count}
          contributors_count={city.contributors_count}
          url={city.url}
        />
      )
    });

    return (
      <div className="o-grid__cell o-grid__cell--width-100">
        <div className="o-container o-container--small">

          <div className="u-letter-box--large">
            <h1 className="c-heading c-heading--medium">
              <Translate content="cities.title" unsafe/>
            </h1>
          </div>

          <div className="u-letter-box--large">
            <div className="o-field o-field--icon-right" style={{padding:"5px"}}>
              <Translate component="input" className="c-field" type="text" attributes={{placeholder: "cities.search"}} onChange={this.onInputChange} />
              <i className="fa fa-fw fa-search c-icon"></i>
            </div>

            <div className="cities-container">
              <div>
              { cities }
              </div>
            </div>
          </div>

          <div className="u-letter-box--large">
            <h3 className="c-heading c-heading--medium">
              <Translate content="cities.contact" />
            </h3>
            <p className="c-paragragh">
              <Translate content="cities.contact_link" unsafe/>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default Cities
