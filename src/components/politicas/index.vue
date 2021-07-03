<template>
  <v-card elevation="0">
    <app-dialog
        :dialog.sync="modalPoliticas"
        :titulo="form.id ? 'Editar Política' : 'Adicionar Política'"
        @open-dialog="modalPoliticas = true;"
        @close-dialog="modalPoliticas = false;"
        @accion="save"
    >
      <template v-if="modalPoliticas">
        <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="save">
          <v-card elevation="0">
            <v-container fluid>
              <v-row>
                <v-col cols="12" md="6" xs="12" sm="12" lg="6">
                  <v-input-select
                      label="Sujeto"
                      @value="e => form.sujeto = e"
                      item-color="primary"
                      required
                      :init="form.sujeto"
                      autofocus
                      :rules="$validate(['required'])"
                      v-model="form.sujeto"
                      color="primary"
                      :items="roles"
                      item-text="rol"
                      outlined
                      dense
                      hide-details
                      item-value="rol"
                  ></v-input-select>
                </v-col>
                <v-col cols="12" md="6" xs="12" sm="12" lg="6">
                  <v-input-text-field
                      @value="e => form.objeto = e"
                      :init="form.objeto"
                      v-model="form.objeto"
                      label="Objeto"
                      required
                      dense
                      hide-details
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="6" xs="12" sm="12" lg="6">
                  <v-input-select
                      label="App"
                      item-color="primary"
                      required
                      @value="e => form.app = e"
                      :rules="$validate(['required'])"
                      v-model="form.app"
                      :init="form.app"
                      :items="aplicaciones"
                      outlined
                      dense
                      hide-details
                  ></v-input-select>
                </v-col>
                <v-col cols="12" md="6" xs="12" sm="12" lg="6">
                  <v-input-select
                      label="Accion"
                      @value="e => form.accion = e"
                      item-color="primary"
                      required
                      :rules="$validate(['required'])"
                      v-model="form.accion"
                      :init="form.accion"
                      multiple
                      :items="acciones"
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
    <crud-table :headers="headers" description="Políticas" :url-inicial="url" :widthModal="500" :order="order" :custom="true">
      <template slot="buttons">
        <v-icon-tooltip
            v-if="btnAgregar"
            color="primary"
            icon="add"
            text="Agregar Política"
            id="addPolicies"
            @accion="oModal({})"
        />
      </template>
      <!-- SLOT PARA TODOS LOS ITEMS (Solo en caso de que se quiera personalizar cada columna o mas de 1 columna) -->
      <template slot="items" slot-scope="items">
        <tr>
          <td>{{ items.items.sujeto }}</td>
          <td>{{ items.items.objeto }}</td>
          <td>{{ items.items.accion }}</td>
          <td>{{ items.items.app }}</td>
          <td>
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

export default {
  mixins: [actions, validate],
  data: () => ({
    valid: false,
    url: 'autorizacion/politicas',
    order: ['createdAt', 'DESC'],
    headers: [
      { text: 'Sujeto', align: 'center', value: 'sujeto' },
      { text: 'Objeto', align: 'center', value: 'objeto' },
      { text: 'Acción', align: 'center', value: 'accion' },
      { text: 'App', sortable: false, value: 'app' },
      { text: 'Acciones', divider: false, sortable: false, align: 'center', value: 'ACTIONS' }
    ],
    form: {
      sujeto: null,
      objeto: null,
      accion: null,
      app: null
    },
    aplicaciones: ['frontend', 'backend'],
    acciones: ['create', 'read', 'update', 'delete', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    roles: [],
    modalPoliticas: false,
    btnAgregar: true,
    btnEliminar: true,
    actualizarRegistro: false,
    registroAnterior: {}
  }),
  mounted() {
    // Verificar permiso para crear
    if ($Casbin && $Casbin.enforcer) {
      const { rol } = this.$storage.get('rol');
      $Casbin.enforcer.enforce(rol, '/politicas', 'create').then(permitido => {
        this.btnAgregar = permitido;
      });
      $Casbin.enforcer.enforce(rol, '/politicas', 'update').then(permitido => {
        this.btnEditar = permitido;
      });
      $Casbin.enforcer.enforce(rol, '/politicas', 'delete').then(permitido => {
        this.btnEliminar = permitido;
      });
    }
    this.loadParams();
  },
  methods: {
    reset() {
      this.form = {
        sujeto: null,
        objeto: null,
        accion: null,
        app: null
      };
    },
    async loadParams () {
      await this.$service.get('roles').then((resultado) => {
        this.roles = resultado && resultado.datos ? resultado.datos : [];
      });
    },
    async itemDelete({ items }) {
      const message = '¿Está seguro de eliminar este registro?';
      this.$confirm(
        message,
        async () => {
          try {
            const { sujeto, objeto, accion, app } = items;
            await this.$service.delete(`${this.url}?sujeto=${sujeto}&objeto=${objeto}&accion=${accion}&app=${app}`);
            this.updateList();
            this.$message.success('Registro eliminado satisfactoriamente');
          } catch (error) {
            this.$message.error(error.message ?? error.mensaje);
          }
        },
        () => {}
      );
    },
    closeModal() {
      this.modalPoliticas = false;
      this.reset();
    },
    oModal({ items }) {
      if (items && Object.keys(items).length > 0) {
        this.form = { ...items, accion: items.accion.split('|') };
        this.registroAnterior = { ...items };
        this.actualizarRegistro = true;
      } else {
        this.actualizarRegistro = false;
        this.reset();
      }
      this.modalPoliticas = true;
    },
    /**
     * @function save
     * @description Esta funcion esta creada para guardar en la BD
     * @author dbarra@agetic.gob.bo
     */
    async save() {
      if (this.$refs.form.validate()) {
        // eslint-disable-next-line
        let data = { ...({}, this.form) };
        data.accion = data.accion.join('|');
        if (this.actualizarRegistro) {
          const response = await this.$service.patch(`${this.url}?sujeto=${this.registroAnterior.sujeto}&objeto=${this.registroAnterior.objeto}&accion=${this.registroAnterior.accion}&app=${this.registroAnterior.app}`, data);
          if (response && ![400].includes(response.codigo)) {
            this.closeModal();
            this.updateList();
            this.$message.success('El registro fue actualizado exitosamente');
          } else {
            this.$message.error(response.mensaje || 'Ocurrio un error al tratar de enviar la data');
          }
        } else {
          const response = await this.$service.post(this.url, data);
          if (response && ![400].includes(response.codigo)) {
            this.$message.success('El registro fue agregado correctamente');
            this.closeModal();
            this.updateList();
          } else {
            this.$message.error(response.mensaje || 'Ocurrio un error al tratar de enviar la data');
          }
        }
      } else {
        this.$message.error('Complete los campos obligatorios');
      }
    }
  },
  components: {
    CrudTable
  }
};
</script>
