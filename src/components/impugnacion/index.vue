<template>
  <v-card elevation="0">
    <app-dialog
      :dialog.sync="modalPreguntas"
      :titulo="edicionRespuesta ? 'Editar respuestas' : 'Anular pregunta'"
      @open-dialog="modalPreguntas = true; aOpciones = []; observed = null; state = null; reviewingToApprove = null"
      @close-dialog="modalPreguntas = false; aOpciones = []; observed = null; state = null; reviewingToApprove = null"
      :textoEjecutar="edicionRespuesta ? 'Guardar respuestas' : 'Anular pregunta'"
      btnActions="column"
      @accion="save"
    >
      <template v-if="modalPreguntas">
        <!-- FORMULARIO PARA AGREGAR O EDITAR -->
        <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="save">
          <v-card elevation="0">
            <v-container fluid>
            <v-row>
              <v-col cols="12" class="pb-0">
                <v-select
                  item-color="primary"
                  required
                  :autofocus="!form.id"
                  v-model="form.tipoPregunta"
                  label="Tipo de pregunta (*)"
                  color="primary"
                  :items="aTiposPreguntas"
                  item-text="label"
                  outlined
                  disabled
                  dense
                  item-value="value"
                  :rules="[(val) => !!val || 'No puede estar vacio']"
                ></v-select>
              </v-col>
              <v-col cols="12" class="pb-0">
                <v-select
                  item-color="primary"
                  required
                  v-model="form.tipoRespuesta"
                  label="Tipo de respuesta (*)"
                  color="primary"
                  :items="aTiposRespuestas"
                  disabled
                  item-text="label"
                  outlined
                  dense
                  item-value="value"
                  :rules="[(val) => !!val || 'No puede estar vacio']"
                ></v-select>
              </v-col>
              <v-col cols="12" class="pb-0">
                <v-select
                  item-color="primary"
                  required
                  v-model="form.nivelDificultad"
                  label="Nivel de dificultad (*)"
                  color="primary"
                  :items="aNivelDificultad"
                  item-text="label"
                  outlined
                  disabled
                  dense
                  item-value="value"
                  :rules="[(val) => !!val || 'No puede estar vacio']"
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" v-if="form.tipoRespuesta">
                <v-radio-group row disabled v-model="form.preguntaImagen" class="mradio">
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
                <v-textarea
                  item-color="primary"
                  required
                  :autofocus="!form.id"
                  v-model="form.textoPregunta"
                  disabled
                  label="Pregunta (*)"
                  outlined
                  counter
                  dense
                  :rules="[
                    (val) => !!val || 'No puede estar vacio',
                    (val) => (val || '').length <= 1000 || 'La cantidad de caracteres supera lo establecido.'
                  ]"
                ></v-textarea>
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
                      <img :src="data.item.url" />
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
              <v-col cols="12" class="pb-0" v-if="form.tipoRespuesta && form.tipoRespuesta !== FALSO_VERDADERO && form.preguntaImagen">
                <v-card elevation="0" class="mb-3">
                  <v-row no-gutters>
                    <v-col cols="12" sm="12">
                      Opciones:
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
                  <template v-for="opcion in aOpciones">
                    <v-opciones
                      :key="opcion.key"
                      :letter="opcion.key"
                      :value="opcion.text"
                      :observado="true"
                      :imagen="form.preguntaImagen"
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
                  :disabled="!edicionRespuesta"
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
                Si el tipo de respuesta es <strong>{{ SELECCION_SIMPLE.replace(/_/g, ' ') }}</strong> entonces en el campo "respuesta" solo seleccione la opción correcta.<br/><br/>
                Si el tipo es respuesta es <strong>{{ SELECCION_MULTIPLE.replace(/_/g, ' ') }}</strong> entonces en el campo "respuesta" seleccione varias opciones correctas como minimo {{ CANTIDAD_MINIMA_RESPUESTA_SELECCION_MULTIPLE }}
                </v-alert>
              </v-col>
              <v-col cols="12" class="pb-0">
                <v-select
                  item-color="primary"
                  required
                  :disabled="!edicionRespuesta"
                  v-model="form.respuestas"
                  label="Respuesta (*)"
                  outlined
                  :multiple="form.tipoRespuesta === SELECCION_MULTIPLE"
                  :items="aRespuestas"
                  :rules="form.tipoRespuesta === SELECCION_SIMPLE ? [(val) => !!val || 'La respuesta no puede estar vacio'] : [(val) => !!val.length > 0 || 'La respuesta no puede estar vacio']"
                  dense
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
          </v-card>
        </v-form>
      </template>
    </app-dialog>
    <crud-table
      :headers="headers"
      description="Impugnación de preguntas"
      :url-inicial="url"
      :parametros="parametros"
      :filters-inicial="filters"
      :widthModal="500"
      :order="order"
      :custom="true"
      v-if="url && idArea"
    >
      <!-- SLOT PARA TODOS LOS ITEMS (Solo en caso de que se quiera personalizar cada columna o mas de 1 columna) -->
      <template slot="items" slot-scope="items">
        <tr :class="getQuestionStatus(items)">
          <td :class="items.items.estado === ESTADO_OBSERVADO ? 'white--text' : ''">{{ items.items.tipoPregunta }}</td>
          <td :class="items.items.estado === ESTADO_OBSERVADO ? 'white--text' : ''">{{ items.items.nivelDificultad }}</td>
          <td class="text--wrap">
            <div :class="items.items.estado === ESTADO_OBSERVADO ? 'white--text' : ''">{{ items.items.textoPregunta }}</div>
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
            <v-tooltip bottom color="success">
              <template v-slot:activator="{ on }">
                <v-btn
                  icon
                  v-on="on"
                  color="success"
                  @click.stop="
                    observed = null;
                    state = items.items.estado;
                    edicionRespuesta = true;
                    handleClickQuestion(items)
                  "
                >
                  <v-icon-component icon="edit"></v-icon-component>
                </v-btn>
              </template>
              <span>Editar respuestas</span>
            </v-tooltip>
            <v-tooltip bottom color="error">
              <template v-slot:activator="{ on }">
                <v-btn
                  icon
                  v-on="on"
                  color="error"
                  @click.prevent="
                    edicionRespuesta = false;
                    handleClickQuestion(items)"
                >
                  <v-icon-component icon="remove_circle"></v-icon-component>
                </v-btn>
              </template>
              <span>Anular pregunta</span>
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
  </v-card>
</template>
<script>
import CrudTable from '@/plugins/crud-table/CrudTable.vue';
import actions from '@/plugins/crud-table/mixins/crud-table';
import vIconComponent from '@/plugins/icon/index.vue';
import AppDialog from '@/plugins/modal/AppDialog.vue';
import vOpciones from '../bancoPreguntas/opciones.vue';

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
    parametros: null,
    reviewingToApprove: null,
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
    abecedario: [],
    aOpciones: [],
    aRespuestas: [],
    edicionRespuesta: false,
    order: ['createdAt', 'DESC'],
    filters: [
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
    ],
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
    etapaSeleccionada: null
  }),
  methods: {
    handleClickAllApprove () {
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
      }, () => {}, 'aprobar todos', 'cancelar');
    },
    getQuestionStatus ({ items: { estado } }, dom = 'row') {
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
    remove () {
      this.form.imagenPregunta = null;
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
          this.aOpciones = items.opciones ? Object.keys(items.opciones).map(item => {
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
        this.aRespuestas = Object.keys(this.aOpciones).map(item => this.abecedario[item]);
      }
      this.modalPreguntas = true;
    },
    anularPregunta(id) {
      this.$confirm(`¿Está seguro de anular la pregunta, esto afectará a los resultados
        obtenidos?`, async () => {
        this.$waiting(true, `Anulando y re-calificando exámenes de la etapa ${this.etapaSeleccionada.nombre} ...`);
        const response = await this.$service.patch(`preguntas/${id}/estados`, { operacion: 'ANULAR' });
        this.$waiting(false);
        if (!response) {
          this.$message.success('Pregunta anulada correctamente');
          this.updateList();
        } else {
          this.$message.error(response.mensaje);
        }
      });
    },
    async save() {
      if (!this.edicionRespuesta) {
        this.anularPregunta(this.form.id);
        return;
      }
      this.$confirm(
        `¿Está
          seguro de que desea cambiar la respuesta, esto afectará a los resultados
          obtenidos?`,
        async () => {
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
              const data = { ...this.form, opciones, respuestas };
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
            } else {
              this.$message.error('Complete los campos obligatorios');
            }
          } catch (error) {
            this.$message.error(error.message);
          }
        }
      );
    }
  },
  mounted() {
    this.$nextTick(async () => {
      const { rol } = this.$storage.get('rol');
      this.etapaSeleccionada = this.$storage.get('etapaSeleccionada');
      this.btnEdit = await this.$Casbin.enforcer.enforce(rol, '/banco-preguntas', 'update');

      this.idStage = this.$storage.get('etapaSeleccionada');
      let isChanged = !!(this.idStage && this.idStage.id);
      if (!isChanged) {
        const olimpiadaSeleccionada = this.$storage.get('olimpiadaSeleccionada');
        const aEtapas = await this.$service.get(`olimpiadas/${olimpiadaSeleccionada.id ? olimpiadaSeleccionada.id : olimpiadaSeleccionada}/etapas`);
        const { filas } = aEtapas.datos;
        const etapaSelecionada = filas.find(item => item.id === this.idStage);
        this.$storage.set('etapaSeleccionada', etapaSelecionada);
      }

      const areaSeleccionada = this.$storage.get('areaSeleccionada');
      isChanged = !!(areaSeleccionada && areaSeleccionada.id);
      this.idArea = this.$storage.get('areaSeleccionada');
      if (!isChanged) {
        const areas = await this.$service.get(`etapas/${this.$storage.get('etapaSeleccionada').id}/etapaAreaGrados`);
        const { filas } = areas.datos;
        this.idArea = filas.find(item => item.id === areaSeleccionada);
      }
      if (areaSeleccionada) {
        this.url = `etapasAreaGrado/${this.idArea.id}/preguntas`;
        this.parametros = { idOlimpiada: this.$storage.get('olimpiadaSeleccionada').id };
      }

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
  background:#e57373;
  &:hover {
    background:#e57373 !important;
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
        -webkit-transition: background-color .1s ease,opacity .1s ease,color .1s ease,-webkit-box-shadow .1s ease;
        transition: background-color .1s ease,opacity .1s ease,color .1s ease,-webkit-box-shadow .1s ease;
        transition: background-color .1s ease,opacity .1s ease,color .1s ease,box-shadow .1s ease;
        transition: background-color .1s ease,opacity .1s ease,color .1s ease,box-shadow .1s ease,-webkit-box-shadow .1s ease;
        -webkit-transform: translateY(-50%) translateX(50%) rotate(-45deg);
        transform: translateY(-50%) translateX(50%) rotate(-45deg);
      }
    }
  }
}
</style>
