import React, {Component} from 'react';
import Translate from 'react-translate-component';
import {formatNumber} from '../../lib/number-tools';

class FeaturePopupContent extends Component {
  fProps() {
    return this.props.feature.properties;
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
    const currentLine = fProps.lines.find(el => el.url_name == fProps.line_url_name);

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
            <LineLabel line={currentLine} />
          }
          <DetailedData
            isStation={this.isStation()}
            lines={fProps.lines}
            transport_mode_name={fProps.transport_mode_name}
            buildstart={fProps.buildstart}
            buildstart_end={fProps.buildstart_end}
            line_url_name={fProps.line_url_name}
            opening={fProps.opening}
            closure={fProps.closure}
            section_closure={fProps.section_closure}
            length={fProps.length}
            id={`${fProps.klass}-${fProps.id}`}
          />
        </ul>
      </div>
    )
  }
}


const validFeatureValue = (value) => value !== null && value !== 0 && value !== 999999;

// FIXME: Replace 'Today' with i18n.
const validOrToday = (value) => validFeatureValue(value) ? value : 'Today';

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

  render() {
    const otherLines = this.props.lines.
      filter(line => line.url_name != this.props.line_url_name).
      sort((a,b) => a.from && b.from && a.from > b.from ? 1 : -1);

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
          { this.props.length && <li className="c-list__item"><Translate content="city.popup.length" with={{km: formatNumber(parseFloat(this.props.length)/1000)}} /></li>}
          { validFeatureValue(this.props.buildstart) &&
            <li className="c-list__item">{`Construction: ${this.props.buildstart} - ${validOrToday(this.props.buildstart_end)}`}</li>}
          { (validFeatureValue(this.props.opening) || validFeatureValue(this.props.closure)) &&
              <li className="c-list__item">{`Operation: ${this.props.opening} - ${validOrToday(this.props.closure)}`}</li>}
          { validFeatureValue(this.props.section_closure) &&
              <li className="c-list__item"><Translate content="city.popup.closure" with={{year: this.props.section_closure}} /></li> }
          { otherLines.length > 0 &&
            <li className="c-list__item popup-data-title">
              Other lines on the same track
            </li>}
          { otherLines.length > 0 && otherLines.map(line =>
            <LineLabel
              line={{...line}}
              key={line.url_name}
              showYears={true}
            />)}
        </div>
        <label htmlFor={this.props.id} className="popup-data-toggle c-link">
          <span className="show-more"><span className="fas fa-angle-down"/></span>
          <span className="show-less"><span className="fas fa-angle-up"/></span>
        </label>
      </div>
    )
  }
}

class LineLabel extends Component {
  lineStyle() {
    return {
      color: this.props.line.label_font_color,
      backgroundColor: this.props.line.color,
      marginLeft: 0,
      marginRight: 5,
      boxShadow: this.props.line.label_font_color === '#000' ? '0 0 1px rgba(0,0,0,0.5)' : null
    };
  }

  render() {
    return (
      <li className="c-list__item line-label-li">
        <span className="c-text--highlight line-label" style={this.lineStyle(this.props.line)}>{this.props.line.name}</span>
        <strong className="line-label-system">{this.props.line.system}</strong>
        {this.props.showYears &&
          <span className="line-label-system">{` (${this.props.line.from} - ${validOrToday(this.props.line.to)})`}</span>
        }
      </li>
    )
  }
}

export default FeaturePopupContent
