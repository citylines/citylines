import React, {Component, PureComponent} from 'react';

class CityComparisonHeader extends PureComponent {
  cities() {
    return [
      {name: 'Buenos Aires', url_name:'buenos-aires'},
      {name: 'Madrid', url_name:'madrid'},
      {name: 'Santiago', url_name:'santiago-de-chile'}
    ];
  }

  render() {
    return (
      <div id="comparison-header" className="o-grid">
        <div className="o-grid__cell">
          <CitySelect
            cities={this.cities()}
            urlName={this.props.urlNames[0]}
            onChange={(newUrlName) => {this.props.onChange([newUrlName, this.props.urlNames[1]])}}
          />
        </div>
        <div className="o-grid__cell">
          <YearControl
            year={this.props.year}
            onYearChange={this.props.onYearChange}
          />
        </div>
        <div className="o-grid__cell">
          <CitySelect
            cities={this.cities()}
            urlName={this.props.urlNames[1]}
            onChange={(newUrlName) => {this.props.onChange([this.props.urlNames[0], newUrlName])}}
          />
        </div>
      </div>
    );
  }
}

class CitySelect extends Component {
  handleChange(event) {
    this.props.onChange(event.target.value);
  }

  render() {
    return (
      <select value={this.props.urlName} onChange={this.handleChange.bind(this)} className="c-field">
        {this.props.cities.map(city =>
          <option key={city.url_name} value={city.url_name}>{city.name}</option>
        )}
      </select>
    )
  }
}

class YearControl extends Component {
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

  toggleAnimation() {};

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
                onClick={this.toggleAnimation.bind(this)}><span className={`fa ${icon}`}></span></button>
      </div>
    )
  }
}

export default CityComparisonHeader
