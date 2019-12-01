import React from 'react';
import {render} from 'react-dom';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Counterpart from 'counterpart';

import Main from './components/main';

Counterpart.registerTranslations(window.locale, window.i18n);
Counterpart.setLocale(window.locale);

import assets from './lib/assets-provider';
assets.loadPaths(window.assetsPaths);

render(
    <Router>
      <Route path='/' component={Main} />
    </Router>
  ,
    document.getElementById('container')
  );
