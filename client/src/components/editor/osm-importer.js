import React, {PureComponent} from 'react';
import Translate from 'react-translate-component';

class OSMImporter extends PureComponent {
  render() {
    return(
        <ul className="c-card">
          <li className="c-card__item c-card__item--brand">OpenStreetMap</li>
          <li className="c-card__item">
          {this.props.zoom < 13 ?
            <Translate component="p" content="editor.osm.zoom" />
              : "" }
            <Translate component="button"
                       content="editor.osm.import_button"
                       onClick={this.props.onImport}
                       className="c-button"
                       disabled={this.props.savingData || this.props.zoom < 13} />
          </li>
        </ul>
        )
  }
}

export default OSMImporter
