import React, {PureComponent} from 'react';
import Translate from 'react-translate-component';

class FeatureLinesEditor extends PureComponent {
  render() {
    return (
      <ul className="c-list c-list--unstyled">
        {this.props.featureLines.map((l) =>
          <li key={`own-${l.line_url_name}`}className="c-list__item editor-features-lines-item">{`${l.line} - ${l.system}`}<span className="fa fa-close"></span></li>
          )}
        <li className="c-list__item editor-features-lines-item">

          <select className="c-field u-xsmall" onChange={this.props.onAddLine}>
            <option>Add line</option>
            {this.props.systems.map((system) => {
              return this.props.lines.filter(line => line.system_id == system.id).map((line) => {
                const label = system.name ? `${system.name} - ${line.name}` : line.name;
                return (
                  <option key={line.url_name} value={line.url_name}>{label}</option>
                )
               })
            })}
          </select>
        </li>
      </ul>
    )
  }
}

export default FeatureLinesEditor
