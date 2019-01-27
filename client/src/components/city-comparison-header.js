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
          <div className="o-grid-text">2019</div>
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
export default CityComparisonHeader
