import React, {PureComponent} from 'react';

class KmIndicator extends PureComponent {
  render() {
    return (
      <div>
        <span className="c-badge c-badge--success" style={{display: this.props.kmOperative ? 'inline-block' : 'none'}}>
          {`Operativos: ${this.props.kmOperative} km`}
        </span>
        <span className="c-badge c-badge--brand" style={{display: this.props.kmUnderConstruction ? 'inline-block' : 'none'}}>
          {`En construcción: ${this.props.kmUnderConstruction} km`}
        </span>
      </div>
    )
  }
}

export default KmIndicator
