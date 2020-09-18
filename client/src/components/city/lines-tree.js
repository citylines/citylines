import React, {PureComponent} from 'react';
import Translate from 'react-translate-component';
import SystemTags from './system-tags';

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
      this.props.onAllLinesToggle(this.props.system.id, checked);
    }
  }

  toggleExpanded() {
    this.setState({expanded: !this.state.expanded})
  }

  render() {
    const lines = this.props.lines || [];
    const expandClass = this.state.expanded ? 'c-tree__item--expanded' : 'c-tree__item--expandable';

    return (
      <ul className="c-tree system-tree">
        <li className={`c-tree__item ${expandClass}`}>
          <span className="c-link system-name" onClick={this.toggleExpanded.bind(this)}>{this.props.system.name || <Translate content="city.lines" />}</span>
          <SystemTags system={this.props.system} />
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
                transportMode={this.props.transportModes.find(tm => tm.id === line.transport_mode_id)}
                showTransportMode={this.props.showTransportModes}
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
          <div className="line-tree-content">
            <span>{this.props.name}</span>
            {this.props.transportMode && this.props.transportMode.name != 'default' && this.props.showTransportMode &&
                <Translate className="c-badge c-badge--ghost" content={`transport_modes.${this.props.transportMode.name}`} />}
          </div>
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

  UNSAFE_componentWillReceiveProps(nextProps) {
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
