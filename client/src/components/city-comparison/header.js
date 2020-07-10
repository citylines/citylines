import React, {PureComponent} from 'react';
import {Link} from 'react-router-dom';
import Year from './year';
import Translate from 'react-translate-component';

class CityComparisonHeader extends PureComponent {
  cities() {
    return this.props.citiesList.map(city => {
        return {name: city.name, url_name: city.url.split("/")[1], country: city.country};
      });
  }

  theOtherCity(urlName) {
    return this.props.urlNames.find(un => un != urlName);
  }

  render() {
    return (
      <div id="comparison-header" className="o-grid o-grid--xsmall-full o-grid--small-full o-grid--medium-full o-grid--large-fit">
        <div className="o-grid__cell">
          <CitySelect
            cities={this.cities().filter(city => city.url_name != this.theOtherCity(this.props.urlNames[0]))}
            urlName={this.props.urlNames[0]}
            onChange={(newUrlName) => {this.props.onChange([newUrlName, this.props.urlNames[1]])}}
          />
        </div>
        <div className="o-grid__cell o-grid__cell--width-25">
          {typeof(this.props.year) != "undefined" && <Year
            year={this.props.year}
            onYearChange={this.props.onYearChange}
            onUpdate={this.props.onYearUpdate}
            toggleAnimation={this.props.toggleAnimation}
            toggleSettings={this.props.toggleSettings}
            playing={this.props.playing}
            showSettings={this.props.showSettings}
          />}
        </div>
        <div className="o-grid__cell">
          <CitySelect
            cities={this.cities().filter(city => city.url_name != this.theOtherCity(this.props.urlNames[1]))}
            urlName={this.props.urlNames[1]}
            onChange={(newUrlName) => {this.props.onChange([this.props.urlNames[0], newUrlName])}}
          />
        </div>
      </div>
    );
  }
}

class CitySelect extends PureComponent {
  handleChange(event) {
    this.props.onChange(event.target.value);
  }

  render() {
    return (
      <div className="c-input-group">
        <select value={this.props.urlName} onChange={this.handleChange.bind(this)} className="c-field">
          <Translate component="option" value="" content="compare.select_city"/>
          {this.props.cities.map((city, cityIndex) =>
            <option key={`${city.url_name}-${cityIndex}`} value={city.url_name}>{`${city.name}, ${city.country}`}</option>
          )}
        </select>
        {this.props.urlName && <Link to={`/${this.props.urlName}`} className="c-link c-link--primary">
          <i className="fa fa-external-link-alt see-city"></i>
        </Link>}
      </div>
    )
  }
}


export default CityComparisonHeader
