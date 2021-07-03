<template>
  <v-card color="backgroundColor" elevation="0" class="app-home d-flex flex-row align-center justify-center flex-wrap">
     <v-img
      v-for="(sectores, i) in aSectores" :key="i"
      class="white--text align-end ma-2 cursor--pointer"
      height="200px"
      width="400px"
      src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
    >
      <v-card-title>{{ sectores.nombre }}</v-card-title>
    </v-img>
  </v-card>
</template>

<script>

export default {
  data() {
    return {
      aSectores: [],
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
    this.$nextTick(() => {
      this.aSectores = [
        {
          nombre: 'Medicina'
        },
        {
          nombre: 'Turismo'
        },
        {
          nombre: 'Tecnologia'
        },
        {
          nombre: 'Trabajo'
        },
        {
          nombre: 'Educacion'
        },
        {
          nombre: 'Salud'
        },
        {
          nombre: 'Otros'
        }
      ];
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
  margin: auto;
  height: 100%;
  width: 100%;
}

</style>
