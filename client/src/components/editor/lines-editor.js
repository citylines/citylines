import React, {PureComponent} from 'react';
import {SketchPicker} from 'react-color';
import Translate from 'react-translate-component';

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

  onCancelDelete() {
    this.displayDeleteWarning = false;
    this.forceUpdate();
  }

  onSave() {
    this.displaySaveButton = false;
    const args = Object.assign({},this.state, {urlName: this.props.url_name});
    if (typeof this.props.onSave === 'function') this.props.onSave(args);
  }

  onClick(e) {
    if (typeof this.props.onClick) this.props.onClick(e, this.props.url_name);
  }

  render() {
    const deleteWarningControl = <span className="c-input-group" style={{float:'right'}}>
        <Translate className="editor-delete-warning-text" content="editor.lines_editor.are_you_sure" />
        <button className="c-button" onClick={this.bindedOnActualDelete}><Translate content="editor.lines_editor.yes" /></button>
        <button className="c-button" onClick={this.bindedOnCancelDelete}><Translate content="editor.lines_editor.no" /></button>
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

export default LinesEditor
