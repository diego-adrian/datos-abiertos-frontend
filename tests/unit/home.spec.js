import { shallowMount, mount } from '@vue/test-utils';
import HomeComponent from '@/components/home/Home.vue';
import Vuetify from 'vuetify';
import Vue from 'vue';
import MaterialIcons from '@dbetka/vue-material-icons';

Vue.use(MaterialIcons);
Vue.use(Vuetify);

const breakpoint = {
  init: jest.fn(),
  framework: {},
  smAndDown: true,
};

const vuetify = new Vuetify();
const vue = new Vue();
vuetify.framework.breakpoint = breakpoint;

describe('Componente home', () => {
  it('Renderizar home', () => {
    const contenedor = shallowMount(HomeComponent, {
      vue,
      vuetify,
    });
    expect(contenedor.text())
      .toContain('Bienvenido');
  });
});
