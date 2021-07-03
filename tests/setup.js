import Vue from 'vue';
import Vuetify from 'vuetify';
import Message from '@/plugins/message/message';
import Storage from '@/plugins/storage';
import Util from '@/plugins/util';
import Progress from '@/plugins/progress-bar/progress';
import Service from '@/plugins/service';

Vue.use(Vuetify);
Vue.use(Message);
Vue.use(Storage);
Vue.use(Util);
Vue.use(Progress);
Vue.use(Service, {
  apiUrl: 'http://localhost/api/',
  baseServer: 'http://localhost/api/',
  authToken: 'Bearer test',
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
