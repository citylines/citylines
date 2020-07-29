import React, {PureComponent} from 'react';
import TimelineSpeedControl from '../city/timeline-speed-control';

class CityComparisonSettings extends PureComponent {
  systems(urlName) {
    const systems = this.props.systems[urlName];
    const systemsShown = this.props.systemsShown[urlName];

    if (!systems || !systemsShown) return [];

    return systems.filter(s => s.name).
      map(s => {s.show = systemsShown.includes(s.id); return s});
  }

  cityName(urlName) {
   const city = this.props.cities[urlName];
   return city ? city.name : null;
  }

  render() {
    return (
      <div className="comparison-settings">
        <div className="c-card">
          <div className="c-card__item">
            <div className="comparison-settings-timeline-speed-container">
              <TimelineSpeedControl
                speed={this.props.speed}
                onSpeedChange={this.props.onSpeedChange}
              />
            </div>
            <div className="o-grid">
            {
              this.props.urlNames.map((urlName) =>
                <div key={`systems-of-${urlName}`} className="o-grid__cell">
                  <div className="c-text">{this.cityName(urlName)}</div>
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
          </div>
        </div>
      </div>
    )
  }
}

export default CityComparisonSettings
