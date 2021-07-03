<template>
  <v-card elevation="0">
    <crud-table :headers="headers" description="Gestión de usuarios" :url-inicial="url" :widthModal="500" :order="order"
                :custom="true">
      <template slot="buttons">
        <v-tooltip bottom color="primary">
          <template v-slot:activator="{ on }">
            <v-btn color="primary" :small="['xs', 'sm'].includes($vuetify.breakpoint.name)" icon v-on="on"
                   @click.native.stop="oModal" slot="activator" v-if="btnAgregar"
            >
              <v-icon-component icon="add"/>
            </v-btn>
          </template>
          <span> Agregar usuario </span>
        </v-tooltip>
      </template>
      <!-- SLOT PARA EL FORMULARIO -->
      <template slot="form" slot-scope="">
        <v-card-title class="ma-0 pa-1">
          <v-container fluid>
            <v-row no-gutters>
              <v-col
                  align="start"
                  justify="center"
                  :cols="11"
                  class="d-flex flex-row align-center text-sm color1--tex primary--text"
              >
                <v-icon-component class="m-2" icon="add"></v-icon-component>
                <span class="fs10 pl-2">
                  {{ form.id ? 'Editar usuario' : 'Adicionar usuario' }}
                </span>
              </v-col>
              <v-col :cols="1">
                <v-tooltip bottom color="primary">
                  <template v-slot:activator="{ on }">
                    <v-btn icon color="primary" v-on="on" @click.stop="closeModal">
                      <v-icon-component icon="close"></v-icon-component>
                    </v-btn>
                  </template>
                  <span>Cerrar ventana emergente</span>
                </v-tooltip>
              </v-col>
            </v-row>
          </v-container>
        </v-card-title>
        <v-divider></v-divider>
        <!-- FORMULARIO PARA AGREGAR O EDITAR -->
        <v-form :key="`usuario-${form.id}`" ref="form" v-model="valid" lazy-validation @submit.prevent="save">
          <v-card>
            <form-persona :persona="form.persona" @value="obtenerPersona"></form-persona>
            <v-container fluid>
              <v-card elevation="0" class="primary--text mb-3">Datos del usuario</v-card>
              <v-row>
                <v-col cols="12" md="12" xs="12" sm="12" lg="12">
                  <v-text-field
                      color="primary"
                      required
                      autofocus
                      :rules="$validate(['required', 'email'])"
                      v-model="form.correoElectronico"
                      label="Correo Electrónico"
                      outlined
                      hide-details
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="12" xs="12" sm="12" lg="12">
                  <v-select
                      color="primary"
                      required
                      item-color="primary"
                      autofocus
                      v-model="form.roles"
                      label="Roles"
                      :items="roles"
                      item-text="rol"
                      item-value="id"
                      multiple
                      outlined
                      hide-details
                      :rules="$validate(['required'])"
                  ></v-select>
                </v-col>
              </v-row>
            </v-container>
            <v-card-actions>
              <v-container fluid>
                <v-row>
                  <v-col justify="start" xs="12" sm="12" md="4" lg="4" cols="12" class="pr-0 pl-0">
                    <small class="error--text text-required">* Los campos son obligatorios</small>
                  </v-col>
                  <v-col sm="12" xs="12" md="4" lg="4" cols="12">
                    <v-btn block @click.stop="closeModal" elevation="0"
                    >
                      <v-icon-component icon="cancel"></v-icon-component>
                      Cancelar
                    </v-btn>
                  </v-col>
                  <v-col sm="12" xs="12" md="4" lg="4" cols="12">
                    <v-btn dark block color="primary" type="submit" :disabled="!valid" elevation="0">
                      <v-icon-component icon="check"></v-icon-component>
                      Enviar
                    </v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-actions>
          </v-card>
        </v-form>
      </template>
      <!-- SLOT PARA TODOS LOS ITEMS (Solo en caso de que se quiera personalizar cada columna o mas de 1 columna) -->
      <template slot="items" slot-scope="items">
        <tr>
          <td>{{ items.items.nroDocumento }}</td>
          <td>{{ items.items.nombre }}</td>
          <td>{{ items.items.usuario }}</td>
          <td>
            <v-chip small v-for="rol in items.items.usuarioRol" :key="rol.id">{{ rol.rol.rol }}</v-chip>
          </td>
          <td>
            <v-btn outlined :color="items.items.estado === 'ACTIVO' ? 'info' : 'default'">{{
                items.items.estado
              }}
            </v-btn>
          </td>
          <td>
            <v-tooltip bottom color="info lighten-1" v-if="items.items.estado === 'CREADO' && btnEditar">
              <template v-slot:activator="{ on }">
                <v-btn icon v-on="on" @click.stop="activateUser(items.items.id)">
                  <v-icon color="info lighten-1">{{ icons.mdiShieldKey }}</v-icon>
                </v-btn>
              </template>
              <span>Activar usuario</span>
            </v-tooltip>
            <v-tooltip bottom color="teal lighten-1"
                       v-if="btnEditar && (items.items.estado === 'ACTIVO' || items.items.estado === 'ASIGNADO')">
              <template v-slot:activator="{ on }">
                <v-btn icon v-on="on" color="info" @click.stop="passwordRecovery(items.items.id)">
                  <v-icon-component icon="vpn_key"></v-icon-component>
                </v-btn>
              </template>
              <span>Restablecer Contraseña</span>
            </v-tooltip>
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
import FormPersona from '@/components/personas/form.vue';
import vIconComponent from '@/plugins/icon/index.vue';

export default {
  mixins: [actions, validate],
  data: () => ({
    valid: false,
    url: 'usuarios',
    order: ['createdAt', 'DESC'],
    headers: [
      {
        text: 'Nro. Documento',
        align: 'center',
        value: 'nroDocumento'
      },
      {
        text: 'Persona',
        align: 'center',
        value: 'nombre'
      },
      {
        text: 'Usuario',
        align: 'center',
        value: 'nombre'
      },
      {
        text: 'Rol',
        align: 'center',
        value: 'usuario'
      },
      {
        text: 'Estado',
        sortable: false,
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
      usuario: null,
      persona: {
        nombres: null,
        primerApellido: null,
        segundoApellido: null,
        tipoDocumento: null,
        nroDocumento: null,
        fechaNacimiento: null
      },
      roles: [],
      estado: 'ACTIVO'
    },
    btnAgregar: true,
    btnEditar: true,
    btnEliminar: true,
    roles: []
  }),
  mounted() {
    // Verificar permiso para crear
    if ($Casbin && $Casbin.enforcer) {
      const { rol } = this.$storage.get('rol');
      $Casbin.enforcer.enforce(rol, '/usuarios', 'create')
        .then(permitido => {
          this.btnAgregar = permitido;
        });
      $Casbin.enforcer.enforce(rol, '/usuarios', 'update')
        .then(permitido => {
          this.btnEditar = permitido;
        });
      $Casbin.enforcer.enforce(rol, '/usuarios', 'delete')
        .then(permitido => {
          this.btnEliminar = permitido;
        });
    }
    this.loadParams();
  },
  methods: {
    async loadParams() {
      await this.$service.get('roles')
        .then((resultado) => {
          this.roles = resultado && resultado.datos ? resultado.datos : [];
        });
    },
    reset() {
      this.form = {
        id: null,
        usuario: null,
        estado: 'ACTIVO',
        persona: {
          nombres: null,
          primerApellido: null,
          segundoApellido: null,
          tipoDocumento: null,
          nroDocumento: null,
          fechaNacimiento: null
        },
        roles: []
      };
    },
    obtenerPersona(value) {
      this.form.persona = value;
    },
    async itemDelete({ items }) {
      // Verificar permiso para ejecutar esta funcion
      if ($Casbin && $Casbin.enforcer) {
        const { rol } = this.$storage.get('rol');
        const permitido = await $Casbin.enforcer.enforce(rol, '/usuarios', 'delete');
        if (!permitido) {
          this.$message.warning('No tiene permisos');
          return;
        }
      }
      const message = '¿Está seguro de eliminar este registro?';
      this.$confirm(
        message,
        async () => {
          try {
            await this.$service.delete(`${this.url}/${items.id}`);
            this.updateList();
            this.$store.commit('closeModal');
            this.$message.success('Registro eliminado satisfactoriamente');
          } catch (err) {
            this.$message.error(err.message ?? err.mensaje ?? 'Ocurrio un error');
          }
        },
        () => {
        }
      );
    },
    closeModal() {
      this.reset();
      this.$store.commit('closeModal');
    },
    async oModal({ items }) {
      if (items && items.id) {
        this.form = { ...items };
        this.form.roles = [];
        items.usuarioRol.forEach((rol) => {
          this.form.roles.push(rol.rol.id);
        });
      } else {
        this.reset();
      }
      this.$store.commit('openModal');
    },
    async passwordRecovery(id) {
      const message = '¿Está seguro de restablecer la contraseña de este usuario?';
      this.$confirm(
        message,
        async () => {
          try {
            const response = await this.$service.patch(`${this.url}/contrasena/${id}`, {});
            this.$message.success(response.mensaje);
          } catch (error) {
            this.$message.error(error.mensaje ?? error.message ?? 'Error al restablecer contraseña');
          } finally {
            this.$store.commit('closeModal');
            this.updateList();
          }
        }
      );
    },
    async activateUser(id) {
      const message = '¿Está seguro de activar la cuenta del usuario?';
      this.$confirm(
        message,
        async () => {
          try {
            const response = await this.$service.patch(`${this.url}/activacion/${id}`, {});
            this.$store.commit('closeModal');
            this.updateList();
            this.$message.success(response.mensaje);
          } catch (error) {
            this.$store.commit('closeModal');
            this.$message.error(error.mensaje ?? 'Error al tratar de activar la cuenta de usuario');
          }
        }
      );
    },
    /**
     * @function save
     * @description Esta funcion esta creada para guardar en la BD
     * @author dbarra@agetic.gob.bo
     */
    async save() {
      if (this.$refs.form.validate()) {
        const data = { ...({}, this.form) };
        if (data.id) {
          try {
            const response = await this.$service.patch(`${this.url}/${data.id}`, data);
            console.log(`response: ${response}`);
            this.$store.commit('closeModal');
            this.updateList();
            this.$message.success('Se actualizó el registro correctamente');
          } catch (error) {
            console.log(`error: ${error}`);
            this.$message.error(error.mensaje ?? 'Ocurrio un error al tratar de enviar la data');
          }
        } else {
          delete data.id;
          try {
            const response = await this.$service.post(this.url, data);
            console.info(`Exito: ${response}`);
            this.$store.commit('closeModal');
            this.updateList();
            this.$message.success('El registro fue agregado correctamente');
          } catch (error) {
            console.info(`Error: ${error}`);
            this.$message.error(error.mensaje ?? 'Ocurrio un error al tratar de enviar la data');
          }
        }
      } else {
        this.$message.error('Complete los campos obligatorios');
      }
    }
  },
  components: {
    CrudTable,
    FormPersona,
    vIconComponent
  }
};
</script>
