import React, {PureComponent} from 'react';
import {Link} from 'react-router-dom';

class About extends PureComponent {
  /* TODO:
   * - Tags component
   * - i18n
   **/

  render() {
    return (
      <div className="o-container o-container--medium u-pillar-box--medium" style={{textAlign: "justify"}}>
        <div className="u-letter-box--xlarge letter-with-footer">
          <h1 className="c-heading">About</h1>
          <p>
            <Link className="c-link" to="/">Citylines.co</Link> is a collaborative platform for mapping the transit systems of the world. The source code is <a className="c-link" href="https://github.com/citylines">open</a>, licensed under the <a className="c-link" href="https://github.com/citylines/citylines/blob/master/LICENSE.md">MIT license</a>, and the data is available under the <a className="c-link" href="http://opendatacommons.org/licenses/odbl/1.0/" target="_blank">Open Database License</a>. Please refer to the <Link className="c-link" to="/">License section</Link> for more details.
          </p>

          <h2 className="c-heading">Our mission</h2>
          <p>
            Our mission is to create a global repository and visualization tool of transit geodata, specially focused on the historic dimension of urban transport systems.
          </p>
          <p>
            We also want to develop tools that allow us to manipulate this data, in particular, regarding:
            <ul className="c-list">
              <li>Integration with OpenStreetMap (OSM). Current import-based integration should be improved by allowing the possibiliy of exporting data back to OSM. <a className="c-link" href="https://github.com/citylines/citylines2osm">A working prototype is already available</a>.</li>
              <li>Routing. We want to be able to build routing-ready data. In order to do this, a series of features are still needed. Nevertheless, <a className="c-link" href="https://github.com/citylines/citylines2network">some tools have already been prototyped</a>.</li>
            </ul>
          </p>
          <p>
            In order to do this, <b>we are looking for funding</b>.
          </p>

          <h2 className="c-heading">Who we are</h2>
          <p>
            <Link className="c-link" to="/">Citylines.co</Link> is a global comunity of users, contributors and developers. The founder and lead engineer is <a className="c-link" href="https://www.linkedin.com/in/bruno-salerno-b29a8b3/">Bruno Salerno</a>.
          </p>

          <h2 className="c-heading">How to colaborate</h2>
          <p>
            You are encouraged to contribute by improving or adding new data through our online editor, or by taking part in the development of the platform. We are actively looking for open source contributors involving data, front and backend development, and design.
          </p>

          <h2 className="c-heading">Reach us</h2>
            <p>Github repo, email, gitter</p>
        </div>
      </div>
    );
  }
}

export default About
