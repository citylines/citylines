import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import Translate from 'react-translate-component';

class Footer extends PureComponent {
  render() {
    const currentYear = new Date().getFullYear();

    return (
        <nav className="footer c-nav c-nav--light c-nav--inline a-nav a-nav--fast">
          <span className="c-nav__item">&copy; {`2015-${currentYear} citylines.co`}</span>
          <span className="c-nav__item c-nav__item--right">
            <Link to="/terms" tabIndex={0}  className="c-nav__item c-nav__item--right">
              <Translate content="terms.title" />
            </Link>
          </span>
          <div style={{flexGrow: 2}}></div>
          <span className="c-nav__item c-nav__item--right"><a target="_blank" href="https://twitter.com/citylines_co"><span className="fab fa-twitter" /></a></span>
          <span className="c-nav__item c-nav__item--right"><a target="_blank" href="mailto:info@citylines.co"><span className="fa fa-envelope"/></a></span>
          <span className="c-nav__item c-nav__item--right"><a target="_blank" href="https://github.com/citylines/citylines"><span className="fab fa-github" /></a></span>
          <span className="c-nav__item c-nav__item--right"><a target="_blank" href="https://www.kaggle.com/citylines/city-lines"><span className="fab fa-kaggle" /></a></span>
          <span className="c-nav__item c-nav__item--right"><a target="_blank" href="https://gitter.im/citylines/Lobby?utm_source=share-link&utm_medium=link&utm_campaign=share-link"><span className="fab fa-gitter"/></a></span>
        </nav>
  )
  }
}

export default Footer
