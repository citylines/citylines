import React, {PureComponent} from 'react';

class ComparisonToggleableContainer extends PureComponent {
  render() {
    return (
      <div className="comparison-settings">
        <div className="c-card">
          <div className="c-card__item">
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }
}

export default ComparisonToggleableContainer
