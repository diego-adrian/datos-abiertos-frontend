<template>
  <span class="fs9 ml-0 pl-0 d-flex flex-row bloque--detalles" v-if="show">
    <v-select
      label="Olimpiada seleccionada:"
      :value="selectedOlympiad || mOlimpiada"
      item-text="nombre"
      item-value="id"
      @change="selectOlympiad"
      style="width: 200px; max-width: 200px"
      class=""
      no-data-text="No hay olimpiadas que listar"
      :items="olympiads || aOlimpiadas"
      hide-details
      v-if="[
        '/etapas',
        '/etapas-areas-grados',
        '/banco-preguntas',
        '/inscripciones',
        '/calificacion-publicacion',
        '/impugnacion',
        '/medalleros-generar'
      ].includes(path)"
    >
    </v-select>
    <v-select
      label="Selecciona la etapa"
      :items="stages || aEtapas"
      :value="selectedStage || mEtapa"
      item-text="nombre"
      return-object
      style="width: 200px; max-width: 200px"
      hide-details
      class=" ml-2"
      @change="selectStage"
      v-if="[
        '/etapas-areas-grados',
        '/banco-preguntas',
        '/inscripciones',
        '/calificacion-publicacion',
        '/impugnacion',
        '/medalleros-generar'
      ].includes(path)"
      no-data-text="No existen registros"
    ></v-select>
    <v-select
      label="Selecciona el area"
      :items="areas || aAreas"
      :value="selectedArea || mArea"
      @change="selectArea"
      class=" ml-2"
      style="width: 200px; max-width: 200px"
      item-text="nombre"
      return-object
      v-if="[
        '/banco-preguntas',
        '/inscripciones',
        '/impugnacion'
      ].includes(path)"
      hide-details
      no-data-text="No existen registros"
    ></v-select>
  </span>
</template>
<script>
import { mapState } from 'vuex';
import Auth from '@/components/auth/mixins/auth';

export default {
  mixins: [Auth],
  props: {
    path: {
      type: String,
      default: null
    }
  },
  data: () => ({
    mOlimpiada: null,
    aOlimpiadas: [],
    url: [
      '/politicas',
      '/areas',
      '/grados-escolares',
      '/distritos',
      '/unidades-educativas/',
      '/usuarios',
      '/olimpiadas',
      '/examen-offline'
    ],
    oShow: null,
    sShow: null,
    aShow: null,
    mArea: null,
    aAreas: []
  }),
  computed: {
    show() {
      let response = true;
      if (this.url.includes(this.path)) response = false;
      return response;
    },
    ...mapState([
      'olympiadBreadcrumb',
      'stageBreadcrumb',
      'areaBreadcrumb',
      'olympiads',
      'selectedOlympiad',
      'stages',
      'selectedStage',
      'areas',
      'selectedArea'
    ])
  },
  methods: {
    async selectOlympiad (item) {
      this.$store.commit('setMain', false);
      await this.setInitOlympiad(item);
      await this.getStages();
      setTimeout(() => {
        this.$store.commit('setMain', true);
      }, 10);
    },
    selectStage (item) {
      this.$store.commit('setMain', false);
      this.$storage.set('etapaSeleccionada', item);
      setTimeout(async () => {
        await this.getAreas();
        this.$store.commit('setMain', true);
      }, 10);
    },
    selectArea (item) {
      this.$store.commit('setMain', false);
      this.$storage.set('areaSeleccionada', item);
      setTimeout(() => {
        this.$store.commit('setMain', true);
      }, 10);
    },
    async getOlympiad () {
      return new Promise((resolve, reject) => {
        try {
          if (this.$storage.get('olimpiadas')) {
            const olimpiadas = this.$storage.get('olimpiadas');
            this.aOlimpiadas = olimpiadas;
            const [first] = olimpiadas;
            this.mOlimpiada = first;
            this.$store.commit('setOlympiad', this.mOlimpiada);
          }
          resolve(true);
        } catch (error) {
          reject(error.message);
        }
      });
    },
  },
  mounted () {
    this.$nextTick(async () => {
      await this.getOlympiad();
      await this.getStages();
      await this.getAreas();
    });
  }
};
</script>
<style lang="scss">
  .olympics--list {
    margin-bottom: -15px !important;
    .v-input__control {
      min-height: 55px !important;
    }
  }
</style>
