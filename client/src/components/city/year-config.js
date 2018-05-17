import React, {PureComponent} from 'react';
import Translate from 'react-translate-component';

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
            <div className="o-form-element">
              <Translate content="city.years.config.timeline_speed" />
              <input
                type="range"
                className="c-range"
                min={this.minSpeed}
                max={this.maxSpeed}
                value={this.speed()}
                onChange={this.handleSpeedChange.bind(this)}
                />
            </div>
            <label className="c-field c-field--choice">
              <input
                type="checkbox"
                checked={this.props.showTransportModes}
                onChange={this.props.onShowTransportModesChange.bind(this)}
              /> <Translate content="city.years.config.show_transport_modes" />
            </label>
        </div>
      </div>
    )
  }
}

export default YearConfig
