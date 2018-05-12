import React, {Component} from 'react';
import {SketchPicker} from 'react-color';
import Translate from 'react-translate-component';

class LinesEditorItem extends Component {
  constructor(props, context) {
    super(props, context);

    this.color = this.props.color;
    this.name = this.props.name;
    this.system_id = this.props.system_id;

    this.state = {
      color: this.color,
      name: this.name,
      system_id: this.system_id
    }

    this.displaySaveButton = false;

    this.bindedOnColorChange = this.onColorChange.bind(this);
    this.bindedOnNameChange = this.onNameChange.bind(this);
    this.bindedOnDelete = this.onDelete.bind(this);
    this.bindedOnActualDelete = this.onActualDelete.bind(this);
    this.bindedOnCancelDelete = this.onCancelDelete.bind(this);
    this.bindedOnSave = this.onSave.bind(this);
    this.bindedOnClick = this.onClick.bind(this);
  }

  componentDidUpdate() {
    const colorPickerContainer = this.refs.colorPickerContainer;

    if (!colorPickerContainer) return;

    const bottom = colorPickerContainer.getBoundingClientRect().bottom;
    const parentHeight = document.documentElement.clientHeight + document.documentElement.scrollHeight;

    if (bottom > parentHeight) {
      colorPickerContainer.style.setProperty('bottom','0px');
    }
  }

  onColorChange(color) {
    if (this.name && this.name != '') {
      this.displaySaveButton = true;
    }
    this.color = color.hex;
    this.updateState();
  }

  onNameChange(e) {
    const newName = e.target.value;
    this.name = newName;
    if (newName && newName != '') {
      this.displaySaveButton = true;
    }
    this.updateState();
  }

  updateState() {
    this.displayDeleteWarning = false;

    this.setState({
      color: this.color,
      name: this.name,
      system_id: this.system_id
    });
  }

  onDelete() {
    this.displayDeleteWarning = true;
    this.forceUpdate();
  }

  onActualDelete() {
    this.displayDeleteWarning = false;
    if (typeof this.props.onDelete === 'function') this.props.onDelete(this.props.url_name);
  }

  onCancelDelete() {
    this.displayDeleteWarning = false;
    this.forceUpdate();
  }

  onSave() {
    this.displaySaveButton = false;
    const args = Object.assign({}, this.state, {line_url_name: this.props.url_name});
    if (typeof this.props.onSave === 'function') this.props.onSave(args);
  }

  onClick(e) {
    if (typeof this.props.onClick) this.props.onClick(e, this.props.url_name);
  }

  onDragStart(e) {
    e.dataTransfer.setData('text', this.props.url_name);
    this.props.onDragStart();
  }

  onDragEnd(e) {
    this.props.onDragEnd();
  }

  onSystemSelectChange(e) {
    this.props.onSystemSelectChange(this.props.url_name, e.target.value);
  }

  render() {
    const deleteWarningControl = <span className="c-input-group" style={{float:'right'}}>
        <Translate className="editor-delete-warning-text" content="editor.lines_editor.are_you_sure" />
        <button className="c-button" onClick={this.bindedOnActualDelete}><Translate content="editor.lines_editor.yes" /></button>
        <button className="c-button" onClick={this.bindedOnCancelDelete}><Translate content="editor.lines_editor.no" /></button>
      </span>;

    return (
      <div onDragStart={this.onDragStart.bind(this)} onDragEnd={this.onDragEnd.bind(this)} className="c-card__item draggable-line" onClick={this.bindedOnClick} draggable={true}>
        <div className="c-input-group">
          <div className="o-field">
            <input className="c-field" type="text" value={this.state.name} onChange={this.bindedOnNameChange}></input>
          </div>
          <div className="o-field">
            <div className="editor-line-color"><div className="color" style={{backgroundColor: this.state.color}}></div></div>
            {this.props.displayColorPicker ?
            <div ref="colorPickerContainer" className="color-picker-container"><SketchPicker color={ this.state.color } onChange={this.bindedOnColorChange}/></div> : null
            }
          </div>
          <div className="o-field">
            <select className="c-field line-system-select" value={this.props.transport_mode_id || 0}>
              {this.props.transportModes.map(tm => <option key={tm.id} value={tm.id}><Translate content={`transport_modes.${tm.name}`}/></option> )}
            </select>
          </div>
          <div className="o-field">
            {this.props.systems.length > 1 &&
            <select className="c-field line-system-select" value={this.props.system_id} onChange={this.onSystemSelectChange.bind(this)}>
              {this.props.systems.map(system => system.name ? <option key={system.id} value={system.id}>{system.name}</option> : <Translate component="option" key={system.id} value={system.id} content="editor.lines_editor.unnamed_system" />)}
            </select>
            }
          </div>
          <div className="o-field">
            { this.displayDeleteWarning ?
              deleteWarningControl :
              <span className="c-input-group" style={{float:'right'}}>
                { this.displaySaveButton && <button onClick={this.bindedOnSave} className="c-button c-button--info">
                    <Translate content="editor.lines_editor.save" />
                  </button> }
                { this.props.deletable && <button onClick={this.bindedOnDelete} className="c-button">
                    <Translate content="editor.lines_editor.delete" />
                  </button> }
              </span>
            }
          </div>
        </div>
      </div>
    )
  }
}

class LinesEditorNew extends LinesEditorItem {
  resetState() {
    this.name = this.props.name;
    this.color = this.props.color;
    this.system_id = this.props.system_id;

    this.updateState();
  }

  onSave() {
    if (this.state.name == '') return;
    this.displaySaveButton = false;
    const args = Object.assign({}, this.state);
    if (typeof this.props.onSave === 'function') this.props.onSave(args);

    this.resetState();
  }

  render() {
    return (
      <div className="c-card__item" onClick={this.bindedOnClick}>
        <div className="c-input-group">
          <div className="o-field">
            <Translate
              component="input"
              className="c-field"
              type="text"
              value={this.state.name}
              onChange={this.bindedOnNameChange}
              attributes={{placeholder:"editor.lines_editor.new_line_placeholder"}}
            />
          </div>
          <div className="o-field">
            <div className="editor-line-color"><div className="color" style={{backgroundColor: this.state.color}}></div></div>
            {this.props.displayColorPicker ?
            <div ref="colorPickerContainer" className="color-picker-container"><SketchPicker color={ this.state.color } onChange={this.bindedOnColorChange}/></div> : null
            }
          </div>
          <div className="o-field">
          </div>
          <div className="o-field">
            <span className="c-input-group" style={{float:'right'}}>
              { this.displaySaveButton && <button onClick={this.bindedOnSave} className="c-button c-button--info">
                  <Translate content="editor.lines_editor.create" />
                </button> }
            </span>
          </div>
        </div>
      </div>
    )
  }
}

export {LinesEditorItem, LinesEditorNew};
