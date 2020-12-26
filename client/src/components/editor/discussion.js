import React, {Component} from 'react';

class Discussion extends Component {
  constructor(props, context) {
    super(props, context);

    this.msgs = [
      {id:1, author: "Phil", content: "Hi", timestamp: '1997-07-16T19:20:15+00:00'},
      {id:2, author: "me", content: "This is a msg", timestamp: '1997-07-18T11:20:15+00:00'}
    ]
  }

  render() {
    return (
      <div className="u-letter-box--small discussion">
        <div className="o-grid__cell o-grid__cell--width-100">
          <div>
            { this.msgs.map(msg => <Msg
                key={msg.id}
                author={msg.author}
                content={msg.content}
                timestamp={msg.timestamp}
              />) }
          </div>
          <div className="c-input-group send-msg">
            <div className="o-field">
              <input className="c-field"></input>
            </div>
            <button className="c-button c-button--brand">Send</button>
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
