import React, {PureComponent} from 'react';
import Translate from 'react-translate-component';

class FeatureHistory extends PureComponent {
  render() {
    return (
      <div className="c-card--accordion feature-history">
        <input type="checkbox" id="accordion-1"></input>
        <Translate component="label" className="c-card__item" htmlFor="accordion-1" content="editor.feature_viewer.history.title"/>
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
      <ol className="c-list u-small">
      {this.props.history.map(record => <li
        key={`${record.type}-${record.timestamp}`}
        className="c-list__item"
        >
          {this.localizedTimestamp(record.timestamp)}
          <a className="history-record-author c-link" target="_blank" href={record.user_url}>{record.user_nickname}</a>
          <span className="history-record-type">(<Translate content={`editor.feature_viewer.history.${record.type}`} />)</span>
        </li>)}
      </ol>
    </div>
  }
}

export default FeatureHistory
