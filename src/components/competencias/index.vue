<template>
  <div>
    <v-tabs show-arrows icons-and-text background-color="backgroundColor" fixed-tabs wrap v-model="selectedTab">
      <v-tab>
        Olimpiadas
        <v-icon-component icon="local_library"/>
      </v-tab>
      <v-tab-item>
        <olimpiadas @selectedOlympiad="selectedOlympiad"/>
      </v-tab-item>
      <v-tab :disabled="!idOlympiad">
        Etapas
        <v-icon-component icon="school"/>
      </v-tab>
      <v-tab-item>
        <etapas v-if="idOlympiad" :idOlympiad="idOlympiad" @selectedStage="selectedStage"/>
      </v-tab-item>
      <v-tab :disabled="!idStage">
        Etapas-áreas-grados
        <v-icon-component icon="fmd_good"/>
      </v-tab>
      <v-tab-item>
        <etapas-areas-grados v-if="idStage" :idStage="idStage" :idOlympiad="idOlympiad"  @selectedArea="selectedArea"/>
      </v-tab-item>
      <v-tab :disabled="!idArea">
        Banco de preguntas
        <v-icon-component icon="flag"/>
      </v-tab>
      <v-tab-item>
        <banco-preguntas v-if="idArea" :idArea="idArea"/>
      </v-tab-item>
      <v-tab :disabled="!idArea">
        Inscripciones
        <v-icon-component icon="how_to_reg"/>
      </v-tab>
      <v-tab-item>
        <inscripciones v-if="idArea" :idEtapaAreaGradoSelected="idArea"/>
      </v-tab-item>
    </v-tabs>
  </div>
</template>
<script>

import { $Casbin } from '@/plugins/casbin';
import validate from '@/common/mixins/validate';
import olimpiadas from '@/components/olimpiada/index.vue';
import etapas from '@/components/etapas/index.vue';
import etapasAreasGrados from '@/components/etapas-areas-grados/index.vue';
import bancoPreguntas from '@/components/bancoPreguntas/index.vue';
import inscripciones from '@/components/inscripciones/index.vue';
import vIconComponent from '@/plugins/icon/index.vue';

export default {
  mixins: [validate],
  data: () => ({
    selectedTab: null,
    idOlympiad: false,
    idStage: false,
    idArea: false
  }),
  mounted() {
    // Verificar permiso para crear
    if ($Casbin && $Casbin.enforcer) {
      const { rol } = this.$storage.get('rol');
      $Casbin.enforcer.enforce(rol, '/olimpiadas', 'create')
        .then(permitido => {
          this.btnAgregar = permitido;
        });
      $Casbin.enforcer.enforce(rol, '/olimpiadas', 'update')
        .then(permitido => {
          this.btnEditar = permitido;
        });
      $Casbin.enforcer.enforce(rol, '/olimpiadas', 'delete')
        .then(permitido => {
          this.btnEliminar = permitido;
        });
    }
    this.loadParams();
  },
  methods: {
    selectedOlympiad (idOlympiad) {
      this.idOlympiad = null;
      setTimeout(() => {
        this.idOlympiad = idOlympiad;
        this.selectedTab = 1;
      }, 10);
    },
    selectedStage (idStage) {
      this.idStage = null;
      setTimeout(() => {
        this.idStage = idStage;
        this.selectedTab = 2;
      }, 10);
    },
    selectedArea (idArea) {
      this.idArea = null;
      setTimeout(() => {
        this.idArea = idArea;
        this.selectedTab = 3;
      }, 10);
    },
    async loadParams() {
      await this.$service.get('roles')
        .then((resultado) => {
          this.roles = resultado && resultado.datos ? resultado.datos : [];
        });
    },
    closeModal() {
      this.reset();
      this.$store.commit('closeModal');
    }
  },
  components: {
    olimpiadas,
    etapas,
    etapasAreasGrados,
    bancoPreguntas,
    inscripciones,
    vIconComponent
  }
};
</script>
