import { shallowMount, mount } from '@vue/test-utils';
import UsuariosComponent from '@/components/usuarios/index.vue';
// import axios from 'axios';
// import Service from '@/plugins/service';

// jest.mock('axios', () => ({
//   get: () => Promise.resolve({
//     finalizado: true,
//     mensaje: 'listado obtenido con exito',
//     datos: [{ usuario: 'nuevo usuario', estado: 'ACTIVO' }]
//   })
// }));
jest.mock('@/plugins/service');

describe('Componente usuarios', () => {
  it('Renderizar usuarios', () => {
    const contenedor = shallowMount(UsuariosComponent);
    expect(contenedor.text()).toContain('Agregar usuario');
  });

  it('Listado usuarios', async () => {
    const listaUsuarios = '<tr>'
    + '  <td>112233</td>'
    + '  <td>usuario 1</td>'
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
    const contenedor = shallowMount(UsuariosComponent, {
      slots: { items: listaUsuarios }
    });
    expect(contenedor.text()).toContain('Agregar usuario');
  });

  it('Cargado de usuarios desde api', async () => {
    // this.$service.get.mockResolvedValue({
    //   finalizado: true,
    //   mensaje: 'listado obtenido con exito',
    //   datos: [{ usuario: 'user', estado: 'ACTIVO' }]
    // });

    const component = shallowMount(UsuariosComponent);
    await component.vm.loadParams();
  });
});
