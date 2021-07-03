<template>
  <div>
    <v-tabs show-arrows icons-and-text background-color="backgroundColor" fixed-tabs wrap v-model="selectedTab">
      <v-tab>
        Áreas
        <!--        <v-icon-component icon="local_library"/>-->
      </v-tab>
      <v-tab-item>
        <areas/>
      </v-tab-item>
      <v-tab>
        Grados de escolaridad
        <!--        <v-icon-component icon="school"/>-->
      </v-tab>
      <v-tab-item>
        <grados-escolares/>
      </v-tab-item>
      <v-tab>
        Distritos
        <!--        <v-icon-component icon="fmd_good"/>-->
      </v-tab>
      <v-tab-item>
        <distritos/>
      </v-tab-item>
      <v-tab>
        Unidades Educativas
        <!--        <v-icon-component icon="flag"/>-->
      </v-tab>
      <v-tab-item>
        <unidades-educativas/>
      </v-tab-item>
    </v-tabs>
  </div>
</template>
<script>

import { $Casbin } from '@/plugins/casbin';
import validate from '@/common/mixins/validate';
import areas from '@/components/areas/index.vue';
import gradosEscolares from '@/components/grado-escolaridad/index.vue';
import distritos from '@/components/distritos/index.vue';
import unidadesEducativas from '@/components/unidadesEducativas/index.vue';

export default {
  mixins: [validate],
  data: () => ({
    selectedTab: null,
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
    areas,
    gradosEscolares,
    distritos,
    unidadesEducativas
  }
};
</script>
