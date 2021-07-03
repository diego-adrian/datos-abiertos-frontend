<template>
  <div>
    <v-app-bar
      :clipped-left="clipped"
      fixed
      flat
      color="backgroundColor"
      height="60"
      class="pa-0 ma-0 navbar"
    >
      <v-btn
        v-if="auth"
        icon
        color="primary"
        @click="setDrawer"
      >
        <v-icon-component icon="menu"/>
      </v-btn>
      <span class="primary--text fs10 font-weight-medium" v-if="!['/login'].includes($route.path)">Sistema de competencias educativas</span>

      <v-spacer></v-spacer>
      <v-card elevation="0">
        <v-btn id="btnHelp" :small="['xs', 'sm'].includes($vuetify.breakpoint.name)" icon text>
          <v-icon-component icon="help_outline" class="primary--text" color="primary"/>
        </v-btn>
        <v-btn id="btnTheme" :small="['xs', 'sm'].includes($vuetify.breakpoint.name)" icon text
          @click="setTheme">
          <v-icon-component :icon="$vuetify.theme.dark ? 'dark_mode' : 'light_mode'" class="primary--text" color="primary"/>
        </v-btn>
        <v-btn v-if="auth && !['/login'].includes($route.path)" id="btnSettings" :small="['xs', 'sm'].includes($vuetify.breakpoint.name)" text depressed icon
          class="primary--text" @click="settings">
          <v-icon-component icon="settings" color="primary"/>
        </v-btn>
      </v-card>

          <!-- SECCION DE SETTINGS -->
          <v-dialog
            v-model="modalSettings"
            content-class="settings"
            :width="['xs', 'sm'].includes($vuetify.breakpoint.name) ? 300 : 200"
            :overlay-opacity="['xs', 'sm'].includes($vuetify.breakpoint.name) ? .7 : 0"
          >
            <v-card elevation="0">
              <template v-for="(item, i) in aSettings">
                <!-- SI TIENE SUBMENU -->
                <template v-if="item.submenu">
                  <v-list-group
                    :key="i"
                    :value="true"
                    color="primary"
                    class="item--group--settings"
                    disabled
                    :prepend-icon="ICONS[item.icono]"
                    link
                  >
                    <template v-slot:activator>
                      <v-list-item-content>
                        <v-list-item-title class="fontColor--text ml-0 fs9">{{ item.label }}</v-list-item-title>
                      </v-list-item-content>
                    </template>

                    <section style="margin-left: 50px">
                      <v-radio-group
                        v-model="radioGroup"
                      >
                        <v-radio
                          color="success"
                          v-for="subItem in item.submenu"
                          @click="setRol(subItem)"
                          :key="subItem.label"
                          :label="(subItem.rol || '').replace(/_/gi, ' ')"
                          :value="subItem.idRol"
                        ></v-radio>
                      </v-radio-group>
                    </section>

                  </v-list-group>
                </template>
                <!-- SI NO TIENE SUBMENU -->
                <template v-else>
                  <v-list-item
                    :key="item.url"
                    color="primary"
                    dense
                    link
                    @click="redirect(item)"
                  >
                    <v-list-item-icon :class="`bloque--configuraciones ml-1 mr-1`">
                      <v-icon-component :icon="item.icono" class="primary--text"></v-icon-component>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title class="ruta--menu fontColor--text fs9">
                        {{ item.label }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </template>
              </template>

            </v-card>
          </v-dialog>
    </v-app-bar>
  </div>
</template>

<script>
import systemAppearance from 'system-appearance';
import { mapState } from 'vuex';
import Auth from '@/components/auth/mixins/auth';
import vIconComponent from '@/plugins/icon/index.vue';

export default {
  mixins: [Auth],
  data: () => ({
    clipped: false,
    title: null,
    apps: false,
    modalSettings: false,
    rutas: [],
    roles: [],
    mRol: null,
    selectedRoute: null,
    menuIcon: 'home',
    themeVerify: false,
    aSettings: [],
    radioGroup: null,
    rol: ''
  }),
  components: {
    vIconComponent
  },
  methods: {
    setDrawer () {
      this.$storage.set('drawer', !this.drawer);
      this.$root.$refs.AppSideBar.updateStateSidebar();
    },
    getLastColor () {
      const menu = this.$storage.get('selectedMenu');
      if (menu) {
        return menu.propiedades[this.$vuetify.theme.dark ? 'color_dark' : 'color_light'];
      }
      return 'null';
    },
    actualizarIcono(url) {
      let { path } = this.$route;
      path = url ?? path;
      console.log(`Actualizando iconos: ${path}`);
      if (this.$storage.get('menu') && !this.rutas) {
        this.rutas = this.$storage.get('menu');
      }
      if (this.rutas && this.rutas.length > 0) {
        let rutas = this.rutas.filter(item => item.url === path);
        if (rutas.length === 0) {
          this.rutas.filter(item => item.subModulo != null && item.subModulo.length > 0).forEach(ruta => {
            rutas = rutas.concat(ruta.subModulo.filter(item => item.url === path));
          });
        }
        if (rutas && rutas.length > 0) {
          this.menuIcon = rutas[0].propiedades && rutas[0].propiedades.icono ? rutas[0].propiedades.icono : null;
          this.$store.state.currentBackground = rutas[0].propiedades && rutas[0].propiedades.color_light && rutas[0].propiedades.color_light ? this.$vuetify.theme.dark ? rutas[0].propiedades.color_dark : rutas[0].propiedades.color_light : null;
        } else {
          this.menuIcon = 'home';
          this.$store.state.currentBackground = undefined;
        }
      }
    },
    darkModeListener() {
      if (this.themeVerify || this.$storage.get('theme') == null) {
        this.$vuetify.theme.dark = true;
        this.$storage.set('theme', this.$vuetify.theme.dark);
      }
    },
    lightModeListener() {
      if (this.themeVerify || this.$storage.get('theme') == null) {
        this.$vuetify.theme.dark = false;
        this.$storage.set('theme', this.$vuetify.theme.dark);
      }
    },
    settings() {
      this.roles = this.$storage.get('roles');
      const { idRol } = this.$storage.get('rol');
      const modules = this.$storage.get('modules');
      const subMenus = modules.map(item => {
        const obj = {};
        obj.idRol = item.idRol;
        obj.idOlimpiada = item.olimpiadas[0].id;
        obj.rol = item.rol;
        return obj;
      });
      this.radioGroup = idRol;
      const [firstElement] = this.roles;
      this.mRol = firstElement;
      const user = this.$storage.getUser();
      this.aSettings = [
        {
          icono: 'person',
          url: '/perfil',
          label: `${user.nombres} ${user?.primerApellido} ${user?.segundoApellido}`
        },
        {
          icono: 'switch_account',
          label: 'Cambiar de rol',
          submenu: [...subMenus]
        },
        {
          icono: 'vpn_key',
          url: '/password',
          label: 'Cambiar contrasena'
        },
        {
          icono: 'logout',
          label: 'Cerrar sesion'
        }
      ];
      this.modalSettings = !this.modalSettings;
    },
    isActive(url) {
      return this.$route.path === url;
    },
    setTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      this.$storage.set('theme', this.$vuetify.theme.dark);
      this.$store.commit('setCurrentBackground', this.$vuetify.theme.dark);
      this.actualizarIcono();
    },
    async setRol({ rol, idRol, idOlimpiada }) {
      try {
        this.modalSettings = false;
        if (rol && idRol && idOlimpiada) {
          const response = await this.$service.post('change-rol', {
            idRol,
            idOlimpiada
          });
          const { datos } = response;
          await this.setData(datos);
          await this.startOlympics();
          const menus = this.getModules(this.$storage.get('modules'), rol);
          this.$storage.set('menu', menus);
          this.rol = rol;
          this.$store.commit('setMenu', menus);
          if (this.$route.path !== '/home') this.$router.push('/home');
          if (this.$route.path === '/home') this.reload();
        }
      } catch (error) {
        this.$message.error(error?.message || 'Ocurrio un problema');
      }
    },
    reload() {
      this.$store.commit('setMain', false);
      this.$nextTick(() => {
        this.$store.commit('setMain', true);
      });
    },
    showApps() {
      this.rutas = this.$storage.get('menu');
      this.apps = !this.apps;
    },
    redirect(subItem) {
      this.modalSettings = false;
      if (subItem && subItem.hasOwnProperty('url')) {
        if (this.$route.path.replace(/\//gi, '') !== subItem.url) {
          this.$router.push(subItem.url);
          setTimeout(() => {
            this.getParent();
          }, 100);
        }
      } else {
        if (subItem.icono === 'logout') {
          this.$confirm('¿Está seguro de cerrar la sesión?', () => {
            this.modalSettings = false;
            this.logout();
          });
        }
      }
    },
    hasNoSupport() {
      this.appearance = null;
      console.warn('You specified no preference for a color scheme or your browser does not support it.');
    }
  },
  computed: {
    ...mapState([
      'auth',
      'currentBackground',
      'stages',
      'areas',
      'selectedArea',
      'drawer'
    ])
  },
  mounted() {
    systemAppearance(this.darkModeListener, this.lightModeListener, this.hasNoSupport);
    this.$nextTick(async () => {
      this.rol = this.$storage.get('rol')?.rol;
      this.rutas = this.$storage.get('menu');
      this.$vuetify.theme.dark = this.$storage.get('theme');
      this.themeVerify = true;
    });
  },
  created() {
    this.$root.$refs.AppNavbar = this;
    this.$router.onReady(() => {
      this.actualizarIcono();
    });
  }
};
</script>

<style lang="scss">
@import '../scss/variables.scss';

.navbar {
  .v-toolbar__content {
    border-bottom: thin solid rgba(0, 0, 0, 0.12) !important;
  }
}

.item--group {
  .v-list-group__header__prepend-icon {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    background: var(--color_fondo) !important;
    border-radius: 10px;
    min-width: 60px !important;
    width: 60px !important;
    min-height: 60px !important;
    height: 60px !important;
  }
}

.setting {
  .v-list-group__header__append-icon {
    display: none !important;
  }
}

@media screen and (min-width: 768px) {
  .settings {
    position: fixed;
    z-index: 10;
    min-width: 300px;
    right: 0;
    top: 65px;
    padding: 20px 0px 20px 0px;
    border-radius: 7px !important;
    background: $white;
    transition: top 0.3s ease-in;
    .v-list-group__header__append-icon {
      display: none !important;
    }
  }
  .text--ellipsis {
    text-overflow: ellipsis;
    max-width: 220px;
    white-space: nowrap;
    overflow: hidden;
  }
}

</style>
