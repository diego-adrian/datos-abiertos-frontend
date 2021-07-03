<template>
  <v-card elevation="0">
    <!-- SLOT PARA EL FORMULARIO -->
    <app-dialog :dialog.sync="modalSubirResultados"
      titulo="Subir resultados de exámenes offline"
      @open-dialog="modalSubirResultados = true;"
      @close-dialog="modalSubirResultados = false; updateList();"
      :mostrar-acciones="false"
      @accion="subir"
      max-width="700"
      icono="upload"
    >
      <v-card class="pa-2 d-flex flex-column align-center justify-center pl-0 pr-0" elevation="0">
        <v-form
          :key="`offline-${form.id}`"
          ref="form"
          v-model="valid"
          lazy-validation
          style="width: 95%"
        >
          <v-row>
            <v-col cols="12" md="12" xs="12" sm="12" lg="12" v-if="['TECNICO_SIE_DEPARTAMENTAL', 'TECNICO_SIE_DISTRITO'].includes(this.$storage.get('rol').rol)">
              <v-select v-model="idUnidadEducativaSubida"
                item-value="id" :items="unidadesEducativas" attach outlined label="Unidad Educativa"
                :rules="$validate(['required'])">
                <template v-slot:prepend-item>
                  <v-list-item>
                    <v-list-item-content>
                      <v-text-field
                        v-model="searchTermUnidadEducativa"
                        placeholder="Buscar Unidad Educativa"
                        @input="cargarUnidadesEducativas"></v-text-field>W
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider class="mt-2"></v-divider>
                </template>
                <template slot="selection" slot-scope="data">
                  {{ data.item.nombre }} - {{ data.item.codigoSie }}
                </template>
                <template slot="item" slot-scope="data">
                  {{ data.item.nombre }} - {{ data.item.codigoSie }}
                </template>
              </v-select>
            </v-col>
            <v-col cols="12" md="12" xs="12" sm="12" lg="12">
              <uploader
                :options="options"
                :fileStatusText="fileStatusText"
                :autoStart="false"
                :attrs="attrs"
                :key="new Date().toISOString()" class="mb-3">
                <uploader-unsupport></uploader-unsupport>
                  <uploader-drop class="d-flex flex-column align-center jsutify-center">
                    <p>Arraste y suelte aqui los archivos que va a subir</p>
                    <section class="border--separator-files"/>
                    <div class="letter">O</div>
                    <uploader-btn>Buscar archivos</uploader-btn>
                  </uploader-drop>
                  <uploader-list></uploader-list>
              </uploader>
            </v-col>
          </v-row>
        </v-form>
      </v-card>
    </app-dialog>

    <app-dialog :dialog.sync="modalDescargarPruebas"
      titulo="Descargar exámenes offline"
      @open-dialog="modalDescargarPruebas = true;"
      @close-dialog="modalDescargarPruebas = false; closeModalDescarga();"
      :opciones-desactivadas="opcionesDesactivadas"
      textoEjecutar="Descargar"
      :mostrar-acciones="false"
      icono="download"
    >
      <v-card class="pa-2 d-flex flex-column align-center justify-center pl-0 pr-0" elevation="0">
        <v-container>
          <v-row>
            <v-col cols="12" md="12" xs="12" sm="12" lg="12">
              <v-input-select
                @value="e => idOlimpiadaDescarga = e"
                color="primary"
                :init="idOlimpiadaDescarga"
                item-color="primary"
                disabled
                label="Olimpiada"
                :items="aOlimpiadas"
                item-value="id"
                item-text="nombre"
                outlined
                attach
                hide-details
                v-model="idOlimpiadaDescarga"
                :rules="$validate(['required'])"
              >
              </v-input-select>
            </v-col>
            <v-col cols="12" md="12" xs="12" sm="12" lg="12" v-if="['TECNICO_SIE_DEPARTAMENTAL', 'TECNICO_SIE_DISTRITO'].includes(this.$storage.get('rol').rol)">
              <v-select v-model="idUnidadEducativaDescarga"
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
                <template slot="selection" slot-scope="data">
                  {{ data.item.nombre }} - {{ data.item.codigoSie }}
                </template>
                <template slot="item" slot-scope="data">
                  {{ data.item.nombre }} - {{ data.item.codigoSie }}
                </template>
              </v-select>
            </v-col>
            <v-col cols="12" md="12" xs="12" sm="12" lg="12">
              <v-btn
                class="ma-2"
                :loading="loadingDescarga"
                :disabled="!idOlimpiadaDescarga || !idUnidadEducativaDescarga"
                color="success"
                @click="solicitarDescargarArchivo()"
                v-if="!urlDescargaEmpaquetado"
              >
                {{ descargaExeMsg }}
                <template v-slot:loader>
                  {{ loadingDescargaMsg }}
                  <span class="custom-loader">
                    <v-icon light>cached</v-icon>
                  </span>
                </template>
              </v-btn>
              <v-btn
                class="ma-2"
                outlined
                :disabled="!idOlimpiadaDescarga || !idUnidadEducativaDescarga"
                :href="urlDescargaEmpaquetado"
                download
                v-else>
                  DESCARGAR
                  <v-icon
                    right
                    dark
                  >
                    download
                  </v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </app-dialog>
    <crud-table
      v-if="showCrudTable"
      :headers="headers"
      :url-inicial="url"
      :widthModal="500"
      :order="order"
      :show-filter-init="true"
      :filters-inicial="filters"
      :custom="true"
      :filtro-as-query="false"
      :omitir-carga-on-mounted="true"
      >
      <template slot="buttons">
        <v-tooltip bottom color="primary">
          <template v-slot:activator="{ on }">
            <v-btn icon :small="['xs', 'sm'].includes($vuetify.breakpoint.name)" @click.native="oModalUpload"
              class="primary--text btn-filter" v-on="on">
              <v-icon-component icon="upload" color="primary"/>
            </v-btn>
          </template>
          <span> Subir resultados </span>
        </v-tooltip>
        <v-tooltip bottom color="primary">
          <template v-slot:activator="{ on }">
            <v-btn icon :small="['xs', 'sm'].includes($vuetify.breakpoint.name)" @click.native="oModalDownload"
              class="primary--text btn-filter" v-on="on">
              <v-icon-component icon="download" color="primary"/>
            </v-btn>
          </template>
          <span> Descargar pruebas offline </span>
        </v-tooltip>
      </template>
      <template slot="items" slot-scope="items">
        <tr>
          <td>{{ items.items.inscripcion.unidadEducativa.nombre }}</td>
          <td>{{ items.items.inscripcion.unidadEducativa.codigoSie }}</td>
          <td>
            {{ items.items.inscripcion.estudiante.persona.nombres }}
            {{ items.items.inscripcion.estudiante.persona.primerApellido }}
            {{ items.items.inscripcion.estudiante.persona.segundoApellido }}
          </td>
          <td>{{ items.items.inscripcion.estudiante.rude }}</td>
          <td>{{ items.items.inscripcion.etapaAreaGrado.area.nombre }}</td>
          <td>{{ items.items.inscripcion.etapaAreaGrado.gradoEscolar.nombre }}</td>
          <td>{{ items.items.fechaInicio }}</td>
          <td>
            <v-btn outlined :color="items.items.estado === 'ACTIVO' ? 'info' : 'color1'">{{
                items.items.estado
              }}
            </v-btn>
          </td>
        </tr>
      </template>
    </crud-table>
  </v-card>
</template>
<script>

import { Uploader, UploaderBtn, UploaderDrop, UploaderList, UploaderUnsupport } from 'vue-simple-uploader';
import { $Casbin } from '@/plugins/casbin';
import validate from '@/common/mixins/validate';
import CrudTable from '@/plugins/crud-table/CrudTable.vue';
import actions from '@/plugins/crud-table/mixins/crud-table';
import AppDialog from '@/plugins/modal/AppDialog.vue';
import vIconComponent from '../../plugins/icon/index.vue';

export default {
  mixins: [actions, validate],
  data: () => ({
    valid: false,
    showCrudTable: null,
    url: 'examenesAdministracion/offline',
    order: ['createdAt', 'DESC'],
    headers: [
      {
        text: 'Unidad Educativa',
        sortable: false,
        align: 'center',
        value: 'unidadEducativa'
      },
      {
        text: 'SIE',
        sortable: false,
        align: 'center',
        value: 'sie'
      },
      {
        text: 'Nombres y apellidos',
        sortable: false,
        align: 'center',
        value: 'nombres'
      },
      {
        text: 'RUDE',
        sortable: false,
        align: 'center',
        value: 'rude'
      },
      {
        text: 'Área',
        divider: false,
        sortable: false,
        align: 'center',
        value: 'area'
      },
      {
        text: 'Año de escolaridad',
        divider: false,
        sortable: false,
        align: 'center',
        value: 'grado'
      },
      {
        text: 'Fecha de carga',
        divider: false,
        sortable: false,
        align: 'center',
        value: 'fecha'
      },
      {
        text: 'Estado de carga',
        divider: false,
        sortable: false,
        align: 'center',
        value: 'estado'
      }
    ],
    form: {
      id: null,
      nombre: null,
      codigo: null,
      idDepartamento: null,
    },
    headersDescarga: [
      {
        text: 'Fecha',
        sortable: false,
        align: 'center',
        value: 'fecha'
      },
      {
        text: 'Estado',
        sortable: false,
        align: 'center',
        value: 'estado'
      },
    ],
    options: {},
    fileStatusText: {},
    attrs: {
      accept: '*'
    },
    idUnidadEducativaDescarga: null,
    btnAgregar: true,
    btnEditar: true,
    btnEliminar: true,
    departamentos: [],
    modalSubidaArchivo: false,
    modalSubirResultados: false,
    modalDescargarPruebas: false,
    unidadesEducativas: [],
    searchTermUnidadEducativa: null,
    opcionesDesactivadas: true,
    idUnidadEducativaSubida: null,
    idOlimpiadaDescarga: null,
    mFile: null,
    aOlimpiadas: [],
    loadingDescargaMsg: 'Verificando',
    loadingDescarga: false,
    descargaExeMsg: 'Solicitar archivo .exe',
    archivoDescargaEncontrado: false,
    urlDescargaEmpaquetado: null,
    refreshIntervalId: null,
    idDescarga: null,
    nombreArchivoEjecutable: null,
    nivelUsuario: [],
    aDepartamentos: [],
    aDistritos: [],
    customizedFilters: [],
    departamentoSeleccionado: null,
    distritoSeleccionado: null,
    existOlimpiada: null,
    existUnidadEducativa: null
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
    this.$nextTick(async () => {
      const nivel = await this.$service.get('usuarios/roles');
      this.nivelUsuario = nivel.datos.nivel;
      const respuesta = await this.$service.get('olimpiadas?limite=50&pagina=1');
      this.aOlimpiadas = respuesta.datos.filas;
      const departamentos = await this.$service.get('departamentos');
      this.aDepartamentos = departamentos.datos;
      this.fileStatusText = {
        success: 'Se subio',
        error: 'error',
        uploading: 'Subiendo...',
        paused: 'Listo para subir',
        waiting: 'esperando...'
      };
      this.options = {
        target: `${this.$baseServer}/examenesOffline/pruebas`,
        method: 'PATCH',
        headers: {
          Authorization: `${this.$authToken} ${this.$storage.get('token')}`
        },
        uploadMethod: 'PATCH',
        testChunks: false
      };
      const keyNiveles = Object.entries(this.nivelUsuario[0]);
      for (const [key, value] of keyNiveles) {
        if (key === 'idOlimpiada') this.existOlimpiada = true;
        if (key === 'idDepartamento') this.departamentoSeleccionado = this.aDepartamentos.find(dep => dep.id === value).id;
        if (key === 'idUnidadEducativa') this.existUnidadEducativa = true;
      }
      if (this.departamentoSeleccionado) {
        const distritos = await this.$service.get(`distritos?filtro=idDepartamento:${this.departamentoSeleccionado ?? ''}`);
        this.aDistritos = distritos && distritos.datos && distritos.datos.filas ? distritos.datos.filas : [];
        this.distritoSeleccionado = this.aDistritos.length > 0 ? this.aDistritos[0].id : null;
      }
      this.filters = this.definirFiltros();
      this.showCrudTable = true;
      setTimeout(() => {
        this.updateList();
      }, 100);
    });
    this.loadParams();
    if (['TECNICO_SIE_DEPARTAMENTAL', 'TECNICO_SIE_DISTRITO'].includes(this.$storage.get('rol').rol)) {
      this.$message.success('Seleccione una unidad educativa');
    }
    this.eliminarSetInterval();
  },
  computed: {
    formData() {
      const formData = new FormData();
      formData.append('archivo', this.mFile);
      return formData;
    },
    configSubidaArchivo() {
      return {
        method: 'PATCH',
        data: this.formData,
        url: this.$baseServer + (this.$storage.get('rol').rol === 'TECNICO_SIE'
          ? `examenesOffline/unidadEducativa/${this.idUnidadEducativaSubida}/pruebas`
          : 'examenesOffline/pruebas'),
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `${this.$authToken} ${this.$storage.get('token')}`
        },
      };
    }
  },
  methods: {
    definirFiltros() {
      this.customizedFilters = [];

      if (this.existOlimpiada) {
        this.customizedFilters.push({
          field: 'idOlimpiada',
          type: 'array',
          init: this.$storage.get('olimpiadaSeleccionada').id,
          multiple: false,
          label: 'Olimpiadas',
          values: this.aOlimpiadas.map(olimpiada => ({
            text: olimpiada.nombre,
            value: olimpiada.id
          })),
        });
      }

      if (this.existUnidadEducativa) {
        this.customizedFilters.push({
          field: 'unidadEducativa',
          type: 'text',
          label: 'Unidad Educativa',
        });
      }

      this.customizedFilters.push({
        field: 'rude',
        type: 'text',
        label: 'RUDE',
      });

      if (this.departamentoSeleccionado) {
        this.customizedFilters.push({
          field: 'idDepartamento',
          type: 'array',
          multiple: false,
          init: this.departamentoSeleccionado,
          eventName: 'cambioDepartamento',
          onChange: this.handleChangeDep,
          disabled: this.$storage.get('rol').rol === 'TECNICO_SIE_DEPARTAMENTAL',
          label: 'Departamentos',
          values: this.aDepartamentos.map(departamento => ({
            text: departamento.nombre,
            value: departamento.id
          })),
        },
        {
          field: 'idDistrito',
          type: 'array',
          multiple: false,
          init: this.distritoSeleccionado,
          label: 'Distritos',
          values: this.aDistritos.map(departamento => ({
            text: departamento.nombre,
            value: departamento.id
          })),
        });
      }
      return this.customizedFilters;
    },
    async handleChangeDep (idDepartamento) {
      await this.loadDistritos(idDepartamento);
    },
    async loadDistritos(idDepartamento) {
      try {
        this.departamentoSeleccionado = idDepartamento;
        const distritos = await this.$service.get(`distritos?filtro=idDepartamento:${this.departamentoSeleccionado ?? ''}`);
        this.aDistritos = distritos && distritos.datos && distritos.datos.filas ? distritos.datos.filas : [];
        this.distritoSeleccionado = this.aDistritos.length > 0 ? this.aDistritos[0].id : null;
        this.$root.$refs.CrudTable.cargarFiltro(this.definirFiltros());
      } catch (error) {
        this.$message.error(error.message);
      }
    },
    async loadParams() {
      const resultado = await this.$service.get('departamentos');
      if (resultado && resultado.isOK) this.departamentos = resultado && resultado.datos ? resultado.datos : [];
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
        idDepartamento: null,
      };
      this.opcionesDesactivadas = true;
      this.searchTermUnidadEducativa = null;
      this.unidadesEducativas = [];
      this.mFile = null;
      this.idUnidadEducativaSubida = null;
      this.idOlimpiadaDescarga = null;
      this.idUnidadEducativaDescarga = null;
      this.unidadesEducativas = [];
      this.loadingDescargaMsg = 'Verificando';
      this.loadingDescarga = false;
      this.descargaExeMsg = 'Solicitar archivo .exe';
      this.archivoDescargaEncontrado = false;
      this.urlDescargaEmpaquetado = null;
      this.eliminarSetInterval();
      this.refreshIntervalId = null;
      this.idDescarga = null;
    },

    closeModal() {
      this.modalSubidaArchivo = false;
      this.reset();
    },
    closeModalDescarga() {
      this.modalDescargarPruebas = false;
      this.reset();
    },
    async oModal({ items }) {
      if (items && items.id) {
        this.form = { ...items };
        this.form.idDepartamento = items.departamento.id;
      } else {
        this.reset();
      }
      this.modalSubidaArchivo = true;
    },
    async oModalUpload() {
      this.modalSubirResultados = true;
      this.cargarUnidadesEducativas();
      this.reset();
    },
    async oModalDownload() {
      this.modalDescargarPruebas = true;
      this.cargarUnidadesEducativas();
      this.reset();
      this.idOlimpiadaDescarga = this.$storage.get('olimpiadaSeleccionada').id;
    },
    async cargarUnidadesEducativas() {
      await this.$service.get(`unidades-educativas?filtro=nombre:${this.searchTermUnidadEducativa ?? ''}`)
        .then((resultado) => {
          this.unidadesEducativas = resultado && resultado.datos && resultado.datos.filas ? resultado.datos.filas : [];
        });
    },
    selectFile() {
      this.msgError = null;
    },
    async subir() {
      if (this.$refs.form.validate()) {
        const response = await this.$service.requestWithConfig(this.configSubidaArchivo);
        if (response.isOK) {
          this.$message.success('El archivo subido correctamente');
          this.modalSubirResultados = false;
          this.closeModal();
          this.reset();
        }
      } else {
        this.$message.error('Complete los campos obligatorios');
      }
    },
    async descargarPruebaOffline(idArchivoDescarga) {
      const response = await this.$service.post(`examenesOffline/olimpiada/${this.idOlimpiadaDescarga}/unidadEducativa/${this.idUnidadEducativaDescarga}/empaquetados/${idArchivoDescarga}`);
      if (response.finalizado) {
        this.closeModal();
        this.reset();
      } else {
        this.$message.error(response.mensaje || 'Complete los campos obligatorios');
      }
    },
    async solicitarDescargarArchivo() {
      if (!this.idUnidadEducativaDescarga || !this.idOlimpiadaDescarga) {
        this.$message.error('Faltan algunos campos por completar para iniciar la descarga');
        return;
      }
      this.loadingDescarga = true;
      this.loadingDescargaMsg = 'Generando archivo';
      const urlListadoYCreacion = `examenesOffline/olimpiada/${this.idOlimpiadaDescarga}/unidadEducativa/${this.idUnidadEducativaDescarga}/empaquetados`;
      const response = await this.$service.get(urlListadoYCreacion);
      if (response.datos && response.datos.total === 0) {
        const responseGeneracion = await this.$service.post(urlListadoYCreacion);
        if (responseGeneracion.finalizado && responseGeneracion.datos && ['PROCESANDO', 'CREADO'].includes(responseGeneracion.datos.estado)) {
          this.idDescarga = responseGeneracion.datos.id;
          this.configurarSetIntervalUrlDescarga(urlListadoYCreacion);
        } else {
          console.log('No se puede generar, error');
        }
      } else if (response.finalizado && response.datos && response.datos.filas && response.datos.filas.length > 0) {
        this.idDescarga = response.datos.filas[0].id;
        if (response.datos.filas[0].estado === 'FINALIZADO') {
          this.obtenerUrlDescarga();
          this.eliminarSetInterval();
        } else if (response.datos.filas[0].estado === 'PROCESANDO') {
          this.configurarSetIntervalUrlDescarga(urlListadoYCreacion);
        }
      } else {
        this.$message.warning('La respuesta no es válida, intente mas tarde');
      }
    },
    async configurarSetIntervalUrlDescarga() {
      const refreshIntervalId = setInterval(async () => {
        this.obtenerUrlDescarga();
      }, 10000);
      this.$store.commit('setIdSetInterval', refreshIntervalId);
    },
    async obtenerUrlDescarga() {
      const urlDescarga = `examenesOffline/olimpiada/${this.idOlimpiadaDescarga}/unidadEducativa/${this.idUnidadEducativaDescarga}/empaquetados/${this.idDescarga}`;
      const response = await this.$service.get(urlDescarga);
      if (response.datos.estado === 'FINALIZADO') {
        this.descargarEmpaquetado();
        return;
      }
      if (response.datos.estado !== 'PROCESANDO') {
        this.$message.error(response.mensaje || 'Ocurriò un error al obtener el archivo de descarga');
        this.eliminarSetInterval();
        this.closeModalDescarga();
      }
    },
    eliminarSetInterval() {
      if (this.$store.state.idSetInterval) {
        clearInterval(this.$store.state.idSetInterval);
        this.$store.commit('setIdSetInterval', null);
      }
    },
    async descargarEmpaquetado() {
      const urlDescarga = `${this.$baseServer}examenesOffline/olimpiada/${this.idOlimpiadaDescarga}/unidadEducativa/${this.idUnidadEducativaDescarga}/empaquetados/${this.idDescarga}`;
      await this.$service.requestWithConfig({
        method: 'POST',
        url: urlDescarga,
        headers: {
          Authorization: `${this.$authToken} ${this.$storage.get('token')}`
        },
        responseType: 'blob'
      })
        .then((resultado) => {
          if (resultado?.isOK) {
            const url = URL.createObjectURL(new Blob([resultado], {
            }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', this.nombreArchivoEjecutable);
            document.body.appendChild(link);
            link.click();
            this.closeModalDescarga();
          } else {
            this.$message.error('No se pudo descargar el archivo');
            console.log('Error al descargar archivo > ', resultado);
          }
        });
    }
  },
  watch: {
    'idUnidadEducativaDescarga'(newValue) {
      if (newValue && this.idOlimpiadaDescarga) {
        this.opcionesDesactivadas = false;
        for (const unidadEducativa of this.unidadesEducativas) {
          if (unidadEducativa.id === newValue) {
            this.nombreArchivoEjecutable = `${unidadEducativa.nombre}_${unidadEducativa.id}.exe`;
            break;
          }
        }
      }
    },
    'idOlimpiadaDescarga'(newValue) {
      if (this.$storage.get('rol').rol === 'DIRECTOR') {
        this.idUnidadEducativaDescarga = '00000000-0000-4000-0000-000000000000';
        this.nombreArchivoEjecutable = 'PruebaOfflineOlimpiadasEstudiantiles.exe';
      }
      if (newValue && this.idUnidadEducativaDescarga) {
        this.opcionesDesactivadas = false;
      }
    },
    'form.fechaInicio'(newValue) {
      this.minFechaFin = newValue;
    },
    'form.fechaFin'(newValue) {
      this.maxFechaInicio = newValue;
    },
    'urlDescargaEmpaquetado'(newValue) {
      if (newValue === true) {
        if (this.$store.state.idSetInterval) {
          clearInterval(this.$store.state.idSetInterval);
          this.$store.commit('setIdSetInterval', null);
        }
      }
    }
  },
  components: {
    CrudTable,
    AppDialog,
    Uploader,
    UploaderBtn,
    UploaderDrop,
    UploaderList,
    UploaderUnsupport,
    vIconComponent,
  }
};
</script>
<style lang="scss">
  @import '../../scss/variables.scss';
  .custom-loader {
    animation: loader 1s infinite;
    display: flex;
  }
  .uploader {
    width: 100%;
    .uploader-drop {
      background: transparent;
    }
    .uploader-btn {
      color: $fontColor;
    }
    .uploader-file-info {
      color: $fontColor;
    }
    .uploader-list ul li{
      color: $black;
    }
  }
  .border--separator-files {
    width: 73%;
    margin: auto;
    border-bottom: 1px solid $fontColor;
    margin-bottom: 20px;
    opacity: .2;
  }
  .letter {
    width: 20px;
    background: $backgroundColor;
    user-select: none;
    opacity: .2;
    margin-top: -30px;
  }
  @-moz-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-webkit-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-o-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
