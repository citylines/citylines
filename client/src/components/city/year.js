import React, {Component} from 'react';
import CityStore from '../../stores/city-store';

class Year extends Component {
  toggleAnimation() {
    CityStore.toggleAnimation(this.props.urlName, (year) => {
      this.refs.slider.value = year;
      this.refs.currentYear.value = year;
    });
  }

  yearChange(e) {
    let year = parseInt(e.target.value);
    CityStore.setYear(this.props.urlName, year);
  }

  onKeyPress(e) {
    if (e.key !== 'Enter') return;

    let year = parseInt(e.target.value);
    if (year < this.props.min) year = this.props.min
    if (year > this.props.max) year = this.props.max
    CityStore.setYear(this.props.urlName, year);
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
