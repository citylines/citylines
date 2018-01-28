import React, {Component} from 'react';
import { Link } from 'react-router';
import MainStore from '../stores/main-store.js'
import CookieNotice from './cookie-notice.js';
import BrowserCookies from 'browser-cookies';
import Translate from 'react-translate-component';
import counterpart from 'counterpart';
import assets from '../lib/assets-provider';
import {Helmet} from "react-helmet";

class Main extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {};

    this.bindedOnChange = this.onChange.bind(this);
  }

  componentWillMount() {
    MainStore.addChangeListener(this.bindedOnChange);
  }

  componentWillUnmount() {
    MainStore.removeChangeListener(this.bindedOnChange);
  }

  componentDidMount() {
    this.checkAuth();
    this.checkCookieAdviceCookie();
  }

  onChange() {
    this.setState(MainStore.getState());
  }

  displayMenu() {
    return !this.props.location.pathname.match(/\/$|\user\/|\/auth|\/data|\/terms/);
  }

  togglePanel() {
    MainStore.togglePanel();
  }

  async checkAuth() {
    const url = '/api/auth/check';

    const response = await fetch(url, {credentials: 'same-origin'});
    const json = await response.json();

    if (json.username) {
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
          <Helmet>
            <title>{counterpart("main.title")}</title>
            <meta name="description" content={counterpart("main.description")} />
            <meta property="og:title" content={counterpart("main.title")} />
            <meta property="og:description" content={counterpart("main.description")} />
          </Helmet>
          <nav className="c-nav c-nav--inline">
              <span className="c-nav__item" style={{display: this.displayMenu() ? 'inline-block' : 'none'}} onClick={this.togglePanel}>
                  <span className="fa fa-bars"></span>
              </span>
              <Link to="/" className="c-nav__item c-text--loud">
                <img src={assets.path("img/citylines-navbar.svg")} className="navbar-logo" />
              </Link>
              { this.state.username ?
              <Link to={`/user/${this.state.userid}`} className="c-nav__item c-nav__item--right">{this.state.username}</Link>  :
              <Link to="/auth" className="c-nav__item c-nav__item--right"><Translate content="main.log_in" /></Link> }
              <Link to="/terms" className="c-nav__item c-nav__item--right">
                <Translate content="terms.title" />
              </Link>
              <Link to="/data" className="c-nav__item c-nav__item--right">
                <Translate content="data.short_title" />
              </Link>
          </nav>
          <div id="main-container" className={`o-grid o-panel o-panel--nav-top ${this.state.loading ? 'loading' : null}`}>
            {this.props.children}
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

export default Main
