<template>
  <v-card elevation="0">
    <v-card elevation="0" class="primary--text mb-3 mt-3">Datos Personales</v-card>
    <v-card class="pa-4" outlined rounded>
      <v-tooltip max-width="300" color="primary" top v-model="showTooltip">
        <template v-slot:activator="{ on, attrs }">
            <span
                v-bind="attrs"
                v-on="on"
            ></span>
        </template>
        <ul class="fs8">
          <li>Ingresa el número de documento, tal cual está en la cédula de identidad.</li>
          <li>Si el carnet tiene complemento (ej: 1K, 1E), ingrésalo así: 1234567-1K</li>
          <li>Si la cédula de identidad es de extranjero, introdúcela incluyendo E- (ej: E-123456) </li>
        </ul>
      </v-tooltip>
      <v-input-text-field
          @value="e => form.nroDocumento = e"
          :init="form.nroDocumento"
          v-model="form.nroDocumento"
          :disabled="deshabilitarCarnet"
          label="Nro. Documento (*)"
          required
          dense
          @blur="handleTouched('nroDocumento')"
          :full-width="false"
          @keyup="form.nroDocumento = $util.textToUppercase(form.nroDocumento)"
          :width="300"
          :clearable="false"
          :rules="[val => !!val || 'El nombre del usuario no puede estar vacio']"
      />
      <v-input-text-field
          @value="e => form.nombres = e"
          :init="form.nombres"
          v-model="form.nombres"
          :disabled="deshabilitarCampos"
          :label="`${!deshabilitarCampos ? 'Nombre (*)' : 'Nombre'}`"
          required
          :dense="true"
          @blur="handleTouched('nombres')"
          :full-width="false"
          @keyup="form.nombres = $util.textToUppercase(form.nombres)"
          :width="300"
          :clearable="false"
          :rules="!deshabilitarCampos && touched.nombres ? $validate(['required', 'caracteres']) : []"
      />
      <v-input-text-field
          @value="e => form.primerApellido = e"
          :init="form.primerApellido"
          v-model="form.primerApellido"
          :disabled="deshabilitarCampos"
          :label="`${!deshabilitarCampos ? 'Primer Apellido (*)' : 'Primer Apellido'}`"
          required
          :dense="true"
          @blur="handleTouched('primerApellido')"
          :full-width="false"
          @keyup="form.primerApellido = $util.textToUppercase(form.primerApellido)"
          :width="300"
          :clearable="false"
          :rules="(form.segundoApellido == null || form.segundoApellido.toString().length>0) ? $validate([]) : $validate(['required', 'caracteres'])"
      />
      <v-input-text-field
          @value="e => form.segundoApellido = e"
          :init="form.segundoApellido"
          v-model="form.segundoApellido"
          :disabled="deshabilitarCampos"
          :label="`${!deshabilitarCampos ? 'Segundo Apellido (*)' : 'Segundo Apellido'}`"
          required
          :dense="true"
          @blur="handleTouched('segundoApellido')"
          :full-width="false"
          @keyup="form.segundoApellido = $util.textToUppercase(form.segundoApellido)"
          :width="300"
          :clearable="false"
          :rules="(form.primerApellido == null || form.primerApellido.toString().length>0) ? $validate([]) : $validate(['required', 'caracteres'])"
      />
      <v-input-text-field
          :show-field="false"
          required
          :label="`${!deshabilitarCampos ? 'Fecha Nacimiento (*)' : 'Fecha Nacimiento'}`"
      >
        <template slot="contenido">
          <date-input
              v-model="form.fechaNacimiento"
              :fecha="persona.fechaNacimiento"
              :tabIndex="5"
              min-date="1950-01-01"
              required
              :disabled="deshabilitarCampos"
              @value="obtenerFecha"
          ></date-input>
        </template>
      </v-input-text-field>
    </v-card>
  </v-card>
</template>
<script>
import DateInput from '@/plugins/date-input/DateInput.vue';
import validate from '@/common/mixins/validate';

export default {
  props: {
    touched: {
      type: Object,
      default: () => ({
        nombres: false,
        primerApellido: false,
        segundoApellido: false,
        nroDocumento: false,
        fechaNacimiento: false
      })
    },
    persona: {
      type: Object,
      default: () => ({
        nombres: null,
        primerApellido: null,
        segundoApellido: null,
        nroDocumento: null,
        fechaNacimiento: null
      })
    },
    deshabilitarCampos: {
      type: Boolean,
      default: false,
    },
    deshabilitarCarnet: {
      type: Boolean,
      default: false,
    },
    ciudadania: {
      type: Boolean,
      default: false,
    },
  },
  mixins: [validate],
  data () {
    return {
      valid: false,
      menu: false,
      showTooltip: null,
      form: {
        id: null,
        nombres: null,
        primerApellido: null,
        segundoApellido: null,
        nroDocumento: null,
        fechaNacimiento: null,
        estado: 'ACTIVO',
      },
      rules: {
        required: [
          v => !!v || 'Este campo es requerido.'
        ],
        primerApellido: [
          v => (!!this.form.segundoApellido || !!v) || 'Este campo es requerido.',
          v => !!this.form.segundoApellido || (/^[A-Za-zÁ-ÖÚ-öú-ÿñÑ'\s]+$/.test(v)) || 'Existen caracteres no válidos.'
        ],
        segundoApellido: [
          v => (!!this.form.primerApellido || !!v) || 'Este campo es requerido.',
          v => !!this.form.primerApellido || (/^[A-Za-zÁ-ÖÚ-öú-ÿñÑ'\s]+$/.test(v)) || 'Existen caracteres no válidos.'
        ]
      }
    };
  },
  watch: {
    'form.nombres' () {
      this.$emit('value', this.form);
    },
    'form.primerApellido' () {
      this.$emit('value', this.form);
    },
    'form.segundoApellido' () {
      this.$emit('value', this.form);
    },
    'form.nroDocumento' () {
      this.$emit('value', this.form);
    },
    'form.fechaNacimiento' () {
      this.$emit('value', this.form);
    },
  },
  mounted () {
    this.form = { ...this.persona };
  },
  methods: {
    obtenerFecha(val) {
      this.form.fechaNacimiento = val;
    },
    handleTouched (name) {
      this.$emit('touch', { name });
    },
    isLetter(e) {
      const char = String.fromCharCode(e.keyCode); // Get the character
      if (/^[A-Za-zÁ-ÖÚ-öú-ÿñÑ'\s]+$/.test(char)) return true; // Match with regex
      else e.preventDefault(); // If not match, don't add to input text
    }
  },
  components: {
    DateInput
  }
};
</script>
<style lang="scss">
@import '../../scss/variables.scss';
.input--user, .input--tooltip {
  .v-input__append-outer {
    position: absolute;
    margin: 0;
    right: 0;
    top: -15px;
    margin-right: -15px;
    border-radius: 50%;
    border: 2px solid $info;
    background: $white;
  }
}
</style>
