import React, {PureComponent} from 'react';
import {browserHistory} from 'react-router';

import CityViewStore from '../../stores/city-view-store';
import MainStore from '../../stores/main-store';

import {PanelHeader, PanelBody} from '../panel';
import LinesTree from './lines-tree';
import Year from './year';
import KmIndicator from './km-indicator';

class CityView extends PureComponent {
  constructor(props, context) {
    super(props, context);

    this.urlName = this.props.params.city_url_name;

    this.bindedOnChange = this.onChange.bind(this);
    this.bindedOnYearChange = this.onYearChange.bind(this);
    this.bindedOnLineToggle = this.onLineToggle.bind(this);
    this.bindedOnLinesShownChange = this.onLinesShownChange.bind(this);
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

  params() {
    return this.props.location.query;
  }

  updateParams(newParams) {
    const params = Object.assign({}, this.params(), newParams);

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

  onAllLinesToggle(system_id, all) {
    CityViewStore.toggleAllLines(this.urlName, system_id, all);
  }

  onLinesShownChange() {
    const linesShown = this.state.linesShown.join(',');
    this.updateParams({lines: linesShown});
  }

  render() {
    if (!this.state) return null;

    return (
        <PanelBody>
          <div className="year-and-km-container">
            <Year
              urlName={this.urlName}
              min={(this.state.years || {}).start}
              max={(this.state.years || {}).end}
              year={this.state.currentYear}
              playing={this.state.playing}
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
              onLineToggle={this.bindedOnLineToggle}
              onLinesShownChange={this.bindedOnLinesShownChange}
              onAllLinesToggle={this.bindedOnAllLinesToggle}
            /> : null })
          }
        </PanelBody>
    )
  }
}

export default CityView
