import React, {Component} from 'react';

class LinesTreeContainer extends Component {
  render() {
    return (
      <ul style={{marginLeft: "1em"}} className="c-tree">
        {this.props.children}
      </ul>
    )
  }
}

class LinesTree extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {expanded: this.props.defaultExpanded || true};
  }

  onItemToggle(urlName) {
    if (typeof this.props.onLineToggle === 'function') {
      this.props.onLineToggle(urlName);
    }
  }

  toggleExpanded() {
    this.setState({expanded: !this.state.expanded})
  }

  componentWillReceiveProps(newProps) {
    const newLinesShown = newProps.linesShown.sort().toString();
    const linesShown = this.props.linesShown.sort().toString();

    if (newLinesShown !== linesShown &&
        typeof this.props.onLinesShownChange === 'function') {
      this.props.onLinesShownChange();
    }
  }

  render() {
    const lines = this.props.lines || [];
    const expandClass = this.state.expanded ? 'c-tree__item--expanded' : 'c-tree__item--expandable';

    return (
      <li className={`c-tree__item ${expandClass}`} onClick={this.toggleExpanded.bind(this)}>
        <span className="c-link"> {this.props.name} </span>
        <ul className="c-tree" style={{display: this.state.expanded ? 'block' : 'none'}}>
          { lines.map((line) => {
            return <LinesTreeItem
              key={line.url_name}
              urlName={line.url_name}
              name={line.name}
              color={line.style.color}
              show={this.props.linesShown.includes(line.url_name)}
              onToggle={this.onItemToggle.bind(this)}
            />
          })}
        </ul>
      </li>
    )
  }
}

class LinesTreeItem extends Component {
  onToggle() {
    if (this.props.onToggle) {
      this.props.onToggle(this.props.urlName);
    }
  }

  render() {
    const style={backgroundColor: this.props.show ? this.props.color : null}

    return (
        <label className="c-toggle" >
          <input onChange={this.onToggle.bind(this)} type="checkbox" checked={this.props.show} />
          <div className="c-toggle__track" style={style}>
            <div className="c-toggle__handle"></div>
          </div>
          {this.props.name}
        </label>
    )
  }
}

export {LinesTreeContainer, LinesTree};
