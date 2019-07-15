import {PureComponent} from 'react';
import {browserHistory} from 'react-router';

class CityBase extends PureComponent {
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
}

export default CityBase
