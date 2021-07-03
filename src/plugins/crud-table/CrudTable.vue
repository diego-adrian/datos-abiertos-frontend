<template>
  <v-card elevation="0" class="crud-table backgroundColor">
    <v-row no-gutters class="mt-2 mb-2">
      <v-col cols="12" class="d-flex flex-row align-center justify-start">
        <slot name="extra-row"></slot>
      </v-col>
      <slot name="customFilters"></slot>
      <v-col cols="12" class="d-flex flex-row align-center justify-space-between">
        <!-- Section buttons -->
        <v-card elevation="0"
                class="subtitle primary--text font-weight-regular pl-4 fs12">{{ description }}
        </v-card>
        <v-card elevation="0" class="d-flex flex-row">
          <slot name="buttons"></slot>
          <!-- Section Filters -->
          <v-card elevation="0" class="btn-filter" :class="{ active: showFilter }" v-if="filters.length > 0 && showFilterOptions">
            <v-tooltip bottom color="primary">
              <template v-slot:activator="{ on }">
                <v-btn icon :small="['xs', 'sm'].includes($vuetify.breakpoint.name)" @click.native="filtrar()"
                       :id="idFilter" class="primary--text btn-filter" v-on="on">
                  <v-icon-component icon="search" color="primary"/>
                </v-btn>
              </template>
              <span> Buscar </span>
            </v-tooltip>
          </v-card>
          <v-tooltip bottom color="primary">
            <template v-slot:activator="{ on }">
              <v-btn icon id="btnRefresh" :small="['xs', 'sm'].includes($vuetify.breakpoint.name)"
                     @click.native="getData(true)"
                     :class="`primary--text ${idRefresh} mr-3`" v-on="on">
                <v-icon-component icon="refresh"/>
              </v-btn>
            </template>
            <span> Actualizar listado </span>
          </v-tooltip>
        </v-card>
        <!-- END Section buttons -->

        <!-- Modal Add/Edit -->
        <v-dialog v-model="modal" persistent :max-width="widthModal">
          <v-card class="crud-dialog">
            <slot name="form">Agregue su formulario aquí</slot>
          </v-card>
        </v-dialog>
        <!-- END Modal Add/Edit -->
      </v-col>

      <!-- Section Filter -->
      <v-col cols="12" lg="12" md="12" sm="12" class="mt-3" v-if="showFilter && filters.length > 0">
        <transition name="slide-fade">
          <v-container fluid class="container--filter backgroundColor">
            <v-row no-gutters style="width: 97%">
              <v-col
                  :cols="12"
                  :class="[
                  !['xs'].includes($vuetify.breakpoint.name)
                    ? 'd-flex flex-row align-center justify-start flex-wrap'
                    : ''
                ]"
              >
                <template v-for="(filter, idx) in filters">
                  <v-input-text-field
                    @value="e => search[filter.field] = e"
                    :key="filter.field"
                    dense
                    outlined
                    :disabled="filter.disabled"
                    color="primary"
                    ref="searchTextField"
                    class="ml-2 mr-2 mb-1"
                    :autofocus="idx === 0"
                    v-if="filter.type === 'text'"
                    v-model="search[filter.field]"
                    :init="search[filter.field]"
                    :label="filter.label"
                    :style="!['xs'].includes($vuetify.breakpoint.name) ? 'width: 300px; max-width: 300px' : ''"
                    hide-details
                  ></v-input-text-field>
                  <v-input-select
                    @value="e => search[filter.field] = e"
                    :key="filter.field"
                    color="primary"
                    item-color="primary"
                    v-if="filter.type === 'array'"
                    v-model="search[filter.field]"
                    :init="search[filter.field]"
                    class="ml-2 mr-2 mb-1"
                    :label="filter.label"
                    :items="filter.values"
                    item-text="text"
                    item-value="value"
                    :disabled="filter.disabled"
                    :multiple="filter.multiple"
                    dense
                    :style="!['xs'].includes($vuetify.breakpoint.name) ? 'width: 300px; max-width: 300px' : ''"
                    outlined
                    hide-details
                    :append-icon="ICONS.search"
                    v-on:change="callFunction(search[filter.eventName], filter.field)"
                  ></v-input-select>
                  <v-input-select
                    v-if="filter.type === 'asyncautocomplete'"
                    @value="e => search[filter.field] = e"
                    v-model="search[filter.field]"
                    :key="search[filter.field]"
                    item-value="id" :items="auxSearch[filter.field]" outlined
                    dense hide-details
                    :label="filter.label"
                    :disabled="filter.disabled"
                    class="ml-2 mr-2 mb-1"
                    v-on:change="callFunction(search[filter.eventName], filter.field)"
                    :style="!['xs'].includes($vuetify.breakpoint.name) ? 'width: 300px; max-width: 300px' : ''"
                  >
                    <template v-slot:prepend-item>
                      <v-list-item>
                        <v-list-item-content>
                          <v-input-text-field
                            @value="e => searchTerm[filter.field] = e"
                            v-model="searchTerm[filter.field]"
                            :placeholder="filter.placeholder"
                            v-on:input="cargarRecursos(filter.url, filter.field, searchTerm[filter.field])">
                          </v-input-text-field>
                        </v-list-item-content>
                      </v-list-item>
                    </template>
                    <template slot="selection" slot-scope="data">
                      {{ filter.itemView.map(x => data.item[x]).join(' ') }}
                    </template>
                    <template slot="item" slot-scope="data">
                      {{ filter.itemView.map(x => data.item[x] + ' ').join(' ') }}
                    </template>
                  </v-input-select>
                </template>
              </v-col>

              <v-tooltip bottom color="primary" v-if="showFilterOptions">
                <template v-slot:activator="{ on }">
                  <v-btn
                      @click.native="handleCleanFilters()"
                      v-on="on"
                      color="gray"
                      dark
                      small
                      absolute
                      right
                      fab
                  >
                    <v-icon-component icon="close"></v-icon-component>
                  </v-btn>
                </template>
                <span>Cerrar filtro/búsqueda</span>
              </v-tooltip>
            </v-row>
          </v-container>
        </transition>
      </v-col>
      <!-- END Section Filter -->
    </v-row>

    <v-skeleton-loader :loading="loading" transition="fade-transition" type="table">
      <v-data-table
          :headers="getHeaders"
          :items="items"
          :items-per-page="10"
          :loading="loading"
          @update:page="requestData"
          @update:items-per-page="handleItemsPerPageOptions"
          :options.sync="options"
          class="data--table"
          :server-items-length="totalItems"
          loading-text="Cargando registros..."
          rowsPerPageText="filas por pagina"
          no-results-text="No se encontraron registros que coincidan"
          no-data-text="No hay resultados"
          :mobile-breakpoint="600"
          :footer-props="{
          itemsPerPageOptions: [10, 20, 50],
          itemsPerPageAllText: 'todos',
          itemsPerPageText: 'Filas por página'
        }"
      >
        <!-- ACTIONS -->
        <template v-slot:item.ACTIONS="{ item }" v-if="!custom">
          <slot name="actions" :props="item"></slot>
        </template>
        <!-- ALL ITEMS -->
        <template v-slot:item="{ item }" v-if="custom">
          <slot name="items" :items="item"></slot>
        </template>
        <!-- BUTTONS FOOTER -->
        <template v-slot:top>
          <div v-if="false">
            <v-select
                label="Ir a la pág."
                outlined
                dense
                no-data-text="No hay registros"
                hide-details
                color="primary"
                v-model="pageNumber"
                :items="numbers"
                class="input--search_page"
                @change="goToPage"
            >
            </v-select>
          </div>
        </template>
      </v-data-table>
    </v-skeleton-loader>
  </v-card>
</template>
<script>

import { mapState } from 'vuex';
import vIconComponent from '../icon/index.vue';

export default {
  props: {
    headers: {
      type: Array,
      default: () => []
    },
    parametros: {
      type: Object,
    },
    custom: {
      type: Boolean,
      default: false
    },
    idRefresh: {
      type: String,
      default: 'btn-refresh-list'
    },
    idFilter: {
      type: String,
      default: 'btn-filter-list'
    },
    order: {
      type: Array,
      default: () => []
    },
    filtersInicial: {
      type: Array,
      default: () => []
    },
    urlInicial: null,
    widthModal: {
      type: Number,
      default: 480
    },
    attribute: {
      type: String,
      default: 'filas'
    },
    description: {
      type: String,
      default: ''
    },
    filtroAsQuery: {
      type: Boolean,
      default: false
    },
    showFilterInit: {
      type: Boolean,
      default: false
    },
    showFilterOptions: {
      type: Boolean,
      default: true
    },
    omitirCargaOnMounted: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    'options.sortDesc'(ant, value) {
      if (ant !== value && this.loaded) {
        this.getData();
      }
    },
    activeSearch: {
      handler(value) {
        if (value) {
          this.getData();
          this.activeSearch = false;
        }
      },
      deep: true
    }
  },
  data() {
    return {
      url: null,
      search: {},
      activeSearch: false,
      totalItems: 0,
      items: [],
      loading: true,
      pageNumber: null,
      loaded: false,
      itemsPerPage: null,
      selected: [],
      numbers: [],
      options: {
        page: 1,
        itemsPerPage: 10
      },
      showFilterActive: this.showFilter,
      auxSearch: {},
      searchTerm: {},
      showFilter: false,
      filters: []
    };
  },
  destroyed() {
    this.loaded = false;
  },
  mounted() {
    this.$nextTick(() => {
      this.url = this.urlInicial;

      this.cargarFiltro(this.filtersInicial);

      this.showFilter = this.showFilterInit;
      if (this.showFilter) {
        setTimeout(() => {
          if (this.$root.$refs.CrudTable.$refs.searchTextField) {
            for (const elem of this.$root.$refs.CrudTable.$refs.searchTextField) {
              if (elem && elem.$children[0].$el) this.addEventKeydown(elem.$children[0].$el);
            }
          }
        }, 300);
      }
      if (this.omitirCargaOnMounted) {
        return;
      }
      try {
        this.getData();
      } catch (error) {
        this.$message.error(error.message ?? error.mensaje ?? 'Ocurrio un error');
      }
    });
  },
  created() {
    this.$root.$refs.CrudTable = this;
  },
  computed: {
    ...mapState(['modal']),

    getHeaders() {
      const items = [];
      this.headers.map(el => {
        el.align = 'left';
        items.push(el);
      });
      return items;
    }
  },
  components: {
    vIconComponent
  },
  methods: {
    updateUrl(newUrl) {
      console.log(`Nueva ruta: ${newUrl}`);
      this.url = newUrl;
    },
    borrarLista() {
      this.items = [];
      this.setPropsDataTable();
    },
    goToPage() {
      this.options.page = this.pageNumber;
      this.getData();
    },
    requestData(data) {
      this.options.page = data;
      this.pageNumber = data;
      this.getData();
    },
    delay (time) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(true);
        }, time);
      });
    },
    /**
     * @function addEventKeydown
     * @description Esta funcion esta implementada nativamente, porque vue no reconoce el keydown solo el jekup
     * @link  https://vuejs.org/v2/guide/events.html
     * @param elem
     */
    addEventKeydown(elem) {
      const element = elem;
      let typingTimer;
      const doneTypingInterval = 1000;
      if (element) {
        element.onkeydown = () => {
          clearTimeout(typingTimer);
          typingTimer = setTimeout(async () => {
            this.activeSearch = true;
          }, doneTypingInterval);
          return true;
        };
      }
    },
    handleItemsPerPageOptions(itemsPerPage) {
      this.itemsPerPage = itemsPerPage;
      this.getData();
    },
    /**
     * @function handleCleanFilters
     * @description Limpiar los filtros
     * @author dbarra@agetic.gob.bo
     */
    handleCleanFilters() {
      this.search = {};
      this.getData();
      // eslint-disable-next-line vue/no-mutating-props
      this.showFilter = false;
    },
    /**
     * @function getData
     * @description Obtener los registros para el crudTable
     * @author dbarra@agetic.gob.bo
     */
    async getData(refresh = false) {
      try {
        this.loading = true;
        if (this.itemsPerPage) {
          this.options.itemsPerPage = this.itemsPerPage;
        }
        const {
          sortBy,
          sortDesc,
          page,
          itemsPerPage
        } = this.options;
        let query = {
          limite: itemsPerPage,
          pagina: page,
        };

        const sort = Array.isArray(sortBy) && sortBy.length > 0 ? sortBy[0] : sortBy;
        const desc = Array.isArray(sortDesc) && sortDesc.length > 0 ? sortDesc[0] : sortDesc;
        if ((sort || '').length > 0 && !refresh) {
          query.order = (desc ? '-' : '') + sort;
        }

        this.search = {
          ...this.search,
          ...this.parametros
        };

        const filtro = [];

        // Convirtiendo JSON array search en array plano

        if (this.filtroAsQuery) {
          query = {
            ...query,
            ...this.search
          };
        } else {
          if (Object.keys(this.search).length) {
            for (const key in this.search) {
              if (typeof this.search[key] !== 'function' && (this.search[key] || '').trim().length > 0) {
                filtro.push(`${key}:${this.search[key]}`);
              }
            }
          }
        }

        if (Object.keys(query).length > 2) {
          query = {
            ...query,
            page: 1
          };
          this.options.page = 1;
        }

        let data = await this.$service.list(this.url, query, filtro);
        if (data?.datos && !data.datos.errores) {
          data = data.datos;
          const items = this.setItemsHeader(data[this.attribute]);
          const n = parseInt(data.total / this.options.itemsPerPage);
          const isHigher = n * this.options.itemsPerPage >= data.total;
          this.numbers = [...Array(n > 0 ? (isHigher ? n : n + 1) : 1)
            .keys()].map(
            item => item + 1
          );
          const { total } = data;
          (items || []).map(el => {
            if (el.estado !== undefined) {
              el.active = el.estado === 'INACTIVO' ? 'INACTIVE' : 'ACTIVE';
            }
          });
          this.setPropsDataTable(false, items, total);
        } else {
          this.setPropsDataTable();
        }
        setTimeout(() => {
          this.loaded = true;
        }, 1000);
      } catch (error) {
        this.$message.error(error.message ?? error.mensaje ?? 'Ocurrio un error');
      }
    },
    setItemsHeader(data) {
      if (this.url === 'usuarios') {
        if (data) {
          return data.map(fila => {
            fila.nroDocumento = fila.persona.nroDocumento;
            fila.nombre = `${fila.persona.nombres} ${fila.persona.primerApellido} ${fila.persona.segundoApellido}`;
            return fila;
          });
        }
      }
      return data;
    },
    setPropsDataTable(loading = false, items = [], count = 0) {
      this.loading = loading;
      this.items = items;
      this.totalItems = count;
    },
    filtrar() {
      // eslint-disable-next-line vue/no-mutating-props
      this.showFilter = !this.showFilter;
      if (this.showFilter) {
        if (this.filtersInicial.length > 0) this.cargarFiltro(this.filtersInicial);
        for (const key in this.search) {
          this.search[key] = '';
        }
        setTimeout(() => {
          if (this.$root.$refs.CrudTable.$refs.searchTextField) {
            for (const elem of this.$root.$refs.CrudTable.$refs.searchTextField) {
              if (elem && elem.$children[0].$el) this.addEventKeydown(elem.$children[0].$el);
            }
          }
        }, 300);
      }
    },
    parseDate(date) {
      if (!date) return null;
      const [month, day, year] = date.split('/');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    },
    cargarRecursos(url, variable, searchTerm) {
      this.$service.get(`${url}?filtro=nombre:${searchTerm ?? ''}`)
        .then((resultado) => {
          const aux = this.auxSearch;
          this.auxSearch = {};
          this.auxSearch = aux;
          this.auxSearch[variable] = resultado && resultado.datos && resultado.datos.filas ? resultado.datos.filas : [];
        });
    },
    async callFunction(accion, params) {
      await this.delay(100);
      if (accion) {
        await accion(this.search[params]);
      }
      await this.getData();
    },
    cargarFiltro (newFilters) {
      this.$nextTick(() => {
        this.filters = newFilters;
        this.search = {};
        newFilters.forEach((filter) => {
          if (filter.init) {
            this.search[filter.field] = filter.init;
          }
          if (filter.onChange) {
            this.search[filter.eventName] = filter.onChange;
          }
        });
      });
    },
  }
};
</script>
<style lang="scss">
@import '../../scss/variables.scss';

$filterBackground: #f5f5f5;
$filterBorder: #e5e5e5;
.data--table {
  display: flex;
  flex-direction: column;

  .input--search_page {
    max-width: 120px;
    width: 120px;

    label {
      font-size: 13px !important;
    }
  }
}

.crud-table {
  .table-actions {
    white-space: initial;
    padding: 0 0 0 5px !important;
    text-align: center;
  }

  td {
    .v-alert {
      padding: 2px 8px;
      text-align: center;
      font-size: 0.9rem;
      font-weight: 600;
      display: inline-block;
    }
  }

  .btn-filter {
    display: inline-block;
    position: relative;

    &.active {
      .v-btn {
        background-color: $backgroundColor !important;
        box-shadow: none;
      }

      &::after,
      &::before {
        display: block;
      }
    }

    &::before {
      content: '';
      position: absolute;
      width: 0;
      height: 0;
      bottom: -10px;
      left: 7px;
      border-bottom: 12px solid $color1;
      border-left: 14px solid transparent;
      border-right: 14px solid transparent;
      display: none;
    }

    &::after {
      content: '';
      position: absolute;
      width: 0;
      height: 0;
      bottom: -11px;
      left: 7px;
      border-bottom: 12px solid $color1;
      border-left: 14px solid transparent;
      border-right: 14px solid transparent;
      z-index: 1;
      display: none;
    }
  }

  .container--filter {
    background: $backgroundColor;
    border: 1px solid $filterBorder;
  }
}
</style>
