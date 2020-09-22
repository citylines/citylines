import React, {PureComponent} from 'react';
import Translate from 'react-translate-component';

class NoLinesAlert extends PureComponent {
  render() {
    return (
      <div className="c-card">
        <Translate component="div" className="c-card__item" content="editor.no_lines_alert" />
      </div>
    )
  }
}

export default NoLinesAlert
