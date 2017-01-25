import React, {PureComponent} from 'react';

class ModifiedFeaturesViewer extends PureComponent {
  type(feature) {
    let type = "";
    if (feature.properties && !feature.geometry) type = "(Props)";
    if (!feature.properties && feature.geometry) type = "(Geo)";
    return type;
  }

  render() {
    const content = this.props.modifiedFeatures ?
      Object.entries(this.props.modifiedFeatures).map((entry) => {
        const id = entry[0];
        const feature = entry[1];

        return (
          <li key={id} className="c-card__item">{`${this.type(feature)} ${feature.klass} Id: ${feature.id}`}</li>
        )
      })
      : <div className="c-card__item">Ningún elemento modificado</div>;

    return (
      <ul className={`c-card ${this.props.modifiedFeatures ? "c-card--menu c-card--grouped" : ""}`}>
      <li className="c-card__item c-card__item--divider">Elementos modificados</li>
        { content }
      </ul>
    )
  }
}

export default ModifiedFeaturesViewer
