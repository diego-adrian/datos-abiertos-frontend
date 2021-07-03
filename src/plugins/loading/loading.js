import store from '@/store';

export default {
  store,
  install(Vue) {
    const WaitScreen = {
      show(showHide = false, message = 'Cargando...') {
        const screen = store.state.waiting;
        screen.message = message;
        screen.show = showHide;
      }
    };
    Vue.prototype.$waiting = WaitScreen.show;
  }
};
