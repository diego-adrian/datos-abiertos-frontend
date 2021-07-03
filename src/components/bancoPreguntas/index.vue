<template>
  <v-card elevation="0">
    <app-dialog
        :dialog.sync="modalPreguntas"
        :titulo="form.id ? observed ? 'Revisando la pregunta antes de observar' : reviewingToApprove ? 'Revisando la pregunta antes de aprobar': 'Editar pregunta' : 'Adicionar pregunta'"
        @open-dialog="modalPreguntas = true; aOpciones = []; observed = null; state = null; reviewingToApprove = null"
        @close-dialog="modalPreguntas = false; aOpciones = []; observed = null; state = null; reviewingToApprove = null"
        :textoEjecutar="state === ESTADO_OBSERVADO ? 'Enviar al comite verificador' : reviewingToApprove ? 'Aprobar' : observed ? 'Observar y enviar al comite de carga' : form.id ? 'Guardar cambios' : 'Guardar pregunta creada'"
        btnActions="column"
        @accion="save"
        max-width="600px"
    >
      <template v-if="modalPreguntas">
        <!-- FORMULARIO PARA AGREGAR O EDITAR -->
        <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="save">
          <v-card elevation="0">
            <v-container fluid>
              <v-row>
                <v-col cols="12" class="pb-0">
                  <v-input-select
                    @value="e => form.tipoPregunta = e"
                    item-color="primary"
                    required
                    :init="form.tipoPregunta"
                    :autofocus="!form.id"
                    v-model="form.tipoPregunta"
                    label="Tipo de pregunta (*)"
                    color="primary"
                    :items="aTiposPreguntas"
                    item-text="label"
                    outlined
                    :disabled="observed || reviewingToApprove"
                    dense
                    item-value="value"
                    :rules="[(val) => !!val || 'No puede estar vacio']"
                  ></v-input-select>
                </v-col>
                <v-col cols="12" class="pb-0">
                  <v-input-select
                    @value="e => form.tipoRespuesta = e"
                    item-color="primary"
                    required
                    v-model="form.tipoRespuesta"
                    :init="form.tipoRespuesta"
                    label="Tipo de respuesta (*)"
                    color="primary"
                    :items="aTiposRespuestas"
                    :disabled="observed || reviewingToApprove"
                    item-text="label"
                    outlined
                    @change="handleChangeTipoRespuesta"
                    dense
                    item-value="value"
                    :rules="[(val) => !!val || 'No puede estar vacio']"
                  ></v-input-select>
                </v-col>
                <v-col cols="12" class="pb-0">
                  <v-input-select
                    @value="e => form.nivelDificultad = e"
                    item-color="primary"
                    required
                    v-model="form.nivelDificultad"
                    :init="form.nivelDificultad"
                    label="Nivel de dificultad (*)"
                    color="primary"
                    :items="aNivelDificultad"
                    item-text="label"
                    outlined
                    :disabled="observed || reviewingToApprove"
                    dense
                    item-value="value"
                    :rules="[(val) => !!val || 'No puede estar vacio']"
                  ></v-input-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" v-if="form.tipoRespuesta">
                  <v-radio-group
                    row
                    @change="handleChangeSelected"
                    :disabled="observed || reviewingToApprove"
                    :rules="[(val) => !!val || 'No puede estar vacio']"
                    v-model="form.preguntaImagen"
                    class="mradio">
                    <v-radio
                      color="primary"
                      label="Subir pregunta"
                      value="PREGUNTA"
                    ></v-radio>
                    <v-radio
                      color="primary"
                      label="Subir imagen"
                      value="IMAGEN"
                    ></v-radio>
                  </v-radio-group>
                </v-col>
                <v-col cols="12" class="pb-0" v-if="form.preguntaImagen === 'PREGUNTA'">
                  <v-input-textarea
                    @value="e => form.textoPregunta = e"
                    item-color="primary"
                    required
                    :rows="10"
                    v-model="form.textoPregunta"
                    :init="form.textoPregunta"
                    :disabled="observed || reviewingToApprove"
                    label="Pregunta (*)"
                    outlined
                    counter
                    dense
                    :rules="[
                      (val) => !!val || 'No puede estar vacio',
                      (val) => (val || '').length <= 1000 || 'La cantidad de caracteres supera lo establecido.'
                    ]"
                  ></v-input-textarea>
                </v-col>
                <v-col cols="12" class="pb-0" v-if="form.preguntaImagen === 'IMAGEN'">
                  <v-autocomplete
                    v-model="form.imagenPregunta"
                    :items="aImagenPregunta"
                    filled
                    :disabled="(form.textoPregunta || '').length > 0 || observed || reviewingToApprove"
                    color="primary"
                    label="Imagen"
                    item-text="descripcion"
                    item-value="url"
                    no-data-text="No hay imagenes que listar"
                  >
                    <template v-slot:selection="data">
                      <v-chip
                          v-bind="data.attrs"
                          :input-value="data.selected"
                          close
                          @click="data.select"
                          @click:close="remove(data.item)"
                      >
                        <v-avatar left>
                          <v-img :src="data.item.url"></v-img>
                        </v-avatar>
                        {{ data.item.descripcion }}
                      </v-chip>
                    </template>
                    <template v-slot:item="data">
                      <v-list-item-avatar>
                        <img :src="data.item.url"/>
                      </v-list-item-avatar>
                      <v-list-item-content>
                        <v-list-item-title
                            v-html="data.item.descripcion"
                        ></v-list-item-title>
                        <v-list-item-subtitle
                            v-html="data.item.codigo"
                        ></v-list-item-subtitle>
                      </v-list-item-content>
                    </template>
                  </v-autocomplete>
                </v-col>
                <v-col
                  cols="12" class="pb-0"
                  v-if="form.tipoRespuesta && form.tipoRespuesta !== FALSO_VERDADERO && form.preguntaImagen">
                  <v-col cols="12" class="pa-0">
                    <v-alert
                        type="info"
                        text
                        dense
                        class="fs8"
                        width="100%"
                    >
                      Las <strong>OPCIONES</strong> son el texto que normalmente tiene una pregunta, por ejemplo:<br/>
                      a) Es un texto para la primera opción <br/> b) Segunda opción <br/>
                      Para agregar mas opciones haga click en el icono <strong class="fs12">"+"</strong>
                    </v-alert>
                    <v-alert
                        type="error"
                        text
                        dense
                        class="fs8"
                        width="100%"
                        v-if="aOpciones.length === 0"
                    >
                      Tiene que agregar opciones
                    </v-alert>
                  </v-col>
                  <v-card elevation="0" class="mb-3">
                    <v-row no-gutters>
                      <v-col cols="11" sm="11">
                        Opciones:
                      </v-col>
                      <v-col cols="1" sm="1">
                        <v-tooltip bottom color="success">
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn
                                icon
                                color="success"
                                v-bind="attrs"
                                v-on="on"
                                :disabled="observed || reviewingToApprove"
                                @click="addOption">
                              <v-icon-component icon="add"></v-icon-component>
                            </v-btn>
                          </template>
                          <span>Agregar opción</span>
                        </v-tooltip>
                      </v-col>
                    </v-row>
                  </v-card>
                  <v-card elevation="0">
                    <v-alert
                        type="info"
                        text
                        dense
                        class="fs8"
                        width="100%"
                        v-if="form.preguntaImagen === 'IMAGEN'"
                    >
                      El texto de las opciones se limpiaran cuando se envien porque estas se encuentran en la imagen.
                    </v-alert>
                    <template v-for="(opcion, idx) in aOpciones">
                      <v-opciones
                        :key="opcion.key"
                        :letter="opcion.key"
                        :value="opcion.text"
                        @setOption="setOption"
                        :observado="observed || reviewingToApprove"
                        :imagen="form.preguntaImagen"
                        :showDelete="(aOpciones.length - 1) === idx"
                        @deleteOption="deleteOption"
                      />
                    </template>
                  </v-card>
                </v-col>
              </v-row>
              <v-row elevation="0" v-if="form.tipoRespuesta && form.tipoRespuesta === FALSO_VERDADERO">
                <v-col cols="12" class="pb-0">
                  Respuesta (*):
                </v-col>
                <v-col cols="12" class="pb-0">
                  <v-radio-group
                      class="mt-0 pt-0"
                      :disabled="observed || reviewingToApprove"
                      v-model="form.opciones"
                      :rules="[(val) => !!val || 'Tiene que marcar si la pregunta es falso o verdadero']"
                  >
                    <v-radio
                        label="Falso"
                        value="FALSO"
                    ></v-radio>
                    <v-radio
                        label="Verdadero"
                        value="VERDADERO"
                    ></v-radio>
                  </v-radio-group>
                </v-col>
              </v-row>
              <v-row v-if="form.tipoRespuesta && form.tipoRespuesta !== FALSO_VERDADERO && form.preguntaImagen">
                <v-col cols="12">
                  <v-alert
                      type="info"
                      text
                      dense
                      class="fs8"
                      width="100%"
                  >
                    Si el tipo de respuesta es <strong>{{ SELECCION_SIMPLE.replace(/_/g, ' ') }}</strong> entonces en el
                    campo "respuesta" solo seleccione la opción correcta.<br/><br/>
                    Si el tipo es respuesta es <strong>{{ SELECCION_MULTIPLE.replace(/_/g, ' ') }}</strong> entonces en
                    el campo "respuesta" seleccione varias opciones correctas como minimo
                    {{ CANTIDAD_MINIMA_RESPUESTA_SELECCION_MULTIPLE }}
                  </v-alert>
                </v-col>
                <v-col cols="12" class="pb-0">
                  <v-input-select
                    @value="e => form.respuestas = e"
                    :init="form.respuestas"
                    item-color="primary"
                    required
                    :disabled="observed || reviewingToApprove"
                    v-model="form.respuestas"
                    label="Respuesta (*)"
                    outlined
                    :multiple="form.tipoRespuesta === SELECCION_MULTIPLE"
                    :items="aRespuestas"
                    :rules="form.tipoRespuesta === SELECCION_SIMPLE ?
                      [(val) => !!val || 'La respuesta no puede estar vacio'] :
                      [(val) => !!(val || '').length > 0 || 'La respuesta no puede estar vacio']"
                    dense
                  ></v-input-select>
                </v-col>
                <v-col cols="12" class="pb-0"
                       v-if="observed || form.observacion || state === ESTADO_OBSERVADO || reviewingToApprove">
                  <v-input-textarea
                    @value="e => form.observacion = e"
                    :init="form.observacion"
                    :label="reviewingToApprove ? 'Observaciones a la pregunta' : observed ? 'Escriba aqui si hay motivos para observar la pregunta' : 'Detalles de la pregunta observada'"
                    :rows="3"
                    :disabled="$storage.get('rol').rol !== 'COMITE_DOCENTE_VERIFICADOR' || reviewingToApprove"
                    v-model="form.observacion"
                    counter
                    :rules="reviewingToApprove ? [] : [
                      (val) => !!val || 'No puede estar vacio la observacion',
                      (val) => (val || '').length <= 200 || 'La cantidad de caracteres supera lo establecido.'
                    ]"
                    color="primary"
                    placeholder="Escriba aqui el motivo de la observacion"
                  ></v-input-textarea>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-form>
      </template>
    </app-dialog>
    <crud-table
      v-if="showCrudTable"
      :headers="headers"
      description="Banco de preguntas"
      :url-inicial="url"
      :widthModal="500"
      :show-filter-init="true"
      :filters-inicial="filters"
      :order="order"
      :custom="true"
      :omitir-carga-on-mounted="true"
    >
      <template slot="buttons">
        <v-tooltip bottom color="primary" v-if="$storage.get('rol').rol === 'COMITE_DOCENTE_CARGA'">
          <template v-slot:activator="{ on }">
            <v-btn
                color="primary"
                id="btnAllApprove"
                v-on="on"
                icon
                @click="handleClickAllApprove"
            >
              <v-icon-component icon="send"/>
            </v-btn>
          </template>
          <span>Se enviaran todas las preguntas al comite de verificacion</span>
        </v-tooltip>
        <v-tooltip bottom color="primary">
          <template v-slot:activator="{ on }">
            <v-btn
                color="primary"
                :small="['xs', 'sm'].includes($vuetify.breakpoint.name)"
                icon
                id="btnUploadFile"
                v-on="on"
                @click.native.stop="oModal"
                slot="activator"
            >
              <v-icon-component icon="file_upload"/>
            </v-btn>
          </template>
          <span> Subir banco de preguntas </span>
        </v-tooltip>
        <v-tooltip bottom color="primary" v-if="btnNew">
          <template v-slot:activator="{ on }">
            <v-btn
                color="primary"
                :small="['xs', 'sm'].includes($vuetify.breakpoint.name)"
                icon
                id="addQuestion"
                v-on="on"
                @click="handleClickQuestion"
                slot="activator"
            >
              <v-icon-component icon="add"/>
            </v-btn>
          </template>
          <span> Agregar pregunta </span>
        </v-tooltip>
      </template>

      <!-- SLOT PARA TODOS LOS ITEMS (Solo en caso de que se quiera personalizar cada columna o mas de 1 columna) -->
      <template slot="items" slot-scope="items">
        <tr :class="getQuestionStatus(items)">
          <td :class="items.items.estado === ESTADO_OBSERVADO ? 'white--text' : ''">{{ items.items.tipoPregunta }}</td>
          <td :class="items.items.estado === ESTADO_OBSERVADO ? 'white--text' : ''">{{
              items.items.nivelDificultad
            }}
          </td>
          <td class="text--wrap">
            <div :class="items.items.estado === ESTADO_OBSERVADO ? 'white--text' : ''">{{
                items.items.textoPregunta
              }}
            </div>
            <span v-custom-tooltip="items.items.textoPregunta">Ver mas</span>
          </td>
          <td>
            <v-img
                v-if="items.items.imagenPregunta"
                :src="items.items.imagenPregunta"
                width="200"
                height="100"
            >
            </v-img>
          </td>
          <td>
            <v-chip
                class="ma-2"
                :color="getQuestionStatus(items, 'element')"
                label
                outlined
            >
              {{ items.items.estado }}
            </v-chip>
          </td>
          <td>
            <v-tooltip bottom color="error" v-if="btnWatch && items.items.estado === ESTADO_ENVIADO">
              <template v-slot:activator="{ on }">
                <v-btn
                    icon
                    v-on="on"
                    color="error"
                    @click.stop="state = null; observed = true; handleClickQuestion(items)"
                >
                  <v-icon-component icon="chat"></v-icon-component>
                </v-btn>
              </template>
              <span>Revisar la pregunta para ver si se tiene que observar o no</span>
            </v-tooltip>
            <v-tooltip bottom color="success" v-if="btnEdit && items.items.estado === ESTADO_ENVIADO">
              <template v-slot:activator="{ on }">
                <v-btn
                    icon
                    v-on="on"
                    color="success"
                    @click.stop="
                    state = 'APROBADO';
                    reviewingToApprove = true; handleClickQuestion(items)"
                >
                  <v-icon-component icon="verified_user"></v-icon-component>
                </v-btn>
              </template>
              <span>Revisar la pregunta antes de aprobarla</span>
            </v-tooltip>
            <v-tooltip bottom color="primary" v-if="btnSend">
              <template v-slot:activator="{ on }">
                <v-btn
                    icon
                    v-on="on"
                    color="primary"
                    @click.stop="sendQuestion(items)"
                >
                  <v-icon-component icon="send"></v-icon-component>
                </v-btn>
              </template>
              <span>Enviar pregunta al comite verificador</span>
            </v-tooltip>
            <v-tooltip bottom color="success"
                       v-if="btnEdit && [ESTADO_CREADO, ESTADO_OBSERVADO].includes(items.items.estado)">
              <template v-slot:activator="{ on }">
                <v-btn
                    icon
                    v-on="on"
                    color="success"
                    @click.stop="
                    observed = null;
                    state = items.items.estado;
                    handleClickQuestion(items)
                  "
                >
                  <v-icon-component icon="edit"></v-icon-component>
                </v-btn>
              </template>
              <span> {{ items.items.estado === ESTADO_OBSERVADO ? 'Solucionar observación' : 'Editar pregunta' }}</span>
            </v-tooltip>
            <v-tooltip bottom color="error" v-if="btnDelete && items.items.estado === ESTADO_CREADO">
              <template v-slot:activator="{ on }">
                <v-btn
                    icon
                    v-on="on"
                    color="error"
                    @click.prevent="deleteItem(items)"
                >
                  <v-icon-component icon="delete"></v-icon-component>
                </v-btn>
              </template>
              <span>Eliminar pregunta</span>
            </v-tooltip>
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
      No existen registros, porque no existen áreas asignadas a esta etapa.
    </v-alert>
    <v-card elevation="0" class="progress--status" v-if="uploading">
      <v-card elevation="0" class="cards fs8" :class="$vuetify.theme.dark ? 'black--text' : 'white--text'">
        <v-icon-component icon="local_shipping" :size="45"></v-icon-component>
        <v-icon-component icon="done" :size="25"></v-icon-component>
        Se subio exitosamente el archivo
      </v-card>
      <v-card elevation="0" class="cards fs8 info--text">
        <v-progress-circular indeterminate class="mr-3" color="info"/>
        Se esta procesando el archivo pero puede ver el estado haciendo click
        <v-btn depressed text style="text-transform: none; letter-spacing: 0" min-width="40" @click="getStatus"
               class="primary--text pl-0 pr-0">aqui
        </v-btn>
      </v-card>
    </v-card>
    <!-- MODAL PARA CARGAR MASIVAMENTE PREGUNTAS -->
    <v-dialog v-model="$store.state.modal2" width="450" persistent>
      <v-file-upload ref="fileUpload" @close="closeUploadFileModal" :key="new Date().getTime() / 1000" :id-eag="idAreaSeleccionada"
                     :uploading.sync="uploading"/>
    </v-dialog>
  </v-card>
</template>
<script>
import CrudTable from '@/plugins/crud-table/CrudTable.vue';
import actions from '@/plugins/crud-table/mixins/crud-table';
import vIconComponent from '@/plugins/icon/index.vue';
import vFileUpload from '@/plugins/fileUpload/index.vue';
import AppDialog from '@/plugins/modal/AppDialog.vue';
import vOpciones from './opciones.vue';

const SELECCION_SIMPLE = 'SELECCION_SIMPLE';
const SELECCION_MULTIPLE = 'SELECCION_MULTIPLE';
const FALSO_VERDADERO = 'FALSO_VERDADERO';

const ESTADO_CREADO = 'CREADO';
const ESTADO_ENVIADO = 'ENVIADO';
const ESTADO_OBSERVADO = 'OBSERVADO';
const ESTADO_APROBADO = 'APROBADO';

const CANTIDAD_MINIMA_OPCIONES_SELECCION_SIMPLE = 4; // ECU - v1.0.3
const CANTIDAD_MINIMA_OPCIONES_SELECCION_MULTIPLE = 4; // ECU - v1.0.3

const CANTIDAD_MINIMA_RESPUESTA_SELECCION_MULTIPLE = 2; // ECU - v1.0.3
export default {
  mixins: [actions],
  data: () => ({
    name: '',
    url: null,
    actualizarRegistro: null,
    form: {},
    valid: null,
    btnEdit: null,
    btnSend: null,
    parametros: null,
    reviewingToApprove: null,
    btnDelete: null,
    btnNew: null,
    btnWatch: null,
    observed: null,
    modalPreguntas: null,
    uploading: null,
    SELECCION_SIMPLE: SELECCION_SIMPLE,
    SELECCION_MULTIPLE: SELECCION_MULTIPLE,
    FALSO_VERDADERO: FALSO_VERDADERO,
    ESTADO_CREADO: ESTADO_CREADO,
    ESTADO_ENVIADO: ESTADO_ENVIADO,
    ESTADO_OBSERVADO: ESTADO_OBSERVADO,
    ESTADO_APROBADO: ESTADO_APROBADO,
    state: null,
    CANTIDAD_MINIMA_OPCIONES_SELECCION_SIMPLE: CANTIDAD_MINIMA_OPCIONES_SELECCION_SIMPLE,
    CANTIDAD_MINIMA_OPCIONES_SELECCION_MULTIPLE: CANTIDAD_MINIMA_OPCIONES_SELECCION_MULTIPLE,
    CANTIDAD_MINIMA_RESPUESTA_SELECCION_MULTIPLE: CANTIDAD_MINIMA_RESPUESTA_SELECCION_MULTIPLE,
    aTiposPreguntas: [],
    aTiposRespuestas: [],
    aNivelDificultad: [],
    aImagenPregunta: [],
    aEtapas: [],
    idStage: null,
    aAreas: [],
    idArea: null,
    idAreaSeleccionada: null,
    abecedario: [],
    aOpciones: [],
    aRespuestas: [],
    order: ['createdAt', 'DESC'],
    filters: [],
    showCrudTable: false,
    headers: [
      {
        text: 'Tipo de pregunta',
        align: 'center',
        value: 'tipoPregunta',
      },
      {
        text: 'Nivel',
        align: 'center',
        value: 'nivelDificultad',
      },
      {
        text: 'Pregunta',
        align: 'center',
        value: 'textoPregunta',
      },
      {
        text: 'Imagen',
        align: 'center',
        value: 'imagenPregunta',
      },
      {
        text: 'Estado',
        sortable: false,
        value: 'estado',
      },
      {
        text: 'Acciones',
        divider: false,
        sortable: false,
        align: 'center',
        value: 'ACTIONS',
      },
    ],
  }),
  methods: {
    handleClickAllApprove() {
      this.$confirm('Esta seguro de aprobar todas las preguntas', async () => {
        try {
          const { id } = this.$storage.get('areaSeleccionada');
          const response = await this.$service.patch(`etapasAreaGrado/${id}/preguntas/envioLotes`);
          if (response && response.isOK) {
            this.$message.success(response.mensaje);
            this.updateList();
          } else {
            throw new Error(response.mensaje);
          }
        } catch (error) {
          this.$message.error(error.message);
        }
      }, () => {
      }, 'aprobar todos', 'cancelar');
    },
    getQuestionStatus({ items: { estado } }, dom = 'row') {
      let className;
      if (estado === this.ESTADO_OBSERVADO && dom) {
        className = 'pregunta--observada';
      }
      if (estado === this.ESTADO_CREADO && dom === 'element') {
        className = 'info';
      }
      if (estado === this.ESTADO_OBSERVADO && dom === 'element') {
        className = 'white';
      }
      return className;
    },
    handleChangeTipoRespuesta() {
      this.form = {
        ...this.form,
        respuestas: this.form.tipoRespuesta === this.SELECCION_MULTIPLE ? [] : null
      };
      this.aRespuestas = Object.keys(this.aOpciones).map(item => this.abecedario[item]);
    },
    async selectStage() {
      const areas = await this.$service.get(`etapas-areas-grados?idEtapa=${this.idStage}`);
      this.aAreas = areas.datos.filas;
    },
    handleChangeSelected() {
      if (this.form.preguntaImagen === 'IMAGEN') {
        this.form = {
          ...this.form,
          textoPregunta: null,
          respuestas: this.form.tipoRespuesta === this.SELECCION_MULTIPLE ? [] : null
        };
        this.aOpciones = [{
          key: 'a',
          text: null
        }];
        this.aRespuestas = Object.keys(this.aOpciones)
          .map(item => this.abecedario[item]);
      } else {
        this.form = {
          ...this.form,
          imagenPregunta: null
        };
      }
    },
    getStatus() {
      this.$store.commit('openModal', 2);
      this.uploading = !this.uploading;
      setTimeout(() => {
        this.updateList();
        this.$refs.fileUpload.getFileStatus();
      }, 100);
    },
    async closeUploadFileModal(option) {
      this.$store.commit('closeModal', 2);
      this.$waiting(false);
      if (option) {
        this.uploading = !this.uploading;
      }
    },
    remove() {
      this.form.imagenPregunta = null;
    },
    deleteOption(letter) {
      const index = this.aOpciones.findIndex(option => option.key === letter);
      this.aOpciones.splice(index, 1);
      this.aRespuestas = Object.keys(this.aOpciones)
        .map(item => this.abecedario[item]);
      this.form.respuestas = this.form.tipoRespuesta === this.SELECCION_MULTIPLE ? [] : null;
    },
    sendQuestion({ items: { id } }) {
      this.$confirm('Esta seguro de enviar la pregunta al comite verificador?', async () => {
        try {
          const response = await this.$service.patch(`preguntas/${id}/estados`, {
            operacion: 'ENVIAR'
          });
          if (response && response.isOK) {
            this.$message.success(response.mensaje || 'La pregunta se envio exitosamente al comite de verificacion');
            this.updateList();
          } else {
            throw new Error(response.mensaje);
          }
        } catch (error) {
          this.$message.error(error.message);
        }
      });
    },
    setOption({
      key,
      text
    }) {
      this.aOpciones.filter(option => {
        if (option.key === key) {
          option.text = text;
        }
      });
    },
    addOption() {
      if (Array.isArray(this.aOpciones) && this.aOpciones.length < 10) {
        const options = this.aOpciones.map((option, idx) => {
          const obj = {};
          obj.key = this.abecedario[idx];
          obj.text = option.text;
          return obj;
        });
        this.aOpciones = options;
        this.aOpciones.push({
          key: this.abecedario[this.aOpciones.length],
          text: ''
        });
        this.aRespuestas = Object.keys(this.aOpciones)
          .map(item => this.abecedario[item]);
      } else {
        this.$message.error('No se puede agregar mas opciones');
      }
    },
    oModal() {
      this.$store.commit('openModal', 2);
    },
    reset() {
      this.form = {};
      this.aOpciones = [];
    },
    handleClickQuestion({ items }) {
      this.reset();
      if (items && items.id) {
        this.form = { ...items };
        this.form = {
          ...this.form,
          observacion: (this.form.observacion || '').trim().length === 0 ? null : this.form.observacion
        };
        if (items.tipoRespuesta === this.FALSO_VERDADERO) {
          this.form = {
            ...this.form,
            opciones: items.respuestas.includes('FALSO') ? 'FALSO' : 'VERDADERO',
            preguntaImagen: (items.textoPregunta || '').length === 0 ? 'IMAGEN' : 'PREGUNTA'
          };
        } else {
          this.aOpciones = items.opciones ? Object.keys(items.opciones)
            .map(item => {
              const obj = {};
              obj.key = item;
              obj.text = items.opciones[item];
              return obj;
            }) : null;

          this.aRespuestas = Object.keys(items.opciones);
          this.form = {
            ...this.form,
            preguntaImagen: (items.textoPregunta || '').length === 0 ? 'IMAGEN' : 'PREGUNTA',
            respuestas: items.tipoRespuesta === this.SELECCION_SIMPLE ? items.respuestas[0] : items.respuestas
          };
        }
      } else {
        this.aOpciones = [];
        this.aRespuestas = Object.keys(this.aOpciones)
          .map(item => this.abecedario[item]);
      }
      this.modalPreguntas = true;
    },
    deleteItem({ items: { id } }) {
      this.$confirm('¿Está seguro de eliminar la opción?', async () => {
        const response = await this.$service.delete(`preguntas/${id}`);
        if (!response) {
          this.$message.success('Pregunta eliminada correctamente');
          this.updateList();
        } else {
          this.$message.error(response.mensaje);
        }
      });
    },
    closeModal() {
      this.$store.commit('closeModal', 3);
    },
    /**
     * @function save
     * @description Esta funcion esta creada para guardar en la BD
     * @author dbarra@agetic.gob.bo
     */
    async save() {
      try {
        if (this.$refs.form.validate()) {
          const opciones = this.aOpciones.reduce((container, item) => {
            container[item.key] = item.text;
            return container;
          }, {});
          let respuestas;
          if (this.form.tipoRespuesta === this.FALSO_VERDADERO) {
            respuestas = [this.form.opciones];
          } else {
            respuestas = (Array.isArray(this.form.respuestas)) ? this.form.respuestas : this.form.respuestas.split(',');
            respuestas = respuestas.map(item => item.trim());
          }
          const data = {
            ...this.form,
            opciones,
            respuestas
          };
          if (data.tipoRespuesta === this.SELECCION_SIMPLE && Object.keys(opciones).length < this.CANTIDAD_MINIMA_OPCIONES_SELECCION_SIMPLE) {
            this.$message.error(`La cantidad mínima de opciones para una <strong>${data.tipoRespuesta.replace(/_/g, ' ')}</strong> es de <strong>${this.CANTIDAD_MINIMA_OPCIONES_SELECCION_SIMPLE}</strong>`);
            return;
          }
          if (data.tipoRespuesta === this.SELECCION_MULTIPLE && Object.keys(opciones).length < this.CANTIDAD_MINIMA_OPCIONES_SELECCION_MULTIPLE) {
            this.$message.error(`La cantidad mínima de opciones para una <strong>${data.tipoRespuesta.replace(/_/g, ' ')}</strong> es de <strong>${this.CANTIDAD_MINIMA_OPCIONES_SELECCION_MULTIPLE}</strong>`);
            return;
          }
          if (data.tipoRespuesta === this.SELECCION_MULTIPLE) {
            if (!(this.form.respuestas.length >= this.CANTIDAD_MINIMA_RESPUESTA_SELECCION_MULTIPLE)) {
              this.$message.error(`La cantidad mínima de respuestas para una <strong>${data.tipoRespuesta.replace(/_/g, ' ')}</strong> es de <strong>${this.CANTIDAD_MINIMA_RESPUESTA_SELECCION_MULTIPLE}</strong>`);
              return;
            }
          }
          if (this.form.tipoRespuesta === this.FALSO_VERDADERO) delete data.opciones;
          if (data.id) {
            if ((this.form.textoPregunta || '').trim().length > 0) {
              data.imagenPregunta = null;
            } else {
              data.textoPregunta = null;
              if (data.opciones) {
                data.opciones = Object.keys(data.opciones)
                  .reduce((container, item) => {
                    container = {
                      ...container,
                      [item]: null
                    };
                    return container;
                  }, {});
              }
            }
            let response;
            if (this.observed) {
              response = await this.$service.patch(`preguntas/${data.id}/estados`, {
                operacion: 'OBSERVAR',
                observacion: this.form.observacion
              });
            } else {
              if (!this.reviewingToApprove) {
                response = await this.$service.put(`preguntas/${data.id}`, data);
              } else {
                response = {
                  isOK: true,
                  mensaje: 'Se aprobo la pregunta correctamente'
                };
              }
              if (this.state === this.ESTADO_OBSERVADO) {
                await this.$service.patch(`preguntas/${data.id}/estados`, {
                  operacion: 'ENVIAR'
                });
              }
              if (this.state === this.ESTADO_APROBADO) {
                await this.$service.patch(`preguntas/${data.id}/estados`, {
                  operacion: 'APROBAR'
                });
              }
            }
            if (response && response.isOK) {
              this.observed = null;
              this.reviewingToApprove = null;
              this.modalPreguntas = false;
              this.reset();
              this.closeModal();
              this.updateList();
              this.$message.success(response.mensaje || 'Los datos se actualizaron de forma correcta');
            } else {
              throw new Error(response.mensaje);
            }
          } else {
            delete data.id;
            const response = await this.$service.post(this.url, data);
            if (response && response.isOK) {
              this.reset();
              this.closeModal();
              this.updateList();
              this.$message.success(response.mensaje || 'Los datos se guardaron de forma correcta');
              this.modalPreguntas = false;
            } else {
              throw new Error(response.mensaje);
            }
          }
        } else {
          this.$message.error('Complete los campos obligatorios');
        }
      } catch (error) {
        this.$message.error(error.message);
      }
    },
    async actualizarOlimpiada(idOlimpiadaSeleccionadaNueva) {
      this.olimpiadaSeleccionada = this.olimpiadas.find(item => item.id === idOlimpiadaSeleccionadaNueva);
      this.idOlimpiadaSeleccionada = idOlimpiadaSeleccionadaNueva;
      if (this.olimpiadaSeleccionada != null) {
        this.$storage.set('olimpiadaSeleccionada', this.olimpiadaSeleccionada);
      }
      this.idEtapaSeleccionada = null;
      await this.cargarEtapas();

      this.idAreaSeleccionada = null;
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
      await this.cargarEtapas();
      await this.cargarAreas();
      await this.$service.get('grados-escolares')
        .then((resultado) => {
          this.gradosEscolares = resultado && resultado.datos && resultado.datos.filas
            ? resultado.datos.filas
            : [];
        });
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
        {
          field: 'tipoPregunta',
          type: 'array',
          multiple: false,
          label: 'Tipo de pregunta',
          values: [
            'OLIMPIADA',
            'CURRICULA'
          ]
        },
        {
          field: 'nivelDificultad',
          type: 'array',
          multiple: false,
          label: 'Nivel de dificultad',
          values: [
            'COMPLEJA',
            'INTERMEDIA',
            'BÁSICA'
          ]
        },
        {
          field: 'tipoRespuesta',
          type: 'array',
          multiple: false,
          label: 'Tipo de respuesta',
          values: [
            'SELECCION_MULTIPLE',
            'SELECCION_SIMPLE',
            'FALSO_VERDADERO'
          ]
        },
        {
          field: 'estado',
          type: 'array',
          multiple: false,
          label: 'Estado',
          values: [
            'CREADO',
            'OBSERVADO',
            'ENVIADO',
            'APROBADO'
          ]
        }
      ];
    },
  },
  mounted() {
    this.$nextTick(async () => {
      const { rol } = this.$storage.get('rol');
      this.btnEdit = await this.$Casbin.enforcer.enforce(rol, '/banco-preguntas', 'update');
      this.btnDelete = await this.$Casbin.enforcer.enforce(rol, '/banco-preguntas', 'delete');
      this.btnNew = await this.$Casbin.enforcer.enforce(rol, '/banco-preguntas', 'create');
      this.btnWatch = await this.$Casbin.enforcer.enforce(rol, '/banco-preguntas', 'watch') || rol === 'COMITE_DOCENTE_VERIFICADOR';
      this.btnSend = await this.$Casbin.enforcer.enforce(rol, '/banco-preguntas', 'send') || rol === 'COMITE_DOCENTE_CARGA';

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

      this.url = `etapasAreaGrado/${this.idAreaSeleccionada}/preguntas`;

      await this.loadParams();

      this.abecedario = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
      const aTiposPreguntas = await this.$service.get('preguntas/tipoPreguntas');
      this.aTiposPreguntas = aTiposPreguntas.datos.map((pregunta) => {
        const obj = {};
        obj.label = pregunta.replace(/_/gi, ' ');
        obj.value = pregunta;
        return obj;
      });
      const aTiposRespuestas = await this.$service.get('preguntas/tipoRespuestas');
      this.aTiposRespuestas = aTiposRespuestas.datos.map((pregunta) => {
        const obj = {};
        obj.label = pregunta.replace(/_/gi, ' ');
        obj.value = pregunta;
        return obj;
      });
      const aNivelesDificultad = await this.$service.get(
        'preguntas/nivelesDificultad'
      );
      this.aNivelDificultad = aNivelesDificultad.datos.map((data) => {
        const obj = {};
        obj.label = data.replace(/_/gi, ' ');
        obj.value = data;
        return obj;
      });

      this.aImagenPregunta = [
        {
          codigo: 'MAT-101-1',
          area: 'Matematicas',
          descripcion: 'Primera pregunta de matematicas',
          url: 'https://i.ibb.co/5rDFxv4/velocidad-mru.jpg',
        },
        {
          codigo: 'MAT-101-2',
          area: 'Matematicas',
          descripcion: 'Segunda pregunta de matematicas',
          url: 'https://i.ibb.co/3sR7kG3/movimiento-rectilineo-uniforme.jpg',
        },
        {
          codigo: 'FIS-99-1',
          area: 'Fisica',
          descripcion: 'Primera pregunta de fisica',
          url:
              'https://www.analyzemath.com/high_school_math/grade_12/circles_sectors_trig/trig_circle_2.gif',
        },
        {
          codigo: 'FIS-99-2',
          area: 'Fisica',
          descripcion: 'Segunda pregunta de fisica',
          url:
              'http://www.analyzemath.com/high_school_math/grade_12/circles_sectors_trig/trig_circle_3.gif',
        },
      ];
    });
  },
  components: {
    CrudTable,
    vIconComponent,
    vFileUpload,
    AppDialog,
    vOpciones
  },
};
</script>
<style lang="scss">
@import '../../scss/variables.scss';

.mradio {
  .v-input--radio-group__input {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
}

.pregunta--observada {
  background: #e57373;

  &:hover {
    background: #e57373 !important;
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
        content: '';
        top: 50%;
        right: 0;
        border: medium none;
        background-color: $info !important;
        width: 1.14285714em;
        height: 1.14285714em;
        border-style: solid;
        border-color: $info;
        border-width: 0 1px 1px 0;
        -webkit-transition: background-color .1s ease, opacity .1s ease, color .1s ease, -webkit-box-shadow .1s ease;
        transition: background-color .1s ease, opacity .1s ease, color .1s ease, -webkit-box-shadow .1s ease;
        transition: background-color .1s ease, opacity .1s ease, color .1s ease, box-shadow .1s ease;
        transition: background-color .1s ease, opacity .1s ease, color .1s ease, box-shadow .1s ease, -webkit-box-shadow .1s ease;
        -webkit-transform: translateY(-50%) translateX(50%) rotate(-45deg);
        transform: translateY(-50%) translateX(50%) rotate(-45deg);
      }
    }
  }
}
</style>
