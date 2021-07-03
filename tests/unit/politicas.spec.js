import { shallowMount, mount } from '@vue/test-utils';
import PoliticasComponent from '@/components/politicas/index.vue';
import Vuetify from 'vuetify';
import Vue from 'vue';

const breakpoint = {
  init: jest.fn(),
  framework: {},
  smAndDown: true,
};

const vuetify = new Vuetify();
const vue = new Vue();
vuetify.framework.breakpoint = breakpoint;

jest.mock('@/plugins/service');

describe('Componente politicas', () => {
  it('Renderizar politicas', () => {
    const contenedor = shallowMount(PoliticasComponent, {
      vue, vuetify
    });
    expect(contenedor.text()).toContain('Agregar Política'); // primera pestaña
  });
});
