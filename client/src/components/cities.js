import React, {Component} from 'react';
import {Link} from 'react-router';
import CitiesStore from '../stores/cities-store'

class CityItem extends Component {
  render() {
    return (
      <div className="c-card u-high">
        <div className="c-card__item c-card__item--info">{this.props.name}</div>
        <div className="c-card__item">
          <p className="c-paragraph"> {`Desde ${this.props.start_year}`} </p>
          <p className="c-paragraph"> {`${this.props.lines_count} líneas y ${this.props.plans_count} planes`} </p>
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

    this.state = CitiesStore.getState();
  }

  componentWillMount() {
    CitiesStore.addChangeListener(this.onChange.bind(this));
  }

  componentWillUnmount() {
    CitiesStore.removeChangeListener(this.onChange.bind(this));
  }

  onChange() {
    this.setState(CitiesStore.getState());
  }

  componentDidMount() {
    CitiesStore.fetchCities();
  }

  render() {
    const cities = this.state.cities.map((city) => {
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
          <h3 className="c-heading c-heading--medium">
            En <strong>Citylines</strong> queremos construir una historia espacial de los sistemas de metro del mundo.
          </h3>

          <h3 className="c-heading c-heading--medium">
            Ciudades
          </h3>

          { cities }

          <h3 className="c-heading c-heading--medium">
            Contacto
          </h3>

          <p className="c-paragragh">
            ¿Tenés comentarios? ¿Querés colaborar? ¿Querés agregar una ciudad?
          </p>

          <p className="c-paragragh">
            Contactanos en <a className="c-link c-link--secondary" href="https://twitter.com/SalernoBr" target="_blank">@SalernoBr</a> o visitá nuestro <a className="c-link c-link--secondary" href="https://github.com/BrunoSalerno/citylines" target="_blank">repositorio de Github</a>.
          </p>
        </div>
      </div>
    );
  }
}

export default Cities
