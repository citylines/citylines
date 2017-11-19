import React, {PureComponent} from 'react';
import Translate from 'react-translate-component';

class FeatureLinesEditor extends PureComponent {
  onAddLine(e) {
    const [line, line_url_name, system] = e.target.value.split(',');

    const newLine = {
      line: line,
      line_url_name: line_url_name,
      system: system
    }

    this.props.onAddLine(newLine);
  }

  onRemove(urlName) {
    this.props.onRemoveLine(urlName);
  }

  render() {
    return (
      <ul className="c-list c-list--unstyled">
        {this.props.featureLines.map((l) =>
          <li key={`own-${l.line_url_name}`}className="c-list__item editor-features-lines-item">{`${l.line} - ${l.system}`}<span className="fa fa-close" onClick={() => this.onRemove(l.line_url_name)}></span></li>
          )}
        <li className="c-list__item editor-features-lines-item">
          <select className="c-field u-xsmall" onChange={this.onAddLine.bind(this)}>
            <option>Add line</option>
            {this.props.systems.map((system) => {
              return this.props.lines.filter(line => line.system_id == system.id).map((line) => {
                const label = system.name ? `${system.name} - ${line.name}` : line.name;
                if (this.props.featureLines.find(l => l.line_url_name == line.url_name)) {
                  return;
                }

                return (
                  <option key={line.url_name} value={`${line.name},${line.url_name},${system.name}`}>{label}</option>
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
