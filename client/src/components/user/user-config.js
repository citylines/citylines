import React, {Component} from 'react';
import Translate from 'react-translate-component';

class UserConfig extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      edit: false,
      name: this.props.name
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.name != this.state.name) {
      this.setState({name: nextProps.name});
    }
  }

  handleInputChange(e) {
    const newName = e.target.value;
    this.setState({
      name: newName
    }, () => {
      this.setState({
        inputWidth: this.nameDiv.offsetWidth
      })
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
          <span className='user-avatar-edit'>
            {this.state.edit &&
              <div className="user-gravatar">
                {this.props.img ?
                <Translate component="a" className="c-link" onClick={this.props.onRemoveGravatar} content="user.config.gravatar.unset" />
                  :
                <span>
                  <Translate component="a" className="c-link" onClick={this.props.onSetGravatar} content="user.config.gravatar.set" /> <a className="c-link" target="_blank" href="https://gravatar.com"><i className="fas fa-info-circle"></i></a>
                </span>
                }
              </div>}
            <div className="user-avatar-edit-controls">
              {this.props.editable && (!this.state.edit || (this.state.edit && this.state.name != this.props.name)) &&
              <Translate component="a" className="c-link user-avatar-edit-control" onClick={this.toggleEdit.bind(this)} content={`user.config.${this.state.edit ? 'save' : 'edit'}`} />}
              {this.state.edit &&
              <Translate component="a" className="c-link user-avatar-edit-control" name="cancel" onClick={this.toggleEdit.bind(this)} content='user.config.cancel' />}
            </div>
          </span>
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
    </div>
    )
  }
}

export default UserConfig
