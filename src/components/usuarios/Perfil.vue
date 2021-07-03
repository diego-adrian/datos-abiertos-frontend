<template>
  <v-card elevation="0">
    <v-card-title>
      <div class="v-title-form primary--text"><span :class="$vuetify.theme.dark ? 'white--text' : 'primary--text'">Usuario: {{ $storage.get('rol').rol }}</span></div>
    </v-card-title>
    <v-spacer></v-spacer>
    <v-card-subtitle>
      <v-row class="d-flex justify-center">
        <v-col cols="6" class="text-center">
          <v-icon-component icon="person" class="primary--text"/>
          <v-container class="primary--text"><strong class="primary--text">Datos personales</strong></v-container>
        </v-col>
      </v-row>
    </v-card-subtitle>
    <v-card-text>
      <v-row>
        <v-col cols="12" sm="6">
          <strong>Número de documento</strong>
          <v-text-field
            class="uppercase"
            title="Cédula de identidad"
            maxlength="16"
            dense
            outlined
            type="text"
            v-model="perfil.nroDocumento"
            :disabled="!editProfile"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
            <strong>Tipo de documento</strong>
            <v-text-field
              class="uppercase"
              title="Tipo documento"
              maxlength="10"
              dense
              outlined
              type="text"
              v-model="perfil.tipoDocumento"
              :disabled="!editProfile"
            ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
            <strong>Nombres</strong>
            <v-text-field
              class="uppercase"
              title="Nombres"
              maxlength="25"
              dense
              outlined
              type="text"
              v-model="perfil.nombres"
              :disabled="!editProfile"
            ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
            <strong>Primer apellido</strong>
            <v-text-field
              class="uppercase"
              title="Primer apellido"
              maxlength="25"
              dense
              outlined
              type="text"
              v-model="perfil.primerApellido"
              :disabled="!editProfile"
            ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
            <strong>Segundo apellido</strong>
            <v-text-field
              class="uppercase"
              title="Segundo apellido"
              maxlength="25"
              dense
              outlined
              type="text"
              v-model="perfil.segundoApellido"
              :disabled="!editProfile"
            ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
            <strong>Fecha de nacimiento</strong>
            <v-text-field
              class="uppercase"
              title="Fecha de nacimiento"
              maxlength="15"
              dense
              outlined
              type="text"
              v-model="perfil.fechaNacimiento"
              :disabled="!editProfile"
            ></v-text-field>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-btn v-if="updateAllowed" color="primary" @click="editPassword = true" dark>
        <v-icon-component icon="update"></v-icon-component>
        <span>Actualizar contraseña</span>
      </v-btn>
    </v-card-actions>
    <v-dialog v-model="editPassword" persistent content-class="dialog--alert" max-width="600">
      <v-card>
        <v-card-title class="ma-0 pa-1">
          <v-container fluid>
            <v-row no-gutters>
              <v-col
                align="start"
                justify="center"
                :cols="11"
                class="d-flex flex-row align-center text-sm primary--text primary--text"
              >
                <v-icon-component icon="update" class="mr-2"></v-icon-component>
                <span :class="$vuetify.theme.dark ? 'white--text' : 'primary--text'">Actualizar contraseña</span>
              </v-col>
              <v-col :cols="1">
                <v-tooltip bottom color="primary" >
                  <template v-slot:activator="{ on }">
                    <v-btn icon :color="$vuetify.theme.dark ? 'white' : 'color1'" v-on="on" @click.stop="cancel()">
                      <v-icon-component icon="close"></v-icon-component>
                    </v-btn>
                  </template>
                  <span>Cancelar actualización de contraseña</span>
                </v-tooltip>
              </v-col>
            </v-row>
          </v-container>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-subtitle
          v-if="mustUpdate"
        >
          <v-alert
            border="top"
            colored-border
            type="warning"
            elevation="2"
          >
            Su cuenta fue activada/restablecida, por seguridad debe actualizar su contraseña
          </v-alert>
        </v-card-subtitle>
        <v-card-text class="mt-3">
          <v-form ref="passwordForm">
            <v-row>
              <v-col cols="12" sm="12">
                <v-text-field
                  title="Contraseña actual"
                  label="Contraseña actual"
                  maxlength="50"
                  :minLength="minLengthPass"
                  dense
                  color="primary"
                  outlined
                  v-model="oldPassword"
                  :rules="rules.oldPassword"
                  :type="oldPasswordPeek ? 'text': 'password'"
                  @click:append="oldPasswordPeek = !oldPasswordPeek"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="12">
                <v-text-field
                  title="Nueva contraseña"
                  label="Nueva contraseña"
                  maxlength="50"
                  :minLength="minLengthPass"
                  dense
                  color="primary"
                  outlined
                  v-model="newPassword1"
                  :rules="rules.newPassword1"
                  :type="newPassword1Peek ? 'text': 'password'"
                  :append-icon="newPassword1Peek ? ICONS.visibility : ICONS.visibility_off"
                  @click:append="newPassword1Peek = !newPassword1Peek"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="12">
                <v-text-field
                  title="Repita la nueva contraseña"
                  label="Repita la nueva contraseña"
                  maxlength="50"
                  :minLength="minLengthPass"
                  dense
                  color="primary"
                  outlined
                  v-model="newPassword2"
                  :rules="rules.newPassword2"
                  :type="newPassword2Peek ? 'text': 'password'"
                  :append-icon="newPassword2Peek ? ICONS.visibility : ICONS.visibility_off"
                  @click:append="newPassword2Peek = !newPassword2Peek"
                  @paste.prevent="preventPaste()"
                ></v-text-field>
              </v-col>
              <v-col v-if="newPassword1" cols="12" sm="12">
                <strong>Fortaleza de la nueva contraseña: </strong> {{ nivelPassword[getPasswordStrength].text }}
                <v-progress-linear
                  rounded
                  :value="getProgress(getPasswordStrength)"
                  :color="nivelPassword[getPasswordStrength].color"
                ></v-progress-linear>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            elevation="0"
            @click.native="cancel()"
            id="btn-confirm-selected-cancel"
          >
          <v-icon-component icon="cancel"></v-icon-component>
          <span>Cancelar</span>
          </v-btn>
          <v-btn
            elevation="0"
            color="primary"
            dark
            @click.native="ok()"
            id="btn-confirm-selected-ok"
          >
            <v-icon-component icon="check"></v-icon-component>
            <span>Actualizar</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>
<script>
import { $Casbin } from '@/plugins/casbin';
import zxcvbn from 'zxcvbn';
import vIconComponent from '@/plugins/icon/index.vue';

export default {
  computed: {
    getPasswordStrength() {
      return zxcvbn(this.newPassword1).score;
    }
  },
  components: {
    vIconComponent
  },
  data() {
    return {
      perfil: {
        nroDocumento: null,
        nombres: null,
        primerApellido: null,
        segundoApellido: null,
        fechaNacimiento: null,
        tipoDocumento: null
      },
      minLengthPass: 8,
      minStrengthPass: 3,
      mustUpdate: false,
      oldPassword: null,
      newPassword1: null,
      newPassword2: null,
      oldPasswordPeek: false,
      newPassword1Peek: false,
      newPassword2Peek: false,
      nivelPassword: [
        {
          color: '#EFEFEF',
          text: ''
        },
        {
          color: '#F42D45',
          text: 'Contraseña muy débil'
        },
        {
          color: '#FFC107',
          text: 'Contraseña débil'
        },
        {
          color: '#8FD300',
          text: 'Contraseña segura'
        },
        {
          color: '#8FD300',
          text: 'Contraseña muy segura'
        }
      ],
      rules: {
        oldPassword: [
          v => !!v || 'Este campo es requerido.'
        ],
        newPassword1: [
          v => !!v || 'Este campo es requerido.',
          v => (v && v.length >= this.minLengthPass) || `La contraseña debe ser de al menos ${this.minLengthPass} caracteres`,
          v => (!!v && zxcvbn(v).score >= this.minStrengthPass) || 'La contraseña debe ser segura'
        ],
        newPassword2: [
          v => !!v || 'Este campo es requerido.',
          v => (!!v && v === this.newPassword1) || 'Las contraseñas no coinciden.'
        ]
      },
      editProfile: false,
      editPassword: false,
      updateAllowed: false
    };
  },
  async mounted() {
    const { rol } = this.$storage.get('rol');
    this.updateAllowed = await $Casbin.enforcer.enforce(rol, '/perfil', 'update');
    await this.obtenerDatos();
    if (this.$route.params?.estado === 'ASIGNADO') { // cuenta pendiente de confirmacion de contraseña
      this.editPassword = true;
      this.mustUpdate = true;
    }
  },
  methods: {
    getProgress(progress) {
      return progress * 100 / (this.nivelPassword.length - 1);
    },
    resetForm() {
      this.oldPassword = null;
      this.newPassword1 = null;
      this.newPassword2 = null;
      this.mustUpdate = false;
    },
    async ok() {
      if (this.$refs.passwordForm.validate()) {
        const data = {
          contrasenaActual: btoa(encodeURI(this.oldPassword)),
          contrasenaNueva: btoa(encodeURI(this.newPassword1)),
        };
        await this.$service.patch('usuarios/contrasena', data)
          .then(response => {
            if (response.finalizado) {
              this.$message.success(response.mensaje);
              this.mustUpdate = false;
            }
          })
          .catch(error => {
            this.$message.error(error.message ?? error.mensaje ?? 'Ocurrio un error');
          })
          .finally(() => {
            this.cancel();
          });
      }
    },
    cancel() {
      /* if (this.mustUpdate) {
        this.$message.warning('Debe actualizar su contraseña!');
      } else {

      } */
      this.resetForm();
      this.editPassword = false;
    },
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
    },
    preventPaste() {
      this.$alert('No se permite pegar, debe escribir la contraseña');
      this.newPassword2 = null;
    },
  }
};
</script>
