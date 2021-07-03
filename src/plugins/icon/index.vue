<template>
  <a-icon :name="ICONS[icon]" :class="className" :color="color" :size="size" outlined style="margin: 5px"/>
</template>
<script>
const NAME = 'v-icon-component';
export default {
  name: NAME,
  props: {
    icon: {
      type: String,
      default: null
    },
    size: {
      type: Number,
      default: 24
    },
    color: {
      type: String,
      default: 'white'
    },
    className: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    codeIcon: null
  })
};
</script>
<style lang="scss">
@import '../../scss/variables.scss';

</style>
