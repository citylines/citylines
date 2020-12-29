import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import Translate from 'react-translate-component';
import DiscussionStore from '../../stores/discussion-store';

class Discussion extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {newMsg: '', msgs: []};
    this.boundOnChange = this.onChange.bind(this);
  }

  componentDidMount() {
    DiscussionStore.addChangeListener(this.boundOnChange);
    DiscussionStore.getMsgs(this.props.urlName);
  }

  componentWillUnmount() {
    DiscussionStore.removeChangeListener(this.boundOnChange);
  }

  onChange() {
    this.setState(DiscussionStore.getState());
  }

  onNewMsgChange(e) {
    this.setState({newMsg: e.target.value});
  }

  sendNewMsg() {
    if (!this.validNewMsg()) return;

    DiscussionStore.sendMsg(this.props.urlName, this.state.newMsg, () => {
      ga('send', 'event', 'discussion', 'new_msg', this.props.urlName);
      this.props.onNewMsgSent();
    });
  }

  validNewMsg() {
    return this.state.newMsg.trim().length > 0;
  }

  onNewMsgKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      this.sendNewMsg();
    }
  }

  render() {
    return (
      <div className="u-letter-box--small o-grid__cell o-grid__cell--width-100 discussion">
        <div className="u-letter-box--small">
          { this.state.msgs.length == 0 && <NoMsgsSign />}
          { this.state.msgs.map(msg => <Msg
              key={msg.id}
              authorNickname={msg.author_nickname}
              authorURL={msg.author_url}
              content={msg.content}
              timestamp={msg.timestamp}
            />) }
          <div className="c-input-group send-msg">
            <div className="o-field">
              <Translate
                component="textarea"
                className="c-field"
                attributes={{ placeholder: 'editor.discussion.new_msg_placeholder' }}
                value={this.state.newMsg}
                onChange={this.onNewMsgChange.bind(this)}
                onKeyDown={this.onNewMsgKeyDown.bind(this)}
              />
            </div>
            <button
              className="c-button c-button--brand"
              disabled={!this.validNewMsg()}
              onClick={this.sendNewMsg.bind(this)}
            >
                <span className="fa fa-paper-plane"></span>
            </button>
          </div>
        </div>
      </div>
    )
  }
}

class Msg extends Component {
  localizedTimestamp(timestamp) {
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const timeOptions = { hour: '2-digit', minute:'2-digit' };
    const localDate = new Date(timestamp);
    return `${localDate.toLocaleDateString(undefined, dateOptions)} ${localDate.toLocaleTimeString(undefined, timeOptions)}`;
  }

  render() {
    return (
      <div className="c-card discussion-message">
        <header className="c-card__header">
          <span className="discussion-message-header">
            <Link className="c-link" to={this.props.authorURL} target="_blank">
              {this.props.authorNickname}
            </Link>
            <small className="c-text--quiet">{this.localizedTimestamp(this.props.timestamp)}</small>
          </span>
        </header>
        <div className="c-card__body">
          <p className="c-paragraph">{this.props.content}</p>
        </div>
      </div>
    )
  }
}

class NoMsgsSign extends Component {
  render() {
    return (
      <div className="c-card no-msgs-sign">
        <div className="c-card__body">
          <Translate content="editor.discussion.no_msgs_sign" unsafe={true}/>
        </div>
      </div>
    )
  }
}

export default Discussion
