import React, {PureComponent} from 'react';
import Translate from 'react-translate-component';

class Footer extends PureComponent {
  render() {
    return (
        <nav className="c-nav c-nav--light c-nav--inline a-nav a-nav--fast">
          <span className="c-nav__content">
                  <span className="contact-icon"><a target="_blank" href="https://twitter.com/citylines_co"><span className="fab fa-twitter" /></a></span>
                  <span className="contact-icon"><a target="_blank" href="mailto:info@citylines.co"><span className="fa fa-envelope"/></a></span>
                  <span className="contact-icon"><a target="_blank" href="https://github.com/citylines/citylines"><span className="fab fa-github" /></a></span>
                  <span className="contact-icon"><a target="_blank" href="https://www.kaggle.com/citylines/city-lines"><span className="fab fa-kaggle" /></a></span>
                <Translate content="cities.support" /> <a className="c-link" target="_blank" href="https://gitter.im/citylines/Lobby?utm_source=share-link&utm_medium=link&utm_campaign=share-link"><Translate content="cities.support_link" /> <i className="fab fa-gitter"/></a>.
          </span>
        </nav>
  )
  }
}

export default Footer
