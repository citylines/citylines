import React, {PureComponent} from 'react';

class ModifiedFeaturesViewer extends PureComponent {
  constructor(props, context) {
    super(props, context);

    this.bindedOnClick = this.onClick.bind(this);
  }

  type(feature) {
    let type = "";

    if (feature.props && !feature.geo) type = "(Props)";
    if (!feature.props && feature.geo) type = "(Geo)";
    if (feature.created) type = "(New)";
    if (feature.removed) type = "(Removed)";

    return type;
  }

  onClick(e) {
    const id = e.target.attributes.name.value;
    if (typeof this.props.onClick === 'function') this.props.onClick(id);
  }

  render() {
    const content = this.props.modifiedFeatures ?
      Object.entries(this.props.modifiedFeatures).map((entry) => {
        const id = entry[0];
        const feature = entry[1];
        const idLabel = feature.id ? `Id: ${feature.id}`: '';

        return (
          <li key={id} name={id} className="c-card__item" onClick={this.bindedOnClick}>{`${this.type(feature)} ${feature.klass} ${idLabel}`}</li>
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
