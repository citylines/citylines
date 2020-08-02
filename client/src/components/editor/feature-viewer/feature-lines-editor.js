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

  remainingLines() {
    const lines = [];

    this.props.systems.map((system) => {
      this.props.lines.filter(line => line.system_id == system.id).map((line) => {
        if (this.props.featureLines.find(l => l.line_url_name == line.url_name)) return;

        const label = system.name ? `${system.name} - ${line.name}` : line.name;

        lines.push({line: line, system: system, label: label});
      })
    });

    return lines;
  }

  render() {
    return (
      <ul className="c-list c-list--unstyled">
        {this.props.featureLines.sort((a, b) => a.line.localeCompare(b.line)).map((l) =>
          <li key={`own-${l.line_url_name}`}className="c-list__item editor-features-lines-item">{l.system ? `${l.line} - ${l.system}` : l.line}<span className="fa fa-trash-alt" onClick={() => this.onRemove(l.line_url_name)}></span></li>
          )}
        <li className="c-list__item editor-features-lines-item">
          <select className="c-field u-xsmall" onChange={this.onAddLine.bind(this)}>
            <Translate component="option" content="editor.feature_viewer.add_line"/>
            {this.remainingLines().map(l =>
              <option key={l.line.url_name} value={`${l.line.name},${l.line.url_name},${l.system.name}`}>{l.label}</option>
            )}
          </select>
        </li>
      </ul>
    )
  }
}

export default FeatureLinesEditor
