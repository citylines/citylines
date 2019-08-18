import React, {PureComponent} from 'react';
import YearControl from '../city/year-control';

class Year extends PureComponent {
  componentWillReceiveProps(nextProps) {
    if (nextProps.year != this.props.year && this.props.onUpdate) {
      this.props.onUpdate();
    }
  }

  render() {
    return (
      <YearControl
        year={this.props.year}
        min={this.props.min}
        max={this.props.max}
        showSettings={this.props.showSettings}
        onYearChange={this.props.onYearChange.bind(this)}
        onToggleAnimation={this.props.toggleAnimation.bind(this)}
        onToggleSettings={this.props.toggleSettings.bind(this)}
      />
    );
  }
}

export default Year
