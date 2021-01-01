import React, {PureComponent} from 'react';
import {Link} from 'react-router-dom';

class About extends PureComponent {
  /* TODO:
   * - Tags component
   * - i18n
   **/

  render() {
    return (
      <div className="o-container o-container--medium u-pillar-box--medium">
        <div className="u-letter-box--xlarge letter-with-footer">
          <h1 className="c-heading">About</h1>
          <p>
            <Link className="c-link" to="/">Citylines.co</Link> is a collaborative platform for mapping the transit systems of the world. The software is open source, licensed under the MIT license, and the data is available under the <a className="c-link" href="http://opendatacommons.org/licenses/odbl/1.0/" target="_blank">Open Database License</a>. Please refer to the <Link className="c-link" to="/">License section</Link> for more details.
          </p>

          <h2 className="c-heading">Our mission</h2>


          <h2 className="c-heading">Who we are</h2>
          <p>
            <Link to="/">Citylines.co</Link> is a global comunity of users, contributors and developers from around the world. The founder and lead engineer is <a href="https://www.linkedin.com/in/bruno-salerno-b29a8b3/">Bruno Salerno</a>.
          </p>

          <h2 className="c-heading">How to colaborate</h2>
          <p>
            You are encouraged to contribute by improving or adding new data through our online editor, or by taking part in the development of the platform. We are actively looking for open source contributors, in both front and backend development, and design.
          </p>

          <h2 className="c-heading">Reach us</h2>
        </div>
      </div>
    );
  }
}

export default About
