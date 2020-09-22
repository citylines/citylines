import React, {PureComponent} from 'react';
import Translate from 'react-translate-component';
import {Link} from 'react-router-dom';

class GeneralAlert extends PureComponent {
  render() {
    return (
      <div className="c-card editor-general-alert">
        <div className="c-card__item c-card__item--warning">
          <span className="fa fa-info-circle"/><Translate content="editor.general_alert.title"/><span className="fa fa-times" onClick={this.props.onClose}/>
        </div>
        <li className="c-card__item">
          <Translate content="editor.general_alert.body"/> <Translate component={Link} content="editor.general_alert.link" to="/terms#contributor" className="c-link"/>.
        </li>
      </div>
    )
  }
}

export default GeneralAlert
