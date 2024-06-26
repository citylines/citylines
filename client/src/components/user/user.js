import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import Translate from 'react-translate-component';
import Tags from '../tags';
import {formatNumber} from '../../lib/number-tools';

import MainStore from '../../stores/main-store';
import UserStore from '../../stores/user-store';

import Avatar from './avatar';
import UserConfig from './user-config';

class User extends Component {
  constructor(props, context) {
    super(props, context);

    this.userId = this.props.match.params.user_id;

    this.boundOnChange = this.onChange.bind(this);
  }

  componentWillUnmount() {
    UserStore.removeChangeListener(this.boundOnChange);
    MainStore.removeChangeListener(this.boundOnChange);
  }

  onChange() {
    this.setState(UserStore.getState());
  }

  componentDidMount() {
    UserStore.addChangeListener(this.boundOnChange);
    MainStore.addChangeListener(this.boundOnChange);
    MainStore.setLoading();
    UserStore.load(this.userId).then(() => MainStore.unsetLoading());
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.user_id == this.props.match.params.user_id) return;
    MainStore.setLoading();
    this.userId = nextProps.match.params.user_id;
    UserStore.load(this.userId).then(() => MainStore.unsetLoading());
  }

  km(city) {
    return city.created_features && city.created_features.section_length > 0 ? formatNumber(city.created_features.section_length) : null;
  }

  modifiedFeaturesCount(city) {
    let total = 0;
    ['modified_features', 'deleted_features'].map(attr => {
      if (!city[attr]) return;
      total += city[attr].section_count
      total += city[attr].station_count
    });
    return total > 0 ? formatNumber(total) : null;
  }

  countryAndStateNames(city) {
    let names = ''

    if (city.city.country_state) names += `, ${city.city.country_state}`;
    names += `, ${city.city.country}`;

    return names;
  }

  myProfile() {
    return parseInt(this.userId) === this.state.loggedUserId;
  }

  anyCity() {
    return this.state.cities && this.state.cities.length > 0;
  }

  stationsCreated(city) {
    const created = city.created_features && city.created_features.station_count;
    return created ? formatNumber(created) : null;
  }

  handleNicknameChange(name) {
    UserStore.updateUserNickname(this.userId, name);
  }

  handleSetGravatar() {
    UserStore.setGravatar(this.userId);
  }

  handleRemoveGravatar() {
    UserStore.removeGravatar(this.userId);
  }

  errorMsg() {
      return (
        <div className="o-container o-container--medium u-pillar-box--medium">
          <div className="u-letter-box--large">
            <h1 className="c-heading"><Translate content="user.error"/></h1>
          </div>
        </div>
      )
  }

  render() {
    if (!this.state || Object.entries(this.state).length === 0 || this.state.loading) return null;

    if (this.state.error) {
      return this.errorMsg();
    }

    return (
      <div className="o-container o-container--medium u-pillar-box--medium">
        { this.state.name && <Tags
          title="user.cities_of_user"
          interpolations={{name: this.state.name}}
        /> }
        <div className="u-letter-box--large">
          <h1 className="c-heading">
            <Avatar initials={this.state.initials} img={this.state.img}/>
            <UserConfig
              name={this.state.name}
              editable={this.myProfile()}
              onNicknameChange={this.handleNicknameChange.bind(this)}
              img={this.state.img}
              onRemoveGravatar={this.handleRemoveGravatar.bind(this)}
              onSetGravatar={this.handleSetGravatar.bind(this)}
            />
          </h1>

          { this.anyCity() &&
          <h2 className="c-heading">{ this.myProfile() ? <Translate content="user.my_cities" /> : <Translate content="user.cities_of_user" with={{name: this.state.name}} />}</h2>
          }

          { this.anyCity() &&
          <table className="c-table c-table--striped user_contributions">
            <thead className="c-table__head">
              <tr className="c-table__row c-table__row--heading">
                <Translate component="th" className="c-table__cell" content="user.table.city" />
                <Translate component="th" className="c-table__cell narrow" content="user.table.created_km" />
                <Translate component="th" className="c-table__cell narrow" content="user.table.created_stations" />
                <Translate component="th" className="c-table__cell narrow" content="user.table.modified_or_deleted_elements" />
              </tr>
            </thead>
            <tbody className="c-table__body">
              {this.state.cities.map(city =>
                <tr key={city.city.name} className="c-table__row">
                  <td className="c-table__cell"><Link to={`/${city.city.url_name}`} className="c-link">{city.city.name}</Link>{this.countryAndStateNames(city)}</td>
                  <td className="c-table__cell narrow">{this.km(city)}</td>
                  <td className="c-table__cell narrow">{this.stationsCreated(city)}</td>
                  <td className="c-table__cell narrow">{this.modifiedFeaturesCount(city)}</td>
                </tr>
              )}
            </tbody>
            <Translate component="caption" className="c-table__caption" content="user.table.caption" />
          </table> }

          { !this.anyCity() &&
            <h2 className="c-heading">{this.myProfile() ?
              <span><Translate content="user.you_never_contributed" /> <Translate component={Link} to="/" className="c-link" content="user.see_cities" /></span>
                :
              <Translate content="user.user_never_contributed" with={{name: this.state.name}} />}</h2>
          }

        </div>
      </div>
    )
  }
}

export default User
