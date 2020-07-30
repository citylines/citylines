import React, {PureComponent} from 'react';
import CityToggleableContainer from './toggleable-container';
import {CopyToClipboard} from 'react-copy-to-clipboard';

class CityShare extends PureComponent {

  constructor(props, context) {
    super(props, context);
    this.state = {
      url: window.location.href,
      copied: false
    };
  }

  handleInputChange(e) {
    this.setState({url: e.target.value, copied: false});
  }

  render() {
    // TODO: use https://github.com/nygardk/react-share for social buttons
    return (
      <CityToggleableContainer>
        <div className="c-input-group">
          <div className="o-field">
            <input className={`c-field ${this.state.copied && 'c-field--success'}`} value={this.state.url} onChange={this.handleInputChange.bind(this)}/>
          </div>
          <CopyToClipboard text={this.state.url}
            onCopy={() => this.setState({copied: true})}>
            <button className={`c-button ${this.state.copied ? 'c-button--success' : 'c-button--ghost'}`}>
              <span className="fa fa-clipboard"></span>
            </button>
          </CopyToClipboard>
        </div>
      </CityToggleableContainer>
    )
  }
}

export default CityShare
