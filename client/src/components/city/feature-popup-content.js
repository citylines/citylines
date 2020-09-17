import React, {Component} from 'react';
import Translate from 'react-translate-component';
import counterpart from 'counterpart';
import {formatNumber} from '../../lib/number-tools';
import SystemTags from './system-tags';

/**** Helpers ****/

const validFeatureValue = (value) => value !== null && value !== 0 && value !== 999999;

const validOrToday = (value) => validFeatureValue(value) ? value : counterpart('city.popup.today');

/*****************/

class FeaturePopupContent extends Component {
  fProps() {
    return this.props.feature.properties;
  }

  isStation() {
    return this.fProps().klass === 'Station';
  }

  currentLines() {
    const urlNames = Object.keys(this.fProps()).
      map(k => k.indexOf('url_name') > -1 ? this.fProps()[k] : null).
      filter(el => !!el);

    // We show first non historic or project lines
    return this.fProps().lines.
      filter(line => urlNames.indexOf(line.url_name) > -1).
      sort((a,b) => (a.historic || a.project) ? 1 : -1);
  }

  groupedSystems(lines) {
    const systems = {};

    lines.map(line => {
      if (!systems[line.system]) {
        systems[line.system] = [];
      };

      systems[line.system].push(line);
    });

    return systems;
  }

  render() {
    const currentLines = this.currentLines();

    return (
        <div className="c-text popup-feature-info">
          <ul className={`c-list c-list--unstyled ${this.props.index > 0 ? 'popup-feature-adjacent' : ''}`}>
          {this.isStation() ?
            <div>
              <li className="c-list__item">
                <Translate
                  className="station-popup"
                  content={`city.popup.${this.fProps().name ? 'named' : 'unnamed'}_station`}
                  with={{name: this.fProps().name}}
                />
              </li>
              { Object.entries(this.groupedSystems(currentLines)).map(([system, lines]) =>
                <LinesLabel lines={lines} key={system} />
              )}
            </div>
              :
            <LinesLabel lines={currentLines} />
          }
          <DetailedData
            isStation={this.isStation()}
            lines={this.fProps().lines}
            currentLines={currentLines}
            buildstart={this.fProps().buildstart}
            buildstart_end={this.fProps().buildstart_end}
            opening={this.fProps().opening}
            closure={this.fProps().closure}
            feature_closure={this.fProps().feature_closure}
            length={this.fProps().length}
            id={`${this.fProps().klass}-${this.fProps().id}`}
          />
        </ul>
      </div>
    )
  }
}

class DetailedData extends Component {
  transportModes() {
    const allModes= this.props.currentLines.map(l => l.transport_mode_name);
    return [ ...new Set(allModes) ].filter(e => e && e != 'default');
  }

  render() {
    const currentUrlNames = this.props.currentLines.map(l => l.url_name);

    const otherLines = this.props.lines.
      filter(line => currentUrlNames.indexOf(line.url_name) == -1).
      sort((a,b) => a.from && b.from && a.from > b.from ? 1 : -1);

    const i18nFeaturekey = this.props.isStation ? 'station' : 'track';

    return (
      <div>
        <input className="popup-data-checkbox" id={this.props.id} type='checkbox'></input>
        <div className="popup-data">
          <li className="c-list__item popup-transport-modes">
            { this.transportModes().map(t =>
               <Translate key={t} className="c-badge c-badge--ghost" content={`transport_modes.${t}`} />
            ) }
          </li>
          <li className="c-list__item popup-data-title">
            <Translate content={`city.popup.${i18nFeaturekey}_details`} />
          </li>
          { this.props.length &&
            <li className="c-list__item"><Translate content="city.popup.length" with={{km: formatNumber(parseFloat(this.props.length)/1000)}} /></li>}
          { validFeatureValue(this.props.buildstart) &&
              <li className="c-list__item"><Translate content="city.popup.construction" with={{from: this.props.buildstart, to: validOrToday(this.props.buildstart_end)}} /></li>}
          { (validFeatureValue(this.props.opening) && this.props.opening <= (new Date).getFullYear()) &&
              <li className="c-list__item"><Translate content="city.popup.operation" with={{from: this.props.opening, to: validOrToday(this.props.closure)}} /></li>}
          { validFeatureValue(this.props.feature_closure) &&
              <li className="c-list__item"><Translate content="city.popup.closure" with={{year: this.props.feature_closure}} /></li> }
          { otherLines.length > 0 &&
            <li className="c-list__item popup-data-title">
              <Translate content={`city.popup.other_lines_${i18nFeaturekey}`} />
            </li>}
          { otherLines.length > 0 && otherLines.map(line =>
            <LinesLabel
              lines={[line]}
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

/*
 * This method accepts multiple lines, and displays them this way:
 * L1 L2 L3 Subway
 * where the system name refers to the first line. We assume all lines belong to the same system.
 * */
class LinesLabel extends Component {
  lineStyle(line) {
    return {
      color: line.label_font_color,
      backgroundColor: line.color,
      marginLeft: 0,
      marginRight: 5
    }
  }

  system() {
    // If there are multiple lines,
    // we assume that they all belong to the same systemm
    return {
      name: this.props.lines[0].system,
      historic: this.props.lines[0].historic,
      project: this.props.lines[0].project
    };
  }

  render() {
    return (
      <li className="c-list__item line-label-li">
        {this.props.lines.map(line =>
          <span key={line.name} className="c-text--highlight line-label" style={this.lineStyle(line)}>{line.name}</span>
        )}

        <strong className="line-label-system">{this.system().name}</strong><SystemTags system={this.system()} />

        {/* We loop through all lines, but we usually use showYears with only one line */}
        {this.props.showYears && this.props.lines.map(line =>
          validFeatureValue(line.from) &&
            <span key={line.name} className="line-label-year">{`${line.from} - ${validOrToday(line.to)}`}</span>
        )}
      </li>
    )
  }
}

export default FeaturePopupContent
