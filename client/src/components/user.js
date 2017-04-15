import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Link} from 'react-router';
import Translate from 'react-translate-component';

import UserStore from '../stores/user-store';

class User extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {}

    this.userId = this.props.params.user_id;

    this.bindedOnChange = this.onChange.bind(this);
  }

  componentWillMount() {
    UserStore.addChangeListener(this.bindedOnChange);
  }

  componentWillUnmount() {
    UserStore.removeChangeListener(this.bindedOnChange);
  }

  onChange() {
    this.setState(UserStore.getState());
  }

  componentDidMount() {
    UserStore.load(this.userId);
  }

  km(city) {
    return city.created_features && city.created_features.section_length > 0 ? city.created_features.section_length : null;
  }

  modifiedFeaturesCount(city) {
    let total = 0;
    ['modified_features', 'deleted_features'].map(attr => {
      if (!city[attr]) return;
      total += city[attr].section_count
      total += city[attr].station_count
    });
    return total > 0 ? total : null
  }

  render() {
    console.log(this.state);
    return (
      <div className="o-container o-container--small">
        <div className="u-letter-box--large">
          <h1 className="c-heading">{this.state.name}</h1>
          <h2 className="c-heading">Ciudades editadas</h2>

          <table className="c-table c-table--striped">
            <thead className="c-table__head">
              <tr className="c-table__row c-table__row--heading">
                <th className="c-table__cell">Ciudad</th>
                <th className="c-table__cell">Km creados</th>
                <th className="c-table__cell">Elementos modificados o borrados</th>
              </tr>
            </thead>
            <tbody className="c-table__body">
              {this.state.cities && this.state.cities.map(city =>
                <tr key={city.city.name} className="c-table__row">
                  <td className="c-table__cell"><Link to={`/${city.city.url_name}`} className="c-link">{city.city.name}</Link></td>
                  <td className="c-table__cell">{this.km(city)}</td>
                  <td className="c-table__cell">{this.modifiedFeaturesCount(city)}</td>
                </tr>
              )}
            </tbody>

            <caption className="c-table__caption">Ciudades ordenadas por kms creados y por número de elementos modificados</caption>
          </table>

        </div>
      </div>
    )
  }
}

export default User
