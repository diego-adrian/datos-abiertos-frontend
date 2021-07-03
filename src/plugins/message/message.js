import store from '@/store';

export default {
  store,
  install(Vue) {
    const message = {
      add (message, title, icon, theme) {
        const { snackbar } = store.state;
        snackbar.message = message;
        snackbar.title = title;
        snackbar.icon = icon;
        snackbar.theme = theme;
        snackbar.status = true;
      },
      success (message, title = 'La operación se realizó correctamente.', icon = 'check', theme = 'success') {
        this.add(message, title, icon, theme);
      },
      info (message, title = 'Información', icon = 'info', theme = 'info') {
        this.add(message, title, icon, theme);
      },
      warning (message, title = 'Advertencia', icon = 'warning', theme = 'warning') {
        this.add(message, title, icon, theme);
      },
      error (message, title = 'Error', icon = 'error', theme = 'error') {
        this.add(message, title, icon, theme);
      }
    };
    Vue.prototype.$message = message;
  }
};
