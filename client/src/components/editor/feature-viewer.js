import React, {PureComponent} from 'react';
import Translate from 'react-translate-component';

class FeatureViewer extends PureComponent {
  constructor(props, context) {
    super(props, context);

    this.bindedOnValueChange = this.onValueChange.bind(this);
    this.bindedOnLineChange = this.onLineChange.bind(this);

    this.buildState(props);
  }

  numericField(field) {
    return ['opening', 'buildstart', 'closure'].includes(field);
  }

  visibleFields() {
    return ['opening', 'buildstart', 'closure', 'name', 'osm_id', 'osm_tags'];
  }

  editableFields() {
    return ['opening', 'buildstart', 'closure', 'name'];
  }

  componentWillReceiveProps(props) {
    this.buildState(props);
  }

  buildState(props) {
    this.state = {fields: {}};

    const properties = props.feature ? props.feature.properties : null;

    if (!properties) return;

    Object.entries(properties).map(entry => {
      const key = entry[0];
      const value = entry[1];

      if (!this.visibleFields().includes(key)) return;

      this.state.fields[key] = value;
    });
  }

  onValueChange(e) {
    const key = e.target.attributes.name.value;
    const value = e.target.value;

    const modifiedFeature = Object.assign({}, this.props.feature);
    modifiedFeature.properties[key] = value;

    if (this.props.onFeatureChange) this.props.onFeatureChange(modifiedFeature, key, value);

    this.state.fields[key] = value;
    this.forceUpdate;
  }

  onLineChange(e) {
    const newLineUrlName = e.target.value;

    const modifiedFeature = Object.assign({}, this.props.feature);
    modifiedFeature.properties['line_url_name'] = newLineUrlName;

    if (this.props.onFeatureChange) this.props.onFeatureChange(modifiedFeature, 'line_url_name', newLineUrlName);
  }

  render() {
    const properties = this.props.feature ? this.props.feature.properties : null;

    const content = this.props.feature ?
          <table className="c-table c-table--striped">
            <caption className="c-table__caption"><Translate content={`editor.feature_viewer.fields.klasses_id.${properties.klass.toLowerCase()}`} with={{id: properties.id}} /></caption>
            <tbody className="c-table__body">
              <tr className="c-table__row">
                <td className="c-table__cell"><Translate content="editor.feature_viewer.fields.line" /></td>
                <td className="c-table__cell">
                  <select className="c-field u-xsmall" value={this.props.feature.properties.line_url_name} onChange={this.bindedOnLineChange}>
                    {this.props.systems.map((system) => {
                      return this.props.lines.filter(line => line.system_id == system.id).map((line) => {
                        const label = system.name ? `${system.name} - ${line.name}` : line.name;
                        return (
                          <option key={`${properties.klass}_${properties.id}_${line.url_name}`} value={line.url_name}>{label}</option>
                        )
                       })
                    })}
                  </select>
                </td>
              </tr>
              { Object.keys(this.state.fields).map((key) => {
                // We don't show the field at all if it's not editable and has no value
                if (!this.editableFields().includes(key) && !this.state.fields[key]) return;

                return (
                  <tr key={`${properties.id}_${key}`} className="c-table__row">
                    <td className="c-table__cell"><Translate content={`editor.feature_viewer.fields.${key}`} /></td>
                    <td className="c-table__cell">
                      { this.editableFields().includes(key) ?
                      <input className="c-field"
                             type={this.numericField(key) ? 'number' : 'text'}
                             name={key}
                             onChange={this.bindedOnValueChange}
                             value={this.state.fields[key]}/>
                        :
                        this.state.fields[key]
                      }
                    </td>
                  </tr>
                )
              }) }
            </tbody>
          </table> : <Translate content="editor.feature_viewer.no_feature_selected" />;

    return (
      <div className="c-card">
        <li className="c-card__item c-card__item--brand"><Translate content="editor.feature_viewer.selected_feature" /></li>
        <div className="c-card__item">
        { content }
        </div>
      </div>
      )
  }
}

export default FeatureViewer
