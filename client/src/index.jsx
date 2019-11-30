import React from 'react';
import {render} from 'react-dom';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Counterpart from 'counterpart';

import Main from './components/main';

import MainStore from './stores/main-store';

Counterpart.registerTranslations(window.locale, window.i18n);
Counterpart.setLocale(window.locale);

import assets from './lib/assets-provider';
assets.loadPaths(window.assetsPaths);

let previousPathname = null;
/*
browserHistory.listen( loc =>  {
  if (loc.pathname != previousPathname) {
    previousPathname = loc.pathname;
    ga("send", "pageview", loc.pathname);
  }
});
*/
render(
    <Router>
      <Route path='/' component={Main} />
    </Router>
  ,
    document.getElementById('container')
  );
