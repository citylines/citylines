import './public-path.js';

import React from 'react';
import {render} from 'react-dom';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Counterpart from 'counterpart';

import Main from './components/main';

Counterpart.setMissingEntryGenerator((key) => '');

import assets from './lib/assets-provider';
assets.setCDNURL(window.CDN_URL);
assets.loadPaths(window.assetsPaths);

render(
    <Router>
      <Route path='/' component={Main} />
    </Router>
  ,
    document.getElementById('container')
  );
