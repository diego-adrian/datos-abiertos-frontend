const XLSX = require('xlsx');

export default {
  install: (Vue) => {
    Vue.prototype.XLSX = XLSX;
  }
};
