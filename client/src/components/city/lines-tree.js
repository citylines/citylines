import React, {PureComponent} from 'react';
import Translate from 'react-translate-component';

class LinesTree extends PureComponent {
  constructor(props, context) {
    super(props, context);

    this.state = {expanded: this.props.defaultExpanded || true};
    this.bindedOnItemToggle = this.onItemToggle.bind(this);
    this.bindedOnAllLinesItemToggle = this.onAllLinesItemToggle.bind(this);
  }

  onItemToggle(urlName) {
    if (typeof this.props.onLineToggle === 'function') {
      this.props.onLineToggle(urlName);
    }
  }

  onAllLinesItemToggle(checked) {
    if (typeof this.props.onAllLinesToggle === 'function') {
      this.props.onAllLinesToggle(this.props.systemId, checked);
    }
  }

  toggleExpanded() {
    this.setState({expanded: !this.state.expanded})
  }

  componentDidUpdate() {
    if (typeof this.props.onLinesShownChange === 'function') {
      this.props.onLinesShownChange();
    }
  }

  render() {
    const lines = this.props.lines || [];
    const expandClass = this.state.expanded ? 'c-tree__item--expanded' : 'c-tree__item--expandable';

    return (
      <ul style={{marginLeft: "1em", paddingRight: "1em"}} className="c-tree">
        <li className={`c-tree__item ${expandClass}`} onClick={this.toggleExpanded.bind(this)}>
          <span className="c-link">{this.props.name || <Translate content="city.lines" />} </span>
          <ul className="c-tree" style={{display: this.state.expanded ? 'block' : 'none'}}>
            { lines.length > 1 ?
            <AllLinesItem
              lines={this.props.lines}
              linesShown={this.props.linesShown}
              onToggle={this.bindedOnAllLinesItemToggle}
              /> : "" }
            { lines.map((line) => {
              return <LinesTreeItem
                key={line.url_name}
                urlName={line.url_name}
                name={line.name}
                color={line.color}
                show={this.props.linesShown.includes(line.url_name)}
                onToggle={this.bindedOnItemToggle}
              />
            })}
          </ul>
        </li>
      </ul>
    )
  }
}

class LinesTreeItem extends PureComponent {
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

class AllLinesItem extends PureComponent {
  constructor(props, context) {
    super(props, context);

    this.state = {checked: this.allLinesHidden(props) ? false : true};

    this.bindedOnToggle = this.onToggle.bind(this);
  }

  allLinesHidden(props) {
    return props.lines.filter(line => props.linesShown.includes(line.url_name)).length == 0;
  }

  allLinesShown(props) {
    return props.lines.length === props.lines.filter(line => props.linesShown.includes(line.url_name)).length;
  }

  onToggle() {
    this.props.onToggle(!this.state.checked);
    this.setState({checked: !this.state.checked});
  }

  componentWillReceiveProps(nextProps) {
    if (this.allLinesHidden(nextProps)) {
      this.setState({checked: false});
    }

    if (this.allLinesShown(nextProps)) {
      this.setState({checked: true});
    }
  }

  render() {
    return (
        <label className="c-toggle">
          <input onChange={this.bindedOnToggle} type="checkbox" checked={this.state.checked}/>
          <div className="c-toggle__track">
            <div className="c-toggle__handle"></div>
          </div>
         <Translate content="city.all_lines" />
        </label>
    )
  }
}

export default LinesTree
