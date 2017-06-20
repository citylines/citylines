import React, {PureComponent} from 'react';
import Translate from 'react-translate-component';

class OSMImporter extends PureComponent {
  constructor(props, context) {
    super(props, context);

    this.ROUTES = [
      'train',
      'light_rail',
      'subway',
      'tram',
      'bus',
      'trolleybus',
      'bicycle'
    ];

    this.bindedImport = this.import.bind(this);
  }

  import() {
    this.props.onImport(this.refs.route.value);
  }

  render() {
    return(
        <ul className="c-card">
          <li className="c-card__item c-card__item--brand">OpenStreetMap</li>
          <li className="c-card__item">
          {this.props.zoom < 13 ?
            <Translate component="span" content="editor.osm.zoom" className="osm-container" />
              :
            <span className="osm-container">
              <span className="c-code">
                route =
                <select ref="route" className="c-field osm-route">
                  {this.ROUTES.map(route => <option key={route}>{route}</option>)}
                </select>
              </span>
            </span>
          }
            <Translate component="button"
                       content="editor.osm.import_button"
                       onClick={this.bindedImport}
                       className="c-button"
                       disabled={this.props.savingData || this.props.zoom < 13} />
          </li>
        </ul>
        )
  }
}

export default OSMImporter
