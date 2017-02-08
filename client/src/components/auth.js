import React, {Component} from 'react';

class Auth extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {msg: ''}

    this.bindedOnSubmit = this.onSubmit.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();
    this.login();
  }

  async login() {
    const url = '/api/auth';
    const email = this.refs.email.value;
    const password = this.refs.password.value;

    if (!email || !password) {
      this.setState({msg: 'Fields missing'});
      return;
    }

    const body = JSON.stringify({email: email, password: password});

    const response = await fetch(url, {method: 'POST', body: body});
    const json = await response.json();

    this.setState({msg: json.msg});
  }

  render() {
    return (
        <div className="u-center-block__content">
          <h2 className="c-heading">Iniciar sesión</h2>
          <form onSubmit={this.bindedOnSubmit}>
          <div className="o-form-element">
            <p>{this.state.msg}</p>
            <div className="c-input-group c-input-group--stacked">
              <div className="o-field">
                <input ref="email" className="c-field" placeholder="Email" type="email" required></input>
              </div>
              <div className="o-field">
                <input ref="password" className="c-field" placeholder="Contraseña" type="password" required></input>
              </div>
            </div>
          </div>
          <div className="o-form-element">
            <button type="submit" className="c-button c-button--info c-button--block">Iniciar sesión</button>
          </div>
          </form>
        </div>
    )
  }
}

export default Auth
