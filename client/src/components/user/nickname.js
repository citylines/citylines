import React, {Component} from 'react';

class Nickname extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      edit: false,
      name: this.props.name
    }
  }

  handleInputChange(e) {
    const newName = e.target.value;
    this.setState({
      name: newName,
      inputWidth: this.nameDiv.offsetWidth
    })
  }

  toggleEdit(e) {
    const cancel = e.target.name == 'cancel';
    let name = this.state.name;

    if (cancel) {
      name = this.props.name
    }

    this.setState({
      edit: !this.state.edit,
      name: name,
      inputWidth: this.nameDiv.offsetWidth
    }, () => {
      if (this.state.edit) {
        this.editInput.focus();
      } else {
        if (!cancel) {
        // TODO: save
        }
      }
    });
  }

  render() {
    return (
      <div style={{display:'inline'}}>
        <div className='user-page-username'>
        {this.state.edit ?
        <input
          ref={(input) => { this.editInput = input; }}
          className="c-field user-nickname-input"
          value={this.state.name}
          onChange={this.handleInputChange.bind(this)}
          style={{width: this.state.inputWidth}}
          ></input> : ''}
        <div
          className='user-current-nickname'
          ref={(el) => { this.nameDiv = el; }}
          style={{visibility: this.state.edit ? 'hidden' : 'visible'}}
        >
          {this.state.name}
        </div>
      </div>

      {this.props.myProfile &&
      <a className="c-link user-avatar-edit" onClick={this.toggleEdit.bind(this)}>{this.state.edit ? 'Save' : 'Edit'}</a>}
      {this.state.edit &&
      <a className="c-link user-avatar-edit" name="cancel" onClick={this.toggleEdit.bind(this)}>Cancel</a>}
    </div>
    )
  }
}

export default Nickname
