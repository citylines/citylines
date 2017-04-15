import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Link} from 'react-router';
import Translate from 'react-translate-component';

import UserStore from '../stores/user-store';

class User extends Component {
  constructor(props, context) {
    super(props, context);

    this.userId = this.props.params.user_id;

    this.bindedOnChange = this.onChange.bind(this);
  }

  componentWillMount() {
    UserStore.addChangeListener(this.bindedOnChange);
  }

  componentWillUnmount() {
    UserStore.removeChangeListener(this.bindedOnChange);
  }

  onChange() {
    this.setState(UserStore.getState());
  }

  componentDidMount() {
    UserStore.load(this.userId);
  }

  render() {
    console.log(this.state);
    return null;
  }
}

export default User
