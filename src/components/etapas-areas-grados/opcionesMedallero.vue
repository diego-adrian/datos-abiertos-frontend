<template>
  <v-card elevation="0">
    <v-row v-if="rural">
      <v-col cols="3" class="ma-1">
        Posición Mínima
      </v-col>
      <v-col cols="3" class="ma-1">
        Posición Maxima
      </v-col>
      <v-col cols="3" class="ma-1">
        Nota Mínima
      </v-col>
    </v-row>
    <v-row>
      <v-col v-if="!rural">
        <v-text-field
            color="primary"
            required
            :rules="$validate(['required'])"
            v-model="denominativo"
            @change="sendOption()"
            label="Denominación"
            hint="Ej, Oro"
            outlined
            dense
            hide-details
        />
      </v-col>
      <v-col v-if="rural">
        <v-text-field
            class="ma-1"
            color="primary"
            required
            :rules="$validate(['required', 'numeros'])"
            v-model="posicionMinima"
            @change="sendOptionRural()"
            type="number"
            hint="Ej, 60"
            outlined
            dense
            hide-details
            oninput="if(this.value <= 0) this.value = '';"
        />
      </v-col>
      <v-col v-if="rural">
        <v-text-field
            class="ma-1"
            color="primary"
            required
            :rules="$validate(['required', 'numeros'])"
            v-model="posicionMaxima"
            @change="sendOptionRural()"
            type="number"
            hint="Ej, 90"
            outlined
            dense
            hide-details
            oninput="if(this.value <= 0) this.value = '';"
        />
      </v-col>
      <v-col v-if="rural">
        <v-text-field
            class="ma-1"
            color="primary"
            :rules="$validate(['numeros'])"
            v-model="notaMinima"
            @change="sendOptionRural()"
            type="number"
            hint="Ej, 70"
            outlined
            dense
            hide-details
            oninput="if(this.value <= 0) this.value = '';"
        />
      </v-col>
      <v-col cols="2">
        <v-icon-tooltip v-if="showDelete" color="error" icon="remove_circle_outline" text="Eliminar Medallero"
                        @accion="deleteOption"/>
      </v-col>
    </v-row>
  </v-card>
</template>
<script>
import validate from '@/common/mixins/validate';

const NAME = 'v-opciones-medallero';
export default {
  mixins: [validate],
  name: NAME,
  props: {
    keyInicial: {
      type: String,
    },
    setOption: {
      type: String,
    },
    id: {
      type: String
    },
    value: {
      type: String,
      default: null
    },
    showDelete: {
      type: Boolean,
      default: false
    },
    rural: {
      type: Boolean,
      default: false
    },
    textoInicial: {
      type: String,
      default: null
    },
    ordenGalardonInicial: {
      type: String,
      default: null
    },
    denominativoInicial: {
      type: String,
      default: null
    },
    ordenInicial: {
      type: String,
      default: null
    },
    minimoInicial: null,
    maximoInicial: null,
    notaMinimaInicial: null,
  },
  data: () => ({
    clave: null,
    texto: null,
    ordenGalardon: 0,
    denominativo: null,
    orden: 0,
    posicionMinima: 0,
    posicionMaxima: 100,
    notaMinima: null
  }),
  mounted() {
    this.$nextTick(() => {
      this.key = this.keyInicial;
      this.texto = this.textoInicial;
      this.ordenGalardon = this.ordenGalardonInicial;
      this.denominativo = this.denominativoInicial;
      this.orden = this.ordenInicial ?? 0;
      this.posicionMinima = isNaN(this.minimoInicial) ? 0 : this.minimoInicial;
      this.posicionMaxima = isNaN(this.maximoInicial) ? 0 : this.maximoInicial;
      this.notaMinima = this.notaMinimaInicial;
      if (this.rural) {
        this.sendOptionRural();
      } else {
        this.sendOption();
      }
    });
  },
  methods: {
    deleteOption() {
      this.$confirm('Esta seguro de eliminar el medallero?', () => {
        this.$emit('deleteOption', this.clave);
      });
    },
    getOption() {
      return this.text;
    },
    sendOption() {
      this.$emit('setOption', {
        key: this.key,
        id: this.id,
        text: this.texto,
        ordenGalardon: this.ordenGalardon,
        denominativo: this.denominativo,
        orden: this.orden,
        posicionMinima: this.posicionMinima,
        posicionMaxima: this.posicionMaxima,
        notaMinima: this.notaMinima
      });
    },
    sendOptionRural() {
      this.$emit('setOptionRural', {
        key: this.key,
        id: this.id,
        text: this.texto,
        ordenGalardon: this.ordenGalardon,
        denominativo: this.texto,
        orden: this.orden,
        posicionMinima: this.posicionMinima,
        posicionMaxima: this.posicionMaxima,
        notaMinima: this.notaMinima
      });
    }
  },
  components: {}
};
</script>
<style lang="scss">

</style>
