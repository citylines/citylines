import React, {PureComponent} from 'react';

class CityComparisonSettings extends PureComponent {
  render() {
    return (
      <div className="comparison-settings o-grid">
        {
          Object.entries(this.props.cities).map(([class_name,data]) =>
            <div key={`systems-of-${class_name}`} className="o-grid__cell">
              {
                data.systems.map(system =>
                  <label className="c-toggle">
                    <input type="checkbox" value="on"></input>
                    <div className="c-toggle__track">
                      <div className="c-toggle__handle"></div>
                    </div>
                    <span>{system.name}</span>
                  </label>
                )
              }
            </div>
          )
        }
      </div>
    )
  }
}

export default CityComparisonSettings
