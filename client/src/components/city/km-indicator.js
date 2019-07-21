import React, {PureComponent} from 'react';
import Translate from 'react-translate-component';
import {formatNumber} from '../../lib/number-tools';

class KmIndicator extends PureComponent {
  render() {
    return (
      <div>
      {this.props.kmOperative ?
        <span className="c-badge c-badge--success">
          <Translate content="city.km_operative" with={{km: formatNumber(this.props.kmOperative)}} />
        </span> : null}
      {this.props.kmUnderConstruction ?
        <span className="c-badge c-badge--brand">
          <Translate content="city.km_under_construction" with={{km: formatNumber(this.props.kmUnderConstruction)}} />
        </span> : null}
      </div>
    )
  }
}

export default KmIndicator
