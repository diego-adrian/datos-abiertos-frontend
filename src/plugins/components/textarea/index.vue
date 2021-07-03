<template>
  <div>
    <label class="label-input-textarea">{{ label }}</label>
    <v-textarea
      v-model="textarea"
      solo
      :disabled="disabled"
      :autofocus="autofocus"
      :full-width="fullWidth"
      :class="`input-textarea-component mt-2 ${className}`"
      :style="width ? `width: ${width}px` : ''"
      outlined
      flat
      :id="id"
      :counter="counter"
      :rules="rules"
      :hint="hint"
      :rows="rows"
      :color="color"
      :oninput="oninput"
      :dense="dense"
      :placeholder="placeholder"
      :maxlength="maxlength"
      :clearable="clearable"
      :hide-details="hideDetails"
      :persistent-hint="persistentHint"
    >
    </v-textarea>
    <slot name="contenido"></slot>
  </div>
</template>
<script>
const NAME = 'v-input-textarea';
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
    width: {
      type: Number,
      default: null
    },
    rules: {
      type: Array,
      default: () => []
    },
    color: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: null
    },
    counter: {
      type: Boolean,
      default: false
    },
    hint: {
      type: String,
      default: ''
    },
    rows: {
      type: Number,
      default: 3
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
    hideDetails: {
      type: Boolean,
      default: false
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
    maxlength: null,
    oninput
  },
  mounted() {
    this.$nextTick(() => {
      this.textarea = this.init;
    });
  },
  watch: {
    textarea(value) {
      this.$emit('value', value);
    }
  },
  data: () => ({
    textarea: null
  })
};
</script>
<style lang="scss">
@import '../../../scss/variables.scss';

.label-input-textarea {
  font-weight: 500;
}

.input-textarea-component {
  label {
    display: none !important;
  }
}
</style>
