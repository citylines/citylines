import React, {PureComponent} from 'react';
import Translate from 'react-translate-component';

class TimelineSpeedControl extends PureComponent {
  constructor(props, context) {
    super(props, context);
    this.minSpeed = 500;
    this.maxSpeed = 1250;
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
      <div className="o-form-element">
        <Translate content="city.config.timeline_speed" />
        <input
          type="range"
          className="c-range"
          min={this.minSpeed}
          max={this.maxSpeed}
          value={this.speed()}
          onChange={this.handleSpeedChange.bind(this)}
        />
      </div>
    )
  }
}

export default TimelineSpeedControl
