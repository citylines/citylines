import React from 'react';
import CityBase from '../city-base';
import PropTypes from 'prop-types';

import CityViewStore from '../../stores/city-view-store';
import MainStore from '../../stores/main-store';

import {PanelHeader, PanelBody} from '../panel';
import LinesTree from './lines-tree';
import Year from './year';
import KmIndicator from './km-indicator';
import Tags from '../tags';

class CityView extends CityBase {
  constructor(props, context) {
    super(props, context);

    this.urlName = this.props.match.params.city_url_name;

    this.bindedOnChange = this.onChange.bind(this);
    this.bindedOnYearChange = this.onYearChange.bind(this);
    this.bindedOnLineToggle = this.onLineToggle.bind(this);
    this.bindedOnAllLinesToggle = this.onAllLinesToggle.bind(this);
    this.bindedHandleSpeedChange = this.handleSpeedChange.bind(this)
  }

  onChange() {
    this.setState(CityViewStore.getState(this.urlName));
  }

  componentDidMount() {
    CityViewStore.addChangeListener(this.bindedOnChange);

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

  handleSpeedChange(speed) {
    this.updateParams({speed: speed});

    CityViewStore.setSpeed(this.urlName, speed);
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
              onSpeedChange={this.bindedHandleSpeedChange}
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
