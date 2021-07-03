<template>
  <v-dialog
      :value="dialog"
      @input="$emit('input', $event)"
      :max-width="maxWidth"
      @keydown.esc="closeModal"
      @click:outside="closeModal"
  >
    <v-card>
      <v-card-title class="ma-0 pa-1">
        <v-container fluid>
          <v-row no-gutters class="justify-space-between">
            <div
                :cols="11"
                class="d-flex flex-row align-center text-sm color1--tex primary--text"
            >
              <v-icon-component class="m-2" :icon="icono"></v-icon-component>
              <span class="fs10 pl-2 font-weight-medium">
                  {{ titulo }}
                </span>
            </div>
            <div>
              <v-icon-tooltip
                  color="primary"
                  icon="close"
                  text="Cerrar ventana emergente"
                  @accion="closeModal"
              />
            </div>
          </v-row>
        </v-container>
      </v-card-title>
      <v-divider></v-divider>
      <slot></slot>
      <v-card-actions v-if="mostrarAcciones">
        <v-container fluid class="d-flex align-items justify-end" :class="$vuetify.breakpoint.name === 'xs' ? 'flex-column' : `flex-${btnActions}`">
          <v-btn dark color="primary" @click.stop="execAction" elevation="0" :disabled=opcionesDesactivadas>
            <v-icon-component icon="check"></v-icon-component>
            {{ textoEjecutar }}
          </v-btn>
        </v-container>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import vIconComponent from '@/plugins/icon/index.vue';

export default {
  props: {
    dialog: Boolean,
    titulo: String,
    textoEjecutar: {
      type: String,
      default: 'Enviar'
    },
    btnActions: {
      type: String,
      default: 'row'
    },
    maxWidth: {
      type: String,
      default: '500px'
    },
    mostrarAcciones: {
      type: Boolean,
      default: true
    },
    opcionesDesactivadas: {
      type: Boolean,
      default: false
    },
    icono: {
      type: String,
      default: 'add'
    }

  },
  methods: {
    closeModal() {
      this.$emit('close-dialog');
    },
    execAction() {
      this.$emit('accion');
    },
  },
  components: {
    vIconComponent
  }
};
</script>
