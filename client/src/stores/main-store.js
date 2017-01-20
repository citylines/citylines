import Store from './store';

const MainStore = Object.assign({}, Store, {

  state: {
    displayPanel: true
  },

  getState() {
    return this.state;
  },

  togglePanel() {
    this.state = {
      displayPanel: !this.state.displayPanel
    }

    this.emitChangeEvent();
  }
});

export default MainStore
