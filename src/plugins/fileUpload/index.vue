<template>
  <v-card
    elevation="0"
    class="pa-2 d-flex flex-column align-center justify-center"
  >
    <v-container>
      <v-form ref="form" lazy-validation @submit.prevent="upload">
        <v-row no-gutters>
          <v-col
            align="center"
            justify="center"
            :cols="11"
            class="d-flex flex-row align-center text-sm primary--text primary--text"
          >
            <span :class="$vuetify.theme.dark ? 'white--text' : 'primary--text'">SUBIR ARCHIVO</span>
          </v-col>
          <v-col :cols="1">
            <v-tooltip bottom color="primary">
              <template v-slot:activator="{ on }">
                <v-btn icon :color="$vuetify.theme.dark ? 'white' : 'primary'" v-on="on" @click="$emit('close', false)">
                  <v-icon-component icon="close"></v-icon-component>
                </v-btn>
              </template>
              <span>Cerrar ventana</span>
            </v-tooltip>
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <v-card elevation="0" class="d-flex flex-column align-center justify-center">
          <v-alert
            type="info"
            text
            dense
            class="fs8 mb-0"
          >
            Si tiene problemas con el archivo, puede descargar un ejemplo del archivo
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  min-width="30"
                  text
                  dense
                  v-bind="attrs"
                  v-on="on"
                  class="pa-0 fs8"
                  style="text-transform: none; letter-spacing: 0; margin-bottom: 2px"
                  @click="descargarEjemplo()"
                  color="info">
                  aquí
                </v-btn>
              </template>
              <span>Descargar archivo</span>
            </v-tooltip>
            <template v-slot:prepend>
              <v-icon-component class="ml-0" icon="lightbulb"/>
            </template>
          </v-alert>
          <v-file-input
            label="Subir archivo"
            v-model="mFile"
            @change="selectFile"
            show-size
            style="width: 450px"
            :rules="[(val) => !!val || 'Tiene que subir un archivo']"
            class="mb-4"
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, .xlsx, application/vnd.oasis.opendocument.spreadsheet, .ods"
            hint="Solo se admite un archivo con extension .ods o .xlsx"
            persistent-hint
          ></v-file-input>
          <v-alert
            type="error"
            text
            dense
            class="fs8"
            v-if="msgError"
          >
            {{ msgError }}
          </v-alert>
          <v-progress-linear v-if="mFile" :value="sendProgress" class="mt-1 mb-4"></v-progress-linear>
          <v-btn
            v-if="mFile"
            v-generate="'Espere unos segundos por favor, hasta que se termine de subir el archivo completo...'"
            block
            type="submit"
            color="primary"
          >Subir archivo</v-btn>
        </v-card>
      </v-form>
    </v-container>
    <br>
    <v-container v-if="uploadResult" class="text-center">
      <v-expansion-panels>
        <v-expansion-panel>
          <v-expansion-panel-header>
            <div>Ya tiene un archivo enviado anteriormente, puede ver el estado haciendo click aqui</div>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-btn
              color="primary"
              dark
              :loading="!uploadStatus.estado"
              @click="getFileStatus"
            >
              Ver estado
            </v-btn>
            <v-alert
              color="info"
              text
              dense
              class="fs8"
            >
              <div>{{ uploadStatus.estado }}</div>
              <div v-if="uploadStatus.cantidad">{{ uploadStatus.cantidad }} filas</div>
              <div v-if="uploadResult.fecha">Fecha de envio, {{ moment(uploadResult.fecha).format('DD/MM/YYYY HH:mm:ss') }}</div>
              <div v-if="uploadResult.nombreArchivo">Archivo: {{ uploadResult.nombreArchivo }}</div>
            </v-alert>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <v-dialog
        v-model="uploadCodeDialog"
        fullscreen
        transition="dialog-bottom-transition"
      >
        <v-card>
          <v-toolbar
            dark
            color="primary"
          >
            <v-btn
              icon
              dark
              @click="uploadCodeDialogClose"
            >
              <v-icon-component icon="close"/>
            </v-btn>
            <v-toolbar-title>Errores en el archivo {{uploadResult.nombreArchivo}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-title>
              <v-btn
                dark
                text
                @click="uploadCodeDialogClose"
              >
                Cerrar
              </v-btn>
            </v-toolbar-title>
          </v-toolbar>

          <v-data-table
            :headers="uploadHeaders"
            :items="uploadData"
          >
            <template v-slot:[`item.errores`]="{item}">
              <div v-for="err in item.errores" :key="err.$object">
                <strong>Linea: {{err.linea}}</strong>
                {{err.error}}
              </div>
            </template>
            <template v-slot:no-data>
              <v-alert
                type="success"
                text
                dense
                class="fs8"
                v-if="!uploadStatus.error"
              >
                No hay errores
              </v-alert>
              <v-alert
                type="error"
                text
                dense
                class="fs8"
                v-if="uploadStatus.error"
              >
                {{ uploadStatus.error }}
              </v-alert>
            </template>
          </v-data-table>
        </v-card>
      </v-dialog>
    </v-container>
  </v-card>
</template>
<script>
import axios from 'axios';
import vIconComponent from '@/plugins/icon/index.vue';
import moment from 'dayjs';

const NAME = 'v-file-upload';
export default {
  props: {
    idEag: {
      default: {}
    },
    uploading: {
      type: Boolean,
      default: false
    },
  },
  name: NAME,
  data: () => ({
    moment,
    uploadData: [],
    uploadResult: null,
    uploadStatus: {
      estado: 'Haga click en ver'
    },
    uploadCodeDialog: false,
    uploadHeaders: [
      { text: 'Errores', value: 'errores', filter: value => JSON.stringify(value), },
      { text: 'Tipo', value: 'tipo' },
      { text: 'Nivel dificultad', value: 'nivel-dificultad' },
      { text: 'Tipo respuesta', value: 'tipo-respuesta' },
      { text: 'Respuestas', value: 'respuestas' },
      { text: 'Opciones', value: 'opciones' },
    ],
    setTimeoutId: null,
    msgError: null,
    mFile: null,
    chunks: [],
    uploaded: 0,
    aSize: null,
    count: 0,
    isUpload: false,
    sendProgress: 0
  }),
  components: {
    vIconComponent
  },
  computed: {
    formData() {
      const formData = new FormData();
      const tamanioArchivo = btoa(`data_${this.mFile.size}`);
      const esUltimo = btoa(`data_${this.chunks.length === 1}`);
      const nombreArchivo = btoa(`data_${this.mFile.name}`);
      const fragmentoActual = btoa(`data_${this.count}`);
      const idEtapaAreaGrado = btoa(`data_${this.idEag && this.idEag.id ? this.idEag.id : this.idEag}`);
      const totalFragmentos = btoa(`data_${this.aSize}`);
      formData.set('tamanioArchivo', tamanioArchivo.substr(5, tamanioArchivo.length - 1));
      formData.set('esUltimo', esUltimo.substr(5, esUltimo.length - 1));
      formData.set('nombreArchivo', nombreArchivo.substr(5, nombreArchivo.length - 1));
      formData.set('datosBinarios', this.chunks[0], `${this.mFile.name}.part`);
      formData.set('fragmentoActual', fragmentoActual.substr(5, fragmentoActual.length - 1));
      formData.set('totalFragmentos', totalFragmentos.substr(5, totalFragmentos.length - 1));
      formData.set('idEtapaAreaGrado', idEtapaAreaGrado.substr(5, idEtapaAreaGrado.length - 1));
      return formData;
    },
    config() {
      return {
        method: 'POST',
        data: this.formData,
        url: `${this.$baseServer}preguntas/subirFragmento`,
        headers: {
          'Content-Type': 'application/octet-stream',
          Authorization: `Bearer ${this.$storage.get('token')}`,
        },
        onUploadProgress: (event) => {
          this.uploaded += event.loaded;
        },
      };
    },
  },
  watch: {
    chunks(n) {
      if (this.count > 0) {
        if (n.length > 0) {
          this.upload();
        }
      }
    },
  },
  mounted() {
    this.uploadResult = this.$storage.get('uploadResultQ');
    if (!this.uploadResult || !this.uploadResult.visto) this.setTimeoutCheck();
  },
  methods: {
    async descargarEjemplo() {
      try {
        const response = await this.$service.requestWithConfig({
          method: 'GET',
          url: `${this.$baseServer}preguntas/descargarEjemplo`,
          headers: {
            Authorization: `${this.$authToken} ${this.$storage.get('token')}`
          },
          responseType: 'blob'
        });
        const url = URL.createObjectURL(new Blob([response], {
          type: 'application/vnd.ms-excel'
        }));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'ejemplo_preguntas.ods');
        document.body.appendChild(link);
        link.click();
      } catch (error) {
        this.$message.error(error.message);
      }
    },
    getFileStatus() {
      this.uploadStatus = {};
      this.uploadResult = this.$storage.get('uploadResultQ');
      if (this.uploadResult) {
        this.$service.get(`preguntas/${this.uploadResult.codigoArchivo}/estado`).then((resp) => {
          if (Array.isArray(resp.datos)) {
            this.uploadData = resp.datos;
            this.uploadCodeDialog = true;
            this.uploadStatus.estado = 'Completado!';
          } else this.uploadStatus = resp.datos;
          this.uploadStatus.estado = this.uploadStatus.estado || this.uploadStatus.error || resp.mensaje;
          if (this.uploadStatus && this.uploadStatus.error) {
            this.uploadCodeDialog = true;
          }
          if (resp.codigo === 404) {
            this.$storage.remove('uploadResultQ');
          }
        }).catch((error) => {
          this.uploadResult = null;
          this.$message.error(error.mensaje);
        });
      }
    },
    selectFile() {
      this.msgError = null;
      if (this.mFile) {
        this.uploadResult = null;
        this.sendProgress = 0;
        this.aSize = null;
        this.chunks = [];
        this.createChunks();
      }
    },
    upload() {
      this.$storage.remove('uploadResultQ');
      this.setTimeoutId = null;
      if (this.$refs.form.validate()) {
        if (!this.upload) this.isUpload = !this.isUpload;
        if (!this.aSize) this.aSize = this.chunks.length;
        this.count = this.count + 1;
        axios(this.config)
          .then((res) => {
            if (this.chunks.length === 1) {
              const { data: { datos: finalizado, mensaje } } = res;
              if (res.data.datos.codigoArchivo) {
                this.uploadResult = res.data.datos;
                this.$storage.set('uploadResultQ', this.uploadResult);
              }
              if (finalizado) {
                this.$message.success(mensaje);
                this.mFile = null;
                this.aSize = null;
                this.chunks = [];
                this.$emit('close', true);
              }
            }
            this.chunks.shift();
            if (this.mFile) {
              this.sendProgress += (this.uploaded) / this.mFile.size;
            } else {
              this.sendProgress = 100;
              this.setTimeoutCheck();
            }
          })
          .catch((error) => {
            this.count = this.count - 1;
            if (error.response && error.response.data && error.response.data.mensaje) {
              this.msgError = error.response.data.mensaje;
              this.$message.error(this.msgError);
              this.$waiting(false);
            }
          });
      } else {
        this.$message.error('Tiene que subir un archivo');
      }
    },
    createChunks() {
      this.count = 0;
      const size = 4000000;
      const chunks = Math.ceil(this.mFile.size / size);

      for (let i = 0; i < chunks; i++) {
        this.chunks.push(
          this.mFile.slice(
            i * size,
            Math.min(i * size + size, this.mFile.size),
            this.mFile.type
          )
        );
      }
    },
    uploadCodeDialogClose() {
      this.uploadCodeDialog = false;
      this.uploadResult = this.$storage.get('uploadResultQ');
      if (this.uploadResult) this.uploadResult.visto = true;
      this.$storage.set('uploadResultQ', this.uploadResult);
      this.$emit('update:uploading', false);
    },
    setTimeoutCheck() {
      // if (this.setTimeoutId) return;
      this.setTimeoutId = setTimeout(async () => {
        if (!this.uploadCodeDialog) {
          await this.getFileStatus();
          this.setTimeoutCheck();
        }
      }, 5000);
    }
  },
};
</script>
<style lang="scss">
@import '../../scss/variables.scss';
</style>
