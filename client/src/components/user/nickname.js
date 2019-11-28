import React, {Component} from 'react';

class Nickname extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      edit: false,
      name: this.props.name,
      inputWidth: this.calcInputWidth(this.props.name)
    }
  }

  handleInputChange(e) {
    const newName = e.target.value;
    this.setState({
      name: newName,
      inputWidth: this.calcInputWidth(newName)
    })
  }

  toggleEdit() {
    this.setState({edit: !this.state.edit}, () => {
      if (this.state.edit) this.editInput.focus();
    });
  }

  calcInputWidth(text) {
    let length = text.length * 0.5;
    if (length < 4) length = 4;
    return length + 'ch';
  }

  render() {
    return (
    <div style={{display:'inline'}}>
      {this.state.edit ?
      <input
        ref={(input) => { this.editInput = input; }}
        className="c-field user-page-username user-avatar-input"
        value={this.state.name}
        onChange={this.handleInputChange.bind(this)}
        style={{width: this.state.inputWidth}}
        ></input> :
      <div className="user-page-username">
        {this.props.name}
      </div>
      }
      {this.props.myProfile &&
      <a className="c-link user-avatar-edit" onClick={this.toggleEdit.bind(this)}>{this.state.edit ? 'Save' : 'Edit'}</a>}
    </div>
    )
  }
}

export default Nickname
