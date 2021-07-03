<template>
  <div
    id="app-waiting"
    :class="[
      show ? 'app-waiting d-flex' : 'app-waiting none',
      ['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'flex-column' : ''
    ]"
    v-if="show"
  >
    <v-progress-circular
      indeterminate
      :size="50"
      color="warning"
      class="mr-2"
    ></v-progress-circular>
    <span
      :class="[
        'white--text text-center',
        ['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'fs10' : 'fs15'
      ]"
      >{{ message }}</span
    >
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: mapState({
    show: store => store.waiting.show,
    message: store => store.waiting.message
  })
};
</script>

<style lang="scss">
@import '../../scss/variables.scss';
.app-waiting {
  background-color: $primary;
  display: none;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 999;
  justify-content: center;
  align-items: center;
  -moz-user-select: none;
  -webkit-user-select: none;
  -o-user-select: none;
  user-select: none;
  .progress-circular {
    margin: 0 10px 0 0;
  }
}
</style>
