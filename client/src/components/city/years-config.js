import React, {Component} from 'react';

class YearsConfig extends Component {
  render() {
    return (
      <div className="c-card year-config">
        <div className="c-card__body">
          <p className="c-paragraph">
            Velocidad de animación
            <input type="range" className="c-range" />
          </p>
        </div>
      </div>
    )
  }
}

export default YearsConfig
