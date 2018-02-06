import React, {Component} from 'react';
import counterpart from 'counterpart';
import {Helmet} from "react-helmet";

class Tags extends Component {
  url() {
    return window.location.origin + window.location.pathname;
  }

  urlWithLocale(locale) {
    return `${this.url()}?locale=${locale}`;
  }

  render() {
    const interpolations = this.props.interpolations || {};

    let title = counterpart(this.props.title, interpolations);

    if (this.props.title != 'main.title') {
      title = `${title} | ${counterpart('main.title')}`;
    }

    let description;

    if (this.props.description) {
      description = counterpart(this.props.description, interpolations);
    }

    return (
      <Helmet>
        <title>{title}</title>
        <meta property="og:title" content={title} />

        { description && <meta name="description" content={description} /> }
        { description && <meta property="og:description" content={description} /> }

        <link rel="canonical" href={this.url()} />
        <link rel="alternate" hreflang="es" href={this.urlWithLocale("es")} />
        <link rel="alternate" hreflang="en" href={this.urlWithLocale("en")} />
      </Helmet>
    )
  }
}

export default Tags
