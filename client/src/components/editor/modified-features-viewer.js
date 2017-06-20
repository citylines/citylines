import React, {PureComponent} from 'react';
import Translate from 'react-translate-component';

class ModifiedFeaturesViewer extends PureComponent {
  constructor(props, context) {
    super(props, context);

    this.bindedOnClick = this.onClick.bind(this);
    this.bindedOnDiscard = this.onDiscard.bind(this);
    this.bindedOnSave = this.onSave.bind(this);
  }

  type(feature) {
    let type = null;

    if (feature.props && !feature.geo) type = 'props';
    if (!feature.props && feature.geo) type = 'geo';
    if (feature.created) type = 'created';
    if (feature.removed) type = 'removed';

    return type;
  }

  onClick(e) {
    const id = e.currentTarget.attributes.name.value;
    const feature = this.props.modifiedFeatures[id];

    if (typeof this.props.onClick === 'function') {
      this.props.onClick(feature.klass, feature.id);
    }
  }

  onDiscard() {
    if (typeof this.props.onDiscard === 'function') this.props.onDiscard();
  }

  onSave() {
    if (typeof this.props.onSave === 'function') this.props.onSave();
  }

  elementsNumber() {
    return Object.entries(this.props.modifiedFeatures).length;
  }

  tooManyElements() {
    return this.props.modifiedFeatures && this.elementsNumber() > 20;
  }

  render() {
    const content = this.props.modifiedFeatures ?
      Object.entries(this.props.modifiedFeatures).map((entry) => {
        const id = entry[0];
        const feature = entry[1];
        const idLabel = !feature.created ? `Id: ${feature.id}`: '';

        return (
          <li key={id} name={id} className="c-card__item" onClick={this.bindedOnClick}>
            {this.type(feature) && <Translate content={`editor.modified_features.types.${this.type(feature)}`} className="modified-features-list-subitem" />}
            <Translate content={`editor.modified_features.klasses.${feature.klass.toLowerCase()}`} className="modified-features-list-subitem" />
            <span className="modified-features-list-subitem">{idLabel}</span>
          </li>
        )
      })
      : <div className="c-card__item"><Translate content="editor.modified_features.no_features_modified" /></div>;

      const buttons = this.props.modifiedFeatures ?
        <div className="c-card__item">
          <span className="c-input-group">
            <button onClick={this.bindedOnDiscard} className="c-button c-button--block"><Translate content="editor.modified_features.discard" /></button>
            <button onClick={this.bindedOnSave} disabled={this.props.savingData || this.tooManyElements()} className="c-button c-button--block c-button--info"><Translate content="editor.modified_features.save" /></button>
          </span>
        </div>
        : null;

    return (
      <ul className={`c-card ${this.props.modifiedFeatures ? "c-card--menu c-card--grouped no-max-height" : ""}`}>
      <li className="c-card__item c-card__item--brand">
        <Translate content="editor.modified_features.title" />
        { this.props.modifiedFeatures ? ` (${this.elementsNumber()})` : '' }
      </li>
        { content }
        {  this.tooManyElements() ?
          <Translate component="li" className="c-card__item" content="editor.modified_features.too_many_elements" />
          : ""}
        { buttons }
      </ul>
    )
  }
}

export default ModifiedFeaturesViewer
