import React, {Component} from 'react';
import { Link } from 'react-router';
import MainStore from '../stores/main-store.js'

class Main extends Component {
  componentWillMount() {
    MainStore.addChangeListener(() => this.onChange());
  }

  componentWillUnmount() {
    MainStore.removeChangeListener(() => this.onChange());
  }

  onChange() {
    this.setState(MainStore.getState());
  }

  displayMenu() {
    return (this.props.location.pathname !== '/');
  }

  togglePanel() {
    MainStore.togglePanel();
  }

  render() {
    return (
        <div>
          <nav className="c-nav c-nav--inline">
              <span className="c-nav__item" style={{display: this.displayMenu() ? 'inline-block' : 'none'}} onClick={this.togglePanel}>
                  <span className="fa fa-bars"></span>
              </span>
              <Link to="/" className="c-nav__item c-text--loud">
                  <span className="fa fa-subway"></span>
                  {" citylines.co"}
              </Link>
          </nav>
          <div className="o-grid o-panel o-panel--nav-top">
            {this.props.children}
          </div>
        </div>
      )
  }
}

export default Main
