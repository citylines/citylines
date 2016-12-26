import React, {Component} from 'react';
import {Panel, PanelHeader, PanelBody} from './panel';
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
          <PanelHeader>
            <h3 className="c-heading">{this.props.params.city_url_name}</h3>
          </PanelHeader>
          <PanelBody>
            {"Some body"}
          </PanelBody>
        </Panel>
        );
  }
}

export default City
