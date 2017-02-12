import React, {Component} from 'react';
import MainStore from '../stores/main-store';
import {browserHistory} from 'react-router';

class Auth extends Component {
  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
    gapi.signin2.render('g-signin2', {
      'scope': 'https://www.googleapis.com/auth/plus.login',
      'width': 200,
      'height': 50,
      'longtitle': true,
      'theme': 'dark',
      'onsuccess': this.onSignIn
    });
  }

  async onSignIn(googleUser) {
    const url = '/api/auth';
    const token = googleUser.getAuthResponse().id_token;
    const body = JSON.stringify({token: token});

    const response = await fetch(url, {method: 'POST', body: body});
    const json = await response.json();

    MainStore.setUser(json.username);

    browserHistory.push('/');
  }

  render() {
    return (
        <div className="u-center-block__content">
          <h3 className="c-heading">Iniciar sesión</h3>
          <div className="o-form-element">
            <div id="g-signin2"></div>
          </div>
        </div>
    )
  }
}

export default Auth
