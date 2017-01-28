import React, {PureComponent} from 'react';

class FeatureViewer extends PureComponent {
  constructor(props, context) {
    super(props, context);

    this.bindedOnValueChange = this.onValueChange.bind(this);
    this.bindedOnLineChange = this.onLineChange.bind(this);
  }

  editableFields() {
    return ['opening', 'buildstart', 'closure', 'name']
  }

  visibleFields() {
    return this.editableFields().concat(['length']);
  }

  onValueChange(e) {
    if (e.key != 'Enter') return;

    const key = e.target.attributes.name.value;
    let value = e.target.innerText;

    const oldValue = this.props.feature.properties[key];
    if (typeof oldValue != 'string') value = parseInt(value);

    if (value == oldValue) return;

    const modifiedFeature = Object.assign({}, this.props.feature);
    modifiedFeature.properties[key] = value;

    if (this.props.onFeatureChange) this.props.onFeatureChange(modifiedFeature, key, value);
  }

  onLineChange(e) {
    const newLineUrlName = e.target.value;

    const modifiedFeature = Object.assign({}, this.props.feature);
    modifiedFeature.properties['line_url_name'] = newLineUrlName;

    if (this.props.onFeatureChange) this.props.onFeatureChange(modifiedFeature, 'line_url_name', newLineUrlName);
  }

  render() {
    const properties = this.props.feature ? this.props.feature.properties : null;
    const idLabel = this.props.feature && this.props.feature.properties.id ? `Id: ${properties.id}` :'';

    const content = this.props.feature ?
          <table className="c-table c-table--striped">
            <caption className="c-table__caption">{`${properties.klass} ${idLabel}`}</caption>
            <tbody className="c-table__body">
              <tr className="c-table__row">
                <td className="c-table__cell">{"Línea"}</td>
                <td className="c-table__cell">
                  <select className="c-field u-xsmall" value={this.props.feature.properties.line_url_name} onChange={this.bindedOnLineChange}>
                    {this.props.lines.map((line) => {
                      return (
                        <option key={`${properties.klass}_${properties.id}_${line.url_name}`} value={line.url_name}>{line.name}</option>
                      )
                     })}
                  </select>
                </td>
              </tr>
              { Object.entries(properties).map((entry) => {
                const key = entry[0];
                const value = entry[1];
                if (!this.visibleFields().includes(key)) return;

                return (
                  <tr key={`${properties.id}_${key}`} className="c-table__row">
                    <td className="c-table__cell">{key}</td>
                    <td className="c-table__cell" contentEditable={this.editableFields().includes(key)} suppressContentEditableWarning={true} name={key} onKeyUp={this.bindedOnValueChange}>{value}</td>
                  </tr>
                )
              }) }
            </tbody>
          </table> : 'Ningún elemento seleccionado';

    return (
      <div className="c-card">
        <li className="c-card__item c-card__item--divider">Elemento seleccionado</li>
        <div className="c-card__item">
        { content }
        </div>
      </div>
      )
  }
}

export default FeatureViewer
