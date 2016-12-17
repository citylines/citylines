import EventEmitter from 'events';

const CHANGE_EVENT = "change";

const Store = Object.assign({}, EventEmitter.prototype, {
  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  emitChangeEvent() {
    this.emit(CHANGE_EVENT);
  }
});

export default Store
