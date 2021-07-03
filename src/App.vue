<template>
  <v-app>
    <app-navbar></app-navbar>
    <app-sidebar v-if="!['/login'].includes($route.path)"></app-sidebar>
    <v-main v-if="main">
      <div :class="getClasses" class="main">
        <transition :name="transitionName" mode="out-in">
          <router-view />
        </transition>
      </div>
    </v-main>
    <app-footer/>
    <app-confirm />
    <app-alert />
    <app-loading />
    <app-messages />
    <app-progress />
  </v-app>
</template>

<script>
import { mapState } from 'vuex';
import AppProgress from '@/plugins/progress-bar/AppProgress.vue';
import AppConfirm from '@/plugins/modal/AppConfirm.vue';
import AppAlert from '@/plugins/modal/AppAlert.vue';
import AppLoading from '@/plugins/loading/AppLoading.vue';
import AppMessages from '@/plugins/message/AppMessages.vue';
import Auth from '@/components/auth/mixins/auth';
import routes from '@/router/routes';
import AppNavbar from './layout/AppNavbar.vue';
import AppSidebar from './layout/AppSidebar.vue';
import AppFooter from './layout/AppFooter.vue';

// Páginas que no necesitan autenticación/token/sesión
const PageNoLogin = ['login', 'desbloqueo'];

export default {
  name: 'App',
  mixins: [Auth],
  components: {
    AppProgress,
    AppConfirm,
    AppAlert,
    AppLoading,
    AppMessages,
    AppNavbar,
    AppSidebar,
    AppFooter
  },
  created() {
    if (this.$storage.existUser()) {
      this.$store.commit('setAuth', true);

      if (this.$storage.exist('sidenav')) {
        this.$store.commit('setSidenav', this.$storage.get('sidenav'));
      }
    }
  },
  data() {
    return {
      transitionName: ''
    };
  },
  mounted() {
    // this.setTheme();
    // this.page404();
    this.$storage.set('drawer', false);
  },
  methods: {
    setTheme() {
      this.$vuetify.theme.dark = this.$storage.get('theme') || this.$vuetify.theme.dark;
      this.$storage.set('theme', this.$vuetify.theme.dark);
    },
    page404(to) {
      const routeNames = [...routes.map(item => item.path), '/'];
      const path = to || this.$route.path;
      if (!routeNames.includes(path)) {
        this.$router.push('404');
        this.$store.commit('setSidenav', false);
      } else if (this.$storage.existUser()) {
        this.$router.push(path);
        this.$store.commit('setSidenav', true);
      }
    }
  },
  computed: {
    ...mapState(['auth', 'sidenav', 'main']),
    getClasses() {
      let className = '';
      if (['xs', 'sm'].includes(this.$vuetify.breakpoint.name)) {
        className = '';
      }
      if (!['xs', 'sm'].includes(this.$vuetify.breakpoint.name)) {
        className = 'pl-5 pr-5';
      }
      if (this.$route.path === '/home') {
        className += ' d-flex flex-row align-center justify-center';
      } else if (this.$route.path === '/login') {
        className += ' isLogin';
      } else {
        className += !['xs', 'sm'].includes(this.$vuetify.breakpoint.name) ? ' pl-15 pr-5' : '';
      }
      return className;
    }
  },
  watch: {
    $route(to, from) {
      if (this.$storage.get('menu')) {
        const ruta = this.$storage.get('menu').find(menu => menu.url === location.hash.substr(1));
        if (ruta) {
          this.$store.commit('setCurrentBackground', this.$vuetify.theme.dark ? ruta.propiedades.color_dark : ruta.propiedades.color_light);
        }
      }
      if (to.path === '/login') this.$vuetify.theme.dark = false;
      if (!this.$storage.existUser() && PageNoLogin.indexOf(to.path.substring(1)) === -1) {
        this.logout();
      }
      if (to.path !== '/login' && from.path !== '/login') {
        this.transitionName = 'fade';
      } else {
        this.transitionName = '';
      }
      if (to.path === '/login' && this.$storage.existUser()) {
        this.$router.push(this.$storage.get('menu')[0].url);
      }
      /* const { path } = to;
       * this.page404(path); */
    }
  }
};
</script>

<style lang="scss">
.isLogin {
  & > div {
    min-height: calc(100vh - 100px - 80px);
    overflow-y: auto;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
}
.main--content {
  .v-main__wrap {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
}

</style>
