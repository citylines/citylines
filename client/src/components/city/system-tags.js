import React, {PureComponent} from 'react';
import Translate from 'react-translate-component';

class SystemTags extends PureComponent {
  tags() {
    return ['historic', 'project'];
  }

  render() {
    return this.tags().map(tag =>
      this.props.system[tag] &&
        <Translate
          component="span"
          key={tag}
          className="c-badge c-badge--ghost c-badge--brand system-tag"
          content={`city.system_tags.${tag}`}
        />
    )
  }
}

export default SystemTags
