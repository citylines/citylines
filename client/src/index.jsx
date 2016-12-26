import React from 'react';
import {render} from 'react-dom';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';

import Main from './components/main';
import Cities from './components/cities';
import City from './components/city';

render(
    <Router history={browserHistory}>
      <Route path="/" component={Main}>
        <IndexRoute component={Cities} />
        <Route path=":city_url_name" component={City} />
      </Route>
    </Router>,
    document.getElementById('container')
  );
