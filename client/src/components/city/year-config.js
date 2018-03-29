import React, {PureComponent} from 'react';

class YearConfig extends PureComponent {
  constructor(props, context) {
    super(props, context);
    this.minSpeed = 500;
    this.maxSpeed = 1000;
  }

  speed() {
    return this.maxSpeed - this.props.speed;
  }

  handleSpeedChange(e) {
    const speed = this.maxSpeed - e.target.value;
    this.props.onSpeedChange(speed);
  }

  render() {
    return (
      <div className="c-card year-config">
        <div className="c-card__item">
          Velocidad de animación
          <input
            type="range"
            className="c-range"
            min={this.minSpeed}
            max={this.maxSpeed}
            value={this.speed()}
            onChange={this.handleSpeedChange.bind(this)}
            />
        </div>
      </div>
    )
  }
}

export default YearConfig
