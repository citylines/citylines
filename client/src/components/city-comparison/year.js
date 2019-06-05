import React, {PureComponent} from 'react';

class Year extends PureComponent {
  handleKeyPress(event) {
    if (event.key !== 'Enter') return;

    let year = parseInt(event.target.value);
    if (year < this.props.min) year = this.props.min;
    if (year > this.props.max) year = this.props.max;

    this.props.onYearChange(year);
  };

  handleYearChange(event) {
    const year = parseInt(event.target.value);
    this.props.onYearChange(year);
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.year != this.props.year && this.props.onUpdate) {
      this.props.onUpdate();
    }
  }

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
                 onKeyPress={this.handleKeyPress.bind(this)}
                 onChange={this.handleYearChange.bind(this)}
                 value={this.props.year || ""}/>
        </div>
        <button ref="action"
                className="c-button c-button--ghost"
                onClick={this.props.toggleAnimation}><span className={`fa ${icon}`}></span></button>
        <button type="button" className="c-button c-button--ghost"><span className="fa fa-sliders"></span></button>
      </div>
    )
  }
}

export default Year
