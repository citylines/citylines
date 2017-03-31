import React, {Component} from 'react';

class System extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {display: true}

    this.bindedToggleDisplay = this.toggleDisplay.bind(this);
  }

  toggleDisplay() {
    this.state.display = !this.state.display;
    this.setState(Object.assign({},this.state));
  }

  onDragEnter(e) {
    e.preventDefault();
  }

  onDragOver(e) {
    e.preventDefault();
  }

  onDragLeave(e) {
    e.preventDefault();
  }

  onDrop(e) {
    const lineUrlName = e.dataTransfer.getData('text');
    this.props.onLineDragged(lineUrlName, this.props.id);
  }

  render() {
    return (
       <div className="c-card u-high lines-editor-container">
        <div className="c-card__item c-card__item--brand">
          <span className={`system-toggle fa ${this.state.display ? 'fa-angle-left' : 'fa-angle-down'}`} onClick={this.bindedToggleDisplay}></span>
          <input className="c-field system-name" type="text" value={this.props.name} placeholder="The name of the system"></input>
          <button className="c-button c-button--info save-system">Save</button>
        </div>
        {this.state.display ? this.props.children : null}
        <div className="c-card__item system-lines-drop"
             onDragEnter={this.onDragEnter.bind(this)}
             onDragOver={this.onDragOver.bind(this)}
             onDragLeave={this.onDragLeave.bind(this)}
             onDrop={this.onDrop.bind(this)}
             style={{display: this.state.display ? 'block' : 'none'}}>
             Drop lines here
        </div>
       </div>
      )
  }
}

export default System
