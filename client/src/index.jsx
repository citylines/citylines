import React from 'react';
import {render} from 'react-dom';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';

import Main from './components/main';
import Landing from './components/landing';
import City from './components/city';

render(
    <Router history={browserHistory}>
      <Route path="/" component={Main}>
        <IndexRoute component={Landing} />
        <Route path=":city_id" component={City} />
      </Route>
    </Router>,
    document.getElementById('container')
  );
