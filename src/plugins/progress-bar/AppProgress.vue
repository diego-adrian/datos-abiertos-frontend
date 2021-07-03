<template>
   <v-progress-linear
      class="app--progress"
      :active="active"
      :background-opacity="0.3"
      fixed
      :buffer-value="100"
      :height="4"
      indeterminate
      top
      :value="value"
      color="info"
    ></v-progress-linear>
</template>
<script>
import { mapState } from 'vuex';

export default {
  data: () => ({
    bottom: false,
    query: true,
    value: 0
  }),
  computed: mapState({
    active: store => store.progress.active
  })
};
</script>
<style lang="scss" scoped>
  .app--progress {
    z-index: 1000;
  }
</style>
