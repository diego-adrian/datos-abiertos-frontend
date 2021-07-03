import { shallowMount, mount } from '@vue/test-utils';
import ParametrosComponent from '@/components/parametros/index.vue';
// import axios from 'axios';
// import Service from '@/plugins/service';

// jest.mock('axios', () => ({
//   get: () => Promise.resolve({
//     finalizado: true,
//     mensaje: 'listado obtenido con exito',
//     datos: [{ parametros: 'nuevo parametros', estado: 'ACTIVO' }]
//   })
// }));
jest.mock('@/plugins/service');

describe('Componente parametros', () => {
  it('Renderizar parametros', () => {
    const contenedor = shallowMount(ParametrosComponent);
    expect(contenedor.text()).toContain('Áreas'); // primera pestaña
  });
});
