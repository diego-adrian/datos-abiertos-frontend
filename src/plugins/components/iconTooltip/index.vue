<template>
  <v-tooltip bottom :color="color">
    <template v-slot:activator="{ on }">
      <v-btn :color="color" :small="['xs', 'sm'].includes($vuetify.breakpoint.name)" icon v-on="on"
             slot="activator" @click.stop="accion"
             :disabled="disabled"
             :id="id"
      >
        <v-icon-component :icon="icon"/>
      </v-btn>
    </template>
    {{ text }}
    <slot name="contenido"></slot>
  </v-tooltip>
</template>
<script>
import vIconComponent from '@/plugins/icon/index.vue';

const NAME = 'v-icon-tooltip';

export default {
  name: NAME,
  props: {
    icon: {
      type: String,
      default: null
    },
    color: {
      type: String,
      default: 'white'
    },
    text: {
      type: String,
    },
    disabled: {
      type: Boolean,
      default: false
    },
    id: null
  },
  components: {
    vIconComponent
  },
  methods: {
    accion() {
      this.$emit('accion');
    }
  },
  data: () => ({
    codeIcon: null
  })
};
</script>
<style lang="scss">
@import '../../../scss/variables';

</style>
