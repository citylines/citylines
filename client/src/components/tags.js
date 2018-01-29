import React, {Component} from 'react';
import counterpart from 'counterpart';
import {Helmet} from "react-helmet";

class Tags extends Component {
  render() {
    const interpolations = this.props.interpolations || {};
    let title = counterpart(`${this.props.klass}.title`, interpolations);

    if (this.props.klass != 'main') {
      title = `${title} | ${counterpart('main.title')}`;
    }

    const description = counterpart(`${this.props.klass}.description`, interpolations);

    return (
      <Helmet>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        <meta name="description" content={description} />
        <meta property="og:description" content={description} />
      </Helmet>
    )
  }
}

export default Tags
