import Store from './store';
import MainStore from './main-store';

const UserStore = Object.assign({}, Store, {
  userData: {},

  async load(userId) {
    this.userData = await this.getUserData(userId);
    this.emitChangeEvent();
  },

  async getUserData(userId) {
    const url = `/api/user?user_id=${userId}`;
    const response = await fetch(url);
    const json = await response.json();
    return json;
  },

  getState() {
    return this.userData;
  },

  async updateUserNickname(userId, nickname) {
    const url = `/api/user/${userId}/nickname`;
    const body = JSON.stringify({nickname: nickname});
    const response = await fetch(url, {method:'PUT', body: body, credentials: 'same-origin'});
    const json = await response.json();
    this.userData = {...this.userData, ...json};
    this.emitChangeEvent();
    MainStore.setUser({userid: userId, initials: json.initials});
  }
});

export default UserStore
