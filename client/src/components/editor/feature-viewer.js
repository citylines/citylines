import React, {PureComponent} from 'react';
import Translate from 'react-translate-component';

import FeatureLinesEditor from './feature-viewer/feature-lines-editor';

class FeatureViewer extends PureComponent {
  constructor(props, context) {
    super(props, context);

    this.VISIBLE_FIELDS = ['name', 'buildstart', 'opening', 'closure', 'osm_id', 'osm_tags', 'osm_metadata'];
    this.EDITABLE_FIELDS = new Set(['name', 'buildstart', 'opening', 'closure']);
    this.NUMERIC_FIELDS = new Set(['buildstart', 'opening', 'closure']);
  }

  onValueChange(e) {
    const key = e.target.attributes.name.value;
    const value = e.target.value;

    const modifiedFeature = Object.assign({}, this.props.feature);
    modifiedFeature.properties[key] = value;

    if (this.props.onFeatureChange) this.props.onFeatureChange(modifiedFeature);
  }

  onAddLine(newLine) {
    const modifiedFeature = Object.assign({}, this.props.feature);
    modifiedFeature.properties.lines.push(newLine);

    if (this.props.onFeatureChange) this.props.onFeatureChange(modifiedFeature);
  }

  onRemoveLine(urlName) {
    const modifiedFeature = Object.assign({}, this.props.feature);

    const lineIndex = modifiedFeature.properties.lines.findIndex(l => l.line_url_name == urlName);
    modifiedFeature.properties.lines.splice(lineIndex, 1);

    if (this.props.onFeatureChange) this.props.onFeatureChange(modifiedFeature);
  }

  onLineYearChange(urlName, attr, value) {
    const modifiedFeature = {...this.props.feature};

    const line = modifiedFeature.properties.lines.find(l => l.line_url_name == urlName);
    line[attr] = value;

    if (this.props.onFeatureChange) this.props.onFeatureChange(modifiedFeature);
  }

  render() {
    const properties = this.props.feature ? this.props.feature.properties : null;

    const content = this.props.feature ?
          <table className="c-table c-table--striped">
            <caption className="c-table__caption"><Translate content={`editor.feature_viewer.fields.klasses_id.${properties.klass.toLowerCase()}`} with={{id: properties.id}} /></caption>
            <tbody className="c-table__body">
              <tr className="c-table__row">
                <td className="c-table__cell" colSpan="2">
                  <FeatureLinesEditor
                    featureLines={properties.lines}
                    lines={this.props.lines}
                    systems={this.props.systems}
                    onAddLine={this.onAddLine.bind(this)}
                    onRemoveLine={this.onRemoveLine.bind(this)}
                    onLineYearChange={this.onLineYearChange.bind(this)}
                  />
                </td>
              </tr>
              { this.VISIBLE_FIELDS.map(key => {
                if (key == 'name' && properties.klass == 'Section') return;
                const editable = this.EDITABLE_FIELDS.has(key);
                const value = properties[key];
                if (!editable && !value) return;

                return (
                  <tr key={`${properties.id}_${key}`} className="c-table__row">
                    <td className="c-table__cell"><Translate content={`editor.feature_viewer.fields.${key}`} /></td>
                    <td className="c-table__cell">
                      { editable ?
                      <input className="c-field"
                             type={this.NUMERIC_FIELDS.has(key) ? 'number' : 'text'}
                             name={key}
                             onChange={this.onValueChange.bind(this)}
                             value={typeof value == 'undefined' ? '' : value}/>
                        :
                        value
                      }
                    </td>
                  </tr>
                )
              }) }
            </tbody>
          </table> : <Translate content="editor.feature_viewer.no_feature_selected" />;

    return (
      <div className="c-card">
        <div className="c-card__item c-card__item--brand"><Translate content="editor.feature_viewer.selected_feature" /></div>
        <div className="c-card__item">
        { content }
        </div>
      </div>
      )
  }
}

export default FeatureViewer
