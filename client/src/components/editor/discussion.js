import React, {Component} from 'react';
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
    DiscussionStore.sendMsg(this.props.urlName, this.state.newMsg);
  }

  validNewMsg() {
    return this.state.newMsg.trim().length > 0;
  }

  onNewMsgKeyDown(e) {
    if (e.key === 'Enter') this.sendNewMsg();
  }

  render() {
    return (
      <div className="u-letter-box--small discussion">
        <div className="o-grid__cell o-grid__cell--width-100">
          <div>
            { this.state.msgs.map(msg => <Msg
                key={msg.id}
                author={msg.author}
                content={msg.content}
                timestamp={msg.timestamp}
              />) }
          </div>
          <div className="c-input-group send-msg">
            <div className="o-field">
              <input
                className="c-field"
                value={this.state.newMsg}
                onChange={this.onNewMsgChange.bind(this)}
                onKeyDown={this.onNewMsgKeyDown.bind(this)}
              ></input>
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
    const localDate = new Date(timestamp);
    return `${localDate.toLocaleDateString()} ${localDate.toLocaleTimeString()}`;
  }

  render() {
    return (
      <div className="c-card">
        <header className="c-card__header">
          <span className="c-heading__sub">{this.props.author}, {this.localizedTimestamp(this.props.timestamp)}</span>
        </header>
        <div className="c-card__body">
          <p className="c-paragraph">{this.props.content}</p>
        </div>
      </div>
    )
  }
}

export default Discussion
