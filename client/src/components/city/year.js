import React, {PureComponent} from 'react';
import CityViewStore from '../../stores/city-view-store';
import YearControl from './year-control';
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

  handleSlideChange(event) {
    let year = parseInt(event.target.value);
    if (Number.isNaN(year)) year = 0;
    this.handleYearChange(year);
  }

  handleYearChange(year) {
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
      <YearControl
        year={this.props.year}
        min={this.props.min}
        max={this.props.max}
        showSettings={this.state.showConfigPanel}
        onYearChange={this.handleYearChange.bind(this)}
        onToggleAnimation={this.toggleAnimation.bind(this)}
        onToggleSettings={this.toggleConfigPanel.bind(this)}
      />
      <input ref="slider"
             type="range"
             className="c-range"
             min={this.props.min}
             max={this.props.max}
             onChange={this.handleSlideChange.bind(this)}
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
