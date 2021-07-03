/* eslint-disable no-new */
import store from '@/store';

export default {
  store,
  install(Vue) {
    const {
      progress
    } = store.state;
    const ProgressBar = {
      start () {
        progress.active = true;
      },
      close () {
        store.commit('CLOSE_PROGRESS');
      },
    };

    Vue.prototype.$progress = ProgressBar;
  }
};
