import React, {PureComponent} from 'react';
import {Link} from 'react-router-dom';
import Translate from 'react-translate-component';
import Tags from './tags';

class About extends PureComponent {
  render() {
    const githubSponsorsButton = '<iframe src="https://github.com/sponsors/citylines/button" title="Sponsor citylines" height="35" width="116" style="border: 0;"></iframe>';
    return (
      <div className="o-container o-container--medium u-pillar-box--medium" style={{textAlign: "justify"}}>
        <Tags title="about.title" />
        <div className="u-letter-box--xlarge letter-with-footer">
          <Translate component="h1" className="c-heading" content="about.title" />
          <div className="c-paragraph">
            <Translate content="about.main" unsafe={true}/>
          </div>

          <Translate component="h2" className="c-heading" content="about.our_mission.title" />
          <div className="c-paragraph">
            <Translate content="about.our_mission.body" />
          </div>
          <div className="c-paragraph">
            <Translate content="about.our_mission.list_intro" />
            <ul className="c-list">
              <Translate component="li" content="about.our_mission.list_li1" unsafe={true}/>
              <Translate component="li" content="about.our_mission.list_li2" unsafe={true}/>
            </ul>
          </div>

          <Translate component="h2" className="c-heading" content="about.who_are_we.title"/>
          <div className="c-paragraph">
            <Translate content="about.who_are_we.body" unsafe={true} />
          </div>

          <Translate component="h2" className="c-heading" content="about.how_to_contribute.title"/>
          <div className="c-paragraph">
            <Translate content="about.how_to_contribute.body" />
          </div>
          <div className="c-paragraph">
            <Translate content="about.how_to_contribute.sponsor" unsafe={true}/>
            <div className="about sponsor-button"dangerouslySetInnerHTML={{__html: githubSponsorsButton}}></div>
          </div>

          <Translate component="h2" className="c-heading" content="about.reach_us.title" />
          <div className="c-paragraph">
            <Translate content="about.reach_us.body" unsafe={true}/>
          </div>
        </div>
      </div>
    );
  }
}

export default About
