import React from 'react';
import {render} from 'react-dom';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';

import Main from './components/main';
import Cities from './components/cities';
import City from './components/city';
import CityView from './components/city/city-view';
import Editor from './components/editor';
import Auth from './components/auth';

render(
    <Router history={browserHistory}>
      <Route path="/" component={Main}>
        <IndexRoute component={Cities} />
        <Route path="auth" component={Auth} />
        <Route path=":city_url_name" component={City}>
          <IndexRoute component={CityView} />
          <Route path="edit" component={Editor} />
        </Route>
      </Route>
    </Router>,
    document.getElementById('container')
  );
