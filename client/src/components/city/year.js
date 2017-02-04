import React, {PureComponent} from 'react';
import CityViewStore from '../../stores/city-view-store';

class Year extends PureComponent {
  toggleAnimation() {
    CityViewStore.toggleAnimation(this.props.urlName);
  }

  yearChange(e) {
    let year = parseInt(e.target.value);
    CityViewStore.setYear(this.props.urlName, year);
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
    <div>
      <div className="c-input-group c-input-group--right">
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
                onClick={this.toggleAnimation.bind(this)}><span className={`fa ${icon}`}></span> </button>
      </div>
      <input ref="slider"
             type="range"
             className="c-range"
             min={this.props.min}
             max={this.props.max}
             onChange={this.yearChange.bind(this)}
             value={this.props.year || 0} />
     </div>
     )
  }
}

export default Year
