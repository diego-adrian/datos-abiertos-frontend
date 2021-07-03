import Vue from 'vue';
// Plugins
import Message from '@/plugins/message/message';
import Storage from '@/plugins/storage';
import Service from '@/plugins/service';
import Datetime from '@/plugins/datetime';
import Progress from '@/plugins/progress-bar/progress';
import Loading from '@/plugins/loading/loading';
import Util from '@/plugins/util';
import Casbin from '@/plugins/casbin';
import Bus from '@/plugins/bus';
import Xlsx from '@/plugins/xlsx';
import Directives from '@/directives';
import Modal from '@/plugins/modal/modal';
import Components from '@/plugins/component';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import './assets/fonts/index.scss';
import './scss/index.scss';

Vue.use(Progress);
Vue.use(Message);
Vue.use(Storage);
Vue.use(Util);
Vue.use(Casbin);
Vue.use(Components);
Vue.use(Xlsx);
Vue.use(Modal);
Vue.use(Loading);
Vue.use(Bus);
Vue.use(Datetime);
Vue.use(Directives);
Vue.use(Service, {
  apiUrl: process.env.VUE_APP_API_URL,
  baseServer: process.env.VUE_APP_BASE_SERVER,
  authToken: process.env.VUE_APP_AUTH_TOKEN,
  filterResponse: (response, Message) => {
    if (response.datos && response.finalizado) {
      return response.datos;
    }
    if ('finalizado' in response && !response.finalizado) {
      Message.error(response.message);
      return response.datos;
    }
    return response;
  },
  errorFormat: 'mensaje'
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app');
