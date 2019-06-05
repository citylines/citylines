import React, {PureComponent} from 'react';

class CityComparisonSettings extends PureComponent {
  systems(urlName) {
    const city = this.props.cities[urlName];
    if (!city || !city.systems) return [];
    return city.systems.filter(s => s.name).
      map(s => {s.show = city.systemsShown.includes(s.id); return s});
  }

  render() {
    return (
      <div className="comparison-settings o-grid">
        {
          this.props.urlNames.map((urlName) =>
            <div key={`systems-of-${urlName}`} className="o-grid__cell">
              {
                this.systems(urlName).map(system =>
                  <label key={`system-${system.id}`} className="c-toggle">
                    <input
                      type="checkbox"
                      checked={system.show}
                      onChange={() => this.props.onSystemToggle(urlName,system.id,!system.show)}
                    >
                    </input>
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
