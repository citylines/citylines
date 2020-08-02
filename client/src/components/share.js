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
      {icon: 'fa fa-envelope', target: '_top', hrefFnc: () => `mailto:?subject=${this.title()}&body=${this.title()}: ${encodeURIComponent(this.URLwithUTMTags('email'))}`},
      {icon: 'fab fa-facebook', hrefFnc: () => `https://www.facebook.com/sharer/sharer.php?t=${this.title()}&u=${encodeURIComponent(this.URLwithUTMTags('fb'))}`},
      {icon: 'fab fa-reddit', hrefFnc: () => `http://www.reddit.com/submit?url=${encodeURIComponent(this.URLwithUTMTags('reddit'))}&title=${this.title()}`},
      {icon: 'fab fa-twitter', hrefFnc: () => `https://twitter.com/intent/tweet?text=${this.title()}&url=${encodeURIComponent(this.URLwithUTMTags('twitter'))}`}
    ]
  }

  URLwithUTMTags(medium) {
    const url = this.state.url;
    const els = `utm_medium=${medium}&utm_source=share_web`;
    const art = (url.indexOf('?') == -1) ? '?' : '&';
    return url + art + els;
  }

  title() {
    return document.title.split('|')[0].trim();
  }

  handleInputChange(e) {
    this.setState({url: e.target.value, copied: false});
  }

  render() {
    return (
      <div className="share">
        <div className="o-form-element" style={{maxWidth:'500px'}}>
          <div className="c-input-group">
            <div className="o-field">
              <input className={`c-field ${this.state.copied && 'c-field--success'}`} value={this.state.url} onChange={this.handleInputChange.bind(this)}/>
            </div>
            <CopyToClipboard text={this.URLwithUTMTags('url_copied')}
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
            <a target={media.target || '_blank'} href={media.hrefFnc()}>
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
