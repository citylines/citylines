import React, {Component} from 'react';
import {Link} from 'react-router';
import Diacritics from 'diacritics';
import CitiesStore from '../stores/cities-store';
import MainStore from '../stores/main-store';
import Translate from 'react-translate-component';

class CityItem extends Component {
  render() {
    return (
      <div className="c-card">
        <header className="c-card__header">
          <h3 className="c-heading">
            <Link className="c-link c-link--primary" to={this.props.url}>{this.props.name}</Link>, {this.props.state ? `${this.props.state},` : ''} {this.props.country}
            <div className="c-heading__sub">{this.props.systems.join(', ')}</div>
          </h3>
        </header>
        <div className="c-card__body">
          { this.props.length ? <span className="c-badge c-badge--success">{this.props.length} km</span> : ''}
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
            <Translate component="h1" content="cities.title" className="c-heading c-heading--medium landing-title" unsafe />
          </div>
        </div>

        <div className="o-container o-container--small">
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
          </div>
        </div>

        <div className="o-container o-container--small">
          <div className="u-letter-box--large" style={{textAlign: 'center'}}>
            <Translate component="h2" className="c-heading" content="cities.contributors.list.title" />

            <div className="contributors-list">
              <Translate component="h3" className="c-heading" content="cities.contributors.list.total" />
              <ol className="c-list c-list--ordered">
                {this.state.topContributors.map(contributor =>
                    <li key={`tcontrib-${contributor.user_id}`} className="c-list__item"><Link to={`/user/${contributor.user_id}`} className="c-link">{contributor.name}</Link> {contributor.sum} km</li>
                  )}
              </ol>
            </div>

            <div className="contributors-list">
              <Translate component="h3" className="c-heading" content="cities.contributors.list.last_month" />
              <ol className="c-list c-list--ordered">
                {this.state.monthTopContributors.map(contributor =>
                    <li key={`mcontrib-${contributor.user_id}`} className="c-list__item"><Link to={`/user/${contributor.user_id}`} className="c-link">{contributor.name}</Link> {contributor.sum} km</li>
                  )}
              </ol>
            </div>
          </div>
        </div>

        <div className="o-container o-container--medium" style={{textAlign: 'center', marginTop:30}}>
          <div className="u-letter-box--super">
            <p className="c-paragragh">
              <span className="contact-icon"><a className="c-link" target="_blank" href="https://twitter.com/citylines_co"><span className="fa fa-twitter" /> Twitter</a></span>
              <span className="contact-icon"><a className="c-link" target="_blank" href="mailto:info@citylines.co"><span className="fa fa-envelope"/> Email</a></span>
              <span className="contact-icon"><a className="c-link"  target="_blank" href="https://github.com/BrunoSalerno/citylines"><span className="fa fa-github" /> Github</a></span>
            </p>
            <p><Translate content="cities.support" /> <a className="c-link" target="_blank" href="https://gitter.im/citylines/Lobby?utm_source=share-link&utm_medium=link&utm_campaign=share-link"><Translate content="cities.support_link" /></a>.</p>
          </div>
        </div>
      </div>
    );
  }
}

export default Cities
