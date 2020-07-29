import React, {PureComponent} from 'react';
import YearControl from '../city/year-control';

class Year extends PureComponent {
  UNSAFE_componentWillReceiveProps(nextProps) {
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
        playing={this.props.playing}
        onYearChange={this.props.onYearChange.bind(this)}
        onToggleAnimation={this.props.toggleAnimation.bind(this)}
      />
    );
  }
}

export default Year
