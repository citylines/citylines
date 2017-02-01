import Store from './store';

const MainStore = Object.assign({}, Store, {

  state: {
    displayPanel: true,
    panelFullWidth: false
  },

  getState() {
    return this.state;
  },

  togglePanel() {
    this.state.displayPanel = !this.state.displayPanel;

    this.state = Object.assign({}, this.state);
    this.emitChangeEvent();
  },

  togglePanelFullWidth() {
    this.state.panelFullWidth = !this.state.panelFullWidth;

    this.state = Object.assign({}, this.state);
    this.emitChangeEvent();
  }
});

export default MainStore
