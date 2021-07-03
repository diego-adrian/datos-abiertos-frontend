import * as Component from './components';

export default {
  install: Vue => {
    Vue.component('v-input-text-field', Component.TextField);
    Vue.component('v-input-select', Component.Select);
    Vue.component('v-input-textarea', Component.Textarea);
    Vue.component('v-icon-tooltip', Component.vIconTooltip);
    Vue.component('app-dialog', Component.AppDialog);
  }
};
