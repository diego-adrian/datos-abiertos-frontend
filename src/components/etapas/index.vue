<template>
  <v-card elevation="0">
    <!-- SLOT PARA EL FORMULARIO -->
    <app-dialog
        :dialog.sync="modalEtapa"
        :titulo="form.id ? 'Editar etapa' : 'Adicionar etapa'"
        @open-dialog="modalEtapa = true;"
        @close-dialog="modalEtapa = false;"
        @accion="save"
    >
      <template v-if="modalEtapa">
        <!-- FORMULARIO PARA AGREGAR O EDITAR -->
        <v-form :key="`etapa-${form.id}`" ref="form" v-model="valid" lazy-validation @submit.prevent="save">
          <v-card elevation="0">
            <v-container fluid>
              <v-row>
                <v-col>
                  <v-input-text-field
                    class="pa-3"
                    :show-field="false"
                    label="Olimpiadas"
                    :width="300"
                    dense
                  >
                    <template slot="contenido">
                      <v-select
                        color="primary"
                        required
                        readonly
                        item-color="primary"
                        v-model="form.idOlimpiada"
                        :items="olimpiadas"
                        item-text="nombre"
                        item-value="id"
                        outlined
                        dense
                        @change="actualizarFechaLimiteOlimpiada(form.idOlimpiada)"
                        hide-details
                        :rules="$validate(['required'])"
                      ></v-select>
                    </template>
                  </v-input-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col v-if="form.idOlimpiada != null && form.minFechaOlimpiada != null">
                    <span class="font-weight-medium grey--text pa-4">
                      Del {{this.form.minFechaOlimpiada}} al {{this.form.maxFechaOlimpiada }}
                    </span>
                  </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-col cols="12" md="12" xs="12" sm="12" lg="12">
                    <v-input-text-field
                        @value="e => form.nombre = e"
                        :init="form.nombre"
                        v-model="form.nombre"
                        label="Nombre de la etapa"
                        required
                        full-width
                        :clearable="false"
                        dense
                        :rules="$validate(['required'])"
                    />
                  </v-col>
                </v-col>
              </v-row>
              <v-row class="ml-2 mr-2">
                <v-col cols="12" md="6" xs="6" sm="6" lg="6">
                  <v-input-text-field
                      :show-field="false"
                      label="Tipo de etapa"
                      dense
                  >
                    <template slot="contenido">
                      <v-select
                        :disabled="form.idOlimpiada == null"
                        v-model="form.tipo"
                        :items="enumtipoEtapa"
                        :rules="$validate(['required'])"
                        outlined
                        dense
                        hide-details
                      ></v-select>
                    </template>
                  </v-input-text-field>
                </v-col>
                <v-col cols="12" md="6" xs="6" sm="6" lg="6">
                  <v-switch
                      inset
                      :disabled="form.idOlimpiada == null"
                      v-model="form.comiteDesempate"
                      label="Comité de desempate"
                  ></v-switch>
                </v-col>
              </v-row>
              <v-row class="ml-2 mr-2" v-if="modalEtapa">
                <v-col cols="12" lg="6" md="6" sm="12" xs="12">
                  <v-input-text-field
                      :show-field="false"
                      label="Fecha Inicio"
                  >
                    <template slot="contenido">
                      <date-input
                          :disabled="form.idOlimpiada == null"
                          v-model="form.fechaInicio"
                          :fecha="form.fechaInicio"
                          :tabIndex="5"
                          :min-date="form.minFechaOlimpiada"
                          :max-date="form.maxFechaOlimpiada"
                          required
                          :readonly="form.id!=null"
                          @value="obtenerFechaInicio"
                      ></date-input>
                    </template>
                  </v-input-text-field>
                </v-col>
                <v-col cols="12" lg="6" md="6" sm="12" xs="12">
                  <v-input-text-field
                      :show-field="false"
                      label="Fecha Fin"
                  >
                    <template slot="contenido">
                      <date-input
                          :disabled="form.idOlimpiada == null"
                          v-model="form.fechaFin"
                          :fecha="form.fechaFin"
                          :tabIndex="5"
                          :min-date="this.formatFechaValidar(form.fechaInicio, 'DD-MM-YYYY', 'YYYY-MM-DD')"
                          :max-date="this.formatFechaValidar(form.maxFechaOlimpiada, 'DD-MM-YYYY', 'YYYY-MM-DD')"
                          required
                          :readonly="form.id!=null"
                          @value="obtenerFechaFin"
                      ></date-input>
                    </template>
                  </v-input-text-field>
                </v-col>
                <v-col cols="12" lg="6" md="6" sm="12" xs="12">
                  <v-input-text-field
                      :show-field="false"
                      label="Fecha Inicio Impugnación"
                  >
                    <template slot="contenido">
                      <date-input
                          v-model="form.fechaInicioImpugnacion"
                          :fecha="form.fechaInicioImpugnacion"
                          :tabIndex="5"
                          :disabled="form.fechaFin == null"
                          :min-date="this.formatFechaValidar(form.fechaFin, 'DD-MM-YYYY', 'YYYY-MM-DD')"
                          :max-date="this.formatFechaValidar(form.maxFechaOlimpiada, 'DD-MM-YYYY', 'YYYY-MM-DD')"
                          required
                          :readonly="form.id!=null"
                          @value="obtenerFechaInicioImpugnacion"
                      ></date-input>
                    </template>
                  </v-input-text-field>
                </v-col>
                <v-col cols="12" lg="6" md="6" sm="12" xs="12">
                  <v-input-text-field
                      :show-field="false"
                      label="Fecha Fin Impugnación"
                  >
                    <template slot="contenido">
                      <date-input
                          v-model="form.fechaFinImpugnacion"
                          :fecha="form.fechaFinImpugnacion"
                          :tabIndex="5"
                          :disabled="form.fechaInicioImpugnacion == null"
                          :min-date="this.formatFechaValidar(form.fechaInicioImpugnacion, 'DD-MM-YYYY', 'YYYY-MM-DD')"
                          :max-date="this.formatFechaValidar(form.maxFechaOlimpiada, 'DD-MM-YYYY', 'YYYY-MM-DD')"
                          required
                          :readonly="form.id!=null"
                          @value="obtenerFechaFinImpugnacion"
                      ></date-input>
                    </template>
                  </v-input-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-form>
      </template>
    </app-dialog>
    <crud-table
        v-if="showCrudTable"
        description="Etapas"
        :headers="headers"
        :filters-inicial="filters"
        :url-inicial="obtenerRuta()"
        :widthModal="500"
        :show-filter-init="true"
        :order="order"
        :custom="true"
        :show-filter-options="false"
        :omitir-carga-on-mounted="true"
    >
      <template slot="buttons">
        <v-icon-tooltip id="addStage" color="primary" icon="add" text="Agregar etapa" v-if="btnAgregar"
                        @accion="oModal({})"/>
      </template>

      <template slot="items" slot-scope="items">
        <tr v-if="items.items.id === idSelected"
            :style="$vuetify.theme.dark ? 'background: #00516D' : 'background: #dbe9f5'">
          <td colspan="11" class="pa-0 ma-0"
              style="height: 30px !important; min-height: 30px !important; border-bottom: none">
            <v-alert
                text
                width="100%"
                dense
                elevation="0"
                color="info"
            >
              <v-card
                  elevation="0"
                  color="transparent"
                  class="fs8 primary--text pt-1 pb-1"
              >Esta etapa se encuentra seleccionada para crear o seleccionar áreas
              </v-card>
            </v-alert>
          </td>
        </tr>
        <tr :class="items.items.id === idSelected ? `${$vuetify.theme.dark ? 'dark-is-selected' : 'light-is-selected'}` : ''">
          <td>{{ items.items.nombre }}</td>
          <td>{{ items.items.tipo }}</td>
          <td>
            <v-icon-tooltip
                color="color1"
                icon="event"
                text="Periodo"
            />
            {{ formatFecha(items.items.fechaInicio) }} - {{ formatFecha(items.items.fechaFin) }}<br>
            <v-icon-tooltip
                color="color1"
                icon="event"
                text="Periodo inpugnación"
            />
            {{ formatFecha(items.items.fechaInicioImpugnacion) }} - {{ formatFecha(items.items.fechaFinImpugnacion) }}
          </td>
          <td>
            <v-icon-tooltip
                color="color1"
                icon="emoji_events"
                text="Olimpiada"
            />
            {{ items.items.olimpiada ? items.items.olimpiada.nombre : '' }}<br>
            <v-icon-tooltip
                color="color1"
                :icon="`${items.items.jerarquia === 1 ? 'looks_one' : items.items.jerarquia === 2 ? 'looks_two' : items.items.jerarquia === 3 ? 'looks_3' : items.items.jerarquia === 3|4|5|6 ? `looks_${items.items.jerarquia}`:'info'}`"
                text="Jerarquía"
            />
            Jerarquía<br>
            <v-icon-tooltip :color=" items.items.comiteDesempate ? 'success' : 'error'"
                            :icon=" items.items.comiteDesempate ? 'check_circle' : 'cancel'"
                            :text=" items.items.comiteDesempate ? 'Habra un comité de desempate' : 'No habra un comité de desempate'"
                            v-if="btnEditar"
                            @accion="oModal(items)"/>
            Comité Desempate
            <br>
          </td>
          <td>
            <v-btn outlined :color="items.items.estado === 'ACTIVO' ? 'info' : 'color1'">{{
                items.items.estadoDescripcion
              }}
            </v-btn>
          </td>
          <td>
            <v-btn outlined :color="items.items.estadoSorteoPreguntas === 'FINALIZADO' ? 'success' : 'info'">{{
                items.items.estadoSorteoPreguntas
              }}
            </v-btn>
          </td>
          <td>
            <v-icon-tooltip
              color="primary"
              icon="skip_next"
              text="Actualizar estado"
              v-if="btnEditar"
              @accion="actualizarEstado(items)"
            />
<!--            <v-icon-tooltip color="info" icon="toggle_on" text="Inactivar"
                            v-if="btnEditar && (items.items.estado === 'ACTIVO')" @accion="inactivar(items.items)"/>

            <v-icon-tooltip color="error" icon="toggle_off" text="Activar"
                            v-if="btnEditar && (items.items.estado === 'INACTIVO')" @accion="activar(items.items)"/>-->

            <v-icon-tooltip color="success" icon="edit" text="Editar registro" v-if="btnEditar"
                            @accion="oModal(items)"/>

            <v-icon-tooltip color="error" icon="delete" text="Eliminar registro" v-if="btnEliminar"
                            @accion="itemDelete(items)"/>

          </td>
        </tr>
      </template>
    </crud-table>
    <v-card elevation="0" class="progress--status" v-if="message">
      <v-card elevation="0" class="cards fs8" :class="$vuetify.theme.dark ? 'black--text' : 'white--text'">
        <v-icon-component icon="local_shipping" :size="45"></v-icon-component>
        <v-icon-component icon="done" :size="25"></v-icon-component>
        Se cambio al estado satisfactoriamente
      </v-card>
      <v-card elevation="0" class="cards fs8 info--text">
        <v-progress-circular indeterminate class="mr-3" color="info"/>
        Este proceso puede durar varios minutos, revise el estado del registro para verificar si finalizo con exito
      </v-card>
    </v-card>
  </v-card>
</template>
<script>

import { $Casbin } from '@/plugins/casbin';
import validate from '@/common/mixins/validate';
import CrudTable from '@/plugins/crud-table/CrudTable.vue';
import actions from '@/plugins/crud-table/mixins/crud-table';
import DateInput from '@/plugins/date-input/DateInput.vue';
import moment from 'dayjs';

import vIconComponent from '@/plugins/icon/index.vue';
import Auth from '@/components/auth/mixins/auth';

export default {
  mixins: [actions, validate, Auth],
  data: () => ({
    valid: false,
    url: null,
    parametros: null,
    order: ['createdAt', 'DESC'],
    headers: [
      {
        text: 'Nombre',
        sortable: false,
        align: 'center',
        value: 'nombre'
      },
      {
        text: 'Tipo',
        sortable: false,
        align: 'center',
        value: 'tipo'
      },
      {
        text: 'Periodos',
        sortable: false,
        align: 'center',
        value: 'fechaInicio'
      },
      {
        text: 'Información',
        sortable: false,
        align: 'center',
        value: 'informacion'
      },
      {
        text: 'Estado',
        sortable: false,
        align: 'center',
        value: 'estado'
      },
      {
        text: 'Estado sorteo de preguntas',
        sortable: false,
        align: 'center',
        value: 'estadoSorteoPreguntas'
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
      comiteDesempate: false,
      tipo: null,
      fechaInicio: null,
      minFechaOlimpiada: null,
      maxFechaOlimpiada: null,
      fechaFin: null,
      fechaInicioImpugnacion: null,
      fechaFinImpugnacion: null,
      idOlimpiada: null,
    },
    filters: [],
    message: null,
    idOlimpiadaSeleccionada: {
      type: String,
      default: null
    },
    enumtipoEtapa: [
      'DISTRITAL',
      'DEPARTAMENTAL',
      'NACIONAL',
    ],
    btnAgregar: true,
    btnEditar: true,
    btnEliminar: true,
    menufechaInicio: false,
    menufechaFin: false,
    menufechaInicioImpugnacion: false,
    menufechaFinImpugnacion: false,
    olimpiadas: [],
    modalEtapa: false,
    idSelected: null,
    olimpiadaSeleccionada: null,
    showCrudTable: false
  }),
  async mounted() {
    // Verificar permiso para crear
    if ($Casbin && $Casbin.enforcer) {
      const { rol } = this.$storage.get('rol');
      $Casbin.enforcer.enforce(rol, '/etapas', 'create')
        .then(permitido => {
          this.btnAgregar = permitido;
        });
      $Casbin.enforcer.enforce(rol, '/etapas', 'update')
        .then(permitido => {
          this.btnEditar = permitido;
        });
      $Casbin.enforcer.enforce(rol, '/etapas', 'delete')
        .then(permitido => {
          this.btnEliminar = permitido;
        });
    }

    this.olimpiadaSeleccionada = this.$storage.get('olimpiadaSeleccionada');
    if (this.olimpiadaSeleccionada !== null) {
      this.idOlimpiadaSeleccionada = this.olimpiadaSeleccionada.id;
    }

    this.url = 'etapas';

    await this.loadParams();
  },
  methods: {
    obtenerRuta() {
      console.log(`idOlimpiadaSeleccionada: ${JSON.stringify(this.idOlimpiadaSeleccionada)}`);
      return `olimpiadas/${this.idOlimpiadaSeleccionada}/etapas`;
    },
    cerrarPreguntas (id) {
      return new Promise(async (resolve, reject) => {
        try {
          const url = `etapa/${id}/preguntas/resumenEstados`;
          const data = await this.$service.get(url);
          resolve(data.datos);
        } catch (error) {
          reject(error);
        }
      });
    },
    generateResume (data) {
      return new Promise(async (resolve, reject) => {
        try {
          let html = `
            <table class='table--resume'>
              <tr>
                <td class='title'>Etapa</td>
                <td class='title'>Area</td>
                <td class='title'>Grado Escolar</td>
                <td class='title'>Estado</td>
                <td class='title'>Cantidad</td>
              </tr>
          `;
          data.filter(item => {
            html += `<tr><td>${item.etapa}</td>`;
            html += `<td>${item.area}</td>`;
            html += `<td>${item.gradoEscolar}</td>`;
            html += `<td>${item.estado}</td>`;
            html += `<td>${item.cantidad}</td></tr>`;
          });
          html += '<table/>';
          resolve(html);
        } catch (error) {
          reject(error);
        }
      });
    },
    actualizarOlimpiada(idOlimpiadaSeleccionadaNueva) {
      this.olimpiadaSeleccionada = this.olimpiadas.find(item => item.id === idOlimpiadaSeleccionadaNueva);
      this.idOlimpiadaSeleccionada = idOlimpiadaSeleccionadaNueva;
      if (this.olimpiadaSeleccionada != null) {
        this.$storage.set('olimpiadaSeleccionada', this.olimpiadaSeleccionada);
      }
      this.$root.$refs.CrudTable.updateUrl(this.obtenerRuta());
    },
    async loadParams() {
      await this.$service.get('olimpiadas?limite=50&pagina=1')
        .then((resultado) => {
          this.olimpiadas = resultado && resultado.datos && resultado.datos.filas ? resultado.datos.filas : [];

          this.filters = [
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
          ];
          this.showCrudTable = true;
          setTimeout(() => {
            this.updateList();
          }, 100);
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
        nombre: null,
        jerarquia: 0,
        comiteDesempate: false,
        tipo: null,
        minFechaOlimpiada: null,
        maxFechaOlimpiada: null,
        fechaInicio: null,
        fechaFin: null,
        fechaInicioImpugnacion: null,
        fechaFinImpugnacion: null,
        olimpiada: null
      };
    },
    formatFecha(dateOriginal, formato = 'DD/MM/YYYY') {
      return dateOriginal ? this.$datetime.format(formato, dateOriginal) : '';
    },
    async itemDelete({ items }) {
      // Verificar permiso para ejecutar esta funcion
      if ($Casbin && $Casbin.enforcer) {
        const { rol } = this.$storage.get('rol');
        const permitido = await $Casbin.enforcer.enforce(rol, '/etapas', 'delete');
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
            await this.getStages();
            this.$message.success('Registro eliminado satisfactoriamente');
          } else {
            this.$message.error(response.message ?? response.mensaje);
          }
        },
        () => {
        }
      );
    },
    async actualizarEstado({ items }) {
      // Verificar permiso para ejecutar esta funcion
      if ($Casbin && $Casbin.enforcer) {
        const { rol } = this.$storage.get('rol');
        const permitido = await $Casbin.enforcer.enforce(rol, '/etapas', 'delete');
        if (!permitido) {
          this.$message.warning('No tiene permisos');
          return;
        }
      }
      let message = '';
      if (items.estadoCambio === 'CIERRE_PREGUNTAS') {
        const datos = await this.cerrarPreguntas(items.id);
        const resumen = await this.generateResume(datos);
        message = `¿Está seguro de cambiar el estado de ${items.estado} a ${items.estadoCambio} de este registro? <br/> <br/>${resumen}`;
      } else {
        message = `¿Está seguro de cambiar el estado de ${items.estado} a ${items.estadoCambio} de este registro?`;
      }
      this.$confirm(
        message,
        async () => {
          if (items.estadoCambio === 'GENERACION_EXAMENES') {
            this.message = true;
            setTimeout(() => {
              this.message = false;
            }, 10000);
          }
          const data = { ...{ operacion: items.operacion, idOlimpiada: this.idOlimpiadaSeleccionada }, ...items };
          const response = await this.$service.patch(`${this.url}/${items.id}/estados`, data);
          if (response.isOK) {
            this.updateList();
            this.closeModal();
            this.$message.success('Etapa actualizada correctamente');
          } else {
            this.$message.error(response.message ?? response.mensaje);
          }
        },
        () => {
        },
        'ACEPTAR',
        'CANCELAR',
        items.estadoCambio === 'CIERRE_PREGUNTAS' ? 600 : 360
      );
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
    obtenerFechaInicio(val) {
      this.form.fechaInicio = val;
    },
    obtenerFechaFin(val) {
      this.form.fechaFin = val;
    },
    obtenerFechaInicioImpugnacion(val) {
      this.form.fechaInicioImpugnacion = val;
    },
    obtenerFechaFinImpugnacion(val) {
      this.form.fechaFinImpugnacion = val;
    },
    closeModal() {
      this.modalEtapa = false;
      this.reset();
    },
    actualizarFechaLimiteOlimpiada(idOlimpiada) {
      const olimpiadaSeleccionada = this.olimpiadas.find(item => item.id === idOlimpiada);
      this.form.minFechaOlimpiada = olimpiadaSeleccionada.fechaInicio;
      this.form.maxFechaOlimpiada = olimpiadaSeleccionada.fechaFin;
    },
    async oModal({ items }) {
      if (items && items.id) {
        this.form = { ...items };
        this.form.idOlimpiada = items.olimpiada.id;
        this.form.fechaInicio = this.formatFecha(items.fechaInicio, 'DD-MM-YYYY');
        this.form.fechaFin = this.formatFecha(items.fechaFin, 'DD-MM-YYYY');
        this.form.fechaInicioImpugnacion = this.formatFecha(items.fechaInicioImpugnacion, 'DD-MM-YYYY');
        this.form.fechaFinImpugnacion = this.formatFecha(items.fechaFinImpugnacion, 'DD-MM-YYYY');

        this.form.minFechaOlimpiada = items.olimpiada.fechaInicio;
        this.form.maxFechaOlimpiada = items.olimpiada.fechaFin;
      } else {
        this.reset();
        this.form.idOlimpiada = this.olimpiadaSeleccionada.id;
        this.form.minFechaOlimpiada = this.olimpiadaSeleccionada.fechaInicio;
        this.form.maxFechaOlimpiada = this.olimpiadaSeleccionada.fechaFin;
      }
      this.modalEtapa = true;
    },

    /**
     * @function save
     * @description Esta funcion esta creada para guardar en la BD
     * @author dbarra@agetic.gob.bo
     */
    async save() {
      if (this.$refs.form.validate()) {
        if (this.form.jerarquia) {
          delete this.form.jerarquia;
        }

        const data = { ...({}, this.form) };

        data.fechaInicio = this.formatFechaValidar(data.fechaInicio, 'DD-MM-YYYY', 'YYYY-MM-DD');
        data.fechaFin = this.formatFechaValidar(data.fechaFin, 'DD-MM-YYYY', 'YYYY-MM-DD');

        data.fechaInicioImpugnacion = this.formatFechaValidar(data.fechaInicioImpugnacion, 'DD-MM-YYYY', 'YYYY-MM-DD');
        data.fechaFinImpugnacion = this.formatFechaValidar(data.fechaFinImpugnacion, 'DD-MM-YYYY', 'YYYY-MM-DD');

        if (data.id) {
          const response = await this.$service.patch(`${this.url}/${data.id}`, data);
          if (response.isOK) {
            console.log(`response: ${response}`);
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
    DateInput,
    vIconComponent
  }
};
</script>
<style lang="scss">
@import '../../scss/variables.scss';
.dark-is-selected {
  background: #00516D !important;
}

.light-is-selected {
  background: #dbe9f5 !important;
}

.table--resume {
  width: 100%;
  .title {
    font-weight: bold;
    color: $primary;
    font-size: 13px !important;
    text-align: left;
    font-family: $body-font-family !important;
  }
  tr {
    td {
      border-bottom: 1px solid $fontColor;
      padding-top: 10px;
      padding-bottom: 10px;
    }
  }
}
.progress--status {
      position: fixed;
      bottom: 0;
      height: 70px;
      left: 0;
      right: 0;
      z-index: 9;
      display: flex;
      flex-direction: row;
      align-items: stretch;
      justify-content: center;
      .cards {
        width: 50%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        border: 1px solid $info;
        padding: 15px;
        &:first-child {
          border-right: none;
          background: $info !important;
          &::after {
            position: absolute;
            z-index: 2;
            content: "";
            top: 50%;
            right: 0;
            border: medium none;
            background-color: $info !important;
            width: 1.14285714em;
            height: 1.14285714em;
            border-style: solid;
            border-color: $info;
            border-width: 0 1px 1px 0;
            -webkit-transition: background-color 0.1s ease, opacity 0.1s ease,
              color 0.1s ease, -webkit-box-shadow 0.1s ease;
            transition: background-color 0.1s ease, opacity 0.1s ease,
              color 0.1s ease, -webkit-box-shadow 0.1s ease;
            transition: background-color 0.1s ease, opacity 0.1s ease,
              color 0.1s ease, box-shadow 0.1s ease;
            transition: background-color 0.1s ease, opacity 0.1s ease,
              color 0.1s ease, box-shadow 0.1s ease,
              -webkit-box-shadow 0.1s ease;
            -webkit-transform: translateY(-50%) translateX(50%) rotate(-45deg);
            transform: translateY(-50%) translateX(50%) rotate(-45deg);
          }
        }
      }
    }
</style>
