import React, {PureComponent} from 'react';
import Translate from 'react-translate-component';
import TimelineSpeedControl from './timeline-speed-control';

class YearConfig extends PureComponent {

  render() {
    return (
      <div className="c-card year-config">
        <div className="c-card__item">
            <TimelineSpeedControl
              speed={this.props.speed}
              onSpeedChange={this.props.onSpeedChange}
            />
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
