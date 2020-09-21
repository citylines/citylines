import React, {PureComponent} from 'react';
import Translate from 'react-translate-component';

class GeneralAlert extends PureComponent {
  render() {
    return (
      <div className="c-card editor-general-alert">
        <div className="c-card__item c-card__item--warning">
          <span className="fa fa-info-circle"/><Translate content="editor.general_alert.title"/><span className="fa fa-times" onClick={this.props.onClose}/>
        </div>
        <Translate component="li" className="c-card__item" content="editor.general_alert.body"/>
      </div>
    )
  }
}

export default GeneralAlert
