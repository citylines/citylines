import Store from './store';

const MainStore = Object.assign({}, Store, {
  displayPanel: true,

  getState() {
    return {
      displayPanel: this.displayPanel
    }
  },

  togglePanel() {
    this.displayPanel = !this.displayPanel;
    this.emitChangeEvent();
  }
});

export default MainStore
