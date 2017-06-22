import React, {PureComponent} from 'react';
import Translate from 'react-translate-component';

class NoLinesAlert extends PureComponent {
  render() {
    return (
      <ul className="c-card">
        <Translate component="li" className="c-card__item" content="editor.no_lines_alert" />
      </ul>
    )
  }
}

export default NoLinesAlert
