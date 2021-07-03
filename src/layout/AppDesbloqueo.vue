<template>
  <v-card elevation="0" color="backgroundColor" class="not-found">
    <v-card
      elevation="0"
      class="backgroundColor not-found__message text-center d-flex flex-column align-center justify-center"
    >
      <v-icon-component icon="lock_open" :size="200"></v-icon-component>
      <h4>{{ mensaje }}</h4>
      <v-btn text color="info" class="mt-3" outlined @click="logout()"
        >Regresar al login</v-btn
      >
    </v-card>
  </v-card>
</template>
<script>
import vIconComponent from '@/plugins/icon/index.vue';
import Auth from '@/components/auth/mixins/auth';

export default {
  data: () => ({
    mensaje: 'Desbloqueando cuenta!!!',
  }),
  mixins: [Auth],
  components: {
    vIconComponent,
  },
  methods: {
    handleClickBack() {
      this.$router.back(-1);
      this.$storage.set('selectedMenu', this.$storage.get('prevMenu'));
    },
    async desbloquear(id) {
      const token = await this.$service.get(`usuarios/desbloqueo?id=${id}`);
      this.mensaje = token.mensaje;
    },
  },
  async mounted() {
    const id = await this.$route.query.q;
    await this.desbloquear(id);
  },
};
</script>

<style lang="scss">
@import "../scss/variables.scss";
.not-found {
  background-size: cover;
  background-position: top center;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;

  .not-found__message {
    box-shadow: 0 1px 4px 0 rgba($color: $black, $alpha: 0.1);
    padding: 30px;
    width: 100%;
    max-width: 680px;
    margin-top: -50px;
    h1 {
      font-weight: bold;
      font-size: 11rem;
      margin-top: 0;
      letter-spacing: 2px;
    }
    h4 {
      font-size: 1.3rem;
      font-weight: 300;
    }
  }
  @media screen and (max-width: 767px) and (min-width: 1px) {
    .number {
      line-height: 160px;
      font-size: 7rem !important;
    }
  }
  @media screen and (min-width: 768px) {
    .number {
      line-height: 160px;
    }
  }
}
</style>
