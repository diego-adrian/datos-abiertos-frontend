<template>
  <v-card elevation="0">
    <!-- SLOT PARA EL FORMULARIO -->
    <app-dialog :dialog.sync="modalDistrito"
                :titulo="form.id ? 'Editar distrito' : 'Adicionar distrito'"
                @open-dialog="modalDistrito = true;"
                @close-dialog="modalDistrito = false;"
                @accion="save"
    >
      <template v-if="modalDistrito">
        <!-- FORMULARIO PARA AGREGAR O EDITAR -->
        <v-form :key="`distrito-${form.id}`" ref="form" v-model="valid" lazy-validation @submit.prevent="save">
          <v-card elevation="0">
            <v-container fluid>
              <v-card elevation="0" class="primary--text mb-3">Datos del distrito</v-card>
              <v-row>
                <v-col cols="12" md="12" xs="12" sm="12" lg="12">
                  <v-input-text-field
                    @value="e => form.nombre = e"
                    :init="form.nombre"
                    v-model="form.nombre"
                    label="Nombre de distrito"
                    required
                    full-width
                    :clearable="false"
                    dense
                    :rules="$validate(['required', 'alfanumerico'])"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="12" xs="12" sm="12" lg="12">
                  <v-input-text-field
                    @value="e => form.codigo = e"
                    :init="form.codigo"
                    v-model="form.codigo"
                    label="Código"
                    required
                    type="number"
                    full-width
                    :clearable="false"
                    dense
                    :rules="$validate(['required', 'numeros'])"
                />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" lg="12" md="12" sm="12" xs="12">
                  <v-input-select
                      label="Departamento"
                      @value="e => form.idDepartamento = e"
                      item-color="primary"
                      required
                      :init="form.idDepartamento"
                      autofocus
                      :rules="$validate(['required'])"
                      v-model="form.idDepartamento"
                      color="primary"
                      :items="departamentos"
                      item-text="nombre"
                      item-value="id"
                      outlined
                      dense
                      hide-details
                  ></v-input-select>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-form>
      </template>
    </app-dialog>
    <crud-table :headers="headers" :url-inicial="url" :widthModal="500"
                description="Distritos"
                :order="order"
      :custom="true">
      <template slot="buttons">
        <v-icon-tooltip
            v-if="btnAgregar"
            color="primary"
            icon="add"
            text="Agregar distrito"
            id="addDistrict"
            @accion="oModal({})"
        />
      </template>
      <template slot="items" slot-scope="items">
        <tr>
          <td>{{ items.items.nombre }}</td>
          <td>{{ items.items.codigo }}</td>
          <td>{{ items.items.departamento.nombre }}</td>
          <td>
            <v-btn outlined :color="items.items.estado === 'ACTIVO' ? 'info' : 'color1'">{{
                items.items.estado
              }}
            </v-btn>
          </td>
          <td>
            <v-icon-tooltip
                v-if="btnEditar && (items.items.estado === 'ACTIVO')"
                color="info"
                icon="toggle_on"
                text="Inactivar"
                @accion="inactivar(items.items)"
            />
            <v-icon-tooltip
                v-if="btnEditar && (items.items.estado === 'INACTIVO')"
                color="error"
                icon="toggle_off"
                text="Activar"
                @accion="activar(items.items)"
            />
            <v-icon-tooltip
                v-if="btnEditar"
                color="success"
                icon="edit"
                text="Editar registro"
                @accion="oModal(items)"
            />
            <v-icon-tooltip
                v-if="btnEliminar"
                color="error"
                icon="delete"
                text="Eliminar registro"
                @accion="itemDelete(items)"
            />
          </td>
        </tr>
      </template>
    </crud-table>
  </v-card>
</template>
<script>

import { $Casbin } from '@/plugins/casbin';
import validate from '@/common/mixins/validate';
import CrudTable from '@/plugins/crud-table/CrudTable.vue';
import actions from '@/plugins/crud-table/mixins/crud-table';
import AppDialog from '@/plugins/modal/AppDialog.vue';

export default {
  mixins: [actions, validate],
  data: () => ({
    valid: false,
    url: 'distritos',
    order: ['createdAt', 'DESC'],
    headers: [
      {
        text: 'Nombre',
        sortable: false,
        align: 'center',
        value: 'nombre'
      },
      {
        text: 'Código',
        sortable: false,
        align: 'center',
        value: 'codigo'
      },
      {
        text: 'Departamento',
        sortable: false,
        align: 'center',
        value: 'departamento'
      },
      {
        text: 'Estado',
        sortable: false,
        align: 'center',
        value: 'estado'
      },
      {
        text: 'Acciones',
        divider: false,
        sortable: false,
        align: 'center',
        value: 'ACTIONS'
      }
    ],
    form: {
      id: null,
      nombre: null,
      codigo: null,
      idDepartamento: null
    },
    btnAgregar: true,
    btnEditar: true,
    btnEliminar: true,
    departamentos: [],
    modalDistrito: false
  }),
  mounted() {
    // Verificar permiso para crear
    if ($Casbin && $Casbin.enforcer) {
      const { rol } = this.$storage.get('rol');
      $Casbin.enforcer.enforce(rol, '/distritos', 'create')
        .then(permitido => {
          this.btnAgregar = permitido;
        });
      $Casbin.enforcer.enforce(rol, '/distritos', 'update')
        .then(permitido => {
          this.btnEditar = permitido;
        });
      $Casbin.enforcer.enforce(rol, '/distritos', 'delete')
        .then(permitido => {
          this.btnEliminar = permitido;
        });
    }
    this.loadParams();
  },
  computed: {},
  methods: {
    async loadParams() {
      await this.$service.get('departamentos')
        .then((resultado) => {
          this.departamentos = resultado && resultado.datos ? resultado.datos : [];
        });
    },
    async activar(item) {
      const message = `¿Está seguro de activar ${item.nombre}?`;
      this.$confirm(
        message,
        async () => {
          const response = await this.$service.patch(`${this.url}/activacion/${item.id}`, {});
          if (response.isOK) {
            this.$message.success(response.mensaje);
          } else {
            this.$message.error(response.mensaje ?? response.message ?? `Error al activar ${item.nombre}`);
          }
          this.closeModal();
          this.updateList();
        }
      );
    },
    async inactivar(item) {
      const message = `¿Está seguro de inactivar ${item.nombre}?`;
      this.$confirm(
        message,
        async () => {
          try {
            const response = await this.$service.patch(`${this.url}/inactivacion/${item.id}`, {});
            this.$message.success(response.mensaje);
          } catch (error) {
            this.$message.error(error.mensaje ?? error.message ?? `Error al inactivar ${item.nombre}`);
          } finally {
            this.closeModal();
            this.updateList();
          }
        }
      );
    },
    reset() {
      this.form = {
        id: null,
        nombre: null,
        codigo: null,
        idDepartamento: null
      };
    },

    async itemDelete({ items }) {
      // Verificar permiso para ejecutar esta funcion
      if ($Casbin && $Casbin.enforcer) {
        const { rol } = this.$storage.get('rol');
        const permitido = await $Casbin.enforcer.enforce(rol, '/distritos', 'delete');
        if (!permitido) {
          this.$message.warning('No tiene permisos');
          return;
        }
      }
      const message = '¿Está seguro de eliminar este registro?';
      this.$confirm(
        message,
        async () => {
          const response = await this.$service.delete(`${this.url}/${items.id}`);
          if (response.isOK) {
            this.updateList();
            this.closeModal();
            this.$message.success('Registro eliminado satisfactoriamente');
          } else {
            this.$message.error(response.message ?? response.mensaje);
          }
        },
        () => {
        }
      );
    },
    closeModal() {
      this.modalDistrito = false;
      this.reset();
    },
    async oModal({ items }) {
      if (items && items.id) {
        this.form = { ...items };
        this.form.idDepartamento = items.departamento.id;
      } else {
        this.reset();
      }
      this.modalDistrito = true;
    },

    /**
     * @function save
     * @description Esta funcion esta creada para guardar en la BD
     * @author dbarra@agetic.gob.bo
     */
    async save() {
      if (this.$refs.form.validate()) {
        this.form.codigo = parseInt(this.form.codigo);
        const data = { ...({}, this.form) };
        if (data.id) {
          try {
            const response = await this.$service.patch(`${this.url}/${data.id}`, data);
            console.log(`response: ${response}`);
            this.closeModal();
            this.updateList();
            this.$message.success('Se actualizó el registro correctamente');
          } catch (error) {
            console.log(`error: ${error}`);
            this.$message.error(error.mensaje ?? 'Ocurrio un error al tratar de enviar la data');
          }
        } else {
          delete data.id;
          const response = await this.$service.post(this.url, data);
          if (response.isOK) {
            console.info(`Exito: ${response}`);
            this.closeModal();
            this.updateList();
            this.$message.success('El registro fue agregado correctamente');
          } else {
            console.info(`Error: ${response}`);
            this.$message.error(response.mensaje ?? 'Ocurrio un error al tratar de enviar la data');
          }
        }
      } else {
        this.$message.error('Complete los campos obligatorios');
      }
    }
  },
  components: {
    CrudTable,
    AppDialog
  }
};
</script>
