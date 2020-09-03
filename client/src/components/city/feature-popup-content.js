import React, {Component} from 'react';
import Translate from 'react-translate-component';
import counterpart from 'counterpart';
import {formatNumber} from '../../lib/number-tools';

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
    return this.fProps().lines.filter(line => urlNames.indexOf(line.url_name) > -1);
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
              { currentLines.map(line =>
                <LineLabel
                  line={line}
                  key={line.url_name}
                /> )}
            </div>
              :
            <LineLabel line={currentLines[0]} />
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
               <Translate key={t} className="c-badge c-badge--ghost transport-mode-label" content={`transport_modes.${t}`} />
            ) }
          </li>
          <li className="c-list__item popup-data-title">
            <Translate content={`city.popup.${i18nFeaturekey}_details`} />
          </li>
          { this.props.length &&
            <li className="c-list__item"><Translate content="city.popup.length" with={{km: formatNumber(parseFloat(this.props.length)/1000)}} /></li>}
          { validFeatureValue(this.props.buildstart) &&
              <li className="c-list__item"><Translate content="city.popup.construction" with={{from: this.props.buildstart, to: validOrToday(this.props.buildstart_end)}} /></li>}
          { (validFeatureValue(this.props.opening) || validFeatureValue(this.props.closure)) &&
              <li className="c-list__item"><Translate content="city.popup.operation" with={{from: this.props.opening, to: validOrToday(this.props.closure)}} /></li>}
          { validFeatureValue(this.props.feature_closure) &&
              <li className="c-list__item"><Translate content="city.popup.closure" with={{year: this.props.feature_closure}} /></li> }
          { otherLines.length > 0 &&
            <li className="c-list__item popup-data-title">
              <Translate content={`city.popup.other_lines_${i18nFeaturekey}`} />
            </li>}
          { otherLines.length > 0 && otherLines.map(line =>
            <LineLabel
              line={line}
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
    const line = this.props.line;

    return {
      color: line.label_font_color,
      backgroundColor: line.color,
      marginLeft: 0,
      marginRight: 5,
      boxShadow: '0 1.5px 0 rgba(0,0,0,0.1)'
    }
  }

  render() {
    return (
      <li className="c-list__item line-label-li">
        <span className="c-text--highlight line-label" style={this.lineStyle()}>{this.props.line.name}</span>
        <strong className="line-label-system">{this.props.line.system}</strong>
        {this.props.showYears && validFeatureValue(this.props.line.from) &&
          <div className="line-label-system">{`${this.props.line.from} - ${validOrToday(this.props.line.to)}`}</div>}
      </li>
    )
  }
}

export default FeaturePopupContent
