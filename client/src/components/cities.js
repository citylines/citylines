import React, {Component} from 'react';
import {Link} from 'react-router';
import Diacritics from 'diacritics';
import CitiesStore from '../stores/cities-store';
import MainStore from '../stores/main-store';
import Translate from 'react-translate-component';
import assets from '../lib/assets-provider';
import {formatNumber} from '../lib/number-tools';

class CityItem extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {showAll: false}
  }

  toggleShow() {
    this.setState({showAll: !this.state.showAll});
  }

  bigSystemsDiv() {
    return this.state.systemsDivHeight && this.state.systemsDivHeight > 80;
  }

  showAllClass() {
    return this.state.showAll ? 'show-more' : 'show-less';
  }

  componentDidMount() {
    this.setState({systemsDivHeight: this.systemsDiv.clientHeight});
  }

  render() {
    return (
      <div className="c-card">
        <header className="c-card__header">
          <h3 className="c-heading">
            <Link className="c-link c-link--primary" to={this.props.url}>{this.props.name}</Link>, {this.props.state ? `${this.props.state},` : ''} {this.props.country}
            <div className="city-systems-container">
              <div
                ref={ (el) => this.systemsDiv = el}
                className={`c-heading__sub city-systems ${this.showAllClass()}`}>
                  {this.props.systems.join(', ')}
              </div>
              {this.bigSystemsDiv() ?
                <div
                  className={`c-link city-systems-toggle ${this.showAllClass()}`}
                  onClick={this.toggleShow.bind(this)}>
                    {this.state.showAll ? '-' : '+'}
                </div> : null
              }
            </div>
          </h3>
        </header>
        <div className="c-card__body">
          { this.props.length ? <span className="c-badge c-badge--success">{`${formatNumber(this.props.length)} km`}</span> : ''}
          { this.props.contributors_count ?
            <Translate
              component="span"
              className="c-badge"
              style={{marginLeft: 5}}
              content={`cities.contributors.${this.props.contributors_count == 1 ? 'one' : 'other'}`}
              with={{contributors: this.props.contributors_count}} />
              : ''}
        </div>
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
    CitiesStore.fetchContributors();
    CitiesStore.fetchTopSystems();
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
    return city.length;
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
          length={city.length}
          systems={city.systems}
          contributors_count={city.contributors_count}
          url={city.url}
        />
      )
    });

    return (
      <div className="o-grid__cell o-grid__cell--width-100">
        <div className="o-container o-container--medium">
          <div className="u-letter-box--super">
            <div className="landing-image"><img src={assets.path('img/citylines-main.svg')}/></div>
            <Translate component="h2" content="cities.title" className="c-heading c-heading--medium landing-title"/>
          </div>
        </div>

        <div className="o-container o-container--small cities-search-container">
          <div className="u-letter-box--large">
            <div className="o-field o-field--icon-right" style={{padding: '5px 1px'}}>
              <Translate component="input" className="c-field" type="text" attributes={{placeholder: "cities.search"}} onChange={this.onInputChange} />
              <i className="fa fa-fw fa-search c-icon"></i>
            </div>

            <div className="cities-container">
              <div>
              { cities }
              </div>
            </div>
            <p className="request-city">
              <small>
                <Translate content="cities.request_city.cant_find"/>
                {' '}
                <Translate component="a"
                           target="_blank"
                           className="c-link c-link--primary"
                           href={"https://goo.gl/forms/9O5Y1C4r4Tow6UhE2"}
                           content="cities.request_city.request_it" />
              </small>
            </p>
          </div>
        </div>

        <div className="o-container o-container--small">
          <div className="u-letter-box--large" style={{textAlign: 'center'}}>
            <Translate component="h2" className="c-heading" content="cities.top_systems" />
            <div className="top-systems-list">
              <ol className="c-list c-list--ordered">
                {this.state.topSystems.map(system =>
                    <li key={`tsystem-${system.url}`} className="c-list__item"><Link to={system.url} className="c-link">{system.name} - {system.city_name}</Link> {formatNumber(system.length)} km</li>
                  )}
              </ol>
            </div>
          </div>
        </div>

        <div className="o-container o-container--small">
          <div className="u-letter-box--large" style={{textAlign: 'center'}}>
            <Translate component="h2" className="c-heading" content="cities.contributors.list.title" />

            <div className="contributors-list">
              <Translate component="h3" className="c-heading" content="cities.contributors.list.total" />
              <ol className="c-list c-list--ordered">
                {this.state.topContributors.map(contributor =>
                    <li key={`tcontrib-${contributor.user_id}`} className="c-list__item"><Link to={`/user/${contributor.user_id}`} className="c-link">{contributor.name}</Link> {formatNumber(contributor.sum)} km</li>
                  )}
              </ol>
            </div>

            <div className="contributors-list">
              <Translate component="h3" className="c-heading" content="cities.contributors.list.last_month" />
              <ol className="c-list c-list--ordered">
                {this.state.monthTopContributors.map(contributor =>
                    <li key={`mcontrib-${contributor.user_id}`} className="c-list__item"><Link to={`/user/${contributor.user_id}`} className="c-link">{contributor.name}</Link> {formatNumber(contributor.sum)} km</li>
                  )}
              </ol>
            </div>
          </div>
        </div>

        <div className="o-container o-container--medium" style={{textAlign: 'center', marginTop:30}}>
          <div className="u-letter-box--super">
            <p className="c-paragragh">
              <span className="contact-icon"><a target="_blank" href="https://twitter.com/citylines_co"><span className="fab fa-twitter" /></a></span>
              <span className="contact-icon"><a target="_blank" href="mailto:info@citylines.co"><span className="fa fa-envelope"/></a></span>
              <span className="contact-icon"><a target="_blank" href="https://github.com/BrunoSalerno/citylines"><span className="fab fa-github" /></a></span>
              <span className="contact-icon"><a target="_blank" href="https://www.kaggle.com/citylines/city-lines"><span className="fab fa-kaggle" /></a></span>
            </p>
            <p><Translate content="cities.support" /> <a className="c-link" target="_blank" href="https://gitter.im/citylines/Lobby?utm_source=share-link&utm_medium=link&utm_campaign=share-link"><Translate content="cities.support_link" /></a></p>
          </div>
        </div>
      </div>
    );
  }
}

export default Cities
