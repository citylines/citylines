import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import HomeStore from '../stores/home-store';
import MainStore from '../stores/main-store';
import Translate from 'react-translate-component';
import Tags from './tags';
import assets from '../lib/assets-provider';
import {formatNumber} from '../lib/number-tools';
import Avatar from './user/avatar';
import SystemTags from './city/system-tags';

class ResultItem extends Component {
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
        <Tags title="main.title" description="main.description"/>
        <header className="c-card__header">
          <h3 className="c-heading">
            <Link className="c-link c-link--primary" to={this.props.url}>{this.props.name}</Link> {!this.isCity() && <SystemTags system={this.props.tags} />}
            <span className="item-location">{!this.isCity() ? `${this.props.city_name},` : ''} {this.props.state ? `${this.props.state},` : ''} {this.props.country}</span>
            {this.isCity() &&
            <div className="city-systems-container">
              <div
                ref={ (el) => this.systemsDiv = el}
                className={`c-heading__sub city-systems ${this.showAllClass()}`}>
                  {this.props.systems && this.props.systems.join(', ')}
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
        <Translate component="a" className="c-link c-link--primary" onClick={props.onClick} content="cities.load_more" disabled={props.disabled}/>
      </div>
    </div>;
}

const RequestCity = () => {
  return <div className="c-card">
      <div className="c-card__body" style={{textAlign:'center'}}>
        <Translate content="cities.request_city.cant_find"/>
        {' '}
        <Translate component="a"
                   target="_blank"
                   className="c-link c-link--primary"
                   href={"https://goo.gl/forms/9O5Y1C4r4Tow6UhE2"}
                   content="cities.request_city.request_it" />.
      </div>
    </div>;
}

class Home extends Component {
  constructor(props, context) {
    super(props, context);

    this.bindedOnChange = this.onChange.bind(this);
    this.state = HomeStore.getState();
  }

  componentWillUnmount() {
    HomeStore.cancelSearchTimeout();
    HomeStore.removeChangeListener(this.bindedOnChange);
  }

  onChange() {
    this.setState(HomeStore.getState());
  }

  componentDidMount() {
    HomeStore.addChangeListener(this.bindedOnChange);

    // If we already have the data in the store, don't
    // reload everything when mounting the component again.
    // That also breaks the results list, as the current page
    // is loaded again, and elements get duplicated (unless the page
    // is the first one)..
    if (!this.state.searchResults.length) {
      HomeStore.fetchResults();
      HomeStore.fetchContributors();
      HomeStore.fetchTopSystems();
    }
  }

  onInputChange(e) {
    HomeStore.setSearchTerm(e.target.value);
  }

  fetchMore(e) {
    e.preventDefault();
    HomeStore.fetchMoreResults();
  }

  render() {
    let searchResults = this.state.searchResults.map(item => <ResultItem
          key={item.url}
          name={item.name}
          city_name={item.city_name}
          state={item.state}
          country={item.country}
          length={item.length}
          systems={item.systems}
          tags={{historic: item.historic}}
          contributors_count={item.contributors_count}
          url={item.url}
        />
      );

    const finalSearchElement = (this.state.thereAreMoreResults) ?
      <FetchMoreLink key='fetch-more' onClick={this.fetchMore.bind(this)} disabled={this.state.searching}/>
    :
      <RequestCity key='request-city' />
    ;

    searchResults = [...searchResults, finalSearchElement];

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
              <Translate component="input" className="c-field" type="text" attributes={{placeholder: "cities.search"}} value={this.state.visibleSearchTerm} onChange={this.onInputChange.bind(this)} />
              <i className="fa fa-fw fa-search c-icon"></i>
            </div>

            <div className="cities-container">
              <div>
              { searchResults }
              </div>
            </div>
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

        <div className="o-container o-container--small contributors-list-container">
          <div className="u-letter-box--large">
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
      </div>
    );
  }
}

export default Home
