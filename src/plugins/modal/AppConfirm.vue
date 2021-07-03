<template>
  <v-dialog v-model="show" persistent content-class="dialog--alert" :max-width="width">
    <v-card>
      <v-card-title class="title--dialog">
        <v-icon-component icon="new_releases" class="warning--text"></v-icon-component>
        <span class="fs10 ml-2">Confirmar</span>
        </v-card-title>
      <v-card-text v-html="text" class="pt-0"></v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click.native="cancel()" elevation="0" id="btn-confirm-selected-cancel">{{ textCancel }}</v-btn>
        <v-btn dark color="primary" @click.native="ok()" id="btn-confirm-selected-ok" elevation="0">{{
          textOk
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex';
import vIconComponent from '@/plugins/icon/index.vue';

export default {
  data: () => ({}),
  mounted() {
    const el = document.querySelector('.dialog--alert');
    if (el) {
      el.parentNode.style.zIndex = 100;
    }
  },
  components: {
    vIconComponent
  },
  methods: {
    ok() {
      const { confirm } = this.$store.state;
      confirm.show = false;
      this.$store.commit('CLOSE_CONFIRM');

      if (typeof confirm.callbackOk === 'function') {
        confirm.callbackOk();
      }
    },
    cancel() {
      const { confirm } = this.$store.state;
      confirm.show = false;
      this.$store.commit('CLOSE_CONFIRM');

      if (typeof confirm.callbackCancel === 'function') {
        confirm.callbackCancel();
      }
    }
  },
  computed: mapState({
    show: store => store.confirm.show,
    width: store => store.confirm.width,
    text: store => store.confirm.text,
    textOk: store => store.confirm.textOk,
    textCancel: store => store.confirm.textCancel
  })
};
</script>

<style lang="scss">
@import '../../scss/variables.scss';
.overlay + .overlay {
  z-index: 99;
}
.dialog--alert {
  .title--dialog {
    font-size: 1.1rem !important;
  }
}
</style>
