import React, {Component} from 'react';

class City extends Component {
  render() {
    return <p>{this.props.params.city_id}</p>;
  }
}

export default City
