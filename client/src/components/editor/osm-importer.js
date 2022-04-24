import React, {PureComponent} from 'react';
import Translate from 'react-translate-component';

class OSMImporter extends PureComponent {
  constructor(props, context) {
    super(props, context);

    this.ROUTES = [
      'bicycle',
      'bus',
      'ferry',
      'light_rail',
      'subway',
      'train',
      'tram',
      'trolleybus',
    ];

    this.bindedImport = this.import.bind(this);
  }

  import() {
    this.props.onImport(this.refs.route.value);
  }

  render() {
    return(
        <div className="c-card">
          <div className="c-card__item c-card__item--brand">OpenStreetMap</div>
          <div className="c-card__item">
          {this.props.zoom < 13 ?
            <Translate component="span" content="editor.osm.zoom" className="osm-container" />
              :
            <span className="osm-container">
              <span className="preamble"><Translate content="editor.osm.relation" /></span>
              <span className="c-code">
                route =
                <select ref="route" className="c-field osm-route">
                  {this.ROUTES.map(route => <option key={route}>{route}</option>)}
                </select>
              </span>
              <span className="members">
                <Translate content="editor.osm.members" />
                <ul className="c-list">
                  <li className="c-list__item"><Translate content="editor.osm.ways" /></li>
                  <li className="c-list__item"><Translate content="editor.osm.nodes" /><br/><span className="c-code">public_transport=stop_position</span></li>
                </ul>
              </span>
            </span>
          }
            <Translate component="button"
                       content="editor.osm.import_button"
                       onClick={this.bindedImport}
                       className="c-button"
                       disabled={this.props.savingData || this.props.zoom < 13} />
          </div>
        </div>
        )
  }
}

export default OSMImporter
