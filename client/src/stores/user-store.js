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

    if (response.status == 404) {
      return {error: 'Missing user'}
    }

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
    MainStore.setUser({...MainStore.getUser(), initials: json.initials});
  },

  async setGravatar(userId) {
    this.updateGravatar(userId, 'put');
  },

  async removeGravatar(userId) {
    this.updateGravatar(userId, 'delete');
  },

  async updateGravatar(userId, verb) {
    const url = `/api/user/${userId}/gravatar`;
    const response = await fetch(url, {method: verb, credentials: 'same-origin'});
    const json = await response.json();
    this.userData = {...this.userData, ...json};
    MainStore.setUser({...MainStore.getUser(), img: json.img});
  }
});

export default UserStore
