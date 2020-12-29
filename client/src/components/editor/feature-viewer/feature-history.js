import React, {PureComponent} from 'react';

class FeatureHistory extends PureComponent {
  render() {
    return (
      <div className="c-card--accordion">
        <input type="checkbox" id="accordion-1"></input>
        <label className="c-card__item" htmlFor="accordion-1">Ver historial del elemento</label>
        <FeatureHistoryContent
          featureId={this.props.featureId}
          history={this.props.history}
          onShowFeatureHistory={this.props.onShowFeatureHistory}
        />
      </div>
    )
  }
}

class FeatureHistoryContent extends PureComponent {
  componentDidMount() {
    this.props.onShowFeatureHistory();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.featureId != this.props.featureId) {
      this.props.onShowFeatureHistory();
    }
  }

  localizedTimestamp(timestamp) {
    const localDate = new Date(timestamp);
    const timeOptions = { hour: '2-digit', minute:'2-digit' };
    return `${localDate.toLocaleDateString()} ${localDate.toLocaleTimeString(undefined, timeOptions)}`;
  }

  render() {
    if (!this.props.history) return '';

    return <div className="c-card__item">
      <ul className="c-list c-list--unstyled">
      {this.props.history.map(record => <li
        key={`${record.type}-${record.timestamp}`}
        className="c-list__item"
        >
          <small><a className="c-link" target="_blank" href={record.user_url}>{record.user_nickname}</a> {this.localizedTimestamp(record.timestamp)} ({record.type})</small>
        </li>)}
      </ul>
    </div>
  }
}

export default FeatureHistory
