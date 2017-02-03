import React, {PureComponent} from 'react';
import {SketchPicker} from 'react-color';

class LinesEditor extends PureComponent {
  constructor(props, context) {
    super(props, context);

    this.bindedOnSave = this.onSave.bind(this);
    this.bindedOnDelete = this.onDelete.bind(this);
  }

  onSave(args) {
    if (typeof this.props.onSave === 'function') this.props.onSave(args);
  }

  onDelete(lineUrlName) {
    if (typeof this.props.onDelete === 'function') this.props.onDelete(lineUrlName);
  }

  render() {
    return (
      <div className="u-letter-box--small u-pillar-box--medium" style={{maxWidth:"1000px"}}>
        <div className="c-card c-card--highest">
          {
            this.props.lines.map((line) => {
              return (
                  <LinesEditorItem
                    key={line.url_name}
                    url_name={line.url_name}
                    name={line.name}
                    color={line.style.color}
                    onSave={this.bindedOnSave}
                    onDelete={this.bindedOnDelete}
                  />
                )
            })
          }
        </div>
      </div>
    )
  }
}

class LinesEditorItem extends PureComponent {
  constructor(props, context) {
    super(props, context);

    this.color = this.props.color;
    this.name = this.props.name;

    this.state = {
      color: this.color,
      name: this.name
    }

    this.displayColorPicker = false;
    this.displaySaveButton = false;

    this.bindedToggleColorPicker = this.toggleColorPicker.bind(this);
    this.bindedCloseColorPicker = this.closeColorPicker.bind(this);
    this.bindedOnColorChange = this.onColorChange.bind(this);
    this.bindedOnNameChange = this.onNameChange.bind(this);
    this.bindedOnDelete = this.onDelete.bind(this);
    this.bindedOnActualDelete = this.onActualDelete.bind(this);
    this.bindedOnSave = this.onSave.bind(this);
  }

  toggleColorPicker(e) {
    this.displayColorPicker = !this.displayColorPicker;
    this.forceUpdate();
  }

  closeColorPicker(e) {
    if (e.target.className != 'color') {
      this.displayColorPicker = false;
      this.forceUpdate();
    }
  }

  onColorChange(color) {
    this.displaySaveButton = true;
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
      name: this.name
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

  onSave() {
    this.displaySaveButton = false;
    const args = Object.assign({},this.state, {urlName: this.props.url_name});
    if (typeof this.props.onSave === 'function') this.props.onSave(args);
  }

  render() {
    const deleteWarningControl = <span className="c-input-group" style={{float:'right'}}>
        <span className="editor-delete-warning-text">¿Estás seguro?</span>
        <button className="c-button" onClick={this.bindedOnActualDelete}>Sí</button>
        <button className="c-button" onClick={() => this.displayDeleteWarning = false}>No</button>
      </span>;

    return (
      <div className="c-card__item" onClick={this.bindedCloseColorPicker}>
        <div className="c-input-group">
          <div className="o-field">
            <input className="c-field" type="text" value={this.state.name} onChange={this.bindedOnNameChange}></input>
          </div>
          <div className="o-field">
            <div className="editor-line-color"><div className="color" style={{backgroundColor: this.state.color}} onClick={this.bindedToggleColorPicker}></div></div>
            {this.displayColorPicker ?
            <div className="color-picker-container"><SketchPicker color={ this.state.color } onChange={this.bindedOnColorChange}/></div> : null
            }
          </div>
          <div className="o-field">
            { this.displayDeleteWarning ?
              deleteWarningControl :
              <span className="c-input-group" style={{float:'right'}}>
                { this.displaySaveButton && <button onClick={this.bindedOnSave} className="c-button c-button--brand">Guardar</button> }
                <button onClick={this.bindedOnDelete} className="c-button">Borrar</button>
              </span>
            }
          </div>
        </div>
      </div>
    )
  }
}
export default LinesEditor
