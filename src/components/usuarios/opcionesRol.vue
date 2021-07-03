<template>
  <v-card elevation="0">
    <v-row no-gutters>
      <v-col cols="12" class="align-center justify-center">
        <v-input-text-field
            :show-field="false"
            label="Rol"
        >
          <template slot="contenido">
            <v-select
                color="primary"
                :rules="$validate(['required'])"
                item-color="primary"
                v-model="clave"
                :items="items"
                :item-disabled="rolesSeleccionados"
                @change="sendOption(true)"
                item-text="rol"
                item-value="id"
                :tabindex="8"
                flat
                outlined
                dense
                hide-details
                name="roles"
            ></v-select>
          </template>
        </v-input-text-field>
      </v-col>
    </v-row>
  </v-card>
</template>
<script>
import validate from '@/common/mixins/validate';

const NAME = 'v-opciones-rol';
export default {
  mixins: [validate],
  name: NAME,
  props: {
    keyInicial: {
      type: String,
      default: null
    },
    id: {
      type: Number
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
    roles: {
      type: Array
    },
    rolesSeleccionados: {
      type: Array
    },
  },
  methods: {
    getOption() {
      return this.text;
    },
    sendOption(eliminarSiguientes) {
      this.$emit('setOption', {
        key: this.id,
        id: this.roles.filter(rol => rol.id === this.clave)
          .pop().id,
        text: this.roles.filter(rol => rol.id === this.clave)
          .pop().rol,
        campos: this.roles.filter(rol => rol.id === this.clave)
          .pop().campos,
        idEtapa: this.roles.filter(rol => rol.id === this.clave)
          .pop().idEtapa,
        idArea: this.roles.filter(rol => rol.id === this.clave)
          .pop().idArea,
        idDepartamento: this.roles.filter(rol => rol.id === this.clave)
          .pop().idDepartamento,
        idDistrito: this.roles.filter(rol => rol.id === this.clave)
          .pop().idDistrito,
        idUnidadEducativa: this.roles.filter(rol => rol.id === this.clave)
          .pop().idUnidadEducativa,
        eliminarSiguientes
      });
    }
  },
  data: () => ({
    clave: null,
    texto: null,
    items: []
  }),
  mounted() {
    const gruposUnicosSet = new Map();

    this.roles.map(rol => ({
      grupo: rol.grupo
    }))
      .forEach((item) => {
        gruposUnicosSet.set(JSON.stringify(item), item);
      });

    const gruposUnicos = [...gruposUnicosSet.values()];

    const rolesFinal = [];

    gruposUnicos.forEach(grupoUnico => {
      rolesFinal.push({ header: grupoUnico.grupo });
      rolesFinal.push(...this.roles.filter(rol => rol.grupo === grupoUnico.grupo));
      rolesFinal.push({ divider: true });
    });

    this.items = rolesFinal;

    this.$nextTick(() => {
      if (this.value) {
        this.text = this.value;
        this.clave = this.keyInicial;
        this.sendOption(false);
      }
    });
  },
  components: {
  }
};
</script>
<style lang="scss">

</style>
