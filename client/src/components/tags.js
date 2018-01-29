import React, {Component} from 'react';
import counterpart from 'counterpart';
import {Helmet} from "react-helmet";

class Tags extends Component {
  render() {
    const title = counterpart(`${this.props.klass}.title`);
    const description = counterpart(`${this.props.klass}.description`);

    return (
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={description} />
        <meta property="og:description" content={description} />
      </Helmet>
    )
  }
}

export default Tags
