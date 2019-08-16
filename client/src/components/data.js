import React, {Component} from 'react';
import {Link} from 'react-router';
import Translate from 'react-translate-component';
import Tags from './tags';
import CityData from './city-data';

class Data extends Component {
  datasets() {
    return {
      cities: 'https://dataclips.heroku.com/fnvcwipfhumbbkedepfjbajbqqvq-cities',
      systems: 'https://dataclips.heroku.com/aprshsrwvsfdyfbwrkmuxznutfka-systems',
      lines: 'https://dataclips.heroku.com/yfwuchrcmbjnslnewiediitnfhup-lines',
      features: 'https://dataclips.heroku.com/gugsgunqfrrzftoxsyphiwkmhhae',
      section_lines: 'https://dataclips.heroku.com/xefureocdynlarxzelcpwlzjzmyn-section_lines',
      stations: 'https://dataclips.heroku.com/nsdgftlpvsnevtphlkuwbnzzglrt-stations',
      station_lines: 'https://dataclips.heroku.com/ooanimulqmfdefqsbcqqsdzsijet-station_lines'
    }
  }

  formats() {
    return ['json', 'csv']
  }

  sendGAEvent(e) {
    const name = e.target.attributes.name.value;

    ga('send', 'event', 'data', 'download', name);
  }

  render() {
    return (
        <div className="o-container o-container--medium">
          <Tags title="data.title" />
          <div className="u-letter-box--large">
            <Translate component="h1" className="c-heading" content="data.title" />

            <p><Translate content="data.license" unsafe />. <Translate content="data.see_terms_1" /> <Translate component={Link} className="c-link" to="/terms" content="data.see_terms_2" />.</p>

            <Translate component="h2" className="c-heading" content="data.all_data" />
            { Object.entries(this.datasets()).map(entry => {
              const label = entry[0];
              const url = entry[1];
              return <p key={label}><Translate content={`data.${label}`} />: {this.formats().map(format => <a key={`${label}-${format}`} name={`${label}-${format}`} className="data-link c-link" href={`${url}.${format}`} onClick={this.sendGAEvent}>{format}</a>)} </p>;
            })}
            <Translate component="h2" className="c-heading" content="data.data_by_city" />
            <CityData />
          </div>
        </div>
        )
  }
}

export default Data
