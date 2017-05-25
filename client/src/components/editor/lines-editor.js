import React, {Component} from 'react';
import Translate from 'react-translate-component';
import {System, NewSystem} from './lines_editor/system';
import {LinesEditorItem, LinesEditorNew} from './lines_editor/lines-editor-item';

class LinesEditor extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {displayColorPicker: {}, dragging: false};

    this.bindedOnSave = this.onSave.bind(this);
    this.bindedOnDelete = this.onDelete.bind(this);
    this.bindedOnCreate = this.onCreate.bind(this);
    this.bindedOnItemClick = this.onItemClick.bind(this);
    this.bindedOnSystemSave = this.onSystemSave.bind(this);
    this.bindedOnSystemDelete = this.onSystemDelete.bind(this);
    this.bindedOnDragStart = this.onDragStart.bind(this);
    this.bindedOnDragEnd = this.onDragEnd.bind(this);
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

  onSystemSave(args) {
    if (typeof this.props.onSystemSave === 'function') this.props.onSystemSave(args);
  }

  onSystemDelete(args) {
    if (typeof this.props.onSystemDelete === 'function') this.props.onSystemDelete(args);
  }

  onItemClick(e, lineUrlName) {
    if (e.target.matches(".color-picker-container *")) return;

    if (e.target.className != 'color') {
      this.setState(Object.assign({}, this.state, {displayColorPicker: {}}));
    } else {
      const displayColorPicker = {};
      displayColorPicker[lineUrlName] = !this.state.displayColorPicker[lineUrlName];
      this.setState(Object.assign({}, this.state, {displayColorPicker: displayColorPicker}));
    }
  }

  onLineSystemChange(lineUrlName, systemId) {
    const targetLine = this.props.lines.find(line => line.url_name == lineUrlName);
    if (targetLine.system_id == systemId) return;

    var args = {line_url_name: lineUrlName, color: targetLine.color, name: targetLine.name, system_id: systemId}
    this.onSave(args);
  }

  onDragStart() {
    this.setState(Object.assign({}, this.state, {dragging: true}));
  }

  onDragEnd() {
    this.setState(Object.assign({}, this.state, {dragging: false}));
  }

  render() {
    return (
      <div className={`u-letter-box--small u-pillar-box--medium ${this.state.dragging ? 'dragging-line' : 'not-dragging-line'}`} style={{maxWidth:"1000px"}}>
        { this.props.systems.map((system) => {
          return (
            <System
              key={system.id}
              id={system.id}
              name={system.name}
              onLineDragged={this.onLineSystemChange.bind(this)}
              onSave={this.bindedOnSystemSave}
              onDelete={this.bindedOnSystemDelete}>
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
                      onDragStart={this.bindedOnDragStart}
                      onDragEnd={this.bindedOnDragEnd}
                      systems={this.props.systems}
                      onSystemSelectChange={this.onLineSystemChange.bind(this)}
                    />
                  )
              })
            }
            <LinesEditorNew
              color="#000"
              name=""
              system_id={system.id}
              onSave={this.bindedOnCreate}
              url_name={`${system.id}-the-new-one`}
              displayColorPicker={this.state.displayColorPicker[`${system.id}-the-new-one`]}
              onClick={this.bindedOnItemClick}
            />
            </System>
          )})}
          <NewSystem onCreate={this.props.onCreateSystem}/>
      </div>
    )
  }
}

export default LinesEditor
