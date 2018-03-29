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
    CityViewStore.setYear(this.props.urlName, year);
  }

  handleSpeedChange(speed) {
    CityViewStore.setSpeed(this.props.urlName, speed);
  }

  onKeyPress(e) {
    if (e.key !== 'Enter') return;

    let year = parseInt(e.target.value);
    if (year < this.props.min) year = this.props.min
    if (year > this.props.max) year = this.props.max
    CityViewStore.setYear(this.props.urlName, year);
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
                 onKeyPress={this.onKeyPress.bind(this)}
                 onChange={this.yearChange.bind(this)}
                 value={this.props.year || ""}/>
        </div>
        <button ref="action"
                className="c-button c-button--ghost"
                onClick={this.toggleAnimation.bind(this)}><span className={`fa ${icon}`}></span></button>
        <button className={`c-button c-button--ghost ${this.state.showConfigPanel ? 'c-button--active' : ''}`} onClick={this.toggleConfigPanel.bind(this)}>...</button>
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
          onSpeedChange={this.handleSpeedChange.bind(this)}
        />}
     </div>
     )
  }
}

export default Year
