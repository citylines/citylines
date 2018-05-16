import React, {Component} from 'react';
import Translate from 'react-translate-component';

class FeaturePopupContent extends Component {
  fProps() {
    return this.props.feature.properties;
  }

  lineStyle(p) {
    return {color: p.lineLabelColor, backgroundColor: p.lineColor, marginLeft: 0, marginRight: 5, boxShadow: (p.lineLabelColor === '#000' ? '0 0 1px rgba(0,0,0,0.5)' : null)};
  }

  validFeatureValue(value) {
    return (value !== null && value !== 999999)
  }

  groupedSystems(linesInfo) {
    let systems = {};

    linesInfo.map((l) => {
      if (!systems[l.system]) {
        systems[l.system] = {name: l.system, lines: []}
      };

      systems[l.system].lines.push(l)
    });

    return systems;
  }

  stationTransportModes() {
    return [ ...new Set(this.fProps().lines.map(l => l.transport_mode_name)) ].filter(e => e && e != 'default');
  }

  transportModeLabel(tm) {
    return <Translate className="c-badge c-badge--ghost popup-transport-mode" content={`transport_modes.${tm}`} />;
  }

  isStation() {
    return this.fProps().klass === 'Station';
  }

  render() {
    const fProps = this.fProps();
    const checkBoxId = `${fProps.klass}-${fProps.id}`;

    return (
        <div className="c-text popup-feature-info">
          <ul className={`c-list c-list--unstyled ${this.props.index > 0 ? 'popup-feature-adjacent' : ''}`}>
          {this.isStation() ?
            <div>
              <li className="c-list__item">
                <Translate className="station-popup" content={`city.popup.${fProps.name ? '' : 'unnamed_'}station`} with={{name: fProps.name}} />
              </li>
              {Object.entries(this.groupedSystems(fProps.lines)).map((e, index) => {
                  const s = e[1];
                  return <li key={index} className="c-list__item">
                    {s.lines.map((l, index2) => <span key={`l-${index2}`} className="c-text--highlight line-label" style={this.lineStyle(l)}>{l.line}</span>)}
                    <strong>{s.name}</strong>
                  </li>
                }
              )}
            </div>
              :
            <div>
              <li className="c-list__item">
                <span className="c-text--highlight line-label" style={this.lineStyle(fProps)}>{fProps.line}</span>
                <strong>{fProps.system}</strong>
              </li>
            </div>
          }
          <input className="popup-data-checkbox" id={checkBoxId} type='checkbox'></input>
          <div className="popup-data">
            {
              this.isStation() &&
              <li className="c-list__item">{this.stationTransportModes().map(t => <span key={t}>{this.transportModeLabel(t)}</span>)}</li>
            }
            {
              !this.isStation() && fProps.transport_mode_name && fProps.transport_mode_name != 'default' &&
                <li className="c-list__item">{this.transportModeLabel(fProps.transport_mode_name)}</li>
            }
            <li className="c-list__item popup-data-title">
              { !this.isStation() && <Translate content="city.popup.track" /> }
            </li>
            { fProps.buildstart ? <li className="c-list__item"><Translate content="city.popup.buildstart" with={{year: fProps.buildstart}} /></li> : ''}
            { this.validFeatureValue(fProps.opening) ? <li className="c-list__item"><Translate content="city.popup.opening" with={{year: fProps.opening}} /></li> : ''}
            { this.validFeatureValue(fProps.closure) ? <li className="c-list__item"><Translate content="city.popup.closure" with={{year: fProps.closure}} /></li> : ''}
            { fProps.length ? <li className="c-list__item"><Translate content="city.popup.length" with={{km: (parseFloat(fProps.length)/1000).toFixed(2)}} /></li> : ''}
          </div>
          <label htmlFor={checkBoxId} className="c-link popup-data-toggle fa fa-info-circle"></label>
        </ul>
      </div>
    )
  }
}

export default FeaturePopupContent
