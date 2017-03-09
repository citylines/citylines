import React, {PureComponent} from 'react';
import Translate from 'react-translate-component';

class KmIndicator extends PureComponent {
  render() {
    return (
      <div>
        <span className="c-badge c-badge--success" style={{display: this.props.kmOperative ? 'inline-block' : 'none'}}>
          <Translate content="city.km_operative" with={{km: this.props.kmOperative}} />
        </span>
        <span className="c-badge c-badge--brand" style={{display: this.props.kmUnderConstruction ? 'inline-block' : 'none'}}>
          <Translate content="city.km_under_construction" with={{km: this.props.kmUnderConstruction}} />
        </span>
      </div>
    )
  }
}

export default KmIndicator
