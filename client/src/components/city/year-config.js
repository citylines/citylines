import React, {Component} from 'react';

class YearConfig extends Component {
  render() {
    return (
      <div className="c-card year-config">
        <div className="c-card__item">
          Velocidad de animación
          <input type="range" className="c-range" />
        </div>
      </div>
    )
  }
}

export default YearConfig
