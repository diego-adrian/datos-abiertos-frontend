<template>
  <v-card elevation="0">
    <app-dialog
        :dialog.sync="modalUsuario"
        :titulo="form.id ? 'Editar Usuario' : 'Adicionar Usuario'"
        @open-dialog="modalUsuario = true;"
        @close-dialog="closeModal"
        max-width="1150px"
        @accion="save"
    >
      <!-- SLOT PARA EL FORMULARIO -->
      <template v-if="modalUsuario">
        <!-- FORMULARIO PARA AGREGAR O EDITAR -->
        <v-card elevation="0">
          <v-form :key="`usuario-${form.id}`" ref="form" v-model="valid" lazy-validation @submit.prevent="save">
            <v-row class="ma-4">
              <v-col cols="12" md="4" xs="12" sm="4" lg="4" class="d-flex justify-center">
                <v-card v-if="usarCiudadaniaCheckBox" elevation="0"
                        class="primary--text mb-3 ciudadania--text ml-3 rounded">
                  Campos deshabilitados por usar Ciudadanía Digital
                </v-card>
                <form-persona
                    v-if="modalUsuario"
                    :persona="form.persona"
                    :touched="touched"
                    @touch="touch"
                    :deshabilitarCampos="usarCiudadaniaCheckBox || form.id!=null"
                    :deshabilitar-carnet="form.id!=null"
                    @value="obtenerPersona"></form-persona>
              </v-col>
              <v-col cols="12" md="4" xs="12" sm="4" lg="4" class="d-flex justify-center">
                <v-container>
                  <v-card elevation="0" class="primary--text mb-3">Datos del usuario</v-card>
                  <v-card class="pa-4" outlined rounded>
                    <v-input-text-field
                        @value="e => form.correoElectronico = e"
                        :init="form.correoElectronico"
                        v-model="form.correoElectronico"
                        :disabled="form.ciudadaniaDigital || usarCiudadaniaCheckBox"
                        label="Correo Electrónico"
                        required
                        dense
                        @blur="touch({ name: 'correoElectronico'})"
                        :full-width="false"
                        @keyup="form.correoElectronico = $util.textToUppercase(form.correoElectronico)"
                        :width="300"
                        :clearable="false"
                        :rules="touched.correoElectronico && !usarCiudadaniaCheckBox ? $validate(['required', 'email']) : []"
                    />
                    <v-input-text-field
                        @value="e => form.persona.celular = e"
                        :init="form.persona.celular"
                        v-model="form.persona.celular"
                        :disabled="form.persona.ciudadaniaDigital || usarCiudadaniaCheckBox"
                        label="Nro. celular"
                        required
                        dense
                        maxlength="8"
                        :full-width="false"
                        @keyup="form.persona.celular = $util.textToUppercase(form.persona.celular)"
                        :width="300"
                        :clearable="false"
                        :rules="touched.celular ? $validate(['celular']) : []"
                    />
                  </v-card>
                </v-container>
              </v-col>
              <v-col cols="12" md="4" xs="12" sm="4" lg="4">
                <v-container fluid>
                  <v-card elevation="0">
                    <v-row no-gutters class="justify-space-between">
                      <div class="primary--text">
                        Roles:
                      </div>
                      <v-icon-tooltip
                          color="primary"
                          icon="add"
                          text="Agregar Rol"
                          @accion="addOption();"
                          :disabled="deshabilitarAgregarRol"
                      />
                    </v-row>
                  </v-card>

                  <v-row>
                    <v-col cols="12" md="12" xs="12" sm="12" lg="12">
                      <v-card elevation="0">
                        <v-alert
                            type="warning"
                            text
                            dense
                            class="fs8"
                            v-if="aOpciones.length === 0"
                        >
                          Agregue al menos un rol
                        </v-alert>
                        <template v-for="(opcion, idx) in aOpciones">
                          <v-card class="mb-4" outlined :key='`rol-card-${opcion.key}-${idx}`' rounded>
                            <v-row class="pa-3">
                              <v-col>
                                <v-input-text-field
                                    :show-field="false"
                                    label="Olimpiada"
                                >
                                  <template slot="contenido">
                                    <v-select
                                        color="primary"
                                        required
                                        item-color="primary"
                                        v-model="aOpciones[idx]['idOlimpiada']"
                                        :items="olimpiadas"
                                        item-text="nombre"
                                        item-value="id"
                                        outlined
                                        hide-details
                                        @change="cargarEtapas(aOpciones[idx]['idOlimpiada']); aOpciones[idx].rolesHabilitados = calcularRolesHabilitados(aOpciones[idx]['idOlimpiada'])"
                                        :rules="$validate(['required'])"
                                    ></v-select>
                                  </template>
                                </v-input-text-field>
                              </v-col>
                            </v-row>
                            <v-row :key='`rol-${opcion.key}-${idx}`' v-if="aOpciones[idx]['idOlimpiada'] != null"  class="pl-3 pr-3">
                              <v-col>
                                <opciones-rol
                                    :key="opcion.key"
                                    :id="opcion.key"
                                    :key-inicial="opcion.id"
                                    :value="opcion.text"
                                    @setOption="setOption"
                                    :roles.sync="opcion.rolesHabilitados"
                                    :showDelete="true"
                                />
                              </v-col>
                            </v-row>
                            <div v-if="opcion.campos && opcion.campos.length > 0" :key='`rol-${opcion.key}`'
                                 class="mb-3">
                              <div v-for="(campo, id) in opcion.campos" :key='`campo-${id}${campo}`'>
                                <v-row v-if="campo === 'idEtapa'" class="pa-3">
                                  <v-col>
                                    <v-input-text-field
                                        :show-field="false"
                                        label="Etapa"
                                        full-width
                                    >
                                      <template slot="contenido">
                                        <v-select
                                            color="primary"
                                            required
                                            item-color="primary"
                                            v-model="aOpciones[idx][campo]"
                                            :items="etapas"
                                            item-text="nombre"
                                            item-value="id"
                                            outlined
                                            dense
                                            hide-details
                                            :rules="$validate(['required'])"
                                        >
                                        </v-select>
                                      </template>
                                    </v-input-text-field>
                                  </v-col>
                                </v-row>
                                <v-row v-if="campo === 'idArea'" class="pa-3">
                                  <v-col>
                                    <v-input-text-field
                                        :show-field="false"
                                        label="Área"
                                    >
                                      <template slot="contenido">
                                        <v-select
                                            color="primary"
                                            required
                                            item-color="primary"
                                            v-model="aOpciones[idx][campo]"
                                            :items="areas"
                                            item-text="nombre"
                                            item-value="id"
                                            outlined
                                            dense
                                            hide-details
                                            :rules="$validate(['required'])"
                                        >
                                        </v-select>
                                      </template>
                                    </v-input-text-field>
                                  </v-col>
                                </v-row>
                                <v-row v-if="campo === 'idDepartamento'" class="pa-3">
                                  <v-col>
                                    <v-input-text-field
                                        :show-field="false"
                                        label="Departamento"
                                    >
                                      <template slot="contenido">
                                        <v-select
                                            color="primary"
                                            required
                                            item-color="primary"
                                            v-model="aOpciones[idx][campo]"
                                            :items="departamentos"
                                            item-text="nombre"
                                            item-value="id"
                                            outlined
                                            dense
                                            @change="cargarDistritos(aOpciones[idx][campo])"
                                            hide-details
                                            :rules="$validate(['required'])"
                                        ></v-select>
                                      </template>
                                    </v-input-text-field>
                                  </v-col>
                                </v-row>
                                <v-row v-if="campo === 'idDistrito'" class="pa-3">
                                  <v-col>
                                    <v-input-text-field
                                        :show-field="false"
                                        label="Distrito"
                                    >
                                      <template slot="contenido">
                                        <v-select
                                            color="primary"
                                            required
                                            item-color="primary"
                                            v-model="aOpciones[idx][campo]"
                                            :items="distritos"
                                            item-text="nombre"
                                            item-value="id"
                                            outlined
                                            dense
                                            hide-details
                                            :rules="$validate(['required'])"
                                        ></v-select>
                                      </template>
                                    </v-input-text-field>
                                  </v-col>
                                </v-row>
                                <v-row v-if="campo === 'idUnidadEducativa'" class="pa-3">
                                  <v-col>
                                    <v-input-text-field
                                        :show-field="false"
                                        label="Unidad educativa"
                                    >
                                      <template slot="contenido">
                                        <v-select v-model="aOpciones[idx][campo]" item-text="nombre"
                                                  item-value="id" :items="unidadesEducativas" attach outlined flat solo
                                                  :rules="$validate(['required'])">
                                          <template v-slot:prepend-item>
                                            <v-list-item>
                                              <v-list-item-content>
                                                <v-text-field
                                                    v-model="searchTermUnidadEducativa"
                                                    placeholder="Buscar Unidad Educativa"
                                                    @input="cargarUnidadesEducativas"></v-text-field>
                                              </v-list-item-content>
                                            </v-list-item>
                                          </template>
                                        </v-select>
                                      </template>
                                    </v-input-text-field>
                                  </v-col>
                                </v-row>
                              </div>
                            </div>
                            <v-row class="justify-center">
                              <v-col cols="10"></v-col>
                              <v-col cols="2">
                                <v-icon-tooltip
                                    color="error"
                                    @accion="deleteOption(opcion.id)"
                                    icon="remove_circle_outline"
                                    text="Eliminar"
                                />
                              </v-col>
                            </v-row>
                          </v-card>
                        </template>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-container>
              </v-col>
            </v-row>
          </v-form>
        </v-card>
      </template>
    </app-dialog>
    <crud-table
        v-if="showCrudTable"
        :headers="headers" description="Usuarios" :url-inicial="url" :widthModal="500" :order="order"
                :filters-inicial="filters"
                :show-filter-init="true"
                :filtro-as-query="true"
                :omitir-carga-on-mounted="true"
                :custom="true">
      <template slot="buttons">
        <v-icon-tooltip
            v-if="btnAgregar"
            color="primary"
            icon="add"
            @accion="oModal({})"
            text="Agregar usuario"
        />
      </template>

      <!-- SLOT PARA TODOS LOS ITEMS (Solo en caso de que se quiera personalizar cada columna o mas de 1 columna) -->
      <template slot="items" slot-scope="items">
        <tr>
          <td>{{ items.items.persona.nroDocumento }}</td>
          <td>
            <span>
              {{ items.items.persona.nombres }}
              {{ items.items.persona.primerApellido }}
              {{ items.items.persona.segundoApellido }}
            </span>
            <br>
            <v-btn v-if="items.items.ciudadaniaDigital" color="ciudadania" outlined x-small>
              Ciudadanía Digital
            </v-btn>
          </td>
          <td>{{ items.items.usuario }}</td>
          <td>
            <div v-for="olimpiada in items.items.olimpiadas" :key="olimpiada.id">
              <br>
              <v-chip small dark outlined color="primary">
                <v-icon-component icon="emoji_events"/>
                {{ olimpiada.olimpiada.nombre }}
              </v-chip>
              <v-tooltip v-for="rol in olimpiada.usuarioRol" :key="rol.id" bottom :disabled="rol.rol.grupo !=='ACTOR'">
                <template #activator="{ on }">
                  <v-chip v-on="on" max-width="100" small :color="rol.rol.grupo ==='ACTOR' ? 'color2': 'color3'" dark>
                    {{ rol.rol.rol }}
                  </v-chip>
                </template>
                <span>
                  {{ rol.departamento ? `Departamento: ${rol.departamento.nombre}` : '' }}
                  {{ rol.distrito ? `Distrito: ${rol.distrito.nombre}` : '' }}
                  {{ rol.area ? `Área: ${rol.area.nombre}` : '' }}
                  {{ rol.unidadEducativa ? `Unidad educativa: ${rol.unidadEducativa.nombre}` : '' }}
                  {{ rol.etapa ? `Etápa: ${rol.etapa.nombre}` : '' }}
                </span>
              </v-tooltip>
            </div>
            <br>
          </td>
          <td>
            <v-btn outlined :color="items.items.estado === 'ACTIVO' ? 'info' : 'default'">{{
                items.items.estado
              }}
            </v-btn>
          </td>
          <td>
            <v-tooltip bottom color="primary" v-if="btnEditar">
              <template v-slot:activator="{ on }">
                <v-btn icon v-on="on"
                       :color="['ASIGNADO', 'ACTIVO'].includes(items.items.estado) ? 'success' : 'error'"
                       @click.prevent="itemDelete(items)" :disabled="items.items.estado === 'ASIGNADO'">
                  <v-icon-component v-if="['ASIGNADO', 'ACTIVO'].includes(items.items.estado)"
                                    icon="toggle_on"/>
                  <v-icon-component v-if="['INACTIVO', 'CREADO'].includes(items.items.estado)"
                                    icon="toggle_off"/>
                </v-btn>
              </template>
              <span>{{ items.items.estado === 'INACTIVO' ? 'Activar usuario' : 'Inactivar usuario' }}</span>
            </v-tooltip>
            <v-tooltip bottom color="teal lighten-1"
                       v-if="btnEditar && (items.items.estado === 'ACTIVO' || items.items.estado === 'ASIGNADO')">
              <template v-slot:activator="{ on }">
                <v-btn icon v-on="on" color="info" @click.stop="passwordRecovery(items.items.id)"
                       :disabled="items.items.ciudadaniaDigital">
                  <v-icon-component icon="vpn_key"></v-icon-component>
                </v-btn>
              </template>
              <span>Restablecer Contraseña</span>
            </v-tooltip>
            <v-tooltip bottom color="success" v-if="btnEditar">
              <template v-slot:activator="{ on }">
                <v-btn icon v-on="on" color="success" @click.stop="oModal(items)"
                       :disabled="['ASIGNADO', 'INACTIVO'].includes(items.items.estado)">
                  <v-icon-component icon="edit"></v-icon-component>
                </v-btn>
              </template>
              <span>Editar registro</span>
            </v-tooltip>
          </td>
        </tr>
      </template>
    </crud-table>
  </v-card>
</template>
<script>

import security from '@/common/mixins/security';
import validate from '@/common/mixins/validate';
import CrudTable from '@/plugins/crud-table/CrudTable.vue';
import actions from '@/plugins/crud-table/mixins/crud-table';
import FormPersona from '@/components/personas/form.vue';
import vIconComponent from '@/plugins/icon/index.vue';
import AppDialog from '@/plugins/modal/AppDialog.vue';
import moment from 'dayjs';

import OpcionesRol from './opcionesRol.vue';

const customParseFormat = require('dayjs/plugin/customParseFormat');

moment.extend(customParseFormat);

export default {
  mixins: [security, actions, validate],
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
    aOpciones: [],
    flagTecnicoSie: null,
    olimpiadasOpciones: [],
    form: {
      id: null,
      usuario: null,
      persona: {
        id: null,
        nombres: null,
        primerApellido: null,
        segundoApellido: null,
        nroDocumento: null,
        fechaNacimiento: null,
        celular: null,
      },
      ciudadaniaDigital: false,
      actor: false,
      idOlimpiada: null,
      idEtapa: null,
      idArea: null,
      idDepartamento: null,
      idUnidadEducativa: null,
      roles: [],
      rolesID: [],

      estado: 'ACTIVO'
    },
    touched: {
      roles: false,
      nombres: false,
      correoElectronico: false,
      primerApellido: false,
      segundoApellido: false,
      nroDocumento: false,
      fechaNacimiento: false,
      celular: false,
    },
    btnAgregar: true,
    btnEditar: true,
    btnEliminar: true,
    roles: [],
    modalUsuario: false,
    usarCiudadaniaCheckBox: null,
    filters: [],
    olimpiadas: [],
    etapas: [],
    areas: [],
    departamentos: [],
    distritos: [],
    unidadesEducativas: [],
    searchTermUnidadEducativa: null,
    listaRolesHabilitados: [],
    showCrudTable: false
  }),
  mounted() {
    this.loadParams();
  },
  methods: {
    async loadParams() {
      this.$nextTick(async () => {
        const { rol } = this.$storage.get('rol');
        this.btnAgregar = await this.$check(rol, '/usuarios', 'create');
        this.btnEditar = await this.$check(rol, '/usuarios', 'update');
        this.btnEliminar = await this.$check(rol, '/usuarios', 'delete');
      });

      await this.cargarRoles();
      await this.cargarRolesFiltro();

      await this.$service.get('olimpiadas?limite=50&pagina=1')
        .then((resultado) => {
          this.olimpiadas = resultado && resultado.datos && resultado.datos.filas ? resultado.datos.filas : [];
        });
      // await this.$service.get('etapas')
      //   .then((resultado) => {
      //     this.etapas = resultado && resultado.datos && resultado.datos.filas ? resultado.datos.filas : [];
      //   });
      await this.$service.get('areas')
        .then((resultado) => {
          this.areas = resultado && resultado.datos && resultado.datos.filas ? resultado.datos.filas : [];
        });
      await this.$service.get('departamentos')
        .then((resultado) => {
          this.departamentos = resultado && resultado.datos ? resultado.datos : [];
        });
      await this.cargarEtapas();
      await this.cargarDistritos();
      await this.cargarUnidadesEducativas();
    },
    calcularRolesHabilitados(idOlimpiada) {
      let resultadoFiltro = [];
      resultadoFiltro = this.roles.filter((rol) => !this.aOpciones.some((aOpcion) => aOpcion.id === rol.id && aOpcion.idOlimpiada === idOlimpiada));
      return resultadoFiltro;
    },
    async cargarRoles() {
      await this.$service.get('roles?filtro=permisoCrear:HABILITADO')
        .then((resultado) => {
          this.roles = resultado && resultado.datos ? resultado.datos : [];
          this.roles = this.roles.map(rol => ({
            ...rol, ...{ campos: (['idOlimpiada']).concat(rol.campos ?? []) }
          }));
        });
    },

    async cargarRolesFiltro() {
      await this.$service.get('roles?filtro=permisoCrear:HABILITADO')
        .then((resultado) => {
          this.rolesFiltro = resultado && resultado.datos ? resultado.datos : [];
          this.filters = [
            {
              field: 'filtro',
              type: 'text',
              label: 'Filtro',
            },
            {
              field: 'rol',
              type: 'array',
              multiple: true,
              label: 'Roles Filtro...',
              values: this.rolesFiltro.map(rol => ({
                text: rol.rol,
                value: rol.id
              })),
            },
          ];
          this.showCrudTable = true;
          setTimeout(() => {
            this.updateList();
          }, 100);
        });
    },
    async cargarEtapas(idOlimpiada) {
      this.etapas = [];
      await this.$service.get(`etapas?filtro=idOlimpiada:${idOlimpiada ?? ''}`)
        .then((resultado) => {
          this.etapas = resultado && resultado.datos && resultado.datos.filas ? resultado.datos.filas : [];
        });
    },
    async cargarDistritos(idDepartamento) {
      await this.$service.get(`distritos?filtro=idDepartamento:${idDepartamento ?? this.form.idDepartamento ?? ''}`)
        .then((resultado) => {
          this.distritos = resultado && resultado.datos && resultado.datos.filas ? resultado.datos.filas : [];
        });
    },
    async cargarUnidadesEducativas() {
      await this.$service.get(`unidades-educativas?filtro=nombre:${this.searchTermUnidadEducativa ?? ''}`)
        .then((resultado) => {
          this.unidadesEducativas = resultado && resultado.datos && resultado.datos.filas ? resultado.datos.filas : [];
        });
    },
    touch({ name }) {
      this.touched = {
        ...this.touched,
        [name]: true
      };
    },
    reset() {
      this.aOpciones = [];
      this.olimpiadasOpciones = [];
      this.form = {
        id: null,
        usuario: null,
        estado: 'ACTIVO',
        persona: {
          id: null,
          nombres: null,
          primerApellido: null,
          segundoApellido: null,
          nroDocumento: null,
          fechaNacimiento: null,
          celular: null,
        },
        actor: false,
        ciudadaniaDigital: false,
        idOlimpiada: null,
        idEtapa: null,
        idArea: null,
        idDepartamento: null,
        idUnidadEducativa: null,
        roles: [],
        rolesID: [],
      };
      this.searchTermUnidadEducativa = null;
    },
    obtenerPersona(value) {
      this.form.persona = value;
    },
    async itemDelete({ items }) {
      const { rol } = this.$storage.get('rol');
      const permitido = await this.$check(rol, '/usuarios', 'update');
      if (!permitido) {
        this.$message.warning('No tiene permisos');
        return;
      }
      const message = `¿Está seguro de ${items.estado === 'INACTIVO' ? 'activar' : 'inactivar'} al usuario con C.I. ${items.nroDocumento}?`;
      this.$confirm(
        message,
        async () => {
          const response = await this.$service.patch(`${this.url}/${items.estado === 'INACTIVO' ? 'activacion' : 'inactivacion'}/${items.id}`);
          if (response.isOK) {
            this.updateList();
            this.closeModal();
            this.$message.success(`Usuario ${items.estado === 'INACTIVO' ? 'activado' : 'inactivado'} satisfactoriamente`);
          } else {
            this.$message.error(response.message ?? response.mensaje ?? 'Ocurrio un error');
          }
        },
        () => {
        }
      );
    },
    closeModal() {
      this.reset();
      this.modalUsuario = false;
    },
    async oModal({ items }) {
      await this.setTouched(false);
      if (items && items.id) {
        this.form = { ...items };
        await this.cargarRoles();
        this.form.persona.fechaNacimiento = moment(this.form.persona.fechaNacimiento)
          .format('DD-MM-YYYY');
        this.olimpiadasOpciones = [];
        this.aOpciones = [];
        items.olimpiadas.forEach((olimpiada, indexOlimpiada) => {
          const temporal = olimpiada.usuarioRol.map((elemento, index) => {
            const aOpcion = elemento.rol;
            aOpcion.id = elemento.rol.id;
            aOpcion.key = index + indexOlimpiada;
            aOpcion.text = elemento.rol.rol;
            aOpcion.rolesHabilitados = this.roles;
            aOpcion.campos = [];
            // Agregando campo de olimpiada
            aOpcion.campos.push('idOlimpiada');
            aOpcion.idOlimpiada = olimpiada.olimpiada.id;
            if (elemento.departamento) {
              aOpcion.campos.push('idDepartamento');
              aOpcion.idDepartamento = elemento.departamento.id;
            }
            if (elemento.distrito) {
              aOpcion.campos.push('idDepartamento');
              aOpcion.idDepartamento = elemento.distrito.departamento.id;
              aOpcion.campos.push('idDistrito');
              aOpcion.idDistrito = elemento.distrito.id;
            }
            if (elemento.area) {
              aOpcion.campos.push('idArea');
              aOpcion.idArea = elemento.area.id;
            }
            if (elemento.unidadEducativa) {
              aOpcion.campos.push('idUnidadEducativa');
              aOpcion.idUnidadEducativa = elemento.unidadEducativa.id;
            }
            if (elemento.etapa) {
              aOpcion.campos.push('idEtapa');
              aOpcion.idEtapa = elemento.etapa.id;
            }
            return {
              ...aOpcion
            };
          });
          this.aOpciones.push(...temporal);
        });
      } else {
        await this.cargarEtapas();
        this.reset();
      }
      this.modalUsuario = true;
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
            this.closeModal();
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
            this.closeModal();
            this.updateList();
            this.$message.success(response.mensaje);
          } catch (error) {
            this.closeModal();
            this.$message.error(error.mensaje ?? 'Error al tratar de activar la cuenta de usuario');
          }
        }
      );
    },
    setTouched(option) {
      return new Promise((resolve) => {
        Object.keys(this.touched)
          .forEach(item => {
            this.touched = {
              ...this.touched,
              [item]: option
            };
          });
        resolve(true);
      });
    },
    deleteOption(letter) {
      this.$confirm('Esta seguro de eliminar el rol?', () => {
        const index = this.aOpciones.findIndex(option => option.key === letter);
        this.aOpciones.splice(index, 1);
        this.aRespuestas = Object.keys(this.aOpciones)
          .map(item => item);
        this.form.respuestas = this.form.tipoRespuesta === this.SELECCION_MULTIPLE ? [] : null;
      });
    },
    setOption({
      key,
      id,
      text,
      campos,
      idEtapa,
      idArea,
      idDepartamento,
      idDistrito,
      idUnidadEducativa,
      eliminarSiguientes
    }) {
      this.aOpciones.filter((option) => {
        if (option.key === key) {
          option.id = id ?? option.id;
          option.text = text ?? option.text;
          option.campos = campos ?? option.campos;
          option.idEtapa = idEtapa ?? option.idEtapa;
          option.idArea = idArea ?? option.idArea;
          option.idDepartamento = idDepartamento ?? option.idDepartamento;
          option.idDistrito = idDistrito ?? option.idDistrito;
          option.idUnidadEducativa = idUnidadEducativa ?? option.idUnidadEducativa;
        }
      });
      if (eliminarSiguientes) {
        this.eliminarSiguientes(key + 1);
      }
    },
    eliminarSiguientes(id) {
      this.aOpciones = this.aOpciones.slice(0, id);
    },
    addOption() {
      this.aOpciones = this.aOpciones.map((option, idx) => {
        const obj = {};
        obj.key = idx;
        obj.id = option.id;
        obj.text = option.text;
        obj.campos = option.campos;
        obj.rolesHabilitados = option.rolesHabilitados;
        if (option.idEtapa) {
          obj.idEtapa = option.idEtapa;
        }
        if (option.idArea) {
          obj.idArea = option.idArea;
        }
        if (option.idDepartamento) {
          obj.idDepartamento = option.idDepartamento;
        }
        if (option.idDistrito) {
          obj.idDistrito = option.idDistrito;
        }
        if (option.idUnidadEducativa) {
          obj.idUnidadEducativa = option.idUnidadEducativa;
        }
        obj.idOlimpiada = option.idOlimpiada;
        return obj;
      });
      this.aOpciones.push({
        key: this.aOpciones.length,
        id: '',
        text: '',
        campos: '',
        rolesHabilitados: []
      });
    },
    /**
     * @function save
     * @description Esta funcion esta creada para guardar en la BD
     * @author dbarra@agetic.gob.bo
     */
    async save() {
      if (this.aOpciones.length === 0) {
        this.$message.error('Debe agregar al menos un rol');
        return;
      }
      this.form.roles = this.aOpciones;
      await this.setTouched(true);
      if (this.$refs.form.validate()) {
        // const data = { ...({}, this.form) };
        const data = JSON.parse(JSON.stringify(this.form));
        data.persona.fechaNacimiento = moment(data.persona.fechaNacimiento, 'DD-MM-YYYY', 'es')
          .format('YYYY-MM-DD');
        if (data?.persona?.celular) {
          data.persona.celular = Number(data.persona.celular);
        } else {
          data.persona.celular = null;
        }

        if (data.id) {
          const response = await this.$service.patch(`${this.url}/${data.id}`, data);
          if (response.isOK) {
            this.closeModal();
            this.updateList();
            this.$message.success('Se actualizó el registro correctamente');
          } else {
            this.$message.error(response.mensaje ?? 'Ocurrio un error al tratar de enviar la data');
          }
        } else {
          delete data.id;
          try {
            if (this.usarCiudadaniaCheckBox) {
              data.usuario = data.persona.nroDocumento;
              delete data.id;
              delete data.estado;
              delete data.persona;
            }
            const response = await this.$service.post(`${this.url}${this.usarCiudadaniaCheckBox ? '/ciudadania' : ''}`, data);
            if (response.isOK) {
              console.info(`Exito: ${response}`);
              this.closeModal();
              this.updateList();
              this.$message.success('El registro fue agregado correctamente');
            } else {
              this.$message.error(
                response.mensaje ?? 'Ocurrio un error al tratar de enviar la data'
              );
            }
          } catch (error) {
            console.info(`Error: ${error.mensaje}`);
            this.$message.error(error.mensaje ?? 'Ocurrio un error al tratar de enviar la data');
          }
        }
      } else {
        console.log(`this.form: ${JSON.stringify(this.form)}`);
        this.$message.error('Complete los campos obligatorios');
      }
    },
  },
  computed: {
    deshabilitarAgregarRol() {
      return this.aOpciones.filter(rol => rol.id === '').length > 0 || this.aOpciones.length === this.roles.length;
    },
  },
  components: {
    AppDialog,
    CrudTable,
    FormPersona,
    vIconComponent,
    OpcionesRol
  }
};
</script>
