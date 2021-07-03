import { shallowMount, mount } from '@vue/test-utils';
import LoginComponent from '@/components/auth/Login.vue';
import axios from 'axios';
import Vuetify from 'vuetify';
import Vue from 'vue';
import MaterialIcons from '@dbetka/vue-material-icons';
import VueRouter from 'vue-router';

Vue.use(MaterialIcons);
Vue.use(Vuetify);
Vue.use(VueRouter);

jest.mock('axios');

const breakpoint = {
  init: jest.fn(),
  framework: {},
  smAndDown: true,
};

const vuetify = new Vuetify();
const vue = new Vue();
vuetify.framework.breakpoint = breakpoint;

describe('Componente Login', () => {
  it('Renderizar formulario', () => {
    const contenedor = shallowMount(LoginComponent, {
      vue,
      vuetify,
    });
    expect(contenedor.text()).toContain('Administración de Olimpiadas Científicas');
  });

  it('Login con usuario admin', async () => {
    // this.$util.trimUrl('http://localhost/');
    axios.post.mockResolvedValue({
      finalizado: true,
      mensaje: 'listado obtenido con exito',
      datos: [{ usuario: 'user', estado: 'ACTIVO' }]
    });
    shallowMount(LoginComponent, {
      vue,
      vuetify,
    });
    // const btnLogin = contenedor.find('button');
    // await btnLogin.trigger('click');
    expect(axios).toHaveBeenCalledTimes(0);
  });
});
