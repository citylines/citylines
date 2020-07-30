import React, {PureComponent} from 'react';

class CityToggleableContainer extends PureComponent {
  render() {
    return (
      <div className="c-card city-toggleable-container">
        <div className="c-card__item">
        { this.props.children }
        </div>
      </div>
    )
  }
}

export default CityToggleableContainer
