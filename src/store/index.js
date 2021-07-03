import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    main: true,
    auth: false,
    menu: {},
    user: {},
    progress: {
      active: false
    },
    sidenav: false,
    state403: false,
    modal: false,
    modal2: false,
    modal3: false,
    modal4: false,
    modal5: false,
    modal6: false,
    modal7: false,
    modal8: false,
    alert: {
      show: false,
      title: 'Alerta',
      text: '',
      callback: null
    },
    waiting: {
      show: false,
      message: ''
    },
    confirm: {
      show: false,
      text: '',
      width: 360,
      callbackOk: null,
      callbackCancel: null,
      textOk: '',
      textCancel: ''
    },
    snackbar: {
      status: false,
      timeout: 6000,
      message: '',
      title: '',
      icon: '',
      theme: ''
    },
    drawer: false,
    submenu: false,
    currentBackground: '',
    olympiadBreadcrumb: '',
    stageBreadcrumb: '',
    areaBreadcrumb: '',
    profile: {
      nombres: null,
      nroDocumento: null,
      primerApellido: null,
      segundoApellido: null,
      tipoDocumento: null,
      fechaNacimiento: null
    },
    olympiads: null,
    selectedOlympiad: null,
    stages: null,
    selectedStage: null,
    areas: null,
    selectedArea: null,
    idSetInterval: null,
  },
  mutations: {
    setShowMenus (state, value) {
      state.submenu = value;
    },
    setDrawer (state, value) {
      state.drawer = value;
    },
    setCurrentBackground(state, value) {
      state.currentBackground = value;
    },
    setOlympiads(state, value) {
      state.olympiads = value;
    },
    setOlympiad(state, value) {
      state.selectedOlympiad = value;
    },
    setStages(state, value) {
      state.stages = value;
    },
    setStage(state, value) {
      state.selectedStage = value;
    },
    setAreas(state, value) {
      state.areas = value;
    },
    setArea(state, value) {
      state.selectedArea = value;
    },
    setOlympiadBreadcrumb (state, value) {
      state.olympiadBreadcrumb = value;
    },
    setStageBreadcrumb (state, value) {
      state.stageBreadcrumb = value;
    },
    setAreaBreadcrumb (state, value) {
      state.areaBreadcrumb = value;
    },
    setMain(state, value) {
      state.main = value;
    },
    setUser(state, value) {
      state.user = value;
    },
    setMenu(state, value) {
      state.menu = value;
    },
    setAuth(state, value) {
      state.auth = value;
    },
    setSnackbar(state, value) {
      state.snackbar.status = value;
    },
    setSidenav(state, value) {
      state.sidenav = value;
    },
    openModal(state, id = '') {
      state[`modal${id}`] = true;
    },
    closeModal(state, id = '') {
      state[`modal${id}`] = false;
    },
    setState403(state, value) {
      state.state403 = value;
    },
    setDefault(state) {
      state.auth = false;
      state.menu = {};
      state.user = {};
      state.modal = false;
      state.modal2 = false;
      state.modal3 = false;
      state.modal4 = false;
      state.modal5 = false;
      state.modal6 = false;
      state.modal7 = false;
      state.modal8 = false;
      state.modalArea = false;
      state.modalEtapa = false;
      state.modalGradoEscolar = false;
      state.modalDistrito = false;
      state.modalUnidadEducativa = false;
      state.state403 = false;
      state.alert.show = false;
      state.confirm.show = false;
    },
    setIdSetInterval(state, value) {
      state.idSetInterval = value;
    },
    CLOSE_ALERT(state) {
      state.alert.show = false;
    },
    CLOSE_CONFIRM(state) {
      state.confirm.show = false;
    },
    CLOSE_PROGRESS(state) {
      state.progress.active = false;
    },
    setProfile(state, value) {
      state.profile = value;
    },
    resetProfile(state) {
      state.profile.nombres = null;
      state.profile.nroDocumento = null;
      state.profile.primerApellido = null;
      state.profile.segundoApellido = null;
      state.profile.tipoDocumento = null;
    }
  }
});
