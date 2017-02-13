import React, {Component} from 'react';
import {Link} from 'react-router';
import CitiesStore from '../stores/cities-store'

class CityItem extends Component {
  render() {
    return (
      <div className="c-card u-high">
      <header className="c-card__header">
          <h3 className="c-heading">
          {this.props.name}
          <div className="c-heading__sub">{`${this.props.lines_count} líneas`}</div>
          </h3>
          </header>
        <div className="c-card__body">
          <p className="c-paragraph">
            <Link className="c-link c-link--primary" to={this.props.url}>Visitar ciudad</Link>
          </p>
        </div>
      </div>
    )
  }
}

class Cities extends Component {
  constructor(props, context) {
    super(props, context);

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

    const regex = new RegExp(this.state.value, 'i');
    return this.state.cities.filter((city) => regex.test(city.name));
  }

  sortCities(a,b) {
    return a.name > b.name ? 1 : -1
  }

  render() {
    const cities = this.filterCities().sort(this.sortCities).map((city) => {
      return (
        <CityItem
          key={city.name}
          name={city.name}
          start_year={city.start_year}
          lines_count={city.lines_count}
          plans_count={city.plans_count}
          url={city.url}
        />
      )
    });

    return (
      <div className="o-grid__cell o-grid__cell--width-100">
        <div className="o-container o-container--small">

          <div className="u-letter-box--large">
            <h1 className="c-heading c-heading--medium">
              <b>Citylines.co</b>: ¡Explorá los sistemas de transporte de las ciudades del mundo!
            </h1>
          </div>

          <div className="u-letter-box--large">
            <div className="o-field o-field--icon-right" style={{padding:"5px"}}>
              <input className="c-field" type="text" placeholder="Buscá tu ciudad" onChange={this.onInputChange}></input>
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
              Contacto
            </h3>
            <p className="c-paragragh">
              Entrá a nuestro <a className="c-link" target="_blank" href="https://groups.google.com/forum/#!forum/citylinesco">Grupo de Google</a>, contactame en <a className="c-link c-link--secondary" href="https://twitter.com/SalernoBr" target="_blank">@SalernoBr</a>, o visitá nuestro <a className="c-link c-link--secondary" href="https://github.com/BrunoSalerno/citylines" target="_blank">repositorio de Github</a>.
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default Cities
