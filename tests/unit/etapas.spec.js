import { shallowMount, mount } from '@vue/test-utils';
import EtapasComponent from '@/components/etapas/index.vue';
// import axios from 'axios';
// import Service from '@/plugins/service';

// jest.mock('axios', () => ({
//   get: () => Promise.resolve({
//     finalizado: true,
//     mensaje: 'listado obtenido con exito',
//     datos: [{ etapas: 'nuevo etapas', estado: 'ACTIVO' }]
//   })
// }));
jest.mock('@/plugins/service');

describe('Componente etapas', () => {
  it('Renderizar etapas', () => {
    const contenedor = shallowMount(EtapasComponent);
    expect(contenedor.text()).toContain('Datos de etapa');
  });

  it('Listado etapas', async () => {
    const listaEtapas = '<tr>'
      + '  <td>112233</td>'
      + '  <td>etapas 1</td>'
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
    const contenedor = shallowMount(EtapasComponent, {
      slots: { items: listaEtapas }
    });
    expect(contenedor.text()).toContain('Datos de etapa');
  });

  it('Cargado de etapas desde api', async () => {
    // this.$service.get.mockResolvedValue({
    //   finalizado: true,
    //   mensaje: 'listado obtenido con exito',
    //   datos: [{ etapas: 'user', estado: 'ACTIVO' }]
    // });

    const component = shallowMount(EtapasComponent);
    await component.vm.loadParams();
  });
});
