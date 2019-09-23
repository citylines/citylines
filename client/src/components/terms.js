import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Link} from 'react-router';
import Translate from 'react-translate-component';
import Tags from './tags';

class Terms extends Component {
  componentDidMount() {
    this.checkHash();
  }

  componentDidUpdate(prevProps) {
    if (this.props.location.hash != prevProps.location.hash) {
      this.checkHash();
    }
  }

  checkHash() {
    if (this.props.location.hash.includes('cookies')) {
      ReactDOM.findDOMNode(this.refs.cookies).scrollIntoView();
    }

    if (this.props.location.hash.includes('contributor')) {
      ReactDOM.findDOMNode(this.refs.contributor).scrollIntoView();
    }

    if (this.props.location.hash.includes('privacy')) {
      ReactDOM.findDOMNode(this.refs.privacy).scrollIntoView();
    }
  }

  render() {
    return (
        <div className="o-container o-container--medium" style={{textAlign: 'justify'}}>
          <Tags title="terms.title" />
          <div className="u-letter-box--large letter-with-footer">
            <Translate component="h1" className="c-heading" content="terms.title" />

            <Translate component="h3" className="c-heading" content="terms.license.title"/>
            <p><Translate content="terms.license.p1" unsafe/></p>
            <p><Translate content="terms.license.p2" unsafe/></p>

            <Translate component="h3" className="c-heading" content="terms.contributor.title" ref="contributor"/>
            <ol>
              <li><Translate content="terms.contributor.p1" /></li>
              <li><Translate content="terms.contributor.p2" /></li>
              <li><Translate content="terms.contributor.p3" /></li>
            </ol>

            <Translate component="h3" className="c-heading" content="terms.privacy.title" ref="privacy"/>
            <ol>
              <li><Translate content="terms.privacy.p1" /></li>
              <li><Translate content="terms.privacy.p2" /></li>
              <li><Translate content="terms.privacy.p3" /></li>
              <li><Translate content="terms.privacy.p4" /></li>
              <li><Translate content="terms.privacy.p5" /></li>
              <li><Translate content="terms.privacy.p6" /></li>
            </ol>

            <Translate component="h3" className="c-heading" content="cookie_notice.text.title" ref="cookies"/>
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
