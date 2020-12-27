import Store from './store';

const DiscussionStore = {...Store, ...{
    state: {
      msgs: []
    },

    getState() {
      return this.state;
    },

    async getMsgs(urlName) {
      const url = `/api/editor/${urlName}/discussion/messages`;
      const response = await fetch(url, {credentials: 'same-origin'});
      const json = await response.json();
      this.state.msgs = json;
      this.emitChangeEvent();
    },

    async sendMsg(urlName, content) {
      const url = `/api/editor/${urlName}/discussion/message`;
      const body = JSON.stringify({content: content});
      const response = await fetch(url, {method: 'POST', body: body, credentials: 'same-origin'});
      const json = await response.json();
      this.state.msgs = json;
      this.state.newMsg = '';
      this.emitChangeEvent();
    }
  }
}

export default DiscussionStore
