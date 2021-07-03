<template>
  <v-card elevation="0">
    <crud-table
      :headers="headers"
      :url-inicial="url"
      :filters-inicial="filters"
      :widthModal="500"
      :order="order"
      description="Gestión de entidades"
      :custom="true"
    >
      <template slot="buttons">
        <v-tooltip bottom color="primary">
          <template v-slot:activator="{ on }">
            <v-btn color="primary" icon dark v-on="on" :small="['xs', 'sm'].includes($vuetify.breakpoint.name)" @click.native.stop="oModal" slot="activator">
              <v-icon-component icon="add"/>
            </v-btn>
          </template>
          <span> Agregar entidad </span>
        </v-tooltip>
      </template>
      <!-- SLOT PARA EL FORMULARIO -->
      <template slot="form" slot-scope="">
        <v-card-title class="ma-0 pa-1">
          <v-container fluid>
            <v-row no-gutters>
              <v-col
                align="start"
                justify="center"
                :cols="11"
                class="d-flex flex-row align-center text-sm"
                :class="$vuetify.theme.dark ? 'white--text' : 'primary--text'"
              >
                <v-icon-component class="m-2" icon="add"></v-icon-component>
                {{ form.id ? 'Editar entidad' : 'Adicionar entidad' }}
              </v-col>
              <v-col :cols="1">
                <v-tooltip bottom color="primary" icon>
                  <template v-slot:activator="{ on }">
                    <v-btn icon color="primary" v-on="on" @click.stop="closeModal">
                      <v-icon-component icon="close"></v-icon-component>
                    </v-btn>
                  </template>
                  <span>Cerrar ventana emergente</span>
                </v-tooltip>
              </v-col>
            </v-row>
          </v-container>
        </v-card-title>
        <v-divider></v-divider>
        <!-- FORMULARIO PARA AGREGAR O EDITAR -->
        <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="save">
          <v-card>
            <v-container fluid>
              <v-row>
                <v-col cols="12" md="6" xs="12" sm="12" lg="6">
                  <v-text-field
                    color="primary" icon
                    required
                    autofocus
                    :rules="rules.razonSocial"
                    v-model="form.razonSocial"
                    outlined
                    hide-details
                    dense
                    label="Razón Social"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6" xs="12" sm="12" lg="6">
                  <v-text-field
                    color="primary" icon
                    required
                    v-model="form.nit"
                    label="Nit"
                    outlined
                    hide-details
                    dense
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6" xs="12" sm="12" lg="6">
                  <v-text-field
                    color="primary" icon
                    label="Sigla"
                    required
                    v-model="form.sigla"
                    outlined
                    hide-details
                    dense
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6" xs="12" sm="12" lg="6">
                  <v-text-field
                    color="primary" icon
                    required
                    :rules="rules.email"
                    label="Correo electrónico"
                    v-model="form.email"
                    outlined
                    hide-details
                    dense
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6" xs="12" sm="12" lg="6">
                  <v-text-field
                    color="primary" icon
                    required
                    label="Telefonos"
                    v-model="form.telefonos"
                    outlined
                    hide-details
                    dense
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6" xs="12" sm="12" lg="6">
                  <v-text-field
                    color="primary" icon
                    required
                    label="Web"
                    :rules="rules.website"
                    v-model="form.web"
                    outlined
                    hide-details
                    dense
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6" xs="12" sm="12" lg="6">
                  <v-text-field
                    color="primary" icon
                    required
                    label="Info"
                    v-model="form.info"
                    outlined
                    hide-details
                    dense
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6" xs="12" sm="12" lg="6">
                  <v-text-field
                    color="primary" icon
                    required
                    label="Codigo portal único"
                    v-model="form.codigoPortalUnico"
                    outlined
                    hide-details
                    dense
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-textarea
                    color="primary" icon
                    required
                    counter="250"
                    :rules="rules.descripcion"
                    label="Descripción"
                    v-model="form.descripcion"
                    outlined
                    hide-details
                    dense
                    rows="5"
                  ></v-textarea>
                </v-col>
              </v-row>
            </v-container>
            <v-card-actions>
              <v-container fluid>
                <v-row>
                  <v-col justify="start" xs="12" sm="12" md="4" lg="4" cols="12" class="pr-0 pl-0">
                    <small class="error--text text-required">* Los campos son obligatorios</small>
                  </v-col>
                  <v-col sm="12" xs="12" md="4" lg="4" cols="12">
                    <v-btn block @click.stop="closeModal">
                      <v-icon-component icon="cancel"></v-icon-component>
                      <span>Cancelar</span>
                    </v-btn>
                  </v-col>
                  <v-col sm="12" xs="12" md="4" lg="4" cols="12">
                    <v-btn block color="primary" icon type="submit" :disabled="!valid">
                      <v-icon-component icon="check"></v-icon-component>
                      <span>Enviar</span>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-actions>
          </v-card>
        </v-form>
      </template>
      <!-- SLOT PARA TODOS LOS ITEMS (Solo en caso de que se quiera personalizar cada columna o mas de 1 columna) -->
      <template slot="items" slot-scope="items">
        <tr>
          <td>{{ items.items.razonSocial }}</td>
          <td>{{ items.items.nit }}</td>
          <td>{{ items.items.sigla }}</td>
          <td>{{ items.items.telefonos }}</td>
          <td>{{ items.items.email }}</td>
          <td>{{ items.items.codigoPortalUnico }}</td>
          <td>
            <v-btn outlined :color="items.items.estado === 'ACTIVO' ? 'info' : 'default'">{{
              items.items.estado
            }}</v-btn>
          </td>
          <td>
            <v-tooltip bottom color="success">
              <template v-slot:activator="{ on }">
                <v-btn icon v-on="on" color="success" @click.stop="oModal(items)">
                  <v-icon-component icon="edit"></v-icon-component>
                </v-btn>
              </template>
              <span>Editar registro</span>
            </v-tooltip>
            <v-tooltip bottom color="error">
              <template v-slot:activator="{ on }">
                <v-btn icon v-on="on" color="red" @click.prevent="itemDelete(items)">
                  <v-icon-component icon="delete"></v-icon-component>
                </v-btn>
              </template>
              <span>Eliminar registro</span>
            </v-tooltip>
            <v-tooltip bottom color="info">
              <template v-slot:activator="{ on }">
                <v-btn v-generate icon color="info" v-on="on" @click.prevent="generatePDF(items)">
                  <v-icon-component icon="picture_as_pdf"></v-icon-component>
                </v-btn>
              </template>
              <span>Generar reporte</span>
            </v-tooltip>
          </td>
        </tr>
      </template>
    </crud-table>
    <v-dialog v-model="modal2" persistent width="800">
      <v-card class="pa-0 ma-0">
        <iframe :src="base64" class="pa-0 ma-0" width="800" height="500"></iframe>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" icon @click="$store.commit('closeModal', 2)">
            Cerrar vista pdf
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>
<script>
import { mapState } from 'vuex';
import validate from 'validate.js';
import CrudTable from '@/plugins/crud-table/CrudTable.vue';
import actions from '@/plugins/crud-table/mixins/crud-table';
import vIconComponent from '@/plugins/icon/index.vue';

export default {
  mixins: [actions],
  computed: {
    ...mapState(['modal2'])
  },
  data: () => ({
    rules: {
      razonSocial: [
        val => {
          const key = 'key';
          const constraints = {
            [key]: {
              presence: {
                message: 'Este campo no puede estar vacio'
              }
            }
          };
          const isValid = validate({ [key]: val || null }, constraints, { fullMessages: false });
          return isValid && isValid[key] ? isValid[key].pop() : true;
        }
      ],
      descripcion: [
        val => {
          const key = 'key';
          const constraints = {
            [key]: {
              presence: {
                message: 'Este campo no puede estar vacio'
              },
              length: {
                minimum: 1,
                maximum: 250,
                message: 'Este campo excede los caracteres permitidos'
              }
            }
          };
          const isValid = validate({ [key]: val || null }, constraints, { fullMessages: false });
          return isValid && isValid[key] ? isValid[key].pop() : true;
        }
      ],
      email: [
        val => {
          const key = 'key';
          const constraints = {
            [key]: {
              presence: {
                message: 'No puede estar vacio'
              },
              email: {
                message: 'No es un correo electrónico válido'
              }
            }
          };
          const isValid = validate({ [key]: val || null }, constraints, { fullMessages: false });
          return isValid && isValid[key] ? isValid[key].pop() : true;
        }
      ],
      website: [
        val => {
          const key = 'key';
          const constraints = {
            [key]: {
              url: {
                message: 'La direccion web ingresada no es válido'
              }
            }
          };
          const isValid = validate({ [key]: val || null }, constraints, { fullMessages: false });
          return isValid && isValid[key] ? isValid[key].pop() : true;
        }
      ]
    },
    valid: false,
    url: 'entidades',
    order: ['createdAt', 'DESC'],
    headers: [
      { text: 'Razon social', align: 'center', value: 'razonSocial' },
      { text: 'Nit', value: 'nit' },
      { text: 'Sigla', value: 'sigla' },
      { text: 'Telefonos', value: 'telefonos' },
      { text: 'Correo Electrónico', value: 'email' },
      { text: 'Codigo portal único', value: 'codigoPortalUnico' },
      { text: 'Estado', sortable: false, value: 'estado' },
      { text: 'Acciones', divider: false, sortable: false, align: 'center', value: 'ACTIONS' }
    ],
    form: {
      id: null,
      razonSocial: null,
      nit: null,
      sigla: null,
      email: null,
      telefonos: null,
      descripcion: null,
      web: null,
      info: null,
      codigoPortalUnico: null,
      estado: 'ACTIVO'
    },
    filters: [
      {
        field: 'nombres',
        label: 'Nombres',
        type: 'text',
        typeG: 'String'
      }
    ],
    base64: null
  }),
  methods: {
    reset() {
      this.form = {
        id: null,
        razonSocial: null,
        nit: null,
        sigla: null,
        email: null,
        telefonos: null,
        descripcion: null,
        web: null,
        info: null,
        codigoPortalUnico: null,
        estado: 'ACTIVO'
      };
    },
    itemDelete({ items }) {
      const message = '¿Está seguro de eliminar este registro?';
      this.$confirm(
        message,
        async () => {
          const response = await this.$service.delete(`${this.url}/${items.id}`);
          if (response.isOK) {
            this.updateList();
            this.closeModal();
            this.$message.success('Registro eliminado satisfactoriamente');
          } else {
            this.$message.error(response.message ?? response.mensaje);
          }
        },
        () => {}
      );
    },
    async generatePDF() {
      try {
        const response = await this.$service.file('reporte/generar/base64');
        this.base64 = `data:application/pdf;base64,${response.data}`;
        this.$store.commit('openModal', 2);
        this.$waiting(false);
      } catch (err) {
        this.$waiting(false);
        this.$message.error(err.message ?? err.mensaje);
      }
    },
    closeModal() {
      this.reset();
      this.$store.commit('closeModal');
    },
    async oModal({ items }) {
      if (items && items.id) {
        this.form = { ...items };
      } else {
        this.reset();
      }
      this.$store.commit('openModal');
    },
    /**
     * @function save
     * @description Esta funcion esta creada para guardar en la BD
     * @author dbarra@agetic.gob.bo
     */
    async save() {
      if (this.$refs.form.validate()) {
        const data = { ...({}, this.form) };
        if (data.id) {
          const response = await this.$service.patch(`${this.url}/${data.id}`, data);
          if (response.isOK) {
            console.log(`response: ${response}`);
            this.$store.commit('closeModal');
            this.updateList();
            this.$message.success('Se actualizó el registro correctamente');
          } else {
            this.$message.error(response.mensaje ?? 'Ocurrio un error al tratar de enviar la data');
          }
        } else {
          delete data.id;
          const response = await this.$service.post(this.url, data);
          if (response.isOK) {
            console.info(`Exito: ${response}`);
            this.$store.commit('closeModal');
            this.updateList();
            this.$message.success('El registro fue agregado correctamente');
          } else {
            console.info(`Error: ${response}`);
            this.$message.error(response.mensaje ?? 'Ocurrio un error al tratar de enviar la data');
          }
        }
      } else {
        this.$message.error('Complete los campos obligatorios');
      }
    }
  },
  components: {
    CrudTable,
    vIconComponent
  }
};
</script>
