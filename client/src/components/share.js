import React, {PureComponent} from 'react';

class Share extends PureComponent {
  render() {
    // TODO: use https://www.npmjs.com/package/react-copy-to-clipboard to copy
    // TODO: use https://github.com/nygardk/react-share for social buttons
    return (
      <div className="c-card city-settings">
        <div className="c-card__item">
          <div className="c-input-group">
            <div className="o-field">
              <input className="c-field" defaultValue={window.location.href} />
            </div>
            <button className="c-button c-button--ghost">
              <span className="fa fa-clipboard"></span>
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export default Share
