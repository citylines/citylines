import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import Diacritics from 'diacritics';
import CitiesStore from '../stores/cities-store';
import MainStore from '../stores/main-store';
import Translate from 'react-translate-component';
import assets from '../lib/assets-provider';
import {formatNumber} from '../lib/number-tools';
import Avatar from './user/avatar';

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

  isCity() {
    return !this.props.city_name;
  }

  componentDidMount() {
    if (this.isCity()) {
      this.setState({systemsDivHeight: this.systemsDiv.clientHeight});
    }
  }

  render() {
    return (
      <div className="c-card" style={!this.isCity() ? {backgroundColor:'rgba(0,0,0,0.04)'} : null}>
        <header className="c-card__header">
          <h3 className="c-heading">
            <Link className="c-link c-link--primary" to={this.props.url}>{this.props.name}</Link>, {!this.isCity() ? `${this.props.city_name},` : ''} {this.props.state ? `${this.props.state},` : ''} {this.props.country}
            {this.isCity() &&
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
                    <span className={`fas ${this.state.showAll ? 'fa-angle-up' : 'fa-angle-down'}`}/>
                </div> : null
              }
            </div> }
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

const FetchMoreLink = (props) => {
  return <div className="c-card">
      <div className="c-card__body" style={{textAlign:'center'}}>
        <a className="c-link c-link--primary" onClick={props.onClick}>Cargar mas</a>
      </div>
    </div>;
}

class Cities extends Component {
  constructor(props, context) {
    super(props, context);

    this.bindedOnChange = this.onChange.bind(this);
    this.state = CitiesStore.getState();
    this.searchTimeout = null;
  }

  componentWillUnmount() {
    CitiesStore.removeChangeListener(this.bindedOnChange);
  }

  onChange() {
    this.setState(CitiesStore.getState());
  }

  componentDidMount() {
    CitiesStore.addChangeListener(this.bindedOnChange);

    CitiesStore.fetchCities();
    CitiesStore.fetchContributors();
    CitiesStore.fetchTopSystems();
  }

  onInputChange(e) {
    const searchTerm = e.target.value.trim();

    if (searchTerm != this.state.searchTerm &&
      (!searchTerm || searchTerm.length > 2)) {
      this.resetSearchTimeout();
    }
    CitiesStore.setSearchTerm(searchTerm);
  }

  resetSearchTimeout() {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout)
    }
    this.searchTimeout = setTimeout(() => {
      CitiesStore.fetchCities();
    }, 750);
  }

  fetchMore(e) {
    e.preventDefault();
    CitiesStore.fetchMoreCities();
  }

  render() {
    let cities = this.state.cities.map(item => <CityItem
          key={`${item.name}-${item.state}-${item.country}`}
          name={item.name}
          city_name={item.city_name}
          state={item.state}
          country={item.country}
          length={item.length}
          systems={item.systems}
          contributors_count={item.contributors_count}
          url={item.url}
        />
      );

    if (this.state.thereAreMoreResults) {
      cities = [...cities, <FetchMoreLink key='fetch-more' onClick={this.fetchMore.bind(this)} />];
    }

    return (
      <div className="o-grid__cell o-grid__cell--width-100">
        <div className="o-container o-container--medium">
          <div className="u-letter-box--super">
            <div className="landing-image"><img src={assets.path('img/citylines-main.svg')}/></div>
            <Translate component="h2" content="cities.title" className="c-heading c-heading--medium landing-title" unsafe/>
          </div>
        </div>

        <div className="o-container o-container--small cities-search-container">
          <div className="u-letter-box--large">
            <div className="o-field o-field--icon-right" style={{padding: '5px 1px'}}>
              <Translate component="input" className="c-field" type="text" attributes={{placeholder: "cities.search"}} onChange={this.onInputChange.bind(this)} />
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
                           content="cities.request_city.request_it" />.
              </small>
            </p>
          </div>
        </div>

        <div className="o-container o-container--small">
          <div className="u-letter-box--large" style={{textAlign: 'center'}}>
            <Translate component="h2" className="c-heading" content="cities.top_systems" />
            <div className="top-systems-list">
              <ol className="c-list">
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
              <ol className="c-list">
                {this.state.topContributors.map(contributor =>
                    <li key={`tcontrib-${contributor.user_id}`} className="c-list__item">
                      <Link to={`/user/${contributor.user_id}`} className="c-link"> <Avatar size="inline-list" initials={contributor.initials} img={contributor.img}/> {contributor.name}</Link> {formatNumber(contributor.sum)} km
                    </li>
                  )}
              </ol>
            </div>

            <div className="contributors-list">
              <Translate component="h3" className="c-heading" content="cities.contributors.list.last_month" />
              <ol className="c-list">
                {this.state.monthTopContributors.map(contributor =>
                    <li key={`mcontrib-${contributor.user_id}`} className="c-list__item">
                      <Link to={`/user/${contributor.user_id}`} className="c-link"> <Avatar size="inline-list" initials={contributor.initials} img={contributor.img}/> {contributor.name}</Link> {formatNumber(contributor.sum)} km
                    </li>
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
              <span className="contact-icon"><a target="_blank" href="https://github.com/citylines/citylines"><span className="fab fa-github" /></a></span>
              <span className="contact-icon"><a target="_blank" href="https://www.kaggle.com/citylines/city-lines"><span className="fab fa-kaggle" /></a></span>
            </p>
            <p><Translate content="cities.support" /> <a className="c-link" target="_blank" href="https://gitter.im/citylines/Lobby?utm_source=share-link&utm_medium=link&utm_campaign=share-link"><Translate content="cities.support_link" /> <i className="fab fa-gitter"/></a>.</p>
          </div>
        </div>
      </div>
    );
  }
}

export default Cities
