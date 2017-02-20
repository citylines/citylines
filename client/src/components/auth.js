import React, {Component} from 'react';
import MainStore from '../stores/main-store';
import {browserHistory} from 'react-router';
import GoogleLogin from 'react-google-login';

class Auth extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {};
  }

  componentDidMount() {
    this.loadGoogleSignIn()
  }

  async loadGoogleSignIn() {
    const url = '/api/auth/google_client_id';
    const response = await fetch(url);
    const json = await response.json();
    this.setState({google_client_id: json.google_client_id});
  }

  async onGoogleResponse(googleResponse) {
    const url = '/api/auth';
    const token = googleResponse.tokenId;
    const body = JSON.stringify({token: token});

    const response = await fetch(url, {method: 'POST', body: body, credentials: 'same-origin'});
    const json = await response.json();

    MainStore.setUser(json.username);

    browserHistory.push('/');
  }

  render() {
    return (
        <div className="u-center-block__content">
          <h3 className="c-heading">Iniciar sesión</h3>
          <div className="o-form-element">
            {this.state.google_client_id &&
              <GoogleLogin
                clientId={this.state.google_client_id}
                buttonText="Iniciar sesión con Google"
                fetchBasicProfile={true}
                autoLoad={true}
                onSuccess={this.onGoogleResponse} />
            }
          </div>
        </div>
    )
  }
}

export default Auth
