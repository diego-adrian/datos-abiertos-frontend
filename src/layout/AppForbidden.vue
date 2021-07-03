<template>
  <v-card elevation="0" color="backgroundColor" class="not-found">
    <v-card elevation="0" class="backgroundColor not-found__message text-center">
      <h1><span class="primary--text">4</span>0<span class="primary--text">3</span></h1>
      <h4>Ups !!! no tienes acceso a esta sección </h4>
      <v-btn color="primary" class="mt-1" outlined @click="$router.push('/home')">
        <v-icon-component icon="arrow_back"></v-icon-component>
        <span>Volver al home</span>
      </v-btn>
    </v-card>
  </v-card>
</template>
<script>

import vIconComponent from '@/plugins/icon/index.vue';

export default {
  components: {
    vIconComponent
  }
};
</script>

<style lang="scss">
@import '../scss/variables.scss';

.not-found {
  background-size: cover;
  background-position: top center;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;

  .not-found__message {
    box-shadow: 0 1px 4px 0 rgba($color: $black, $alpha: 0.1);
    padding: 30px;
    background-color: rgba($white, 0.8);
    width: 100%;
    max-width: 680px;

    h1 {
      font-weight: bold;
      font-size: 11rem;
      margin-top: 0;
      letter-spacing: 2px;
    }

    h4 {
      font-size: 1.3rem;
      font-weight: 300;
    }
  }

  .error-500 {
    background-color: $secondary;
    color: #fafafa;
    padding: 18px 20px;
    font-family: Courier;
    margin-bottom: 20px;
    font-size: 12px;
    text-align: left;
  }
}
</style>
