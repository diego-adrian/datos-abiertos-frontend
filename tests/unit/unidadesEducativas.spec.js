import { shallowMount, mount } from '@vue/test-utils';
import UnidadesEducativasComponent from '@/components/unidadesEducativas/index.vue';
// import axios from 'axios';
// import Service from '@/plugins/service';

// jest.mock('axios', () => ({
//   get: () => Promise.resolve({
//     finalizado: true,
//     mensaje: 'listado obtenido con exito',
//     datos: [{ unidadesEducativas: 'nuevo unidadesEducativas', estado: 'ACTIVO' }]
//   })
// }));
jest.mock('@/plugins/service');

describe('Componente unidadesEducativas', () => {
  it('Renderizar unidadesEducativas', () => {
    const contenedor = shallowMount(UnidadesEducativasComponent);
    expect(contenedor.text()).toContain('Agregar Unidad Educativa');
  });

  it('Listado unidadesEducativas', async () => {
    const listaUnidadesEducativas = '<tr>'
      + '  <td>112233</td>'
      + '  <td>unidadesEducativas 1</td>'
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
    const contenedor = shallowMount(UnidadesEducativasComponent, {
      slots: { items: listaUnidadesEducativas }
    });
    expect(contenedor.text()).toContain('Agregar Unidad Educativa');
  });

  it('Cargado de unidadesEducativas desde api', async () => {
    // this.$service.get.mockResolvedValue({
    //   finalizado: true,
    //   mensaje: 'listado obtenido con exito',
    //   datos: [{ unidadesEducativas: 'user', estado: 'ACTIVO' }]
    // });

    const component = shallowMount(UnidadesEducativasComponent);
    await component.vm.loadParams();
  });
});
