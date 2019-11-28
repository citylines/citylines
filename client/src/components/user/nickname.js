import React, {Component} from 'react';
import Translate from 'react-translate-component';

class Nickname extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      edit: false,
      name: this.props.name
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.name != this.state.name) {
      this.setState({name: nextProps.name});
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
          this.props.onNicknameChange(name)
        }
      }
    });
  }

  render() {
    return (
      <div style={{display:'inline'}}>
        <div className='user-page-username'>
        {this.state.edit &&
            <div className="user-gravatar">
              {this.props.img ?
              <a className="c-link" onClick={this.props.onRemoveGravatar}>Remove avatar</a>
                :
              <span><a className="c-link" onClick={this.props.onSetGravatar}>Fetch avatar from Gravatar</a> <a className="c-link" target="_blank" href="https://es.gravatar.com/support/what-is-gravatar/"><i className="fas fa-info-circle"></i></a></span>
              }
            </div>}
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

      {this.props.myProfile && (!this.state.edit || (this.state.edit && this.state.name != this.props.name)) &&
      <Translate component="a" className="c-link user-avatar-edit" onClick={this.toggleEdit.bind(this)} content={`user.nickname.${this.state.edit ? 'save' : 'edit'}`} />}
      {this.state.edit &&
      <Translate component="a" className="c-link user-avatar-edit" name="cancel" onClick={this.toggleEdit.bind(this)} content='user.nickname.cancel' />}
    </div>
    )
  }
}

export default Nickname
