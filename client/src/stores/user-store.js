import Store from './store';

const UserStore = Object.assign({}, Store, {
  userData: {},

  async load(user_id) {
    this.userData = await this.getUserData(user_id);
    this.emitChangeEvent();
  },

  async getUserData(user_id) {
    const url = `/api/user?user_id=${user_id}`;
    const response = await fetch(url);
    const json = await response.json();
    return json;
  },

  getState() {
    return this.userData;
  }
});

export default UserStore
