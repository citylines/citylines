import React, {PureComponent} from 'react';
import {SketchPicker} from 'react-color';

class LinesEditor extends PureComponent {
  constructor(props, context) {
    super(props, context);

    this.displayColorPicker = {};

    this.bindedToggleColorPicker = this.toggleColorPicker.bind(this);
    this.bindedCloseColorPicker = this.closeColorPicker.bind(this);
  }

  toggleColorPicker(e) {
    const line_url_name = e.target.attributes.name.value.split(':')[1];
    const display = !this.displayColorPicker[line_url_name];
    this.displayColorPicker = {}
    this.displayColorPicker[line_url_name] = display;
    this.forceUpdate();
  }

  closeColorPicker(e) {
    if (e.target.className != 'color') {
      this.displayColorPicker = {};
      this.forceUpdate();
    }
  }

  render() {
    return (
      <div className="u-letter-box--small u-pillar-box--medium" style={{maxWidth:"1000px"}}>
        <div className="c-card c-card--highest">
          {
            this.props.lines.map((line) => {
              return (
                <div key={line.url_name} className="c-card__item" onClick={this.bindedCloseColorPicker}>
                  <div className="c-input-group">
                    <div className="o-field">
                      <input className="c-field" type="text" defaultValue={line.name}></input>
                    </div>
                    <div className="o-field">
                      <div className="editor-line-color"><div name={`color:${line.url_name}`} className="color" style={{backgroundColor: line.style.color}} onClick={this.bindedToggleColorPicker}></div></div>
                      {this.displayColorPicker[line.url_name] ?
                      <div className="color-picker-container"><SketchPicker color={ line.style.color } /></div> : null
                      }
                    </div>
                    <div className="o-field">
                      <span className="c-input-group" style={{float:'right'}}>
                        <button className="c-button c-button--brand">Actualizar</button>
                        <button className="c-button">Borrar</button>
                      </span>
                    </div>
                  </div>
                </div>)
            })
          }
        </div>
      </div>
    )
  }
}

export default LinesEditor
