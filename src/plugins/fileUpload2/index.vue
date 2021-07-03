<template>
  <v-card
      elevation="0"
      class="pa-2 d-flex flex-column align-center justify-center"
  >
    <v-container>
      <v-form ref="form" lazy-validation @submit.prevent="upload">
        <v-divider></v-divider>
        <v-card elevation="0" class="d-flex flex-column align-center justify-center">
          <v-file-input
              label="Subir archivos"
              v-model="mFile"
              @change="selectFile"
              show-size
              style="width: 350px"
              :rules="[(val) => !!val || 'Tiene que subir un archivo']"
              class="mb-4"
              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet (.xlsx), application/vnd.oasis.opendocument.spreadsheet (.ods)"
              hint="Solo se admite archivos con extension .ods y .xlsx"
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
          <v-progress-linear :value="sendProgress" class="mt-1 mb-4"></v-progress-linear>
          <v-alert
              type="info"
              text
              dense
              class="fs8"
          >
            Nota: Despues de subir el archivo usted puede cerrar la pantalla emergente o esperar porque se le notificará cuando termine de registrar todos los estudiantes.
          </v-alert>
          <v-alert
              type="info"
              text
              dense
              class="fs8"
          >
            Si tienes problemas puedes descargar un ejemplo
            <v-btn icon @click="descargarEjemplo()" color="success">
              <v-icon-component icon="file_download"></v-icon-component>
            </v-btn>
            <template v-slot:prepend>
              <v-icon-component icon="lightbulb"/>
            </template>
          </v-alert>
          <v-btn v-if="mFile" block type="submit" color="primary">Subir archivo</v-btn>
        </v-card>
      </v-form>
    </v-container>
    <br>
    <v-container v-if="uploadResult" class="text-center">
      <h4>Estado del archivo enviado</h4>
      <v-btn
          color="primary"
          dark
          :loading="!uploadStatus.estado"
          @click="getFileStatus"
      >
        Ver estado
      </v-btn>
      <v-alert
          :color="uploadStatus.error ? 'error' : uploadStatus.estado ? 'info':'info' "
          text
          dense
          class="fs8"
      >
        <div>{{ uploadStatus.estado }}</div>
        <div v-if="uploadStatus.cantidad">{{ uploadStatus.cantidad }} filas</div>
        <div v-if="uploadResult.fecha">Fecha de envio, {{moment(uploadResult.fecha).format('DD/MM/YYYY HH:mm:ss')}}</div>
      </v-alert>
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
                @click="uploadCodeDialog = false"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>Errores en el archivo {{uploadResult.nombreArchivo}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-title>
              <v-btn
                  dark
                  text
                  @click="uploadCodeDialog = false"
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
              >
                No hay errores
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
      type: String,
      default: null
    }
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
      { text: 'Código SIE', value: 'codigoSie' },
      { text: 'RUDE', value: 'rude' },
      { text: 'Número de documento', value: 'nroDocumento' },
      { text: 'Tipo de documento', value: 'tipoDocumento' },
      { text: 'Fecha de nacimiento', value: 'fechaNacimiento' },
      { text: 'Nombre', value: 'nombres' },
      { text: 'Primer apellido', value: 'primerApellido' },
      { text: 'Segundo apellido', value: 'segundoApellido' },
      { text: 'Género', value: 'genero' },
      { text: 'Teléfono', value: 'telefono' },
      { text: 'Correo electrónico', value: 'correo' },
    ],
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
      const idEtapaAreaGrado = btoa(`data_${this.idEag}`);
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
        url: `${this.$baseServer}inscripciones/estudiantes/subirFragmento`,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `${this.$authToken} ${this.$storage.get('token')}`
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
  },
  methods: {
    getFileStatus() {
      this.uploadStatus = {};
      this.uploadResult = this.$storage.get('uploadResultQ');
      if (this.uploadResult) {
        this.$service.get(`inscripciones/estudiantes/${this.uploadResult.codigoArchivo}/estado`).then((resp) => {
          if (Array.isArray(resp.datos)) {
            this.uploadData = resp.datos;
            this.uploadCodeDialog = true;
            this.uploadStatus.estado = 'Completado!';
          } else this.uploadStatus = resp.datos;
          this.uploadStatus.estado = this.uploadStatus.estado || this.uploadStatus.error || resp.mensaje;
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
        this.uploadData = null;
        this.uploadStatus = {
          estado: 'Haga click en ver'
        };
        this.sendProgress = 0;
        this.aSize = null;
        this.chunks = [];
        this.createChunks();
      }
    },
    async descargarEjemplo() {
      await this.$service.requestWithConfig({
        method: 'GET',
        url: `${this.$baseServer}inscripciones/estudiantes/descargarEjemplo`,
        headers: {
          Authorization: `${this.$authToken} ${this.$storage.get('token')}`
        },
        responseType: 'blob'
      })
        .then((resultado) => {
          const url = URL.createObjectURL(new Blob([resultado], {
            type: 'application/vnd.ms-excel'
          }));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'ejemplo_inscripción.ods');
          document.body.appendChild(link);
          link.click();
        });
    },
    upload() {
      this.$storage.remove('uploadResultQ');
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
                // this.$emit('close', true);
              }
            }
            this.chunks.shift();
            // this.sendProgress += (this.uploaded * 100) / this.mFile.size;
            if (this.mFile) {
              this.sendProgress += (this.uploaded) / this.mFile.size;
            } else {
              this.sendProgress = 100;
            }
          })
          .catch((error) => {
            this.count = this.count - 1;
            console.error('error', error);
            if (error.response && error.response.data && error.response.data.mensaje) {
              // this.$message.error(error.response.data.mensaje);
              this.msgError = error.response.data.mensaje;
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
    closeModal() {
      this.$emit('close-dialog');
    },
    reload() {
      this.$emit('recargar');
    }
  },
};
</script>
<style lang="scss">
@import '../../scss/variables.scss';
</style>
