import React, {Component} from 'react';
import MainStore from '../stores/main-store';
import {browserHistory} from 'react-router';
import GoogleLogin from 'react-google-login';
import Translate from 'react-translate-component';

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
          <Translate component="h3" className="c-heading" content="auth.log_in" />
          <div className="o-form-element">
            {this.state.google_client_id &&
              <Translate
                component={GoogleLogin}
                clientId={this.state.google_client_id}
                attributes={{buttonText: "auth.log_in_with_google"}}
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
