import React, {Component} from 'react';
import Panel from './panel';
import MainStore from '../stores/main-store';

class City extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      main: MainStore.getState()
    }

    this.bindedOnChange = this.onChange.bind(this);
  }

  componentWillMount() {
    MainStore.addChangeListener(this.bindedOnChange);
  }

  componentWillUnmount() {
    MainStore.removeChangeListener(this.bindedOnChange);
  }

  onChange() {
    this.setState({
      main: MainStore.getState()
    });
  }

  render() {
    return (
        <Panel display={this.state.main.displayPanel}>
          <p>{this.props.params.city_id}</p>
        </Panel>
        );
  }
}

export default City
