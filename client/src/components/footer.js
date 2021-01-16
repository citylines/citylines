import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Translate from 'react-translate-component';
import assets from '../lib/assets-provider';

class Footer extends Component {
  render() {
    const currentYear = new Date().getFullYear();

    return (
      <nav className="footer c-nav c-nav--light c-nav--inline a-nav a-nav--fast">
        <span className="copyright c-nav__content">&copy; {`2015-${currentYear}`}
          <img src={assets.path("img/citylines-navbar-textonly.svg")} />
        </span>
        <Link className="c-nav__item c-nav__item--right" to="/about" tabIndex={0}>
          <Translate content="about.title" />
        </Link>
        <Link className="c-nav__item c-nav__item--right" to="/terms" tabIndex={0}>
          <Translate content="terms.title" />
        </Link>
        <a className="c-nav__item" target="_blank" href="https://gitter.im/citylines/Lobby?utm_source=share-link&utm_medium=link&utm_campaign=share-link">
          <Translate content="cities.support_link" /> <i className="fab fa-gitter"/>
        </a>
        <div style={{flexGrow: 2}}>
          <a className="c-nav__item c-nav__item--right" target="_blank" href="https://twitter.com/citylines_co"><span className="fab fa-twitter" /></a>
          <a className="c-nav__item c-nav__item--right" target="_blank" href="mailto:info@citylines.co"><span className="fa fa-envelope"/></a>
          <a className="c-nav__item c-nav__item--right" target="_blank" href="https://www.kaggle.com/citylines/city-lines"><span className="fab fa-kaggle" /></a>
          <a className="c-nav__item c-nav__item--right" target="_blank" href="https://github.com/citylines/citylines"><span className="fab fa-github" /></a>
        </div>
      </nav>
    )
  }
}

export default Footer
