import React, {Component} from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import MainStore from '../stores/main-store.js'
import CookieNotice from './cookie-notice.js';
import BrowserCookies from 'browser-cookies';
import Translate from 'react-translate-component';
import Avatar from './user/avatar';
import assets from '../lib/assets-provider';

const Home = React.lazy(() => import('./home'));
const City = React.lazy(() => import('./city'));
const CityComparison = React.lazy(() => import('./city-comparison'));
const Auth = React.lazy(() => import('./auth'));
const Terms = React.lazy(() => import('./terms'));
const Data = React.lazy(() => import('./data'));
const User = React.lazy(() => import('./user/user'));
const Error = React.lazy(() => import('./error'));

class Main extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {};

    this.bindedOnChange = this.onChange.bind(this);

    this.previousPathname = null;
    this.props.history.listen( loc =>  {
      if (loc.pathname != this.previousPathname) {
        this.previousPathname = loc.pathname;
        ga("send", "pageview", loc.pathname);
      }
    });
  }

  componentWillUnmount() {
    MainStore.removeChangeListener(this.bindedOnChange);
  }

  componentDidMount() {
    MainStore.addChangeListener(this.bindedOnChange);

    this.checkAuth();
    this.checkCookieAdviceCookie();
  }

  onChange() {
    this.setState(MainStore.getState());
  }

  displayMenu() {
    return !this.props.location.pathname.match(/\/$|\user\/|\/auth|\/data|\/terms|\/compare/);
  }

  togglePanel() {
    MainStore.togglePanel();
  }

  async checkAuth() {
    const url = '/api/auth/check';

    const response = await fetch(url, {credentials: 'same-origin'});
    const json = await response.json();

    if (json.userid) {
      MainStore.setUser(json);
    }
  }

  checkCookieAdviceCookie() {
    if (!BrowserCookies.get('cookie-advice-accepted')) {
      MainStore.showCookieAdvice();
    }
  }

  onAcceptCookie() {
    BrowserCookies.set('cookie-advice-accepted', "yes", {expires: 365});
    MainStore.hideCookieAdvice();
  }

  render() {
    return (
        <div>
          <nav className="c-nav c-nav--inline">
              <span className="c-nav__item" style={{display: this.displayMenu() ? 'inline-block' : 'none'}} onClick={this.togglePanel}>
                  <span className="fa fa-bars"></span>
              </span>
              <Link to="/" className="c-nav__item c-text--loud">
                <img src={assets.path("img/citylines-navbar.svg")} className="navbar-logo" />
              </Link>
              { this.state.userid ?
              <Link to={`/user/${this.state.userid}`} className="c-nav__item c-nav__item--right"><Avatar size='inline' initials={this.state.initials} img={this.state.img}/></Link>  :
              <Link to="/auth" className="c-nav__item c-nav__item--right"><Translate content="main.log_in" /></Link> }
              <Link to="/terms" className="c-nav__item c-nav__item--right">
                <Translate content="terms.title" />
              </Link>
              <Link to="/data" className="c-nav__item c-nav__item--right">
                <Translate content="data.short_title" />
              </Link>
              <Link to="/compare" className="c-nav__item c-nav__item--right">
                <Translate content="compare.short_title" />
              </Link>
          </nav>
          <div id="main-container" className={`o-grid o-panel o-panel--nav-top ${this.state.loading ? 'loading' : null}`}>
            <React.Suspense fallback={<SuspenseLoader />}>
              <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/auth" component={Auth} />
                <Route path="/terms" component={Terms} />
                <Route path="/data" component={Data} />
                <Route path="/error" component={Error} />
                <Route path="/compare" component={CityComparison} />
                <Route path="/user/:user_id" component={User} />
                <Route path="/:city_url_name" component={City} />
              </Switch>
            </React.Suspense>
          </div>
          <div className="u-center-block__content" style={{display: this.state.loading ? 'block' : 'none', width:'200px'}}>
            <div className="loader"></div>
          </div>
          {this.state.showCookieAdvice && <CookieNotice
            onAccept={this.onAcceptCookie}
            />}
        </div>
      )
  }
}

class SuspenseLoader extends Component {
  componentDidMount() {
    MainStore.setLoading();
  }

  componentWillUnmount() {
    MainStore.unsetLoading();
  }

  render(){
    return null;
  }
}

export default Main
