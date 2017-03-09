import React, {Component} from 'react';
import {Link} from 'react-router';
import Translate from 'react-translate-component';

class CookieNoticeText extends Component {

  render() {
    return (
        <div className="u-center-block__content">
          <Translate component="h3" className="c-heading" content="cookie_notice.text.title" />
          <p><Translate content="cookie_notice.text.p1" /></p>
          <p><Translate content="cookie_notice.text.p2" /></p>
          <p><Translate content="cookie_notice.text.p3" /></p>
          <p><Translate content="cookie_notice.text.p4" unsafe /></p>
        </div>
        )
  }
}

export default CookieNoticeText
