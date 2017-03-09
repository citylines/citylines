import React, {Component} from 'react';
import {Link} from 'react-router';
import Translate from 'react-translate-component';

class CookieNotice extends Component {
  render() {
    return (
    <div className="cookie-notice-container c-list c-list--unstyled">
      <p><Translate content="cookie_notice.notice" /><Translate component="button" onClick={this.props.onAccept} className="c-button c-button--info" content="cookie_notice.accept" /><br /><Translate component={Link} to="/cookies" content="cookie_notice.info" /></p>
    </div>
    )
  }
}

export default CookieNotice
