import React from 'react';
import {render} from 'react-dom';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';
import Counterpart from 'counterpart';

import Main from './components/main';
import Cities from './components/cities';
import City from './components/city';
import CityView from './components/city/city-view';
import Editor from './components/editor';
import Auth from './components/auth';
import Terms from './components/terms';
import Data from './components/data';
import User from './components/user';
import Error from './components/error';
import CityComparison from './components/city-comparison';

import MainStore from './stores/main-store';

Counterpart.registerTranslations(window.locale, window.i18n);
Counterpart.setLocale(window.locale);

import assets from './lib/assets-provider';
assets.loadPaths(window.assetsPaths);

const requireAuth = () => {
  if (!MainStore.userLoggedIn()) {
    browserHistory.push('/auth');
  }
}

let previousPathname = null;

browserHistory.listen( loc =>  {
  if (loc.pathname != previousPathname) {
    previousPathname = loc.pathname;
    ga("send", "pageview", loc.pathname);
  }
});

render(
    <Router history={browserHistory}>
      <Route path="/" component={Main}>
        <IndexRoute component={Cities} />
        <Route path="auth" component={Auth} />
        <Route path="terms" component={Terms} />
        <Route path="data" component={Data} />
        <Route path="error" component={Error} />
        <Route path="compare" component={CityComparison} />
        <Route path="user/:user_id" component={User} />
        <Route path=":city_url_name" component={City}>
          <IndexRoute component={CityView} />
          <Route path="edit" component={Editor} onEnter={requireAuth} />
        </Route>
      </Route>
    </Router>,
    document.getElementById('container')
  );
