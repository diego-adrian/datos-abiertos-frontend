<template>
  <v-card elevation="0">
    <template>
      <Medallero
        :dialog="dialog"
        :medallero="medallero"
        @actualizarLista="actualizarLista"
      />
      <v-card elevation="0" v-show="mostrar">
        <crud-table
          :key="componentKey"
          ref="table"
          v-if="showCrudTable"
          :headers="headers"
          description="Medalleros"
          :url="url"
          :widthModal="500"
          :order="order"
          :custom="true"
          :omitir-carga-on-mounted="true"
          :show-filter-init="true"
          :filters-inicial="filters"
        >
          <template slot="items" slot-scope="items">
            <tr>
              <td>{{ items.items.area }}</td>
              <td>{{ items.items.grado_escolar }}</td>
              <td
                class="text-uppercase"
                v-if="etapaTipo == 'DEPARTAMENTAL' || etapaTipo == 'DISTRITAL'"
              >
                {{ items.items.departamento }}
              </td>
              <td class="text-uppercase" v-if="etapaTipo == 'DISTRITAL'">
                {{ items.items.distrito }}
              </td>
              <td>
                <v-btn
                  v-if="!items.items.estado_medallero"
                  outlined
                  color="red"
                >
                  EN COMITÉ
                  <v-avatar
                    class="ma-2"
                    size="22"
                    color="red"
                  >
                    <span class="white--text text-h5">{{ items.items.estudiantes }}</span>
                  </v-avatar>
                </v-btn>
                <v-btn
                  v-if="items.items.estado_medallero"
                  outlined
                  color="green"
                >
                  GENERADO
                  <v-avatar
                    class="ma-2"
                    size="22"
                    color="green"
                  >
                    <span class="white--text text-h5">{{ items.items.estudiantes }}</span>
                  </v-avatar>
                </v-btn>
              </td>

              <td>
                 <v-tooltip
                  bottom
                  color="grey darken-1"
                  v-if="items.items.estudiantes == 0"
                >
                  <template v-slot:activator="{ on }">
                    <v-btn
                      icon
                      v-on="on"
                      color="grey darken-1"
                    >
                      <v-icon-component disabled icon="remove_red_eye"></v-icon-component>
                    </v-btn>
                  </template>
                  <span>No existe estudiantes en el medallero</span>
                </v-tooltip>

                <v-tooltip
                  bottom
                  color="red"
                  v-else-if ="!items.items.estado_medallero"
                >
                  <template v-slot:activator="{ on }">
                    <v-btn
                      icon
                      v-on="on"
                      color="red"
                      @click.stop="verMedallero(items.items)"
                    >
                      <v-icon-component icon="mode"></v-icon-component>
                    </v-btn>
                  </template>
                  <span>Desempatar Medallero</span>
                </v-tooltip>
                <v-tooltip
                  bottom
                  color="green"
                  v-else-if="items.items.estado_medallero"
                >
                  <template v-slot:activator="{ on }">
                    <v-btn
                      icon
                      v-on="on"
                      color="green"
                      @click.stop="verMedallero(items.items)"
                    >
                      <v-icon-component
                        icon="remove_red_eye"
                      ></v-icon-component>
                    </v-btn>
                  </template>
                  <span>Ver Medallero</span>
                </v-tooltip>
              </td>
            </tr>
          </template>
        </crud-table>
        <v-card elevation="0" v-if="medalleroGenerado == 1">
          <template>
            <v-row
              align="center"
              class="text-center"
              style="padding: 80px !important"
            >
              <v-col cols="12">
                <v-card elevation="0" width="100%" align="center">
                  <v-btn
                    height="100"
                    @click="generarMedalleros()"
                    class="bloque"
                    color="warning"
                    elevation="1"
                  >
                    <v-icon-component icon="military_tech" :size="70" />
                    <strong v-if="this.displayGrande">
                      Se generarán los medalleros de la etapa:
                      {{ etapaSeleccionada.nombre }}</strong
                    >
                  </v-btn>
                  <div class="mt-1" v-if="!this.displayGrande">
                    Se generarán los medalleros de la etapa:
                    {{ etapaSeleccionada.nombre }}
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </template>
        </v-card>
      </v-card>
    </template>
  </v-card>
</template>
<script>
import vIconComponent from '@/plugins/icon/index.vue';
import CrudTable from '@/plugins/crud-table/CrudTable.vue';
import validate from '@/common/mixins/validate';
import actions from '@/plugins/crud-table/mixins/crud-table';
import Medallero from '@/components/medalleros/medallero.vue';

export default {
  mixins: [actions, validate],
  components: {
    vIconComponent,
    CrudTable,
    Medallero,
  },
  data: () => ({
    componentKey: 0,
    mostrar: true,
    url: 'medallero',
    order: ['createdAt', 'DESC'],
    idOlympiad: null,
    etapaSeleccionada: { nombre: '0' },
    medalleroGenerado: 0,
    displayGrande: true,
    etapaTipo: null,
    medallero: [],
    dialog: false,
    idOlimpiadaSeleccionada: null,
    showCrudTable: false,
    filters: [],
    headers: [],
  }),
  mounted() {
    const display = this.$vuetify.breakpoint.name;
    this.displayGrande = !!(
      display === 'lg'
      || display === 'xl'
      || display === 'md'
    );
    this.$nextTick(async () => {
      this.olimpiadaSeleccionada = this.$storage.get('olimpiadaSeleccionada');
      if (this.olimpiadaSeleccionada !== null) {
        this.idOlimpiadaSeleccionada = this.olimpiadaSeleccionada.id;
      } else {
        this.idOlimpiadaSeleccionada = null;
      }

      this.etapaSeleccionada = this.$storage.get('etapaSeleccionada');
      if (this.etapaSeleccionada !== null) {
        this.idEtapaSeleccionada = this.etapaSeleccionada.id;
      } else {
        this.idEtapaSeleccionada = null;
      }

      this.url = `medallero/etapa/${this.etapaSeleccionada.id}/listar`;

      this.loadParams();
    });
  },
  methods: {
    async actualizarOlimpiada(idOlimpiadaSeleccionadaNueva) {
      this.olimpiadaSeleccionada = this.olimpiadas.find(
        (item) => item.id === idOlimpiadaSeleccionadaNueva
      );
      this.idOlimpiadaSeleccionada = idOlimpiadaSeleccionadaNueva;
      if (this.olimpiadaSeleccionada != null) {
        this.$storage.set('olimpiadaSeleccionada', this.olimpiadaSeleccionada);
      }
      this.idEtapaSeleccionada = null;
      await this.cargarEtapas();

      this.$root.$refs.CrudTable.cargarFiltro(this.definirFiltros());

      setTimeout(() => {
        this.updateList();
      }, 100);
    },

    async actualizarEtapa(idEtapaSeleccionadaNueva) {
      this.componentKey += 1;
      this.medalleroGenerado = 0;
      this.etapaSeleccionada = this.etapas.find(
        (item) => item.id === idEtapaSeleccionadaNueva
      );
      this.idEtapaSeleccionada = idEtapaSeleccionadaNueva;
      if (this.etapaSeleccionada != null) {
        this.$storage.set('etapaSeleccionada', this.etapaSeleccionada);
      }
      this.$root.$refs.CrudTable.cargarFiltro(this.definirFiltros());
      await this.cargarListaMedallero();
    },

    async cargarEtapas() {
      await this.$service
        .get(`olimpiadas/${this.idOlimpiadaSeleccionada}/etapas`)
        .then((resultado) => {
          this.etapas = resultado && resultado.datos && resultado.datos.filas
            ? resultado.datos.filas
            : [];
        });
    },

    async loadParams() {
      this.medalleroGenerado = null;
      await this.cargarEtapas();
      await this.$service
        .get('olimpiadas?limite=50&pagina=1')
        .then((resultado) => {
          this.olimpiadas = resultado && resultado.datos && resultado.datos.filas
            ? resultado.datos.filas
            : [];
        });
      await this.cargarListaMedallero();
      setTimeout(() => {
        this.updateList();
      }, 100);
    },

    actualizarLista() {
      this.updateList();
    },

    async cargarListaMedallero() {
      this.filters = this.definirFiltros();
      this.mostrar = false;
      this.url = `medallero/etapa/${this.etapaSeleccionada.id}/listar`;
      this.headers = this.definirHeaders();
      const response = await this.$service.get(this.url);
      this.medalleroGenerado = response.datos.total > 0 ? 2 : 1;
      this.etapaTipo = response.datos.etapaTipo;
      if (response.datos.total < 0) {
        this.headers.splice(0, 6);
        this.filters.splice(2, 4);
      }
      if (response.datos.etapaTipo === 'NACIONAL') {
        this.headers.splice(2, 2);
        this.filters.splice(4, 2);
      }
      if (response.datos.etapaTipo === 'DEPARTAMENTAL') {
        this.headers.splice(3, 1);
        this.filters.splice(5, 1);
      }
      this.showCrudTable = true;
      this.updateList();
      this.mostrar = true;
    },

    async generarMedalleros() {
      const message = `¿Está seguro de generar el medallero de la etapa ${this.etapaSeleccionada.name}, solo se puede generar por una vez?`;
      this.$confirm(message, async () => {
        const response = await this.$service.patch(
          `medallero/etapa/${this.etapaSeleccionada.id}`,
          {}
        );
        if (response.isOK) {
          this.$message.success(response.mensaje);
        } else {
          this.$message.error(
            response.message
              ?? response.mensaje
              ?? 'Error al generar medalleros'
          );
        }
        this.componentKey += 1;
        this.cargarListaMedallero();
      });
    },

    verMedallero(medallero) {
      this.medallero = medallero;
      this.dialog = !this.dialog;
    },

    definirHeaders() {
      return [
        {
          text: 'Área',
          align: 'center',
          value: 'area',
          sortable: false,
        },
        {
          text: 'Grado Escolaridad',
          align: 'center',
          value: 'grado_escolar',
          sortable: false,
        },
        {
          text: 'Departamento',
          align: 'center',
          value: 'departamento',
          sortable: false,
        },
        {
          text: 'Distrito',
          align: 'center',
          value: 'distrito',
          sortable: false,
        },
        {
          text: 'Estado',
          align: 'center',
          value: 'estado_medallero',
          sortable: false,
        },
        {
          text: 'Acciones',
          divider: false,
          sortable: false,
          align: 'center',
          value: 'ACTIONS',
        },
      ];
    },

    definirFiltros() {
      return [
        {
          field: 'idOlimpiada',
          type: 'array',
          init: this.idOlimpiadaSeleccionada,
          multiple: false,
          label: 'Olimpiadas',
          eventName: 'cambioOlimpiadas',
          onChange: this.actualizarOlimpiada,
          values: this.olimpiadas.map((olimpiada) => ({
            text: olimpiada.nombre,
            value: olimpiada.id,
          })),
        },
        {
          field: 'idEtapa',
          type: 'array',
          init: this.idEtapaSeleccionada,
          multiple: false,
          label: 'Etapas',
          eventName: 'cambioEtapas',
          onChange: this.actualizarEtapa,
          values: this.etapas.map((etapa) => ({
            text: `${etapa.nombre} - ${etapa.estado}`,
            value: etapa.id,
          })),
        },
        {
          field: 'area',
          type: 'text',
          label: 'Área',
          typeG: 'String',
        },
        {
          field: 'grado',
          type: 'text',
          label: 'Grado Escolaridad',
          typeG: 'String',
        },
        {
          field: 'departamento',
          type: 'text',
          label: 'Departamento',
          typeG: 'String',
        },
        {
          field: 'distrito',
          type: 'text',
          label: 'Distrito',
          typeG: 'String',
        },
      ];
    },
  },
  computed: {
    nombreArchivo() {
      return 'Medallero';
    },
  },
};
</script>
