<template>
  <v-dialog v-model="show" persistent content-class="dialog--confirm" max-width="360">
    <v-card>
      <v-card-title class="headlineModified">{{ title || 'Alerta' }}</v-card-title>
      <v-card-text v-html="text" class="pt-0"></v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" dark @click.native="ok()">Aceptar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex';

export default {
  mounted() {
    const el = document.querySelector('.dialog--confirm');
    if (el) {
      el.parentNode.style.zIndex = 100;
    }
  },
  methods: {
    ok() {
      const { alert } = this.$store.state;
      this.$store.commit('CLOSE_ALERT');

      if (typeof alert.callback === 'function') {
        alert.callback();
      }
    }
  },
  computed: mapState({
    title: store => store.alert.title,
    show: store => store.alert.show,
    text: store => store.alert.text
  })
};
</script>

<style lang="scss">
.v-dialog--confirm,
.v-dialog--alert {
  z-index: 100;
}
</style>
