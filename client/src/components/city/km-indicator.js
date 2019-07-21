import React, {PureComponent} from 'react';
import Translate from 'react-translate-component';

class KmIndicator extends PureComponent {
  render() {
    return (
      <div>
      {this.props.kmOperative ?
        <span className="c-badge c-badge--success">
          <Translate content="city.km_operative" with={{km: this.props.kmOperative.toLocaleString()}} />
        </span> : null}
      {this.props.kmUnderConstruction ?
        <span className="c-badge c-badge--brand">
          <Translate content="city.km_under_construction" with={{km: this.props.kmUnderConstruction.toLocaleString()}} />
        </span> : null}
      </div>
    )
  }
}

export default KmIndicator
