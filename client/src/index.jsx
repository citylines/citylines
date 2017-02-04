import React from 'react';
import {render} from 'react-dom';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';

import Main from './components/main';
import Cities from './components/cities';
import City from './components/city';
import Editor from './components/editor';

render(
    <Router history={browserHistory}>
      <Route path="/" component={Main}>
        <IndexRoute component={Cities} />
        <Route path=":city_url_name" component={City} />
        <Route path=":city_url_name/edit" component={Editor} />
      </Route>
    </Router>,
    document.getElementById('container')
  );
