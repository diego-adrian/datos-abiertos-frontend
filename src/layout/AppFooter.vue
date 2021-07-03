<template>
  <v-footer
    :fixed="!['xs', 'sm'].includes($vuetify.breakpoint.name)"
    :absolute="['xs', 'sm'].includes($vuetify.breakpoint.name)"
    height="80"
    :inset="inset"
    app
    tile
    color="backgroundColor"
    padless
    class="primary--text d-flex flex-row align-center justify-space-between pr-5"
  >

    <v-card
      elevation="0"
      class="listado d-flex flex-row align-end justify-space-between"
    >
      <v-btn color="error" class="banner--entorno" dark elevation="0" x-small
             v-if="enviroment!=='PROD' && enviroment.length >0 "
             @click="info()">
        {{ enviroment }}
      </v-btn>
      <transition name="fade" mode="out-in">
      </transition>
    </v-card>
    <v-card elevation="0" width="100px">
      <v-img
        v-if="this.$vuetify.theme.dark"
        src="./img/logoAgeticBalanco.png"
        max-width="100"
      />
      <v-img v-else src="./img/logoAgetic.png" max-width="100"/>
    </v-card>
  </v-footer>
</template>

<script>

export default {
  data: () => ({
    fixed: false,
    inset: true,
    enviroment: '',
  }),
  mounted() {
    this.enviroment = process.env.VUE_APP_ENVIROMENT;
  },
  methods: {
    info() {
      this.$alert(`Usted esta usando el entorno de ${this.enviroment}`, () => {
      });
    }
  }
};
</script>
<style lang="scss">
@import "../scss/variables.scss";

.banner--entorno {
  margin: 20px;
}

</style>
