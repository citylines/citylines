import React, {PureComponent} from 'react';
import Translate from 'react-translate-component';

class Intro extends PureComponent {
  render() {
    return (
      <div className="c-card comparison-intro">
        <div className="c-card__body">
          <Translate content="compare.intro" />
        </div>
      </div>
    )
  }
}

export default Intro

