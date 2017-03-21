import Store from './store';

const MainStore = Object.assign({}, Store, {

  state: {
    displayPanel: true,
    panelFullWidth: false,
    loading: false
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

  showCookieAdvice() {
    this.state.showCookieAdvice = true;
    this.emitChangeEvent();
  },

  hideCookieAdvice() {
    this.state.showCookieAdvice = false;
    this.emitChangeEvent();
  },

  userLoggedIn() {
    return !!this.state.username;
  },

  setLoading() {
    this.state.loading = true;
    this.emitChangeEvent();
  },

  unsetLoading() {
    this.state.loading = false;
    this.emitChangeEvent();
  }
});

export default MainStore
