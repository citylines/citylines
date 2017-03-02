import React, {Component} from 'react';
import {Link} from 'react-router';

class CookieNotice extends Component {
  render() {
    return (
    <div className="cookie-notice-container c-list c-list--unstyled">
      <p>Este sitio web usa cookies. Al navegarlo usted acepta el uso que hacemos de ellas.<button onClick={this.props.onAccept} className="c-button c-button--info">Aceptar</button><br /><Link className="c-link" to="/cookies">Información sobre las cookies que usamos</Link></p>
    </div>
    )
  }
}

export default CookieNotice
