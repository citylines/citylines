import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Link} from 'react-router';
import Translate from 'react-translate-component';

class Terms extends Component {
  componentDidMount() {
    this.checkCookiesHash();
  }

  componentDidUpdate(prevProps) {
    if (this.props.location.hash != prevProps.location.hash) {
      this.checkCookiesHash();
    }
  }

  checkCookiesHash() {
    if (this.props.location.hash.includes('cookies')) {
      ReactDOM.findDOMNode(this.refs.cookies).scrollIntoView();
    }
  }

  render() {
    return (
        <div className="o-container o-container--small">
          <div className="u-letter-box--large">
            <Translate component="h1" className="c-heading" content="terms.title" />

            <Translate component="h3" className="c-heading" content="terms.license.title"/>
            <p><Translate content="terms.license.p1" unsafe/></p>
            <p><Translate content="terms.license.p2" unsafe/></p>

            <Translate component="h3" className="c-heading" content="terms.contributor.title" id="contributor" ref="contributor"/>
            <p>
              <ol>
              <li><Translate content="terms.contributor.p1" /></li>
              <li><Translate content="terms.contributor.p2" /></li>
              <li><Translate content="terms.contributor.p3" /></li>
              </ol>
            </p>

            <Translate component="h3" className="c-heading" content="cookie_notice.text.title" id="cookies" ref="cookies"/>
            <p><Translate content="cookie_notice.text.p1" /></p>
            <p><Translate content="cookie_notice.text.p2" /></p>
            <p><Translate content="cookie_notice.text.p3" /></p>
            <p><Translate content="cookie_notice.text.p4" unsafe /></p>
          </div>
        </div>
        )
  }
}

export default Terms
