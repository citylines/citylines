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

  setPanelFullWidth() {
    this.state.panelFullWidth = true;

    this.state = Object.assign({}, this.state);
    this.emitChangeEvent();
  },

  unsetPanelFullWidth() {
    this.state.panelFullWidth = false;

    this.state = Object.assign({}, this.state);
    this.emitChangeEvent();
  },

  setUser(username) {
    this.state.username = username;

    this.state = Object.assign({}, this.state);
    this.emitChangeEvent();
  },

  userLoggedIn() {
    return !!this.state.username;
  }
});

export default MainStore
