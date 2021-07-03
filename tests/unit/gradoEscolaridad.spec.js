import { shallowMount, mount } from '@vue/test-utils';
import GradoEscolaridadComponent from '@/components/grado-escolaridad/index.vue';
// import axios from 'axios';
// import Service from '@/plugins/service';

// jest.mock('axios', () => ({
//   get: () => Promise.resolve({
//     finalizado: true,
//     mensaje: 'listado obtenido con exito',
//     datos: [{ grado-escolaridad: 'nuevo grado-escolaridad', estado: 'ACTIVO' }]
//   })
// }));
jest.mock('@/plugins/service');

describe('Componente grado-escolaridad', () => {
  it('Renderizar grado-escolaridad', () => {
    const contenedor = shallowMount(GradoEscolaridadComponent);
    expect(contenedor.text()).toContain('Agregar grado de escolaridad');
  });

  it('Listado grado-escolaridad', async () => {
    const listaGradoEscolaridad = '<tr>'
      + '  <td>112233</td>'
      + '  <td>grado-escolaridad 1</td>'
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
    const contenedor = shallowMount(GradoEscolaridadComponent, {
      slots: { items: listaGradoEscolaridad }
    });
    expect(contenedor.text()).toContain('Agregar grado de escolaridad');
  });

  it('Cargado de grado-escolaridad desde api', async () => {
    // this.$service.get.mockResolvedValue({
    //   finalizado: true,
    //   mensaje: 'listado obtenido con exito',
    //   datos: [{ grado-escolaridad: 'user', estado: 'ACTIVO' }]
    // });

    const component = shallowMount(GradoEscolaridadComponent);
    await component.vm.loadParams();
  });
});
