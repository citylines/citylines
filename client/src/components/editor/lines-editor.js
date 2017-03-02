import React, {PureComponent} from 'react';
import {SketchPicker} from 'react-color';

class LinesEditor extends PureComponent {
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

  render() {
    return (
      <div className="u-letter-box--small u-pillar-box--medium" style={{maxWidth:"1000px"}}>
        <div className="c-card c-card--highest lines-editor-container">
          {
            this.props.lines.map((line) => {
              return (
                  <LinesEditorItem
                    key={line.url_name}
                    url_name={line.url_name}
                    name={line.name}
                    deletable={line.deletable}
                    color={line.style.color}
                    width={line.style['line-width']}
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
            onSave={this.bindedOnCreate}
            url_name={"the-new-one"}
            displayColorPicker={this.state.displayColorPicker["the-new-one"]}
            onClick={this.bindedOnItemClick}
          />
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

    this.displaySaveButton = false;

    this.bindedOnColorChange = this.onColorChange.bind(this);
    this.bindedOnWidthChange = this.onWidthChange.bind(this);
    this.bindedOnNameChange = this.onNameChange.bind(this);
    this.bindedOnDelete = this.onDelete.bind(this);
    this.bindedOnActualDelete = this.onActualDelete.bind(this);
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

  onWidthChange(e) {
    const newWidth = e.target.value;
    if (this.name && this.name != '') {
      this.displaySaveButton = true
    }
    this.width = newWidth;
    this.updateState();
  }

  updateState() {
    this.displayDeleteWarning = false;

    this.setState({
      color: this.color,
      name: this.name,
      width: this.width
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
    const args = Object.assign({}, this.state, {urlName: this.props.url_name});
    if (typeof this.props.onSave === 'function') this.props.onSave(args);
  }

  onClick(e) {
    if (typeof this.props.onClick) this.props.onClick(e, this.props.url_name);
  }

  widths() {
    const widths = [];
    for (let i=1; i< 11; i++) {
      widths.push(<option key={`${this.props.url_name}_${i}`} value={i}>{i}</option>);
    }
    return widths;
  }

  render() {
    const deleteWarningControl = <span className="c-input-group" style={{float:'right'}}>
        <span className="editor-delete-warning-text">¿Estás seguro?</span>
        <button className="c-button" onClick={this.bindedOnActualDelete}>Sí</button>
        <button className="c-button" onClick={() => this.displayDeleteWarning = false}>No</button>
      </span>;


    return (
      <div className="c-card__item" onClick={this.bindedOnClick}>
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
          <div className="line-width-label">
            Grosor:
          </div>
          <div>
            <select className="c-field" value={this.props.width || 7} onChange={this.bindedOnWidthChange}>
            {this.widths()}
            </select>
          </div>
          <div className="o-field">
            { this.displayDeleteWarning ?
              deleteWarningControl :
              <span className="c-input-group" style={{float:'right'}}>
                { this.displaySaveButton && <button onClick={this.bindedOnSave} className="c-button c-button--info">Guardar</button> }
                { this.props.deletable && <button onClick={this.bindedOnDelete} className="c-button">Borrar</button> }
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

    this.updateState();
  }

  onSave() {
    if (this.state.name == '') return;
    this.displaySaveButton = false;
    const args = Object.assign({},this.state, {urlName: this.props.url_name});
    if (typeof this.props.onSave === 'function') this.props.onSave(args);

    this.resetState();
  }

  render() {
    return (
      <div className="c-card__item" onClick={this.bindedOnClick}>
        <div className="c-input-group">
          <div className="o-field">
            <input className="c-field" type="text" value={this.state.name} onChange={this.bindedOnNameChange} placeholder="Nueva línea"></input>
          </div>
          <div className="o-field">
            <div className="editor-line-color"><div className="color" style={{backgroundColor: this.state.color}}></div></div>
            {this.props.displayColorPicker ?
            <div ref="colorPickerContainer" className="color-picker-container"><SketchPicker color={ this.state.color } onChange={this.bindedOnColorChange}/></div> : null
            }
          </div>
          <div className="o-field">
            <span className="c-input-group" style={{float:'right'}}>
              { this.displaySaveButton && <button onClick={this.bindedOnSave} className="c-button c-button--info">Crear</button> }
            </span>
          </div>
        </div>
      </div>
    )
  }
}

export default LinesEditor
