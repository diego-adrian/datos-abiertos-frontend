<template>
  <div>
    <label class="label-input-text">{{ label }}</label>
    <v-text-field
      v-if="showField"
      v-model="input"
      solo
      :disabled="disabled"
      :autofocus="autofocus"
      :full-width="fullWidth"
      :class="`input-text-component mt-2 ${className}`"
      :style="width ? `width: ${width}px` : ''"
      outlined
      flat
      :id="id"
      :counter="counter"
      :rules="rules"
      :hint="hint"
      :type="type"
      :color="color"
      :oninput="oninput"
      :dense="dense"
      :placeholder="placeholder"
      :maxlength="maxlength"
      :clearable="clearable"
      @change="$emit('change', change)"
      @input="$emit('input', input)"
      :append-icon="appendIcon ? appendIcon : null"
      :hide-details="hideDetails"
      :persistent-hint="persistentHint"
      @click:append="$emit('append', append)"
    >
    </v-text-field>
    <slot name="contenido"></slot>
  </div>
</template>
<script>
const NAME = 'v-input-text-field';
export default {
  name: NAME,
  props: {
    label: {
      type: String,
      default: ''
    },
    fullWidth: {
      type: Boolean,
      default: false
    },
    className: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: null
    },
    width: {
      type: Number,
      default: null
    },
    change: {
      type: Function,
      default: () => {}
    },
    counter: {
      type: Boolean,
      default: false
    },
    rules: {
      type: Array,
      default: () => []
    },
    color: {
      type: String,
      default: ''
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
    dense: {
      type: Boolean,
      default: null
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
    append: {
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
    },
    showField: {
      type: Boolean,
      default: true
    },
    maxlength: null,
    oninput
  },
  mounted() {
    this.$nextTick(() => {
      this.input = this.init;
    });
  },
  watch: {
    input(value) {
      this.$emit('value', value);
    }
  },
  data: () => ({
    input: null
  })
};
</script>
<style lang="scss">
@import '../../../scss/variables.scss';

.label-input-text {
  font-weight: 500;
}

.input-text-component {
  label {
    display: none !important;
  }
}
</style>
