<template>
  <v-card elevation="0">
    <!-- SLOT PARA EL FORMULARIO -->
    <app-dialog :dialog.sync="modalInscripcion"
                :titulo="form.id ? 'Editar inscripción' : 'Adicionar inscripción'"
                @open-dialog="modalInscripcion = true;"
                @close-dialog="closeModal()"
                @accion="save"
    >
      <template v-if="modalInscripcion">
        <!-- FORMULARIO PARA AGREGAR O EDITAR -->
        <v-form :key="`inscripción-${form.id}`" ref="form" v-model="valid" lazy-validation @submit.prevent="save">
          <v-card elevation="0">
            <v-container fluid v-if="modalInscripcion">
              <v-row>
                <v-col cols="12" md="12" xs="12" sm="12" lg="12">
                  <v-select
                      color="primary"
                      required
                      readonly
                      item-color="primary"
                      disabled
                      v-model="form.idEtapaAreaGrado"
                      label="Etapa Área Grado"
                      :items="etapasAreasGrados"
                      item-value="id"
                      outlined
                      hide-details
                      :rules="$validate(['required'])"
                  >
                    <template slot="item" slot-scope="data">
                      Etapa: {{ data.item.etapa.nombre }} - Área: {{ data.item.area.nombre }} - Grado:
                      {{ data.item.gradoEscolar.nombre }}
                    </template>
                    <template slot="selection" slot-scope="data">
                      Etapa: {{ data.item.etapa.nombre }} - Área: {{ data.item.area.nombre }} - Grado:
                      {{ data.item.gradoEscolar.nombre }}
                    </template>
                  </v-select>
                </v-col>
              </v-row>
              <v-card elevation="0" class="primary--text mb-4 mt-5">Datos de estudiante</v-card>
              <v-row>
                <v-col cols="12" md="12" xs="12" sm="12" lg="6">
                  <v-text-field
                      color="primary"
                      required
                      :rules="$validate(['required', 'alfanumerico'])"
                      v-model="persona.nroDocumento"
                      label="Número de Documento"
                      outlined
                      @keyup="persona.nroDocumento = $util.textToUppercase(persona.nroDocumento)"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="12" xs="12" sm="12" lg="6">
                  <v-text-field
                      color="primary"
                      required
                      :rules="$validate(['required', 'alfanumerico'])"
                      v-model="persona.nombres"
                      label="Nombres"
                      outlined
                      hide-details
                      @keyup="persona.nombres = $util.textToUppercase(persona.nombres)"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="12" xs="12" sm="12" lg="6">
                  <v-text-field
                      color="primary"
                      required
                      v-model="persona.primerApellido"
                      label="Primer Apellido"
                      outlined
                      hide-details
                      @keyup="persona.primerApellido = $util.textToUppercase(persona.primerApellido)"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="12" xs="12" sm="12" lg="6">
                  <v-text-field
                      color="primary"
                      required
                      v-model="persona.segundoApellido"
                      label="Segundo Apellido"
                      outlined
                      hide-details
                      @keyup="persona.segundoApellido = $util.textToUppercase(persona.segundoApellido)"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="12" xs="12" sm="12" lg="12">
                  <v-text-field
                      color="primary"
                      required
                      :rules="$validate(['required'])"
                      v-model="estudiante.rude"
                      label="Rude"
                      outlined
                      hide-details
                      @keyup="estudiante.rude = $util.textToUppercase(estudiante.rude)"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row v-if="this.modalInscripcion">
                <v-col cols="12" md="12" xs="12" sm="12" lg="6">
                  <v-select
                      color="primary"
                      required
                      item-color="primary"
                      v-model="persona.genero"
                      label="Género"
                      :items="enumGenero"
                      item-text="nombre"
                      item-value="id"
                      outlined
                      hide-details
                      :rules="$validate(['required'])"
                  ></v-select>
                </v-col>
                <v-col cols="12" md="12" xs="12" sm="12" lg="6">
                  <date-input
                      v-model="persona.fechaNacimiento"
                      :fecha="persona.fechaNacimiento"
                      :tabIndex="5"
                      label="Fecha Nacimiento"
                      min-date="1950-01-01"
                      required
                      :readonly="form.id!=null"
                      @value="obtenerFecha"
                  ></date-input>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="12" xs="12" sm="12" lg="12">
                  <v-text-field
                      color="primary"
                      v-model="persona.telefono"
                      label="Celular"
                      :rules="$validate(['celular'])"
                      outlined
                      maxlength="8"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="12" xs="12" sm="12" lg="12">
                  <v-text-field
                      color="primary"
                      :rules="$validate(['email'])"
                      v-model="persona.correoElectronico"
                      label="Correo electrónico"
                      outlined
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="12" xs="12" sm="12" lg="12">
                  <v-select v-model="form.idUnidadEducativa" item-text="nombre"
                            item-value="id" :items="unidadesEducativas" attach outlined label="Unidad Educativa"
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
                      <v-divider class="mt-2"></v-divider>
                    </template>
                  </v-select>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-form>
      </template>
    </app-dialog>
    <app-dialog :dialog.sync="modalSubirInscripcion"
      titulo="Subir inscripción"
      @open-dialog="modalSubirInscripcion = true;"
      @close-dialog="modalSubirInscripcion = false;"
      :mostrar-acciones="false"
    >
      <v-card class="pa-2 d-flex flex-column align-center justify-center pl-0 pr-0" elevation="0">
        <v-container>
          <v-row>
            <v-col cols="12" md="12" xs="12" sm="12" lg="12">
              <v-select
                  color="primary"
                  required
                  readonly
                  disabled
                  item-color="primary"
                  v-model="form.idEtapaAreaGrado"
                  label="Etapa-Área-Grado Seleccionada: "
                  :items="etapasAreasGrados"
                  item-value="id"
                  outlined
                  hide-details
                  :rules="$validate(['required'])"
              >
                <template slot="item" slot-scope="data">
                  Etapa: {{ data.item.etapa.nombre }} - Área: {{ data.item.area.nombre }} - Grado:
                  {{ data.item.gradoEscolar.nombre }}
                </template>
                <template slot="selection" slot-scope="data">
                  Etapa: {{ data.item.etapa.nombre }} - Área: {{ data.item.area.nombre }} - Grado:
                  {{ data.item.gradoEscolar.nombre }}
                </template>
              </v-select>
              <v-file-upload @close="closeModalsubir" :key="new Date().getTime() / 1000"
                             :id-eag="this.form.idEtapaAreaGrado" @close-dialog="modalSubirInscripcion = false;"
                             @recargar="updateList"/>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </app-dialog>
    <app-dialog
      :dialog.sync="modalReinicio"
      :titulo="`Examenes de ${tituloReinicio}`"
      @open-dialog="modalReinicio = true;"
      @close-dialog="modalReinicio = false; urlReinicio = null"
      max-width="800px"
      :mostrarAcciones="false"
    >
      <Reiniciar v-if="urlReinicio" :urlReinicio="urlReinicio" :student="student"/>
    </app-dialog>
    <crud-table
        v-if="showCrudTable"
        :headers="headers"
        description="Inscripciones"
        :url-inicial="obtenerRuta()"
        :widthModal="500"
        :show-filter-init="true"
        :filters-inicial="filters"
        :order="order"
        :custom="true"
        :show-filter-options="false"
        :omitir-carga-on-mounted="true"
    >
      <template slot="buttons">
        <v-tooltip bottom color="primary" v-if="isAuthorized">
          <template v-slot:activator="{ on }">
            <v-btn
                color="primary"
                :small="['xs', 'sm'].includes($vuetify.breakpoint.name)"
                icon
                v-on="on"
                @click.native.stop="oModalUpload"
                slot="activator"
            >
              <v-icon-component icon="file_upload"/>
            </v-btn>
          </template>
          <span> Subir lista de estudiantes </span>
        </v-tooltip>
        <v-tooltip bottom color="primary">
          <template v-slot:activator="{ on }">
            <v-btn color="primary" :small="['xs', 'sm'].includes($vuetify.breakpoint.name)" icon v-on="on"
                   @click.native.stop="oModal" slot="activator" v-if="btnAgregar && isAuthorized"
            >
              <v-icon-component icon="add"/>
            </v-btn>
          </template>
          <span> Agregar inscripción </span>
        </v-tooltip>
      </template>
      <template slot="items" slot-scope="items">
        <tr>

          <td>{{ items.items.estudiante.persona.nroDocumento }}</td>
          <td class="text--wrap">
            {{ items.items.estudiante.persona.nombres }}
            {{ items.items.estudiante.persona.primerApellido }}
            {{ items.items.estudiante.persona.segundoApellido }}<br>
            {{
              formatFechaValidar(items.items.estudiante.persona.fechaNacimiento, 'YYYY-MM-DD', 'DD-MM-YYYY')
            }}
            <span v-custom-tooltip="`
              ${items.items.estudiante.persona.nombres}
              ${items.items.estudiante.persona.primerApellido}
              ${items.items.estudiante.persona.segundoApellido}
              ${formatFechaValidar(items.items.estudiante.persona.fechaNacimiento, 'YYYY-MM-DD', 'DD-MM-YYYY')}`"
            >Ver mas</span>
          </td>
          <td>{{ items.items.estudiante.rude }}</td>
          <td class="text--wrap">
            {{ items.items.unidadEducativa.nombre }}<br>
            {{ items.items.unidadEducativa.codigoSie }}
            <span v-custom-tooltip="`
              ${items.items.unidadEducativa.nombre}
              ${items.items.unidadEducativa.codigoSie}`"
            >Ver mas</span>
          </td>
          <td>
            {{ items.items.etapaAreaGrado.gradoEscolar.nombre }}
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
                color="success"
                icon="person_search"
                :text="`Buscar examenes de ${ items.items.estudiante.persona.nombres } para reiniciar`"
                @accion="handleClickSearchUser(items.items)"
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
          </td>
        </tr>
      </template>
    </crud-table>
    <v-alert
        type="warning"
        dense
        text
        class="fs9"
        v-else
    >
      No existen áreas asignadas en esta competencia.
    </v-alert>
  </v-card>
</template>
<script>

import { mapState } from 'vuex';
import { $Casbin } from '@/plugins/casbin';
import validate from '@/common/mixins/validate';
import CrudTable from '@/plugins/crud-table/CrudTable.vue';
import actions from '@/plugins/crud-table/mixins/crud-table';
import vIconComponent from '@/plugins/icon/index.vue';
import AppDialog from '@/plugins/modal/AppDialog.vue';
import vFileUpload from '@/plugins/fileUpload2/index.vue';
import DateInput from '@/plugins/date-input/DateInput.vue';
import Reiniciar from '@/components/reinicio/index.vue';
import moment from 'dayjs';

export default {
  mixins: [actions, validate],
  data: () => ({
    valid: false,
    url: null,
    parametros: null,
    modalReinicio: null,
    student: {},
    urlReinicio: null,
    tituloReinicio: null,
    order: ['createdAt', 'DESC'],
    headers: [
      {
        text: 'Nro. de documento',
        sortable: false,
        align: 'center'
      },
      {
        text: 'Nombres',
        sortable: false,
        align: 'center'
      },
      {
        text: 'Rude',
        sortable: false,
        align: 'center',
        value: 'rude'
      },
      {
        text: 'Unidad Educativa',
        sortable: false,
        align: 'center'
      },
      {
        text: 'Grado de escolaridad',
        sortable: false,
        align: 'center'
      },
      {
        text: 'Estado',
        sortable: false,
        align: 'center'
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
      idImportacion: null,
      idEtapa: null,
      idArea: null,
      idGrado: null,
      idUnidadEducativa: null,
      idEtapaAreaGrado: null
    },
    showCrudTable: false,
    filters: [],
    olimpiadas: [],
    etapas: [],
    areas: [],
    estudiante: {
      id: null,
      rude: null,
    },
    persona: {
      nombres: null,
      primerApellido: null,
      segundoApellido: null,
      tipoDocumento: null,
      nroDocumento: null,
      fechaNacimiento: null,
      telefono: null,
      correoElectronico: null,
      genero: null,
      estado: null,
    },
    menufechaNacimiento: false,
    btnAgregar: true,
    btnEditar: true,
    btnEliminar: true,
    departamentos: [],
    etapasAreasGrados: [],
    modalInscripcion: false,
    modalSubirInscripcion: false,
    unidadesEducativas: [],
    searchTermUnidadEducativa: null,
    enumGenero: [
      {
        id: 'M',
        nombre: 'Masculino'
      },
      {
        id: 'F',
        nombre: 'Femenino'
      },
    ],
  }),
  computed: {
    ...mapState(['selectedArea']),
    isAuthorized() {
      return this.etapaSeleccionada ? this.etapaSeleccionada.tipo === 'DISTRITAL' : false;
    }
  },
  mounted() {
    this.$nextTick(() => {
      if ($Casbin && $Casbin.enforcer) {
        const { rol } = this.$storage.get('rol');
        $Casbin.enforcer.enforce(rol, '/inscripciones', 'create')
          .then(permitido => {
            this.btnAgregar = permitido;
          });
        $Casbin.enforcer.enforce(rol, '/inscripciones', 'update')
          .then(permitido => {
            this.btnEditar = permitido;
          });
        $Casbin.enforcer.enforce(rol, '/inscripciones', 'delete')
          .then(permitido => {
            this.btnEliminar = permitido;
          });
      }

      this.olimpiadaSeleccionada = this.$storage.get('olimpiadaSeleccionada');
      if (this.olimpiadaSeleccionada !== null) {
        this.idOlimpiadaSeleccionada = this.olimpiadaSeleccionada.id;
      } else {
        this.idOlimpiadaSeleccionada = null;
      }

      this.etapaSeleccionada = this.$storage.get('etapaSeleccionada');
      if (this.etapaSeleccionada !== null) {
        this.idEtapaSeleccionada = this.etapaSeleccionada.id;
      } else {
        this.idEtapaSeleccionada = null;
      }

      this.areaSeleccionada = this.$storage.get('areaSeleccionada');
      if (this.areaSeleccionada !== null) {
        this.idAreaSeleccionada = this.areaSeleccionada.id;
      } else {
        this.idAreaSeleccionada = null;
      }

      this.url = 'inscripciones';
      this.loadParams();
      this.$message.success('Seleccione etapa, area y grado escolar');
    });
  },
  methods: {
    obtenerRuta() {
      return `etapasAreaGrado/${this.idAreaSeleccionada}/inscripciones`;
    },
    async handleClickSearchUser ({ estudiante: { rude, persona: { nombres, primerApellido, segundoApellido } } }) {
      try {
        this.tituloReinicio = `${nombres} ${primerApellido} ${segundoApellido}`;
        const response = await this.$service.get(`estudiantes/${rude}/detalles`);
        if (response && response.datos && response.isOK) {
          this.student = response.datos;
          this.urlReinicio = `estudiantes/${this.student.idEstudiante}/examenes/calendarios`;
          this.modalReinicio = !this.modalReinicio;
        } else {
          throw new Error('No se encontraron registros');
        }
      } catch (error) {
        this.$message.error(error.message);
      }
    },
    async cargarEtapas() {
      await this.$service.get(`olimpiadas/${this.idOlimpiadaSeleccionada}/etapas`)
        .then((resultado) => {
          this.etapas = resultado && resultado.datos && resultado.datos.filas
            ? resultado.datos.filas
            : [];
        });
    },

    async cargarAreas() {
      await this.$service.get(`etapas/${this.idEtapaSeleccionada}/etapaAreaGrados`)
        .then((resultado) => {
          this.areas = resultado && resultado.datos && resultado.datos.filas
            ? resultado.datos.filas
            : [];
        });
    },

    async loadParams() {
      await this.$service.get('departamentos')
        .then((resultado) => {
          this.departamentos = resultado && resultado.datos ? resultado.datos : [];
        });
      await this.$service.get(`etapas/${this.idEtapaSeleccionada}/etapasAreaGrado`)
        .then((resultado) => {
          this.etapasAreasGrados = resultado && resultado.datos && resultado.datos.filas ? resultado.datos.filas : [];
        });
      await this.cargarUnidadesEducativas();

      await this.cargarEtapas();
      await this.cargarAreas();

      await this.$service.get('olimpiadas?limite=50&pagina=1')
        .then((resultado) => {
          this.olimpiadas = resultado && resultado.datos && resultado.datos.filas
            ? resultado.datos.filas
            : [];
        });

      this.filters = this.definirFiltros();

      this.showCrudTable = true;
      setTimeout(() => {
        this.updateList();
      }, 100);
    },

    async actualizarOlimpiada(idOlimpiadaSeleccionadaNueva) {
      this.olimpiadaSeleccionada = this.olimpiadas.find(item => item.id === idOlimpiadaSeleccionadaNueva);
      this.idOlimpiadaSeleccionada = idOlimpiadaSeleccionadaNueva;
      if (this.olimpiadaSeleccionada != null) {
        this.$storage.set('olimpiadaSeleccionada', this.olimpiadaSeleccionada);
      }
      this.idEtapaSeleccionada = null;
      this.$storage.set('etapaSeleccionada', null);
      await this.cargarEtapas();

      this.idAreaSeleccionada = null;
      this.$storage.set('areaSeleccionada', null);
      this.areas = [];

      this.$root.$refs.CrudTable.cargarFiltro(this.definirFiltros());

      setTimeout(() => {
        this.updateList();
      }, 100);
    },

    async actualizarEtapa(idEtapaSeleccionadaNueva) {
      this.etapaSeleccionada = this.etapas.find(item => item.id === idEtapaSeleccionadaNueva);
      this.idEtapaSeleccionada = idEtapaSeleccionadaNueva;
      if (this.etapaSeleccionada != null) {
        this.$storage.set('etapaSeleccionada', this.etapaSeleccionada);
      }

      this.idAreaSeleccionada = null;

      await this.cargarAreas();

      this.$root.$refs.CrudTable.cargarFiltro(this.definirFiltros());

      setTimeout(() => {
        this.updateList();
      }, 100);
    },

    actualizarArea(idAreaSeleccionadaNueva) {
      this.areaSeleccionada = this.areas.find(item => item.id === idAreaSeleccionadaNueva);
      this.idAreaSeleccionada = idAreaSeleccionadaNueva;
      if (this.areaSeleccionada != null) {
        this.$storage.set('areaSeleccionada', this.areaSeleccionada);
      }

      this.$root.$refs.CrudTable.updateUrl(this.obtenerRuta());
    },

    definirFiltros() {
      return [
        {
          field: 'idOlimpiada',
          type: 'array',
          init: this.idOlimpiadaSeleccionada,
          multiple: false,
          label: 'Olimpiadas',
          eventName: 'cambioOlimpiadas',
          onChange: this.actualizarOlimpiada,
          values: this.olimpiadas.map(olimpiada => ({
            text: olimpiada.nombre,
            value: olimpiada.id
          })),
        },
        {
          field: 'idEtapa',
          type: 'array',
          init: this.idEtapaSeleccionada,
          multiple: false,
          label: 'Etapas',
          eventName: 'cambioEtapas',
          onChange: this.actualizarEtapa,
          values: this.etapas.map(etapa => ({
            text: etapa.nombre,
            value: etapa.id
          })),
        },
        {
          field: 'idEtapaAreaGrado',
          type: 'array',
          init: this.idAreaSeleccionada,
          multiple: false,
          label: 'Áreas Grado',
          eventName: 'cambioAreas',
          onChange: this.actualizarArea,
          values: this.areas.map(area => ({
            text: `${area.area.nombre} - ${area.gradoEscolar.nombre} `,
            value: area.id
          })),
        },
      ];
    },
    async cargarUnidadesEducativas() {
      await this.$service.get(`unidades-educativas?filtro=nombre:${this.searchTermUnidadEducativa ?? ''}`)
        .then((resultado) => {
          this.unidadesEducativas = resultado && resultado.datos && resultado.datos.filas ? resultado.datos.filas : [];
        });
    },

    async activar(item) {
      const message = `¿Está seguro de activar a ${item.estudiante.persona.nombres} ${item.estudiante.persona.primerApellido ?? item.estudiante.persona.segundoApellido}?`;
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
      const message = `¿Está seguro de inactivar a ${item.estudiante.persona.nombres} ${item.estudiante.persona.primerApellido ?? item.estudiante.persona.segundoApellido}?`;
      this.$confirm(
        message,
        async () => {
          const response = await this.$service.patch(`${this.url}/inactivacion/${item.id}`, {});
          if (response.isOK) {
            this.$message.success(response.mensaje);
          } else {
            this.$message.error(response.mensaje ?? response.message ?? `Error al inactivar ${item.nombre}`);
          }
          this.closeModal();
          this.updateList();
        }
      );
    },
    reset() {
      this.form = {
        id: null,
        idImportacion: null,
        idEtapa: null,
        idArea: null,
        idGrado: null,
        idUnidadEducativa: null,
        idEtapaAreaGrado: null
      };
      this.estudiante = {
        id: null,
        rude: null,

      };
      this.persona = {
        nombres: null,
        primerApellido: null,
        segundoApellido: null,
        tipoDocumento: null,
        nroDocumento: null,
        fechaNacimiento: null,
        telefono: null,
        correoElectronico: null,
        genero: null,
        estado: null,
      };
    },

    async itemDelete({ items }) {
      // Verificar permiso para ejecutar esta funcion
      if ($Casbin && $Casbin.enforcer) {
        const { rol } = this.$storage.get('rol');
        const permitido = await $Casbin.enforcer.enforce(rol, '/inscripciones', 'delete');
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
      this.modalInscripcion = false;
      this.reset();
    },
    closeModalsubir() {
      this.modalSubirInscripcion = false;
      this.reset();
    },
    formatFechaValidar(dateOriginal, formato, formatoNuevo) {
      if (moment(dateOriginal, formato, 'es')
        .isValid()) {
        return moment(dateOriginal, formato)
          .format(formatoNuevo);
      } else {
        return dateOriginal;
      }
    },
    formatFecha(dateOriginal, formato = 'DD/MM/YYYY') {
      return dateOriginal ? this.$datetime.format(formato, dateOriginal) : '';
    },
    async oModal({ items }) {
      if (items && items.id) {
        this.form = { ...items };
        this.estudiante = { ...items.estudiante };
        this.persona = { ...items.estudiante.persona };
        this.form.idUnidadEducativa = items.unidadEducativa.id;
        this.form.idEtapaAreaGrado = items.etapaAreaGrado.id;
        this.persona.fechaNacimiento = this.formatFecha(
          this.persona.fechaNacimiento,
          'DD-MM-YYYY'
        );
      } else {
        this.reset();
        this.form = {
          ...this.form,
          idEtapaAreaGrado: this.$storage.get('areaSeleccionada').id
        };
      }
      this.modalInscripcion = true;
    },
    async oModalUpload() {
      this.form = {
        ...this.form,
        idEtapaAreaGrado: this.$storage.get('areaSeleccionada').id
      };
      this.modalSubirInscripcion = true;
    },

    /**
     * @function save
     * @description Esta funcion esta creada para guardar en la BD
     * @author dbarra@agetic.gob.bo
     */
    async save() {
      if (this.$refs.form.validate()) {
        const data = {
          ...this.form,
          estudiante: {
            ...this.estudiante,
            persona: { ...this.persona }
          }
        };
        data.estudiante.persona.fechaNacimiento = this.formatFechaValidar(data.estudiante.persona.fechaNacimiento, 'DD-MM-YYYY', 'YYYY-MM-DD');
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
          const response = await this.$service.post(this.url, data);
          if (response.isOK) {
            this.closeModal();
            this.updateList();
            if (response.finalizado) {
              this.$message.success('El registro fue agregado correctamente');
            }
          } else {
            console.info(`Error: ${response}`);
            this.$message.error(response.mensaje ?? 'Ocurrio un error al tratar de enviar la data');
          }
        }
      } else {
        this.$message.error('Complete los campos obligatorios');
      }
    },
    obtenerFecha(val) {
      this.persona.fechaNacimiento = val;
    },
  },
  components: {
    CrudTable,
    vIconComponent,
    AppDialog,
    vFileUpload,
    DateInput,
    Reiniciar
  }
};
</script>
