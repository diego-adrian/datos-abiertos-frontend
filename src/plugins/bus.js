export default {
  install: Vue => {
    const Bus = new Vue();
    Vue.prototype.$bus = Bus;
  }
};
