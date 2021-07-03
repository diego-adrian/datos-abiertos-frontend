<template>
  <div>
    <v-dialog v-model="modal2" persistent width="400">
      <v-card>
        <v-card-title>
          <v-btn icon class="primary--text btn-filter">
            <v-icon-component icon="info" color="primary"/>
          </v-btn>
          Confirmación
        </v-card-title>
        <v-card-text>
          <p>
          Se calificarán los exámenes y se
          publicarán las respuestas a través del sistema. Ya no se podrán ajustar o añadir
          fechas a los calendarios de la etapa.
          </p>
          <v-simple-table dense>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">
                    Detalles etapa
                  </th>
                  <th class="text-left">
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td> Nombre </td>
                  <td>{{ etapaSeleccionada.nombre }}</td>
                </tr>
                <tr>
                  <td> Tipo</td>
                  <td>{{ etapaSeleccionada.tipo }}</td>
                </tr>
                <tr>
                  <td> Fecha inicio </td>
                  <td>{{ etapaSeleccionada.fechaInicio }}</td>
                </tr>
                <tr>
                  <td> Fecha fin </td>
                  <td>{{ etapaSeleccionada.fechaFin }}</td>
                </tr>
                <tr>
                  <td> <i> Nombre olimpiada </i></td>
                  <td>{{ olimpiadaSeleccionada.nombre }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            elevation="0"
            @click="$store.commit('closeModal', 2)"
          >
            Cancelar
          </v-btn>
          <v-btn
            dark color="primary"
            @click="calificar"
            elevation="0"
          >
            Calificar y publicar
            <v-icon
              right
              dark
            >
              rule
            </v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-card class='crud-table'>
      <v-card-title>
        <v-card elevation="0"
          class="subtitle primary--text font-weight-regular pl-4 fs12">Calificacion
        </v-card>
        <v-spacer></v-spacer>
        <v-tooltip bottom color="primary">
          <template v-slot:activator="{ on }">
            <v-btn icon :small="['xs', 'sm'].includes($vuetify.breakpoint.name)" @click.native="descargarReporte" class="primary--text btn-filter" v-on="on" :disabled="!etapaSeleccionada.id || !olimpiadaSeleccionada.id">
              <v-icon-component icon="download" color="primary"/>
            </v-btn>
          </template>
          <span> Descargar Reporte </span>
        </v-tooltip>
        <v-tooltip bottom color="primary">
          <template v-slot:activator="{ on }">
            <v-btn icon :small="['xs', 'sm'].includes($vuetify.breakpoint.name)" @click.native="abrirConfirm" class="primary--text btn-filter" v-on="on" :disabled="!etapaSeleccionada.id || !olimpiadaSeleccionada.id">
              <v-icon-component icon="rule" color="primary"/>
            </v-btn>
          </template>
          <span> Calificar exámenes y publicar respuestas </span>
        </v-tooltip>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="items"
        class="data--table"
        :search="search"
        :custom-filter="filterOnlyCapsText"
      >
      <template v-slot:top>
        <v-text-field
          v-model="search"
          label="Buscar por unidad educativa o código SIE"
          class="mx-4"
          prepend-icon="search"
        ></v-text-field>
      </template>
      </v-data-table>
    </v-card>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import vIconComponent from '../../plugins/icon/index.vue';

export default {
  computed: {
    ...mapState(['modal2'])
  },
  data: () => ({
    reporte: false,
    search: '',
    headers: [
      {
        text: 'Unidad Educativa',
        value: 'unidadEducativa'
      },
      {
        text: 'Codigo SIE',
        value: 'codigoSie'
      },
      {
        text: 'Area',
        value: 'area'
      },
      {
        text: 'Año de escolaridad',
        value: 'gradoEscolar'
      },
      {
        text: 'Cantidad de inscritos',
        value: 'cantidadInscritos'
      },
      {
        text: 'cantidad Online',
        value: 'cantidadOnline'
      },
      {
        text: 'Cantidad Offline',
        value: 'cantidadOffline'
      },
      {
        text: 'Total Finalizados',
        value: 'examenesFinalizados'
      },
      {
        text: 'Porcentaje',
        value: 'porcentaje'
      },
    ],
    items: [],
    modalCalificacion: true,
    etapaSeleccionada: {},
    olimpiadaSeleccionada: {},
  }),
  async mounted() {
    this.etapaSeleccionada = this.$storage.get('etapaSeleccionada');
    this.olimpiadaSeleccionada = this.$storage.get('olimpiadaSeleccionada');
    if (!this.etapaSeleccionada?.id || !this.olimpiadaSeleccionada?.id) {
      this.$message.error('Debe seleccionar una olimpiada y una etapa');
    }
    this.obtenerReporte();
  },
  methods: {
    async obtenerReporte() {
      this.items = [];
      this.reporte = false;
      this.$service.get(`calificaciones/etapas/${this.etapaSeleccionada.id}`).then((resp) => {
        if (resp.finalizado) {
          this.items = resp.datos.filas;
          if (this.items && this.items.length) {
            this.reporte = true;
          }
        }
      });
    },
    async descargarReporte() {
      if (this.items && this.items.length) {
        // Generar ods TODO opcional
        const worksheet = this.XLSX.utils.json_to_sheet(this.items);
        const workbook = this.XLSX.utils.book_new();
        this.XLSX.utils.book_append_sheet(workbook, worksheet, 'SheetJS');
        const wopts = {
          bookType: 'ods',
          bookSST: false,
        };
        this.XLSX.writeFile(workbook, 'reporte.ods', wopts);
      }
    },
    async abrirConfirm() {
      this.$store.commit('openModal', 2);
    },
    async calificar(item) {
      const body = {
        item
      };
      this.$waiting(true, `Calificando exámenes de la etapa ${this.etapaSeleccionada.nombre} ...`);
      this.$service.patch(`calificaciones/etapas/${this.etapaSeleccionada.id}`, body).then((resp) => {
        if (resp.finalizado) {
          this.$store.commit('closeModal', 2);
          this.$message.success('Los exámenes fueron calificados y publicados');
        }
        this.$waiting(false);
      });
    },
    filterOnlyCapsText (value, search, item) {
      return search != null
        && (item.unidadEducativa.toUpperCase().indexOf(search.toUpperCase().trim()) !== -1 || item.codigoSie.toString().indexOf(search.trim()) !== -1);
    },
  },
  components: {
    vIconComponent,
  }
};
</script>
