import React, {PureComponent} from 'react';
import CityViewStore from '../../stores/city-view-store';
import YearConfig from './year-config';

class Year extends PureComponent {
  constructor(props, context) {
    super(props, context);

    this.state = {showConfigPanel: false};
  }

  toggleConfigPanel() {
    this.setState({showConfigPanel: !this.state.showConfigPanel});
  }

  toggleAnimation() {
    CityViewStore.toggleAnimation(this.props.urlName);
  }

  yearChange(e) {
    let year = parseInt(e.target.value);
    if (Number.isNaN(year)) year = 0;
    CityViewStore.setYear(this.props.urlName, year);
  }

  handleTransportModesChange(e) {
    CityViewStore.setShowTransportModes(this.props.urlName, e.target.checked);
  }

  componentDidUpdate() {
    if (typeof this.props.onYearChange === 'function') {
      this.props.onYearChange();
    }
  }

  render() {
    const icon = this.props.playing ? 'fa-pause' : 'fa-play';

    return (
    <div className="year-container">
      <div className="c-input-group c-input-group--right year-group">
        <div className="o-field">
          <input ref="currentYear"
                 className="c-field"
                 type="number"
                 min={this.props.min}
                 max={this.props.max}
                 onChange={this.yearChange.bind(this)}
                 value={this.props.year || ""}/>
        </div>
        <button ref="action"
                className="c-button c-button--ghost"
                onClick={this.toggleAnimation.bind(this)}>
          <span className={`fa ${icon}`}></span>
        </button>
        <button className={`c-button c-button--ghost ${this.state.showConfigPanel ? 'c-button--active' : ''}`} onClick={this.toggleConfigPanel.bind(this)}>
          <span className="fa fa-sliders-h"></span>
        </button>
      </div>
      <input ref="slider"
             type="range"
             className="c-range"
             min={this.props.min}
             max={this.props.max}
             onChange={this.yearChange.bind(this)}
             value={this.props.year || 0} />
      {this.state.showConfigPanel &&
        <YearConfig
          speed={this.props.speed}
          onSpeedChange={this.props.onSpeedChange}
          showTransportModes={this.props.showTransportModes}
          onShowTransportModesChange={this.handleTransportModesChange.bind(this)}
        />}
     </div>
     )
  }
}

export default Year
