import {PureComponent} from 'react';
import queryString from 'query-string';
import deepEqual from '../lib/deep-equal';

class CityBase extends PureComponent {
  params() {
    return queryString.parse(this.props.location.search)
  }

  updateParams(newParams) {
    const params = Object.assign({}, this.params(), newParams);

    // We delete null params
    Object.keys(params).forEach((key) => (params[key] == null) && delete params[key]);

    // If new params are equal to the current ones, we don't push the state to the
    // browser history
    if (deepEqual(params, this.params())) return;

    this.props.history.push({...this.props.location, search: '?' + queryString.stringify(params)});
  }
}

export default CityBase
