import { shallowMount, mount } from '@vue/test-utils';
import DistritosComponent from '@/components/distritos/index.vue';
// import axios from 'axios';
// import Service from '@/plugins/service';

// jest.mock('axios', () => ({
//   get: () => Promise.resolve({
//     finalizado: true,
//     mensaje: 'listado obtenido con exito',
//     datos: [{ distritos: 'nuevo distritos', estado: 'ACTIVO' }]
//   })
// }));
jest.mock('@/plugins/service');

describe('Componente distritos', () => {
  it('Renderizar distritos', () => {
    const contenedor = shallowMount(DistritosComponent);
    expect(contenedor.text()).toContain('Agregar distrito');
  });

  it('Listado distritos', async () => {
    const listaDistritos = '<tr>'
      + '  <td>112233</td>'
      + '  <td>distritos 1</td>'
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
    const contenedor = shallowMount(DistritosComponent, {
      slots: { items: listaDistritos }
    });
    expect(contenedor.text()).toContain('Agregar distrito');
  });

  it('Cargado de distritos desde api', async () => {
    // this.$service.get.mockResolvedValue({
    //   finalizado: true,
    //   mensaje: 'listado obtenido con exito',
    //   datos: [{ distritos: 'user', estado: 'ACTIVO' }]
    // });

    const component = shallowMount(DistritosComponent);
    await component.vm.loadParams();
  });
});
