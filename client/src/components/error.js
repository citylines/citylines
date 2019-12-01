import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import Translate from 'react-translate-component';
import Tags from './tags';

class Error extends Component {

  render() {
    return (
        <div className="o-container o-container--medium">
          <Tags title="error.title" />
          <div className="u-letter-box--large">
            <Translate component="h1" className="c-heading" content="error.title" />
            <Translate component="h3" className="c-heading" content="error.subtitle" />
            <h2 className="c-heading"><Translate component={Link} className="c-link" content="error.redirect" to="/" /></h2>
          </div>
        </div>
        )
  }
}

export default Error
