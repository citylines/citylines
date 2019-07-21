import React, {Component} from 'react';
import Translate from 'react-translate-component';

class FeaturePopupContent extends Component {
  fProps() {
    return this.props.feature.properties;
  }

  lineStyle(p) {
    return {color: p.lineLabelColor, backgroundColor: p.lineColor, marginLeft: 0, marginRight: 5, boxShadow: (p.lineLabelColor === '#000' ? '0 0 1px rgba(0,0,0,0.5)' : null)};
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

  isStation() {
    return this.fProps().klass === 'Station';
  }

  render() {
    const fProps = this.fProps();

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
          <DetailedData
            isStation={this.isStation()}
            lines={fProps.lines}
            transport_mode_name={fProps.transport_mode_name}
            buildstart={fProps.buildstart}
            opening={fProps.opening}
            closure={fProps.closure}
            length={fProps.length}
            id={`${fProps.klass}-${fProps.id}`}
          />
        </ul>
      </div>
    )
  }
}

class DetailedData extends Component {
  transportModes() {
    let allModes = [];

    if (this.props.isStation) {
      allModes= this.props.lines.map(l => l.transport_mode_name);
    } else {
      allModes.push(this.props.transport_mode_name);
    }

    return [ ...new Set(allModes) ].filter(e => e && e != 'default');
  }

  validFeatureValue(value) {
    return (value !== null && value !== 0 && value !== 999999);
  }

  render() {
    return (
      <div>
        <input className="popup-data-checkbox" id={this.props.id} type='checkbox'></input>
        <div className="popup-data">
          <li className="c-list__item">
            { this.transportModes().map(t =>
               <Translate key={t} className="c-badge c-badge--ghost popup-transport-mode" content={`transport_modes.${t}`} />
            ) }
          </li>
          <li className="c-list__item popup-data-title">
            { !this.props.isStation && <Translate content="city.popup.track" /> }
          </li>
          { this.validFeatureValue(this.props.buildstart) ? <li className="c-list__item"><Translate content="city.popup.buildstart" with={{year: this.props.buildstart}} /></li> : ''}
          { this.validFeatureValue(this.props.opening) ? <li className="c-list__item"><Translate content="city.popup.opening" with={{year: this.props.opening}} /></li> : ''}
          { this.validFeatureValue(this.props.closure) ? <li className="c-list__item"><Translate content="city.popup.closure" with={{year: this.props.closure}} /></li> : ''}
          { this.props.length ? <li className="c-list__item"><Translate content="city.popup.length" with={{km: (parseFloat(this.props.length)/1000).toLocaleString(undefined,{ maximumFractionDigits: 2})}} /></li> : ''}
        </div>
        <label htmlFor={this.props.id} className="popup-data-toggle c-link">
          <span className="show-more">+</span>
          <span className="show-less">−</span>
        </label>
      </div>
    )
  }
}

export default FeaturePopupContent
