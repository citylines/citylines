import React, {PureComponent} from 'react';

class FeatureViewer extends PureComponent {
  constructor(props, context) {
    super(props, context);

    this.bindedOnValueChange = this.onValueChange.bind(this);
  }

  editableFields() {
    return ['opening', 'buildstart', 'closure', 'name']
  }

  visibleFields() {
    return this.editableFields().concat(['length']);
  }

  onValueChange(e) {
    // TODO check that value has changed
    // TODO save value
    if (this.props.onFeatureChange) this.props.onFeatureChange(this.props.feature);
  }

  render() {
    const properties = this.props.feature ? this.props.feature.properties : null;
    const content = this.props.feature ?
          <table className="c-table c-table--striped">
            <caption className="c-table__caption">{`${properties.klass} Id: ${properties.id}`}</caption>
            <tbody className="c-table__body">
              { Object.entries(properties).map((entry) => {
                const key = entry[0];
                const value = entry[1];
                if (!this.visibleFields().includes(key)) return;

                return (
                  <tr key={`${properties.id}_${key}`} className="c-table__row">
                    <td className="c-table__cell">{key}</td>
                    <td className="c-table__cell" contentEditable={this.editableFields().includes(key)} onKeyUp={this.bindedOnValueChange}>{value}</td>
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
