import React, {Component, PureComponent} from 'react';

class CityComparisonHeader extends PureComponent {
  cities() {
    return [
      {name: 'Buenos Aires', url_name:'buenos-aires'},
      {name: 'Madrid', url_name:'madrid'}
    ];
  }

  render() {
    return (
      <div id="comparison-header" className="o-grid">
        <div className="o-grid__cell">
          <CitySelect cities={this.cities()} urlName={this.props.urlNames[0]}/>
        </div>
        <div className="o-grid__cell">
          <div className="o-grid-text">2019</div>
        </div>
        <div className="o-grid__cell">
          <CitySelect cities={this.cities()} urlName={this.props.urlNames[1]}/>
        </div>
      </div>
    );
  }
}

class CitySelect extends Component {
  render() {
    return (
      <select value={this.props.urlName} className="c-field">
        {this.props.cities.map(city =>
          <option value={city.url_name}>{city.name}</option>
        )}
      </select>
    )
  }
}
export default CityComparisonHeader
