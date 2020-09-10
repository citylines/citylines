import Store from './store';
import Counterpart from 'counterpart';

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
  },

  async loadI18n() {
    const locale = window.locale;
    const url = `/api/i18n?locale=${locale}`;

    const response = await fetch(url, {credentials: 'same-origin'});
    const i18n = await response.json();

    Counterpart.registerTranslations(locale, i18n);
    Counterpart.setLocale(locale);

    this.emitChangeEvent();
  }
});

export default MainStore
