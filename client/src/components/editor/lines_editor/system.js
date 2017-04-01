import React, {Component} from 'react';

class System extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {display: true, modified: false, name: props.name || ''};

    this.bindedToggleDisplay = this.toggleDisplay.bind(this);
  }

  toggleDisplay() {
    this.setState(Object.assign({},this.state, {display: !this.state.display}));
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

  onChange(e) {
    this.setState(Object.assign({}, this.state, {name: e.target.value, modified: true}));
  }

  onSave() {
    this.setState(Object.assign({}, this.state, {modified: false}));
    this.props.onSave({id: this.props.id, name: this.state.name});
  }

  render() {
    return (
       <div ref="container" className="c-card lines-editor-container"
        onDragEnter={this.onDragEnter.bind(this)}
        onDragOver={this.onDragOver.bind(this)}
        onDragLeave={this.onDragLeave.bind(this)}
        onDrop={this.onDrop.bind(this)} >

        <div className="c-card__item c-card__item--brand">
          <span className={`system-toggle fa ${this.state.display ? 'fa-angle-left' : 'fa-angle-down'}`} onClick={this.bindedToggleDisplay}></span>
          <input className="c-field system-name" type="text" onChange={this.onChange.bind(this)} value={this.state.name} placeholder="The name of the system"></input>
          { this.state.modified &&
          <button className="c-button c-button--info save-system" onClick={this.onSave.bind(this)}>Save</button> }
        </div>
        {this.state.display ? this.props.children : null}
       </div>
      )
  }
}

export default System
