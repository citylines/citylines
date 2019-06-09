import React, {PureComponent} from 'react';
import {browserHistory} from 'react-router';
import PropTypes from 'prop-types';

import CityViewStore from '../../stores/city-view-store';
import MainStore from '../../stores/main-store';

import {PanelHeader, PanelBody} from '../panel';
import LinesTree from './lines-tree';
import Year from './year';
import KmIndicator from './km-indicator';
import Tags from '../tags';

class CityView extends PureComponent {
  constructor(props, context) {
    super(props, context);

    this.urlName = this.props.params.city_url_name;

    this.bindedOnChange = this.onChange.bind(this);
    this.bindedOnYearChange = this.onYearChange.bind(this);
    this.bindedOnLineToggle = this.onLineToggle.bind(this);
    this.bindedOnAllLinesToggle = this.onAllLinesToggle.bind(this);
  }

  onChange() {
    this.setState(CityViewStore.getState(this.urlName));
  }

  componentWillMount() {
    CityViewStore.addChangeListener(this.bindedOnChange);
  }

  componentDidMount() {
    MainStore.setLoading();
    CityViewStore.load(this.urlName, this.params()).then(() => {
      MainStore.unsetLoading();
    });
  }

  componentWillUnmount() {
    CityViewStore.unload(this.urlName);
    CityViewStore.removeChangeListener(this.bindedOnChange);
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState) return;

    if (prevState.linesShown.length != this.state.linesShown.length) {
      this.onLinesShownChange();
    }
  }

  params() {
    return this.props.location.query;
  }

  updateParams(newParams) {
    const params = Object.assign({}, this.params(), newParams);

    // We delete null params
    Object.keys(params).forEach((key) => (params[key] == null) && delete params[key]);

    // If new params are equal to the current ones, we don't push the state to the
    // browser history
    if (JSON.stringify(params) === JSON.stringify(this.params())) return;

    browserHistory.push({...this.props.location, query: params});
  }

  onYearChange() {
    if (this.state.playing) return;
    const newYear = this.state.currentYear;
    this.updateParams({year: newYear});
    CityViewStore.setKmYear(this.urlName, newYear, null);
  }

  onLineToggle(lineUrlName) {
    CityViewStore.toggleLine(this.urlName, lineUrlName);
  }

  onAllLinesToggle(system_id, checked) {
    CityViewStore.toggleAllLines(this.urlName, system_id, checked);
  }

  onLinesShownChange() {
    let linesShown;

    if (this.state.linesShown.length == this.state.lines.length) {
      linesShown = null;
    } else {
      linesShown = this.state.linesShown.join(',');
    }

    // An update in the lines parameter should remove the system_id param
    this.updateParams({lines: linesShown, system_id: null});
  }

  systemTitle() {
    const systemId = parseInt(this.params().system_id);
    const system = this.state.systems.find(s => s.id == systemId);

    if (!system) return;

    const interpolations = {
      city: this.context.cityName,
      system: system.name
    }

    return <Tags
            title="city.system_title"
            description="city.description"
            interpolations={interpolations}
          />
  }

  render() {
    if (!this.state) return null;

    return (
        <PanelBody>
          {this.params().system_id && this.systemTitle()}<div className="year-and-km-container">
            <Year
              urlName={this.urlName}
              min={(this.state.years || {}).start}
              max={(this.state.years || {}).end}
              year={this.state.currentYear}
              playing={this.state.playing}
              speed={this.state.speed}
              showTransportModes={this.state.showTransportModes}
              onYearChange={this.bindedOnYearChange}
            />
            <KmIndicator
              kmOperative={this.state.kmOperative}
              kmUnderConstruction={this.state.kmUnderConstruction}
            />
          </div>
          { this.state.systems.map((system) => {
            const systemLines = this.state.lines.filter(line => line.system_id == system.id);
            return systemLines.length ?
            <LinesTree
              key={system.id}
              systemId={system.id}
              name={system.name}
              defaultExpanded={true}
              lines={systemLines}
              linesShown={this.state.linesShown}
              transportModes={this.state.transportModes}
              showTransportModes={this.state.showTransportModes}
              onLineToggle={this.bindedOnLineToggle}
              onAllLinesToggle={this.bindedOnAllLinesToggle}
            /> : null })
          }
        </PanelBody>
    )
  }
}

CityView.contextTypes = {
  cityName: PropTypes.string
}

export default CityView
