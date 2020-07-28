import React, {PureComponent} from 'react';

class YearControl extends PureComponent {
  handleYearChange(event) {
    let year = parseInt(event.target.value);
    if (Number.isNaN(year)) year = 0;
    this.props.onYearChange(year);
  };

  render() {
    const icon = this.props.playing ? 'fa-pause' : 'fa-play';
    return (
      <div className="c-input-group c-input-group--right year-group">
        <div className="o-field">
          <input ref="currentYear"
                 className="c-field"
                 type="number"
                 min={this.props.min}
                 max={this.props.max}
                 onChange={this.handleYearChange.bind(this)}
                 value={this.props.year || ""}/>
        </div>
        <button ref="action"
                className="c-button"
                onClick={this.props.onToggleAnimation}><span className={`fa ${icon}`}></span></button>
      </div>
    )
  }
}

export default YearControl
