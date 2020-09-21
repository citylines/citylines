import React, {PureComponent} from 'react';
import Translate from 'react-translate-component';

class GeneralAlert extends PureComponent {
  render() {
    return (
      <div className="c-card editor-general-alert">
        <div className="c-card__item c-card__item--warning">Please note <span style={{float: 'right'}} className="fa fa-times" onClick={this.props.onClose}/></div>
        <li className="c-card__item">
          Do Not Random Editing!!! Follow the actual Lines & Station Location at Wiki or OpenStreetMaps. Repect other editors who spent time for editing. Thank you.
        </li>
      </div>
    )
  }
}

export default GeneralAlert
