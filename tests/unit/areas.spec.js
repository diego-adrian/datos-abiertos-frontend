import { shallowMount, mount } from '@vue/test-utils';
import AreasComponent from '@/components/areas/index.vue';
// import axios from 'axios';
// import Service from '@/plugins/service';

// jest.mock('axios', () => ({
//   get: () => Promise.resolve({
//     finalizado: true,
//     mensaje: 'listado obtenido con exito',
//     datos: [{ areas: 'nuevo areas', estado: 'ACTIVO' }]
//   })
// }));
jest.mock('@/plugins/service');

describe('Componente areas', () => {
  it('Renderizar areas', () => {
    const contenedor = shallowMount(AreasComponent);
    expect(contenedor.text()).toContain('Agregar área');
  });

  it('Listado areas', async () => {
    const listaAreas = '<tr>'
      + '  <td>112233</td>'
      + '  <td>areas 1</td>'
      + '  <td>ADMINISTRADOR</td>'
      + '  <td>'
      + '    <v-btn outlined color="info">ACTIVO</v-btn>'
      + '  </td>'
      + '  <td>'
      + '    <v-tooltip bottom color="success">'
      + '      <template v-slot:activator="{ on }">'
      + '        <v-btn icon v-on="on" @click.stop="oModal(items)">'
      + '          <v-icon color="success">edit</v-icon>'
      + '        </v-btn>'
      + '      </template>'
      + '      <span>Editar registro</span>'
      + '    </v-tooltip>'
      + '    <v-tooltip bottom color="error">'
      + '      <template v-slot:activator="{ on }">'
      + '        <v-btn icon v-on="on" @click.prevent="itemDelete(items)">'
      + '          <v-icon color="red">delete</v-icon>'
      + '        </v-btn>'
      + '      </template>'
      + '      <span>Eliminar registro</span>'
      + '    </v-tooltip>'
      + '  </td>'
      + '</tr>';
    const contenedor = shallowMount(AreasComponent, {
      slots: { items: listaAreas }
    });
    expect(contenedor.text()).toContain('Agregar área');
  });

  it('Cargado de areas desde api', async () => {
    // this.$service.get.mockResolvedValue({
    //   finalizado: true,
    //   mensaje: 'listado obtenido con exito',
    //   datos: [{ areas: 'user', estado: 'ACTIVO' }]
    // });

    const component = shallowMount(AreasComponent);
    await component.vm.loadParams();
  });
});
