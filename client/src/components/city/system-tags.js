import React, {PureComponent} from 'react';
import Translate from 'react-translate-component';

class SystemTags extends PureComponent {
  tags() {
    return ['historic', 'project'];
  }

  render() {
    return this.tags().map(tag =>
      this.props.system[tag] &&
        <span key={tag} className="c-badge c-badge--ghost c-badge--brand system-tag">
          {tag}
        </span>
    )
  }
}

export default SystemTags
