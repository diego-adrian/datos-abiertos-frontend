import axios from 'axios';
import { $Casbin } from '@/plugins/casbin';

export default {
  methods: {
    getModules(roles, rol = null) {
      if (Array.isArray(roles) && roles.length > 0) {
        if (rol) {
          const menu = roles.find(item => {
            if (item.rol === rol) return item.modulos;
          });
          return menu.modulos;
        } else {
          return roles[0].modulos;
        }
      } else {
        return [];
      }
    },
    getRoles(roles) {
      if (Array.isArray(roles)) {
        return roles.map(item => {
          const obj = {};
          obj.rol = item.rol;
          obj.active = item.active;
          obj.idRol = item.idRol;
          obj.idOlimpiada = item.olimpiadas[0].id;
          return obj;
        });
      } else {
        return [];
      }
    },
    getRol(roles) {
      if (Array.isArray(roles) && roles.length > 0) {
        let rol = roles.find(item => item.active);
        rol = {
          ...rol,
          olimpiada: rol.olimpiadas[0]
        };
        return rol;
      }
    },
    getOlympiad(roles) {
      if (Array.isArray(roles) && roles.length > 0) {
        const { olimpiadas } = roles.find(item => item.active);
        return (Array.isArray(olimpiadas)) ? olimpiadas : [olimpiadas];
      }
    },
    setInitOlympiad (id) {
      return new Promise((resolve, reject) => {
        try {
          const olimpiadas = this.$storage.get('olimpiadas');
          this.mArea = null;
          this.mEtapa = null;
          this.aAreas = [];
          this.aEtapas = [];
          this.$storage.set('areaSeleccionada', null);
          this.$storage.set('etapaSeleccionada', null);
          this.$store.commit('setStage', null);
          this.$store.commit('setArea', null);
          const olimpiada = olimpiadas.find(item => item.id === id);
          this.$storage.set('olimpiadaSeleccionada', olimpiada);
          this.$store.commit('setOlympiad', olimpiada);
          resolve(true);
        } catch (error) {
          reject(error);
        }
      });
    },
    getStages () {
      return new Promise(async (resolve, reject) => {
        try {
          const olimpiadaSeleccionada = this.$storage.get('olimpiadaSeleccionada');
          const aEtapas = await this.$service.get(`olimpiadas/${olimpiadaSeleccionada.id ? olimpiadaSeleccionada.id : olimpiadaSeleccionada}/etapas`);
          const { filas } = aEtapas.datos;
          this.$store.commit('setStages', filas);
          this.$storage.set('etapas', filas);
          this.$store.commit('setStage', filas.length !== 0 ? filas[0] : null);
          this.$storage.set('etapaSeleccionada', filas.length !== 0 ? filas[0] : null);
          this.aEtapas = filas;
          this.mEtapa = filas.length !== 0 ? filas[0] : null;
          resolve(true);
        } catch (error) {
          reject(error.message);
        }
      });
    },
    getAreas () {
      return new Promise(async (resolve, reject) => {
        try {
          const etapaSeleccionada = this.$storage.get('etapaSeleccionada');
          let areas = [];
          if (etapaSeleccionada) {
            const aAreas = await this.$service.get(`etapas/${etapaSeleccionada.id ? etapaSeleccionada.id : etapaSeleccionada}/etapaAreaGrados`);
            const { filas } = aAreas.datos;
            areas = filas.map(item => {
              const obj = item;
              obj.nombre = `${item.area.nombre} - ${item.gradoEscolar.nombre}`;
              return item;
            });
          }
          this.$store.commit('setAreas', areas);
          this.$storage.set('areas', areas);
          this.$store.commit('setArea', areas.length !== 0 ? areas[0] : null);
          this.$storage.set('areaSeleccionada', areas.length !== 0 ? areas[0] : null);
          this.aAreas = areas;
          this.mArea = areas.length !== 0 ? areas[0] : null;
          resolve(true);
        } catch (error) {
          reject(error.message);
        }
      });
    },
    exit() {
      this.$confirm(
        '¿Está seguro de salir del sistema?',
        () => {
          this.logout();
        },
        null
      );
    },
    setData (datos) {
      return new Promise((resolve, reject) => {
        try {
          if (datos.persona) this.$storage.set('user', datos.persona);
          this.$storage.set('token', datos.access_token);
          this.$storage.set('roles', this.getRoles(datos.roles));
          const { rol, idRol, olimpiada: { id } } = this.getRol(datos.roles);
          this.$storage.set('rol', {
            rol,
            idRol,
            idOlimpiada: id
          });
          this.$storage.set('modules', datos.roles);
          this.$storage.set('menu', [...this.getModules(datos.roles)]);
          this.$vuetify.theme.dark = this.$storage.get('theme') || this.$vuetify.theme.dark;
          this.$storage.set('theme', this.$vuetify.theme.dark);
          this.$storage.set('sidenav', true);
          this.$store.commit('setProfile', datos.persona);
          resolve(true);
        } catch (error) {
          reject(error.message);
        }
      });
    },
    startOlympics () {
      return new Promise(async (resolve, reject) => {
        try {
          const olimpiadas = this.getOlympiad(this.$storage.get('modules'));
          this.$storage.set('olimpiadas', olimpiadas);
          this.$store.commit('setOlympiads', olimpiadas);
          this.$storage.set('olimpiadaSeleccionada', olimpiadas[0]);
          this.$store.commit('setOlympiad', olimpiadas[0]);
          await this.getStages();
          await this.getAreas();
          resolve(true);
        } catch (error) {
          reject(error.message);
        }
      });
    },
    setInfoToken () {
      return new Promise((resolve) => {
        const payload = this.getPayload();
        const actualDate = Math.round(new Date().getTime() / 1000);
        this.$storage.set('ttl', payload.exp - payload.iat);
        this.$storage.set('t', actualDate);
        resolve(true);
      });
    },
    async credentials(usuario, contrasena, data = {}) {
      try {
        let credentials = data;
        if (usuario && contrasena) {
          credentials = await this.$service.post('auth', {
            usuario,
            contrasena: btoa(encodeURI(contrasena))
          });
          if (!credentials || credentials.codigo) {
            throw new Error(
              credentials?.mensaje
                || 'Existen problemas de conexión. Por favor revise su configuración a Internet.'
            );
          }
        }
        const { datos } = credentials;
        this.$storage.set('drawer', false);
        // Credenciales
        await this.setData(datos);
        // definimos tiempo de vida de token
        await this.setInfoToken();

        const politicas = await this.$service.get('autorizacion/politicas/roles');
        if (!politicas.isError && politicas.datos) {
          this.$storage.set('policy', politicas.datos);
          for (const p of politicas.datos) {
            await $Casbin.enforcer.addPolicy(p[0], p[1], p[2], p[3], p[4], p[5]); // eslint-disable-line no-await-in-loop
          }
        }
        this.$store.commit('setAuth', true);
        this.$store.commit('setSidenav', true);
        this.$store.commit('setMain', true);

        await this.startOlympics();

        if (datos.estado === 'ASIGNADO') {
          await this.$router.push({
            name: 'Perfil',
            params: {
              estado: datos.estado
            }
          });
        } else {
          await this.$router.push('/home');
        }
      } catch (err) {
        this.$message.error(err ? err.message ?? err.mensaje ?? 'Ocurrio un error' : 'Ocurrio un error');
      }
    },
    getPayload () {
      if (this.$storage.get('token')) {
        const jwtStr = this.$storage.get('token').split('.')[1];
        return JSON.parse(atob(jwtStr));
      }
      return null;
    },
    async getCode() {
      const url = `${this.$baseServer}ciudadania-auth`;
      window.location.href = new URL(url);
    },
    reload() {
      this.$store.commit('setMain', false);
      this.$nextTick(() => {
        this.$store.commit('setMain', true);
      });
    },
    cleanData(store) {
      store.commit('setDefault');
    },
    async logout(router, store) {
      let response = {};
      this.$waiting(true, 'Cerrando sesión, espere unos segundos por favor...');
      if (this.$storage.get('token')) {
        const request = {
          url: `${this.$baseServer}logout`,
          method: 'GET',
          headers: {
            Authorization: `Bearer ${this.$storage.get('token')}`
          }
        };
        try {
          response = await axios(request);
          response = response.data;
          this.$waiting(false);
        } catch (e) {
          this.$waiting(false);
          console.error('logout error: ', e.message);
        }
      }
      const storevuex = store || this.$store;
      router = router || this.$router;
      const activeDarkMode = this.$storage.get('theme');
      this.$storage.removeAll();
      this.$storage.set('theme', activeDarkMode);
      this.$store?.commit('resetProfile');
      if ($Casbin.enforcer) {
        $Casbin.enforcer.getPolicy().then(politicas => {
          politicas.forEach(p => {
            $Casbin.enforcer.removePolicy(p[0], p[1], p[2], p[3], p[4], p[5]);
          });
        });
      }
      this.cleanData(storevuex);
      const { path } = router && router.history ? router.history.current : null;
      if (response.url) {
        window.location.href = response.url;
        return;
      }
      if (path !== '/login') {
        router.push('/login');
      }
    }
  }
};
