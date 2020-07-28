import React, {PureComponent} from 'react';
import CityViewStore from '../../stores/city-view-store';
import YearControl from './year-control';

// FIXME: pass calls to store to CityView component
class Year extends PureComponent {
  constructor(props, context) {
    super(props, context);
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

  componentDidUpdate() {
    if (typeof this.props.onYearChange === 'function') {
      this.props.onYearChange();
    }
  }

  render() {
    return (
    <div className="year-container">
      <YearControl
        year={this.props.year}
        min={this.props.min}
        max={this.props.max}
        playing={this.props.playing}
        onYearChange={this.handleYearChange.bind(this)}
        onToggleAnimation={this.toggleAnimation.bind(this)}
      />
      <input ref="slider"
             type="range"
             className="c-range"
             min={this.props.min}
             max={this.props.max}
             onChange={this.handleSlideChange.bind(this)}
             value={this.props.year || 0} />
     </div>
     )
  }
}

export default Year
