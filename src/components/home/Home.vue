<template>
  <v-card color="backgroundColor" elevation="0" class="app-home">
    <div class="header">
      <v-img
          max-width="700px"
          contain
          :src="this.$vuetify.theme.dark ? './img/header-logo-minedu-dark.png' : './img/header-logo-minedu.png'"
      />
    </div>
    <div class="logo"></div>
    <v-card elevation="0" color="backgroundColor"
      class="titulo-home">
      Bienvenido, {{ perfil.nombres }}
    </v-card>
    <v-card elevation="0" color="backgroundColor" class="rol-home">
      {{ (rol || '').replace(/_/gi, ' ') }}
    </v-card>
    <v-card elevation="0" color="backgroundColor" class="titulo-home pt-2 fs12">
      {{ (nombreOlimpiada || '').replace(/_/gi, ' ') }}
    </v-card>
  </v-card>
</template>

<script>

export default {
  data() {
    return {
      rol: null,
      nombreOlimpiada: null,
      perfil: {
        nroDocumento: null,
        nombres: null,
        primerApellido: null,
        segundoApellido: null,
        fechaNacimiento: null,
        tipoDocumento: null
      },
    };
  },
  mounted() {
    this.obtenerDatos();
    this.$nextTick(() => {
      const rol = this.$storage.get('rol');
      const { nombre } = this.$storage.get('olimpiadaSeleccionada');
      if (rol) {
        this.rol = rol.rol;
        this.nombreOlimpiada = nombre;
      }
    });
  },
  methods: {
    async obtenerDatos() {
      if (!this.$store.state.profile.nroDocumento) {
        try {
          const response = await this.$service.get('usuarios/perfil');
          this.perfil = response.datos.persona;
        } catch (err) {
          this.$message.error(err.message ?? err.mensaje ?? 'Ocurrio un error');
        }
      } else {
        this.perfil = this.$store.state.profile;
      }
    }
  }
};
</script>

<style lang="scss">
@import '../../scss/variables.scss';

.titulo-home {
  font-size: 2rem;
  padding-top: 30px;
  color: $primary !important;
  letter-spacing: 0;
  user-select: none;
  text-align: center;
}

.rol-home {
  font-size: 1rem;
  letter-spacing: 0;
  user-select: none;
  text-align: center;
  padding: 20px;
}

.app-home {
  max-width: 700px;
  margin: auto;
  height: 100%;
  width: 100%;
  .header {
    background-size: contain;
    width: 100%;
    height: 200px;
  }
  .logo {
    background: url('../../../public/img/logoOlimpiadas.png') no-repeat center;
    background-size: contain;
    width: 100%;
    height: 150px;
  }
}

</style>
