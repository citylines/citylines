import React, {Component} from 'react';
import {Link} from 'react-router-dom';
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

    if (response.status != 200) return;

    const json = await response.json();

    MainStore.setUser(json);

    browserHistory.push(`/user/${json.userid}`);
  }

  render() {
    return (
        <div className="u-center-block__content">
          <div className="o-form-element" style={{textAlign: 'center'}}>
          <ul className="auth">
            {this.state.google_client_id &&
              <li><Translate
                component={GoogleLogin}
                clientId={this.state.google_client_id}
                attributes={{buttonText: "auth.log_in_with_google"}}
                fetchBasicProfile={true}
                autoLoad={true}
                onSuccess={this.onGoogleResponse} /></li>
            }
            <li><Translate content="auth.log_in_with_twitter" component="a" href="/api/auth/twitter" className="twitter"/></li>
            </ul>
          </div>
          <div className="o-form-element">
            <Translate content="auth.disclaimer"/> <Translate component={Link} className="c-link" content="auth.disclaimer_link" to="/terms#contributor"/><br />
            <Translate content="auth.privacy_disclaimer"/> <Translate component={Link} className="c-link" content="auth.privacy_disclaimer_link" to="/terms#privacy"/>.
          </div>
        </div>
    )
  }
}

export default Auth
