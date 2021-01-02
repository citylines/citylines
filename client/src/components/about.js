import React, {PureComponent} from 'react';
import {Link} from 'react-router-dom';
import Translate from 'react-translate-component';
import Tags from './tags';

class About extends PureComponent {
  /* TODO:
   * - i18n
   **/

  render() {
    return (
      <div className="o-container o-container--medium u-pillar-box--medium" style={{textAlign: "justify"}}>
        <Tags title="about.title" />
        <div className="u-letter-box--xlarge letter-with-footer">
          <Translate component="h1" className="c-heading" content="about.title" />
          <div className="c-paragraph">
            <Link className="c-link" to="/">Citylines.co</Link> is a collaborative platform for mapping the transit systems of the world. The source code is <a className="c-link" href="https://github.com/citylines">open</a>, licensed under the <a className="c-link" href="https://github.com/citylines/citylines/blob/master/LICENSE.md">MIT license</a>, and the data is available under the <a className="c-link" href="http://opendatacommons.org/licenses/odbl/1.0/" target="_blank">Open Database License</a>. Please refer to the <Link className="c-link" to="/">License section</Link> for more details.
          </div>

          <h2 className="c-heading">Our mission</h2>
          <div className="c-paragraph">
            Our mission is to create a global repository and visualization tool of transport geodata, specially focused on the history of transit systems.
          </div>
          <div className="c-paragraph">
            We also want to develop tools that allow us to manipulate this data, in particular, regarding:
            <ul className="c-list">
              <li>Integration with OpenStreetMap (OSM). Currently we only support a simple import mechanism, but we are looking forward to be able to export transit data back to OSM. <a className="c-link" href="https://github.com/citylines/citylines2osm">A working prototype is already available</a>.</li>
              <li>Routing. We want to be able to build routing-ready data. In order to do this, a series of features are still needed. Nevertheless, <a className="c-link" href="https://github.com/citylines/citylines2network">some tools have already been prototyped</a>.</li>
            </ul>
          </div>

          <h2 className="c-heading">Who we are</h2>
          <div className="c-paragraph">
            <Link className="c-link" to="/">Citylines.co</Link> is a global comunity of users, contributors and developers. The founder and lead engineer is <a className="c-link" href="https://www.linkedin.com/in/bruno-salerno-b29a8b3/">Bruno Salerno</a>.
          </div>

          <h2 className="c-heading">How to colaborate</h2>
          <div className="c-paragraph">
            You are encouraged to contribute by improving or adding new data through our online editor, or by taking part in the development of the platform. We are actively looking for open source contributors involving data, front and backend development, and design.
          </div>

          <h2 className="c-heading">Reach us</h2>
            <div>Check out our <a className="c-link" href="https://github.com/citylines/citylines">Github repo</a>, send us an email to <a className="c-link" href="mailto:info@citylines.co">info at citylines.co</a>, or <a className="c-link" href="https://gitter.im/citylines/Lobby?utm_source=share-link&amp;utm_medium=link&amp;utm_campaign=share-link">join our chat room at Gitter</a>.</div>
        </div>
      </div>
    );
  }
}

export default About
