import { shallowMount, mount } from '@vue/test-utils';
import OlimpiadasComponent from '@/components/olimpiada/index.vue';
// import axios from 'axios';
// import Service from '@/plugins/service';

// jest.mock('axios', () => ({
//   get: () => Promise.resolve({
//     finalizado: true,
//     mensaje: 'listado obtenido con exito',
//     datos: [{ olimpiadas: 'nuevo olimpiadas', estado: 'ACTIVO' }]
//   })
// }));
jest.mock('@/plugins/service');

describe('Componente olimpiadas', () => {
  it('Renderizar olimpiadas', () => {
    const contenedor = shallowMount(OlimpiadasComponent);
    expect(contenedor.text()).toContain('Agregar olimpiada');
  });

  it('Listado olimpiadas', async () => {
    const listaOlimpiadas = '<tr>'
      + '  <td>112233</td>'
      + '  <td>olimpiadas 1</td>'
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
    const contenedor = shallowMount(OlimpiadasComponent, {
      slots: { items: listaOlimpiadas }
    });
    expect(contenedor.text()).toContain('Agregar olimpiada');
  });

  it('Cargado de olimpiadas desde api', async () => {
    // this.$service.get.mockResolvedValue({
    //   finalizado: true,
    //   mensaje: 'listado obtenido con exito',
    //   datos: [{ olimpiadas: 'user', estado: 'ACTIVO' }]
    // });

    const component = shallowMount(OlimpiadasComponent);
    await component.vm.loadParams();
  });
});
