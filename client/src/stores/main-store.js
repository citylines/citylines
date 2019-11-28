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
    this.state = {...this.state, ...data};
    this.emitChangeEvent();
  },

  getUser() {
    return {
      intials: this.state.initials,
      img: this.state.img,
      userid: this.state.userid
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
    return !!this.state.userid;
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
