import React, {Component} from 'react';
import {SketchPicker} from 'react-color';
import Translate from 'react-translate-component';
import System from './lines_editor/system';
import {LinesEditorItem, LinesEditorNew} from './lines_editor/lines-editor-item';

class LinesEditor extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {displayColorPicker: {}};

    this.bindedOnSave = this.onSave.bind(this);
    this.bindedOnDelete = this.onDelete.bind(this);
    this.bindedOnCreate = this.onCreate.bind(this);
    this.bindedOnItemClick = this.onItemClick.bind(this);
  }

  onSave(args) {
    if (typeof this.props.onSave === 'function') this.props.onSave(args);
  }

  onDelete(lineUrlName) {
    if (typeof this.props.onDelete === 'function') this.props.onDelete(lineUrlName);
  }

  onCreate(args) {
    if (typeof this.props.onCreate === 'function') this.props.onCreate(args);
  }

  onItemClick(e, lineUrlName) {
    if (e.target.className != 'color') {
      this.setState({displayColorPicker: {}});
    } else {
      const displayColorPicker = {};
      displayColorPicker[lineUrlName] = !this.state.displayColorPicker[lineUrlName];
      this.setState({displayColorPicker: displayColorPicker});
    }
  }

  onLineDragged(lineUrlName, systemId) {
    const targetLine = this.props.lines.find(line => line.url_name == lineUrlName);
    if (targetLine.system_id == systemId) return;

    var args = {urlName: lineUrlName, color: targetLine.color, name: targetLine.name, system_id: systemId}
    this.onSave(args);
  }

  render() {
    return (
      <div className="u-letter-box--small u-pillar-box--medium" style={{maxWidth:"1000px"}}>
        { this.props.systems.map((system) => {
          return (
            <System key={system.id} id={system.id} name={system.name} onLineDragged={this.onLineDragged.bind(this)}>
            { this.props.lines.filter(line => line.system_id == system.id).map((line) => {
                return (
                    <LinesEditorItem
                      key={line.url_name}
                      url_name={line.url_name}
                      name={line.name}
                      deletable={line.deletable}
                      color={line.color}
                      system_id={system.id}
                      onSave={this.bindedOnSave}
                      onDelete={this.bindedOnDelete}
                      displayColorPicker={this.state.displayColorPicker[line.url_name]}
                      onClick={this.bindedOnItemClick}
                    />
                  )
              })
            }
            <LinesEditorNew
              color="#000"
              name=""
              system_id={system.id}
              onSave={this.bindedOnCreate}
              url_name={"the-new-one"}
              displayColorPicker={this.state.displayColorPicker["the-new-one"]}
              onClick={this.bindedOnItemClick}
            />
            </System>
          )})}
      </div>
    )
  }
}

export default LinesEditor
