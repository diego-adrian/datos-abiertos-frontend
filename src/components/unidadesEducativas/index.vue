<template>
  <v-card elevation="0">
    <!-- SLOT PARA EL FORMULARIO -->
    <app-dialog :dialog.sync="modalUnidadEducativa"
                :titulo="form.id ? 'Editar Unidad Educativa' : 'Adicionar Unidad Educativa'"
                @open-dialog="modalUnidadEducativa = true;"
                @close-dialog="modalUnidadEducativa = false;"
                @accion="save"
                max-width="900"
    >
      <template v-if="modalUnidadEducativa">
        <!-- FORMULARIO PARA AGREGAR O EDITAR -->
        <v-form :key="`unidad-educativa-${form.id}`" ref="form" v-model="valid" lazy-validation @submit.prevent="save">
          <v-card elevation="0">
            <v-container fluid>
              <v-card elevation="0" class="primary--text mb-3">Datos de la Unidad Educativa</v-card>
              <v-row>
                <v-col cols="12" md="6" xs="12" sm="12" lg="6">
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
                      @change="cargarDistritos"
                      outlined
                      dense
                      hide-details
                  ></v-input-select>
                </v-col>
                <v-col cols="12" md="6" xs="12" sm="12" lg="6">
                  <v-input-select
                      label="Distrito"
                      @value="e => form.idDistrito = e"
                      item-color="primary"
                      required
                      :init="form.idDistrito"
                      autofocus
                      :rules="$validate(['required'])"
                      v-model="form.idDistrito"
                      color="primary"
                      :items="distritos"
                      item-text="nombre"
                      item-value="id"
                      outlined
                      dense
                      hide-details
                      :disabled="form.idDepartamento==null"
                  ></v-input-select>
                </v-col>
                <v-col cols="12" md="6" xs="12" sm="12" lg="6">
                  <v-input-text-field
                      @value="e => form.codigoSie = e"
                      :init="form.codigoSie"
                      v-model="form.codigoSie"
                      label="Código SIE"
                      required
                      :readonly="form.id != null"
                      :full-width="true"
                      :clearable="false"
                      :dense="true"
                      maxlength="9"
                      :rules="$validate(['required', 'numeros'])"
                  />
                </v-col>
                <v-col cols="12" md="6" xs="12" sm="12" lg="6">
                  <v-input-text-field
                      @value="e => form.nombre = e"
                      :init="form.nombre"
                      v-model="form.nombre"
                      label="Nombre de la Unidad Educativa"
                      required
                      :full-width="true"
                      :clearable="false"
                      :dense="true"
                      :rules="$validate(['required', 'alfanumerico'])"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="6" xs="12" sm="12" lg="6">
                  <v-input-select
                      label="Dependencia"
                      @value="e => form.tipoUnidadEducativa = e"
                      item-color="primary"
                      required
                      :init="form.tipoUnidadEducativa"
                      autofocus
                      :rules="$validate(['required'])"
                      v-model="form.tipoUnidadEducativa"
                      color="primary"
                      :items="enumUnidadEducativa"
                      outlined
                      dense
                      hide-details
                  ></v-input-select>
                </v-col>
                <v-col cols="12" md="6" xs="12" sm="12" lg="6">
                  <v-input-select
                      label="Área"
                      @value="e => form.areaGeografica = e"
                      item-color="primary"
                      required
                      :init="form.areaGeografica"
                      autofocus
                      :rules="$validate(['required'])"
                      v-model="form.areaGeografica"
                      color="primary"
                      :items="enumAreaGeografica"
                      outlined
                      dense
                      hide-details
                  ></v-input-select>
                </v-col>
                <v-col cols="12" md="6" xs="12" sm="12" lg="6">
                  <v-input-text-field
                      :show-field="false"
                      label="Sección"
                  >
                    <template slot="contenido">
                      <v-select v-model="form.seccion" :items="secciones" attach outlined
                                :rules="$validate(['required'])">
                        <template v-slot:prepend-item>
                          <v-list-item>
                            <v-list-item-content>
                              <v-text-field
                                  v-model="searchTermSeccion"
                                  placeholder="Buscar sección"
                                  @input="cargarSecciones"></v-text-field>
                            </v-list-item-content>
                          </v-list-item>
                          <v-divider class="mt-2"></v-divider>
                        </template>
                      </v-select>
                    </template>
                  </v-input-text-field>
                </v-col>
                <v-col>
                  <v-input-text-field
                      :show-field="false"
                      label="Localidad"
                  >
                    <template slot="contenido">
                      <v-select v-model="form.localidad" :items="localidades" attach outlined
                                :rules="$validate(['required'])">
                        <template v-slot:prepend-item>
                          <v-list-item>
                            <v-list-item-content>
                              <v-text-field
                                  v-model="searchTermLocalidad"
                                  placeholder="Buscar localidad"
                                  @input="cargarLocalidades"></v-text-field>
                            </v-list-item-content>
                          </v-list-item>
                          <v-divider class="mt-2"></v-divider>
                        </template>
                      </v-select>
                    </template>
                  </v-input-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-form>
      </template>
    </app-dialog>
    <crud-table :headers="headers" :url-inicial="url" :widthModal="500"
                description="Unidades Educativas"
                :order="order"
                :filters-inicial="filters"
                :custom="true">
      <template slot="buttons">
        <v-tooltip bottom color="primary">
          <template v-slot:activator="{ on }">
            <v-btn color="primary" id="addSchool" :small="['xs', 'sm'].includes($vuetify.breakpoint.name)" icon
                   v-on="on"
                   @click.native.stop="oModal" slot="activator" v-if="btnAgregar"
            >
              <v-icon-component icon="add"/>
            </v-btn>
          </template>
          <span> Agregar Unidad Educativa </span>
        </v-tooltip>
      </template>

      <template slot="items" slot-scope="items">
        <tr>
          <td>{{ items.items.codigoSie }}</td>
          <td>
            {{ items.items.nombre }}
          </td>
          <td>{{ items.items.tipoUnidadEducativa }}</td>
          <td>{{ items.items.areaGeografica }}</td>
          <td>
            <v-icon-tooltip
                color="primary"
                icon="place"
                text="Distrito"
            />
            {{ items.items.distrito.nombre }} ({{ items.items.distrito.departamento.nombre }})<br>
            <v-icon-tooltip
                color="primary"
                icon="fmd_good"
                text="Localidad"
            />
            {{ items.items.localidad }}<br>
            <v-icon-tooltip
                color="primary"
                icon="room"
                text="Sección"
            />
            {{ items.items.seccion }}<br>
          </td>
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
import vIconComponent from '@/plugins/icon/index.vue';
import AppDialog from '@/plugins/modal/AppDialog.vue';

export default {
  mixins: [actions, validate],
  data: () => ({
    valid: false,
    url: 'unidades-educativas',
    order: ['createdAt', 'DESC'],
    headers: [
      {
        text: 'Código SIE',
        sortable: false,
        align: 'center',
        value: 'codigoSie'
      },
      {
        text: 'Nombre',
        sortable: false,
        align: 'center',
        value: 'nombre'
      },
      {
        text: 'Dependencia',
        sortable: false,
        align: 'center',
        value: 'tipoUnidadEducativa'
      },
      {
        text: 'Área',
        sortable: false,
        align: 'center',
        value: 'areaGeografica'
      },
      {
        text: 'Ubicación',
        sortable: false,
        align: 'center',
        value: 'distrito'
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
      codigoSie: null,
      nombre: null,
      tipoUnidadEducativa: null,
      areaGeografica: null,
      idDistrito: null,
      idDepartamento: null,
      localidad: null,
      seccion: null
    },
    filters: [
      {
        field: 'codigoSie',
        label: 'Código SIE',
        type: 'text',
        typeG: 'String'
      },
      {
        field: 'nombre',
        label: 'Nombre',
        type: 'text',
        typeG: 'String'
      }
    ],
    enumUnidadEducativa: [
      'FISCAL', 'CONVENIO', 'PRIVADA'
    ],
    localidades: [],
    secciones: [],
    enumAreaGeografica: [
      'RURAL', 'URBANO'
    ],
    btnAgregar: true,
    btnEditar: true,
    btnEliminar: true,
    distritos: [],
    departamentos: [],
    modalUnidadEducativa: false,
    searchTermLocalidad: null,
    searchTermSeccion: null,
  }),
  mounted() {
    // Verificar permiso para crear
    if ($Casbin && $Casbin.enforcer) {
      const { rol } = this.$storage.get('rol');
      $Casbin.enforcer.enforce(rol, '/unidades-educativas', 'create')
        .then(permitido => {
          this.btnAgregar = permitido;
        });
      $Casbin.enforcer.enforce(rol, '/unidades-educativas', 'update')
        .then(permitido => {
          this.btnEditar = permitido;
        });
      $Casbin.enforcer.enforce(rol, '/unidades-educativas', 'delete')
        .then(permitido => {
          this.btnEliminar = permitido;
        });
    }
    this.loadParams();
  },
  computed: {},
  methods: {
    async loadParams() {
      await this.cargarDistritos();
      await this.$service.get('departamentos')
        .then((resultado) => {
          this.departamentos = resultado && resultado.datos ? resultado.datos : [];
        });
      await this.cargarLocalidades();
      await this.cargarSecciones();
    },

    async cargarDistritos() {
      console.log(`Distrito: ${this.form.idDepartamento}`);
      await this.$service.get(`distritos?filtro=idDepartamento:${this.form.idDepartamento ?? ''}`)
        .then((resultado) => {
          this.distritos = resultado && resultado.datos && resultado.datos.filas ? resultado.datos.filas : [];
        });
    },

    async cargarLocalidades() {
      await this.$service.get(`localidades?filtro=nombre:${this.searchTermLocalidad ?? ''}`)
        .then((resultado) => {
          this.localidades = resultado && resultado.datos && resultado.datos.filas ? resultado.datos.filas : [];
          if (this.localidades.length > 0) {
            this.localidades = this.localidades.map((localidad) => localidad.nombre);
          }
        });
    },

    async cargarSecciones() {
      await this.$service.get(`secciones?filtro=nombre:${this.searchTermSeccion ?? ''}`)
        .then((resultado) => {
          this.secciones = resultado && resultado.datos && resultado.datos.filas ? resultado.datos.filas : [];
          this.secciones = this.secciones.map((seccion) => seccion.nombre);
        });
    },

    async activar(item) {
      const message = `¿Está seguro de activar ${item.nombre}?`;
      this.$confirm(
        message,
        async () => {
          try {
            const response = await this.$service.patch(`${this.url}/activacion/${item.id}`, {});
            this.$message.success(response.mensaje);
          } catch (error) {
            this.$message.error(error.mensaje ?? error.message ?? `Error al activar ${item.nombre}`);
          } finally {
            this.closeModal();
            this.updateList();
          }
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
        codigoSie: null,
        nombre: null,
        tipoUnidadEducativa: null,
        areaGeografica: null,
        idDistrito: null,
        idDepartamento: null,
        localidad: null,
        seccion: null
      };
    },

    async itemDelete({ items }) {
      // Verificar permiso para ejecutar esta funcion
      if ($Casbin && $Casbin.enforcer) {
        const { rol } = this.$storage.get('rol');
        const permitido = await $Casbin.enforcer.enforce(rol, '/unidades-educativas', 'delete');
        if (!permitido) {
          this.$message.warning('No tiene permisos');
          return;
        }
      }
      const message = `¿Está seguro de eliminar la unidad educativa <strong>${items.nombre}</strong>?`;
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
      this.modalUnidadEducativa = false;
      this.reset();
    },
    async oModal({ items }) {
      if (items && items.id) {
        this.form = { ...items };
        this.form.idDistrito = items.distrito.id;
        this.searchTermLocalidad = items.localidad;
        this.searchTermSeccion = items.seccion;

        this.form.idDepartamento = items.distrito.departamento.id;

        await this.cargarLocalidades(this.form.localidad);
        await this.cargarSecciones(this.form.seccion);
        await this.cargarDistritos(this.form.idDepartamento);

        const filtroResultadoLocalidades = this.localidades.filter(localidad => localidad === this.form.localidad);

        if (filtroResultadoLocalidades.length === 0) {
          this.form.localidad = null;
        } /// Verificando mismo nombre y poniendo null a la variable en caso de no existir nombre en la base de datos

        const filtroResultadoSecciones = this.secciones.filter(seccion => seccion === this.form.seccion);

        if (filtroResultadoSecciones.length === 0) {
          this.form.seccion = null;
        } /// Verificando mismo nombre y poniendo null a la variable en caso de no existir nombre en la base de datos
      } else {
        this.reset();
        this.searchTermLocalidad = '';
        this.searchTermSeccion = '';
        await this.cargarLocalidades();
        await this.cargarSecciones();
      }
      this.modalUnidadEducativa = true;
    },

    /**
     * @function save
     * @description Esta funcion esta creada para guardar en la BD
     * @author dbarra@agetic.gob.bo
     */
    async save() {
      console.log(`this.form: ${JSON.stringify(this.form)}`);
      if (this.$refs.form.validate()) {
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
    AppDialog,
    CrudTable,
    vIconComponent
  }
};
</script>
