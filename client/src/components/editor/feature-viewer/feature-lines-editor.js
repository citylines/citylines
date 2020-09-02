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
          <FeatureLine
            name={l.line}
            system={l.system}
            urlName={l.line_url_name}
            onRemove={this.props.onRemoveLine.bind(this)}
          />
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

class FeatureLine extends PureComponent {
  constructor(props, context) {
    super(props, context);
    this.state = {displayYears: false};
  }

  toggleYears() {
    this.setState({displayYears: !this.state.displayYears});
  }

  render() {
    return (
      <li key={`own-${this.props.urlName}`}className="c-list__item editor-features-lines-item">
        {this.props.system ? `${this.props.name} - ${this.props.system}` : l.line}
        <span className="line-commands">
          <span className={`far fa-calendar ${this.state.displayYears ? 'selected' : ''}`} onClick={() => this.toggleYears(this.props.urlName)}></span>
          <span className="far fa-trash-alt" onClick={() => this.props.onRemove(this.props.urlName)}></span>
        </span>
        {this.state.displayYears &&
          <div className="line-years">
            <div className="c-input-group">
              <div className="o-field">
                <Translate component="input" className="c-field u-xsmall" attributes={{ placeholder: 'editor.feature_viewer.years.from' }}/>
              </div>
              <div className="o-field">
                <Translate component="input" className="c-field u-xsmall" attributes={{ placeholder: 'editor.feature_viewer.years.to' }}/>
              </div>
            </div>
            <Translate component="small" content="editor.feature_viewer.years.note" />
          </div>}
      </li>
    )
  }
}

export default FeatureLinesEditor
