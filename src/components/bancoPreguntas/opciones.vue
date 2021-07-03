<template>
  <v-card elevation="0">
    <v-row no-gutters>
      <v-col cols="1" class="d-flex flex-row align-center justify-center">
        <div class="pb-8">{{ letter }})</div>
      </v-col>
      <v-col cols="10">
        <v-input-text-field
          v-if="ready"
          @value="e => text = e"
          color="primary"
          outlined
          :init="init"
          v-model="text"
          dense
          counter
          :maxlength="LIMITE_CARACTERES"
          :disabled="imagen === 'IMAGEN' || observado"
          v-on:change="sendOption"
          :rules="imagen === 'IMAGEN' ? [] : [(val) => !!val || 'No puede estar vacio la opción']"
          label="Opción"
        ></v-input-text-field>
      </v-col>
      <v-col cols="1" v-if="showDelete">
        <v-tooltip bottom color="error">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              color="error"
              v-bind="attrs"
              v-on="on"
              @click="deleteOption"
              :disabled="observado"
            >
              <v-icon-component icon="remove_circle_outline"></v-icon-component>
            </v-btn>
          </template>
          <span>Eliminar opción</span>
        </v-tooltip>
      </v-col>
    </v-row>
  </v-card>
</template>
<script>
import vIconComponent from '@/plugins/icon/index.vue';

const NAME = 'v-opciones';
const LIMITE_CARACTERES = 200;
export default {
  name: NAME,
  props: {
    letter: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: null
    },
    showDelete: {
      type: Boolean,
      default: false
    },
    imagen: {
      type: String,
      default: ''
    },
    observado: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    deleteOption () {
      this.$confirm('Esta seguro de eliminar la pregunta?', () => {
        this.$emit('deleteOption', this.letter);
      });
    },
    getOption () {
      return this.text;
    },
    sendOption () {
      this.$emit('setOption', { key: this.letter, text: this.text });
    }
  },
  data: () => ({
    text: null,
    init: null,
    ready: false,
    LIMITE_CARACTERES: LIMITE_CARACTERES
  }),
  mounted () {
    this.$nextTick(() => {
      if (this.value) {
        this.text = this.value;
        this.init = this.value;
        this.sendOption();
      }
      this.ready = !this.ready;
    });
  },
  components: {
    vIconComponent
  }
};
</script>
<style lang="scss">

</style>
