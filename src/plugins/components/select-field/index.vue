<template>
  <div class="w100">
    <label class="label-input-select">{{ label }}</label>
    <v-select
      v-model="select"
      :item-color="itemColor"
      :autofocus="autofocus"
      :color="color"
      :items="items"
      :item-text="itemText"
      :item-value="itemValue"
      :dense="dense"
      :class="`input-select-component mt-2 ${className}`"
      outlined
      flat
      :disabled="disabled"
      @change="$nextTick(() => {
        $emit('change', change)
      });"
      :multiple="multiple"
      :id="id"
      :rules="rules"
      :hint="hint"
      :append-icon="appendIcon ? appendIcon : ICONS.arrow_drop_down"
      :clearable="clearable"
      :hide-details="hideDetails"
      :persistent-hint="persistentHint"
    >
      <slot name="contenido"></slot>
    </v-select>
  </div>
</template>
<script>
const NAME = 'v-input-select';
export default {
  name: NAME,
  props: {
    label: {
      type: String,
      default: ''
    },
    itemColor: {
      type: String,
      default: 'primary'
    },
    color: {
      type: String,
      default: 'primary'
    },
    items: {
      type: Array,
      default: () => []
    },
    itemText: {
      type: String,
      default: null
    },
    itemValue: {
      type: String,
      default: null
    },
    dense: {
      type: Boolean,
      default: false
    },
    change: {
      type: Function,
      default: () => {}
    },
    className: {
      type: String,
      default: ''
    },
    width: {
      type: Number,
      default: null
    },
    multiple: {
      type: Boolean,
      default: null
    },
    rules: {
      type: Array,
      default: () => []
    },
    hint: {
      type: String,
      default: ''
    },
    persistentHint: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
    },
    autofocus: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    hideDetails: {
      type: Boolean,
      default: false
    },
    appendIcon: {
      type: String,
      default: null
    },
    clickAppend: {
      type: Function,
      default: () => {}
    },
    uppercase: {
      type: Boolean,
      default: false
    },
    init: null,
    disabled: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.select = this.init;
    });
  },
  watch: {
    init (value) {
      this.select = value;
      this.$emit('value', value);
    },
    select (value) {
      this.$emit('value', value);
    }
  },
  data: () => ({
    select: null
  })
};
</script>
<style lang="scss">
@import '../../../scss/variables.scss';
.label-input-select {
  font-weight: 500;
}
</style>
