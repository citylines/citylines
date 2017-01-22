import React from 'react';

const Panel = (props) => <div id="panel" style={{display: props.display ? 'block' : 'none'}}>{props.children}</div>;

const PanelHeader = (props) => <div className="panel-header o-grid__cell o-grid__cell--width-100">{props.children}</div>;

const PanelBody = (props) => <div className="panel-body">{props.children}</div>

export {Panel, PanelHeader, PanelBody};
