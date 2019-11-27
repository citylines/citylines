import Store from './store';

const MainStore = Object.assign({}, Store, {
  state: {
    displayPanel: !(window.innerWidth < 600),
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

  setUser(data) {
    this.state.username = data.username;
    this.state.userid = data.userid;
    this.state.initials = data.initials;

    this.state = Object.assign({}, this.state);
    this.emitChangeEvent();
  },

  getUser() {
    return {
      name: this.state.username,
      intials: this.state.initials,
      id: this.state.userid
    }
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
    this.state = {...this.state};

    this.emitChangeEvent();
  },

  unsetLoading() {
    this.state.loading = false;
    this.state = {...this.state};

    this.emitChangeEvent();
  }
});

export default MainStore
