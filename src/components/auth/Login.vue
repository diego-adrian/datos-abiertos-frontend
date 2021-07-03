<template>
  <div class="login--app d-flex flex-column align-center justify-center">
    <div class="header"></div>
    <div
      class="main d-flex align-center justify-center"
      :class="{
        'flex-row': $vuetify.breakpoint.name !== 'xs',
        'flex-column': $vuetify.breakpoint.name === 'xs'
      }"
    >
      <div
        class="description d-flex flex-column align-center justify-center"
      >
        <div class="image"></div>
        <div class="text d-flex flex-column align-center justify-center">
          <span class="primary--text">SISTEMA DE DATOS ABIERTOS DEL ESTADO PLURINACIONAL DE BOLIVIA</span>
          <span class="pa-4">El sistema permite la organización y gestión de datos enviados por los diferentes sectores del estado plurinacional.</span>
        </div>
      </div>
      <v-divider vertical v-if="!['xs'].includes($vuetify.breakpoint.name)"/>
      <div class="credentials d-flex flex-column align-center justify-center">
        <template v-if="!['xs'].includes($vuetify.breakpoint.name)">
          <span class="iniciar-sesion primary--text">Iniciar Sesión</span>
          <span class="details">Ingresa con el usuario y contraseña</span>
        </template>
        <v-form
          lazy-validation
          ref="loginForm"
          class="d-flex flex-column align-center justify-center"
          :class="{
            'mt-5': $vuetify.breakpoint.name === 'xs'
          }"
        >
          <v-input-text-field
            @value="e => form.user = e"
            v-model="form.user"
            label="Usuario"
            :full-width="false"
            :autofocus="$vuetify.breakpoint.name !== 'xs'"
            @keypress.enter.native="loginWithCredentials"
            :width="300"
            :clearable="false"
            :rules="[val => !!val || 'El nombre del usuario no puede estar vacio']"
          >
          </v-input-text-field>
          <v-input-text-field
            @value="e => form.password = e"
            v-model="form.password"
            label="Contraseña"
            @keypress.enter.native="loginWithCredentials"
            :full-width="false"
            :width="300"
            v-on:append="() => showPassword = !showPassword"
            :append-icon="showPassword ? ICONS.visibility : ICONS.visibility_off"
            :type="!showPassword ? 'password' : 'text'"
            :rules="[val => !!val || 'La contraseña no puede estar vacio']"
          >
          </v-input-text-field>
          <v-btn color="primary" class="rounded" depressed height="50" block @click="loginWithCredentials">
            <span class="font-weight-bold">
              Ingresar
            </span>
          </v-btn>
        </v-form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Auth from './mixins/auth';

export default {
  mixins: [Auth],
  data() {
    return {
      form: {
        user: null,
        password: null
      },
      showPassword: false,
      userTooltip: null,
      passwordTooltip: null,
      modalIngresarCredentials: false,
      show: false
    };
  },
  mounted() {
    this.$nextTick(async () => {
      this.$vuetify.theme.dark = this.$storage.get('theme');
      if (this.$route.query?.code) {
        try {
          const request = {
            method: 'GET',
            url: `${this.$baseServer}usuarios/perfil`,
            headers: {
              Authorization: `Bearer ${this.$route.query.code}`
            }
          };
          let credentials = await axios(request);
          credentials = {
            data: {
              datos: {
                ...credentials.data.datos,
                access_token: this.$route.query.code
              }
            }
          };
          await this.credentials(null, null, credentials.data);
        } catch (err) {
          this.$message.error(err.message);
        }
      } else {
        if (this.$route.path !== '/login') this.$router.push('/login');
      }
    });
  },
  methods: {
    setCookie(name, value, days = 7, path = '/') {
      const expires = new Date(Date.now() + days * 864e5).toUTCString();
      document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=' + path;
    },
    getCookie(name) {
      return document.cookie.split('; ')
        .reduce((r, v) => {
          const parts = v.split('=');
          return parts[0] === name ? decodeURIComponent(parts[1]) : r;
        }, '');
    },
    loginWithCredentials() {
      if (this.$refs.loginForm.validate()) {
        this.credentials(this.form.user, this.form.password, null);
      } else {
        this.$message.error('Complete los campos obligatorios');
      }
    },
    /**
     * @function loginOpenid
     * @description Conectar con OpenID
     */
    loginOpenid() {
      this.getCode();
    },
    cancel() {
      this.resetForm();
      this.modalIngresarCredentials = false;
    },
    mostrarModalCredentials() {
      this.modalIngresarCredentials = true;
    },
    resetForm() {
      this.form = {
        user: null,
        password: null,
      };
    }
  }
};
</script>

<style lang="scss">
@import '../../scss/variables.scss';
.login--app {
  .main {
    margin-top: -40px;
      .credentials {
        .iniciar-sesion {
          font-weight: 500;
          font-size: 1.4rem;
          margin-bottom: 10px;
        }
        .details {
          font-size: 0.8rem;
          margin: auto;
          width: 50%;
          text-align: center;
          margin-bottom: 25px;
        }
      }
      .description {
        .image {
          background: url('../../../public/img/logoDatos.png') no-repeat;
          background-position: top center;
          background-size: contain;
          object-fit: contain;
          width: 300px;
          height: 120px;
        }
        .text {
          margin: auto;
          span {
            user-select: none;
            &:first-child {
              font-weight: 500;
              font-size: 1.1rem;
              margin-top: 10px;
              margin-bottom: 10px;
            }
            &:last-child {
              font-size: 0.83rem;
            }
          }
        }
      }
  }
}
@media screen and (min-width: 601px) {
  .login--app {
    .header {
      background: url('../../../public/img/escudo.jpeg') no-repeat;
      background-position: top center;
      background-size: cover;
      object-fit: cover;
      width: 400px;
      height: 200px;
    }
    .main {
      .credentials {
        width: 50%;
      }
      .description {
        width: 50%;
        .text {
          width: 70%;
          span {
            user-select: none;
            &:first-child {
              text-align: center;
            }
            &:last-child {
              text-align: left;
            }
          }
        }
      }
    }
  }
}

@media screen and (max-width: 600px) and (min-width: 1px) {
  .login--app {
    .header {
      background: url('../../../public/img/escudo.jpeg') no-repeat;
      background-position: top center;
      background-size: contain;
      object-fit: contain;
      width: 300px;
      height: 200px;
    }
    .main {
      .credentials {
        width: 100%;
      }
      .description {
        width: 100%;
        .text {
          width: 85%;
          span {
            user-select: none;
            &:first-child {
              text-align: center;
            }
            &:last-child {
              text-align: justify;
            }
          }
        }
      }
    }
  }
}
</style>
