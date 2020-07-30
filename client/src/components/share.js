import React, {PureComponent} from 'react';
import {CopyToClipboard} from 'react-copy-to-clipboard';

class Share extends PureComponent {
  constructor(props, context) {
    super(props, context);
    this.state = {
      url: window.location.href,
      copied: false
    };

    this.socialMediae = [
      {icon: 'fa fa-envelope', target: '_top', hrefFnc: (url, title) => `mailto:?subject=${title}&body=${title}: ${url}`},
      {icon: 'fab fa-facebook', hrefFnc: (url, title) => `https://www.facebook.com/sharer/sharer.php?t=${title}&u=${url}`},
      {icon: 'fab fa-reddit', hrefFnc: (url, title) => `http://www.reddit.com/submit?url=${url}&title=${title}`},
      {icon: 'fab fa-twitter', hrefFnc: (url, title) => `https://twitter.com/intent/tweet?text=${title}&url=${url}`}
    ]
  }

  title() {
    return document.title.split('|')[0].trim();
  }

  handleInputChange(e) {
    this.setState({url: e.target.value, copied: false});
  }

  render() {
    return (
      <div>
        <div className="o-form-element" style={{maxWidth:'500px'}}>
          <div className="c-input-group">
            <div className="o-field">
              <input className={`c-field ${this.state.copied && 'c-field--success'}`} value={this.state.url} onChange={this.handleInputChange.bind(this)}/>
            </div>
            <CopyToClipboard text={this.state.url}
              onCopy={() => this.setState({copied: true})}>
              <button className={`c-button ${this.state.copied ? 'c-button--ghost-success' : 'c-button--ghost'}`}>
                <span className={`fa ${this.state.copied ? 'fa-check' : 'fa-clipboard'}`}></span>
              </button>
            </CopyToClipboard>
          </div>
        </div>
        <div className="o-form-element">
        {this.socialMediae.map(media =>
          <span key={media.icon} className="contact-icon">
            <a target={media.target || '_blank'} href={media.hrefFnc(this.state.url, this.title())}>
              <span className={media.icon}></span>
            </a>
          </span>)
        }
        </div>
      </div>
    )
  }
}

export default Share
