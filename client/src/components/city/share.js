import React, {PureComponent} from 'react';
import CityToggleableContainer from './toggleable-container';

class CityShare extends PureComponent {
  render() {
    // TODO: use https://www.npmjs.com/package/react-copy-to-clipboard to copy
    // TODO: use https://github.com/nygardk/react-share for social buttons
    return (
      <CityToggleableContainer>
        <div className="c-input-group">
          <div className="o-field">
            <input className="c-field" defaultValue={window.location.href} />
          </div>
          <button className="c-button c-button--ghost">
            <span className="fa fa-clipboard"></span>
          </button>
        </div>
      </CityToggleableContainer>
    )
  }
}

export default CityShare
