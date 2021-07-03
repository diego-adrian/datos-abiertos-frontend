<template>
  <v-card elevation="0" class="pt-1">
    <v-card v-if="olimpiada && etapa" style="margin-top: -20px" elevation="0">
      <v-toolbar color="transparent" flat class="pa-0 ma-0 calendar-information d-flex flex-row align-center justify-center">
        <v-toolbar-title class="fs15 d-flex flex-row align-center justify-center">
          <span class="pr-1 pt-1">Vista [ del </span>
          <span class="pt-1 pl-2">{{ sFirstDate }}</span>
          <span class="pr-2 pl-2 pt-1">al </span>
          <span class="pt-1">{{ sLastDate }} ]</span>
        </v-toolbar-title>
      </v-toolbar>
      <v-card elevation="0" class="d-flex flex-row align-center justify-center">
        <v-autocomplete
          label="Selecciona el area"
          :items="aAreas"
          v-model="area"
          item-text="nombre"
          return-object
          no-data-text="No existen registros"
          outlined
          dense
          hide-details
        ></v-autocomplete>
        <v-btn
          icon
          @click="$refs.calendar.prev(); setDisabledDates(); getDataCalendar()"
        >
          <v-icon>{{ ICONS.chevron_left }}</v-icon>
        </v-btn>
        <v-spacer></v-spacer>

        <v-btn
          icon
          @click="$refs.calendar.next(); setDisabledDates(); getDataCalendar()"
        >
          <v-icon>{{ ICONS.chevron_right }}</v-icon>
        </v-btn>
      </v-card>
      <v-calendar
        locale="es-ES"
        ref="calendar"
        class="mt-2"
        v-if="readyCalendar"
        v-model="calendar"
        :weekdays="[1, 2, 3, 4, 5, 6, 0]"
        type="month"
        :events="events"
        event-overlap-mode="stack"
        @click:date="selectDate"
        @click:event="showEvent"
        :event-overlap-threshold="30"
        :event-color="getEventColor"
        :short-weekdays="false"
        :short-months="false"
      >
        <template v-slot:day="{ past, date }">
          <span :class="isValidDate(date, past) ? 'enabled--calendar_day alldays' : 'disabled--calendar_day alldays'">
            <span :id="date"></span>
          </span>
        </template>
      </v-calendar>
      <v-menu
        v-model="selectedOpen"
        :close-on-content-click="false"
        :close-on-click="false"
        :activator="selectedElement"
        offset-x
      >
        <v-card
          color="grey lighten-4"
          min-width="350px"
          flat
        >
          <v-toolbar
            :color="selectedEvent.color"
            dark
          >
            <v-btn icon @click="editItem">
              <v-icon>{{ ICONS.edit }}</v-icon>
            </v-btn>
            <v-toolbar-title class="fs9 pl-0" v-html="selectedEvent.name"></v-toolbar-title>
            <v-spacer></v-spacer>

            <v-tooltip bottom color="error">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  icon
                  color="white"
                  @click="removeItem(selectedEvent)"
                >
                  <v-icon>{{ ICONS.delete_forever }}</v-icon>
                </v-btn>
              </template>
              <span>Eliminar</span>
            </v-tooltip>

          </v-toolbar>
          <v-card-text>
            <span class="secondary--text" v-html="selectedEvent.details"></span>
          </v-card-text>
          <v-card-actions>
            <v-btn
              text
              color="secondary"
              @click="selectedOpen = false"
            >
              Cerrar detalle
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
    </v-card>
    <!-- ESTE DIALOGO SERA PARA LOS CALENDARIOS -->
    <v-dialog v-model="dialog" persistent width="500">
      <v-card elevation="0">
        <v-card-title class="ma-0 pa-1">
          <v-container fluid>
            <v-row no-gutters>
              <v-col
                align="start"
                justify="center"
                :cols="11"
                class="d-flex flex-row align-center text-sm color1--tex primary--text"
              >
                <v-icon-component class="m-2" icon="date_range"></v-icon-component>
                <span class="fs10 pl-2">Habilitar día y hora del examen</span>
              </v-col>
              <v-col :cols="1">
                <v-tooltip bottom color="primary">
                  <template v-slot:activator="{ on }">
                    <v-btn icon color="primary" v-on="on" @click.stop="dialog=!dialog; reset()">
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
        <v-card-text class="pl-0 pr-0 dias-habilitacion">
          <v-alert
            type="info"
            text
            dense
            class="fs8 mb-0"
          >
            <div>
              <span>Pasos para habilitar el día y la hora del examen para el área de <strong>{{ area && area.nombre ? area.nombre : ''}}</strong></span>
            </div>
          </v-alert>
          <v-card elevation="0" class="pl-4 pr-4 pt-0 mt-0 fs8">
            <ol class="pl-3">
              <li class="success--text">
                Ya selecciono el <strong>{{ $datetime.format('DD/MM/YYYY', dateRange[0]) }}</strong> como apertura del examen
                <v-icon-component icon="check_circle" class="success--text"/>
              </li>
              <li v-if="!correctInitHour" class="error--text">
                <v-row no-gutters>
                  <v-col cols="12">
                    <span>Ahora tiene que seleccionar la hora de apertura del examen</span>
                  </v-col>
                  <v-col cols="12" md="8" lg="8" sm="8" xs="12">
                    <v-row no-gutters>
                      <v-col cols="12">
                        <span class="info--text">La hora tiene que ser por ejemplo 09:45:00</span>
                      </v-col>
                      <v-col cols="2">
                        <v-text-field
                          color="primary"
                          v-model="mStartHour"
                          label="Hora"
                          autofocus
                          maxlength="2"
                          @keyup="(e) => mask(e, 'mStartHour')"
                          @blur="numberValidate('mStartHour')"
                          :rules="[(val) => !!val || '']"
                          placeholder=""
                          class="mr-3 mt-4 mask--hour"
                          dense
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="1" class="pt-4 white--text">:</v-col>
                      <v-col cols="2">
                        <v-text-field
                          color="primary"
                          v-model="mStartHourMinute"
                          label="Minuto"
                          maxlength="2"
                          ref="startMinutes"
                          @keyup="(e) => mask(e, 'mStartHourMinute')"
                          @blur="numberValidate('mStartHourMinute')"
                          :rules="[(val) => !!val || '']"
                          placeholder=""
                          class="mr-3 mt-4 mask--hour"
                          dense
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="1" class="pt-4 white--text">:</v-col>
                      <v-col cols="2">
                        <v-text-field
                          color="primary"
                          v-model="mStartHourSecond"
                          label="Segundo"
                          maxlength="2"
                          ref="startSeconds"
                          @keypress.enter="saveStartHour"
                          @keyup="(e) => mask(e, 'mStartHourSecond')"
                          @blur="numberValidate('mStartHourSecond')"
                          :rules="[(val) => !!val || '']"
                          placeholder=""
                          class="mr-3 mt-4 mask--hour"
                          dense
                        >
                        </v-text-field>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="12" md="4" lg="4" sm="4" xs="12">
                    <v-btn color="primary" class="fs8 mt-5" outlined @click="saveStartHour">Guardar hora</v-btn>
                  </v-col>
                </v-row>
              </li>
              <li v-else class="success--text">
                Ya indico que la hora de apertura es a las <strong>{{ mStartHour }}:{{ mStartHourMinute }}:{{ mStartHourSecond }}</strong>
                <v-icon-component icon="check_circle" class="success--text"/>
              </li>
              <li class="error--text" v-if="!correctEndDate && correctInitHour">
                <v-card elevation="0" class="d-flex flex-column">
                  <span class="error--text">Ahora tiene que seleccionar el dia de cierre del examen</span>
                  <strong class="error--text">NOTA: Si el dia de apertura y cierre es el mismo, vuelva a seleccionar el mismo dia.</strong>
                  <v-card elevation="0" class="d-flex flex-row align-center justify-center">
                    <v-icon-component icon="arrow_downward" :size="35" class="primary--text"/>
                  </v-card>
                </v-card>
              </li>
              <template v-if="correctEndDate">
                <li class="success--text">
                  Ya selecciono el <strong>{{ $datetime.format('DD/MM/YYYY', dateRange[1]) }}</strong> como cierre del examen
                  <v-icon-component icon="check_circle" class="success--text"/>
                </li>
                <li class="d-flex flex-column" v-if="!correctTest">
                  <v-row no-gutters>
                    <v-col cols="12">
                      <span class="error--text">Ahora tiene que seleccionar la hora de cierre del examen</span>
                    </v-col>
                    <v-col cols="12" md="8" lg="8" sm="8" xs="12">
                      <v-row no-gutters>
                        <v-col cols="12">
                          <span class="info--text">La hora tiene que ser por ejemplo 15:45:00</span>
                        </v-col>
                        <v-col cols="2">
                          <v-text-field
                            color="primary"
                            v-model="mEndHour"
                            label="Hora"
                            autofocus
                            maxlength="2"
                            @keyup="(e) => mask(e, 'mEndHour')"
                            @blur="numberValidate('mEndHour')"
                            :rules="[(val) => !!val || '']"
                            placeholder=""
                            class="mr-3 mt-4 mask--hour"
                            dense
                          >
                          </v-text-field>
                        </v-col>
                        <v-col cols="1" class="pt-4 white--text">:</v-col>
                        <v-col cols="2">
                          <v-text-field
                            color="primary"
                            v-model="mEndHourMinute"
                            label="Minuto"
                            maxlength="2"
                            ref="endMinutes"
                            @keyup="(e) => mask(e, 'mEndHourMinute')"
                            @blur="numberValidate('mEndHourMinute')"
                            :rules="[(val) => !!val || '']"
                            placeholder=""
                            class="mr-3 mt-4 mask--hour"
                            dense
                          >
                          </v-text-field>
                        </v-col>
                        <v-col cols="1" class="pt-4 white--text">:</v-col>
                        <v-col cols="2">
                          <v-text-field
                            color="primary"
                            v-model="mEndHourSecond"
                            label="Segundo"
                            maxlength="2"
                            @keypress.enter="saveEndHour"
                            ref="endSeconds"
                            @keyup="(e) => mask(e, 'mEndHourSecond')"
                            @blur="numberValidate('mEndHourSecond')"
                            :rules="[(val) => !!val || '']"
                            placeholder=""
                            class="mr-3 mt-4 mask--hour"
                            dense
                          >
                          </v-text-field>
                        </v-col>
                    </v-row>
                    </v-col>
                    <v-col cols="12" md="4" lg="4" sm="4" xs="12">
                      <v-btn color="primary" class="fs8 mt-5" outlined @click="saveEndHour">Guardar hora</v-btn>
                    </v-col>
                  </v-row>
                </li>
              </template>
              <template v-if="correctTest">
                <li class="success--text">
                  Ya indico que la hora de finalizacion es a las <strong>{{ mEndHour }}:{{ mEndHourMinute }}:{{ mEndHourSecond }}</strong>
                  <v-icon-component icon="check_circle" class="success--text"/>
                </li>
                <li class="error--text d-flex flex-column">
                  <v-row no-gutters>
                    <v-col cols="12">
                      <span>Ahora tiene que seleccionar el tipo del examen</span>
                    </v-col>
                    <v-col cols="6">
                      <v-select
                        class="mr-3 mt-2"
                        label="Tipo de examen"
                        ref="mTipoExamen"
                        :items="['ONLINE', 'OFFLINE']"
                        v-model="mTipoExamen"
                        :rules="[(val) => !!val || 'Tiene que indicar el tipo de examen']"
                      ></v-select>
                    </v-col>
                    <v-col cols="6">
                      <v-select
                        class="mr-3 mt-2"
                        label="Fase de la olimpiada"
                        :items="aTiposPlanificacion"
                        v-model="mFaseOlimpiada"
                        :rules="[(val) => !!val || 'Tiene que indicar el tipo de olimpiada']"
                      ></v-select>
                    </v-col>
                    <v-col cols="12">
                      <v-btn color="primary" block class="fs8 mt-4" outlined @click="save">GUARDAR CALENDARIO</v-btn>
                    </v-col>
                  </v-row>
                </li>
              </template>
            </ol>
          </v-card>
          <v-date-picker
            full-width
            color="primary"
            :disabled="disabledDatePicker"
            v-model="dateRange"
            @click:date="selectDay"
            locale="es-ES"
            range
            :min="minDate || undefined"
            :max="maxDate || undefined"
          ></v-date-picker>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- DIALOG PARA EDITAR -->
    <v-dialog v-model="editModal" width="450" persistent>
      <v-card elevation="0">
        <v-form lazy-validation ref="form" @submit.prevent="save('EDIT')">
          <v-card-title class="ma-0 pa-1">
            <v-container fluid>
              <v-row no-gutters>
                <v-col
                  align="start"
                  justify="center"
                  :cols="11"
                  class="d-flex flex-row align-center text-sm color1--tex primary--text"
                >
                  <v-icon-component class="m-2" icon="date_range"></v-icon-component>
                  <span class="fs10 pl-2">Editar asignación</span>
                </v-col>
                <v-col :cols="1">
                  <v-tooltip bottom color="primary">
                    <template v-slot:activator="{ on }">
                      <v-btn icon color="primary" v-on="on" @click.stop="editModal=!editModal; reset()">
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
        <v-card-text>
          <v-card elevation="0" class="mt-3">
              <v-row>
                <v-col cols="6">
                  <v-select
                    label="Tipo de examen"
                    :items="['ONLINE', 'OFFLINE']"
                    v-model="mTipoExamen"
                    :rules="[(val) => !!val || 'Tiene que indicar el tipo de examen']"
                  ></v-select>
                </v-col>
                <v-col cols="6">
                  <v-select
                    label="Fase de la olimpiada"
                    :items="aTiposPlanificacion"
                    v-model="mFaseOlimpiada"
                    :rules="[(val) => !!val || 'Tiene que indicar el fase de la olimpiada']"
                  ></v-select>
                </v-col>
                <v-col cols="12" xs="12" sm="6">
                  <v-menu
                    v-model="startMenuDatepicker"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="startDateFormatted"
                        label="Fecha de inicio"
                        dense
                        outlined
                        hint="El formato de la fecha es DD/MM/YYYY"
                        :prepend-icon="ICONS.date_range"
                        v-bind="attrs"
                        @blur="startDate = parseDate(startDateFormatted)"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="startDate"
                      no-title
                      :min="minDate || undefined"
                      :max="maxDate || undefined"
                      @input="startMenuDatepicker = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12" xs="12" sm="6">
                  <v-row no-gutters style="margin-top: -20px">
                    <v-col cols="12" class="pb-2 fs8">
                      Hora de inicio:
                    </v-col>
                    <v-col cols="2">
                      <v-text-field
                        label="Hora"
                        maxlength="2"
                        v-model="mStartHour"
                        class="mask--hour"
                        @keyup="(e) => mask(e, 'mStartHour')"
                        @blur="numberValidate('mStartHour')"
                        :rules="[(val) => !!val || '']"
                        dense
                      ></v-text-field>
                    </v-col>
                    <v-col cols="1" class="mt-2 ml-2">:</v-col>
                    <v-col cols="2">
                      <v-text-field
                        label="Minuto"
                        class="mask--hour"
                        maxlength="2"
                        v-model="mStartHourMinute"
                        @keyup="(e) => mask(e, 'mStartHourMinute')"
                        @blur="numberValidate('mStartHourMinute')"
                        :rules="[(val) => !!val || '']"
                        dense
                      ></v-text-field>
                    </v-col>
                    <v-col cols="1" class="mt-2 ml-2">:</v-col>
                    <v-col cols="2">
                      <v-text-field
                        label="Segundo"
                        maxlength="2"
                        class="mask--hour"
                        v-model="mStartHourSecond"
                        @keyup="(e) => mask(e, 'mStartHourSecond')"
                        @blur="numberValidate('mStartHourSecond')"
                        :rules="[(val) => !!val || '']"
                        dense
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12" xs="12" sm="6">
                  <v-menu
                    v-model="endMenuDatepicker"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="endDateFormatted"
                        label="Fecha de culminacion"
                        dense
                        outlined
                        hint="El formato de la fecha es DD/MM/YYYY"
                        :prepend-icon="ICONS.date_range"
                        v-bind="attrs"
                        @blur="endDate = parseDate(endDateFormatted)"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="endDate"
                      no-title
                      :min="minDate || undefined"
                      :max="maxDate || undefined"
                      @input="endMenuDatepicker = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12" xs="12" sm="6">
                  <v-row no-gutters style="margin-top: -20px">
                    <v-col cols="12" class="pb-2 fs8">
                      Hora de culminación:
                    </v-col>
                    <v-col cols="2">
                      <v-text-field
                        label="Hora"
                        maxlength="2"
                        class="mask--hour"
                        v-model="mEndHour"
                        @keyup="(e) => mask(e, 'mEndHour')"
                        @blur="numberValidate('mEndHour')"
                        :rules="[(val) => !!val || '']"
                        dense
                      ></v-text-field>
                    </v-col>
                    <v-col cols="1" class="mt-2 ml-2">:</v-col>
                    <v-col cols="2">
                      <v-text-field
                        label="Minuto"
                        class="mask--hour"
                        maxlength="2"
                        v-model="mEndHourMinute"
                        @keyup="(e) => mask(e, 'mEndHourMinute')"
                        @blur="numberValidate('mEndHourMinute')"
                        :rules="[(val) => !!val || '']"
                        dense
                      ></v-text-field>
                    </v-col>
                    <v-col cols="1" class="mt-2 ml-2">:</v-col>
                    <v-col cols="2">
                      <v-text-field
                        label="Segundo"
                        maxlength="2"
                        class="mask--hour"
                        v-model="mEndHourSecond"
                        @keyup="(e) => mask(e, 'mEndHourSecond')"
                        @blur="numberValidate('mEndHourSecond')"
                        :rules="[(val) => !!val || '']"
                        dense
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
          </v-card>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" type="submit">Actualizar registro</v-btn>
        </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </v-card>
</template>
<script>
import vIconComponent from '@/plugins/icon/index.vue';

export default {
  props: {
    olimpiada: {
      type: String,
      default: null
    },
    etapa: {
      type: Object,
      default: () => {}
    }
  },
  data: () => ({
    aOlimpiadas: [],
    mFaseOlimpiada: null,
    aEtapas: [],
    aAreas: [],
    aTiposPlanificacion: [],
    area: null,
    mEtapa: null,
    dialog: false,
    minDate: null,
    maxDate: null,
    correctEndDate: false,
    correctTest: false,
    selectedElement: null,
    selectedOpen: null,
    selectedEvent: {},
    hours: false,
    startMenuDatepicker: null,
    endMenuDatepicker: null,
    mTipoExamen: null,
    dateRange: [],
    backupInitDate: null,
    mStartHour: null,
    mStartHourMinute: null,
    mStartHourSecond: null,
    mEndHour: null,
    mEndHourMinute: null,
    mEndHourSecond: null,
    editModal: null,
    startDateFormatted: null,
    startDate: null,
    endDate: null,
    endDateFormatted: null,
    disabledDatePicker: true,
    weekday: [0, 1, 2, 3, 4, 5, 6],
    calendar: '',
    events: [],
    idHoraAsignada: null,
    correctInitHour: null,
    readyCalendar: null,
    mesSeleccionado: null,
    firstDate: null,
    sFirstDate: null,
    lastDate: null,
    sLastDate: null
  }),
  components: {
    vIconComponent
  },
  watch: {
    calendar () {
      this.setDisabledDates();
    },
    startDate (val) {
      this.startDateFormatted = this.formatDate(val);
    },
    endDate (val) {
      this.endDateFormatted = this.formatDate(val);
    },
  },
  methods: {
    goToInit () {
      this.calendar = this.etapa.fechaInicio;
    },
    mask ({ key, keyCode }, field) {
      const keys = [8, 37, 38, 39, 40];
      if (isNaN(key) && !keys.includes(keyCode)) {
        this[field] = this[field] ? this[field].substr(0, this[field].length - 1) : null;
      } else {
        if (['mStartHour'].includes(field) && this[field].toString().length === 2 && !keys.includes(keyCode)) this.$refs.startMinutes.focus();
        if (['mStartHourMinute'].includes(field) && this[field].toString().length === 2 && !keys.includes(keyCode)) this.$refs.startSeconds.focus();
        if (['mEndHour'].includes(field) && this[field].toString().length === 2 && !keys.includes(keyCode)) this.$refs.endMinutes.focus();
        if (['mEndHourMinute'].includes(field) && this[field].toString().length === 2 && !keys.includes(keyCode)) this.$refs.endSeconds.focus();
      }
    },
    numberValidate (field) {
      if (['mStartHour', 'mEndHour'].includes(field) && !((parseInt(this[field]) >= 0) && parseInt(this[field]) < 24 && (this[field]).toString().length === 2)) this[field] = null;
      if (['mStartHourMinute', 'mEndHourMinute'].includes(field) && !((parseInt(this[field]) >= 0) && parseInt(this[field]) < 60 && (this[field]).toString().length === 2)) this[field] = null;
      if (['mStartHourSecond', 'mEndHourSecond'].includes(field) && !((parseInt(this[field]) >= 0) && parseInt(this[field]) < 60 && (this[field]).toString().length === 2)) this[field] = null;
    },
    editItem () {
      const startDate = new Date(this.selectedEvent.fechaHoraInicio);
      const endDate = new Date(this.selectedEvent.fechaHoraFin);
      this.idHoraAsignada = this.selectedEvent.id;
      this.mTipoExamen = this.selectedEvent.tipoPrueba;
      this.mFaseOlimpiada = this.selectedEvent.tipoPlanificacion;
      this.startDateFormatted = this.$datetime.format('DD/MM/YYYY', startDate);
      this.endDateFormatted = this.$datetime.format('DD/MM/YYYY', endDate);
      this.mStartHour = this.$datetime.getHour(startDate);
      this.mStartHourMinute = this.$datetime.getMinutes(startDate);
      this.mStartHourSecond = this.$datetime.getSeconds(startDate);
      this.mEndHour = this.$datetime.getHour(endDate);
      this.mEndHourMinute = this.$datetime.getMinutes(endDate);
      this.mEndHourSecond = this.$datetime.getSeconds(endDate);
      this.editModal = !this.editModal;
    },
    formatDate (date) {
      if (!date) return null;
      const [year, month, day] = date.split('-');
      return `${day}/${month}/${year}`;
    },
    parseDate (date) {
      if (!date) return null;
      const [day, month, year] = date.split('/');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    },
    saveEndHour () {
      if (this.mEndHour && this.mEndHourMinute && this.mEndHourSecond) {
        this.correctEndDate = true;
        this.correctTest = true;
      } else {
        this.$message.error('La hora ingresada no esta en el formato correcto');
      }
    },
    saveStartHour () {
      if (this.mStartHour && this.mStartHourMinute && this.mStartHourSecond) {
        this.correctInitHour = true;
        this.disabledDatePicker = false;
        const [initDate] = this.dateRange;
        this.minDate = initDate;
        this.backupInitDate = initDate;
      } else {
        this.$message.error('La hora ingresada no esta en el formato correcto');
      }
    },
    isValidDate (date) {
      const statDate = new Date(this.mEtapa.fechaInicioMilis);
      const endDate = new Date(this.mEtapa.fechaFinMilis);
      return this.$datetime.between(date, statDate, endDate);
    },
    removeItem (item) {
      this.$confirm('Esta seguro de eliminar la asignacion de hora ?', async () => {
        try {
          await this.$service.delete(`calendarios/${item.id}`);
          this.$message.success('El horario fue exitosamente eliminado');
          this.getAreas();
          this.selectedOpen = false;
        } catch (error) {
          this.$message.error(error.message || error.mensaje);
        }
      });
    },
    reset () {
      this.dateRange = [];
      this.mStartHour = null;
      this.mStartHourMinute = null;
      this.mStartHourSecond = null;
      this.mEndHour = null;
      this.mEndHourMinute = null;
      this.mEndHourSecond = null;
      this.correctTest = null;
      this.correctInitHour = null;
      this.correctEndDate = null;
      this.mTipoExamen = null;
      this.mFaseOlimpiada = null;
      this.idHoraAsignada = null;
    },
    save (option = 'EDIT') {
      try {
        if (option === 'EDIT') {
          if (this.$refs.form.validate()) {
            if (!(this.mStartHour && this.mStartHourMinute && this.mStartHourSecond)) {
              this.$message.error('La hora ingresada no esta en el formato correcto');
              return;
            }
            if (!(this.mEndHour && this.mEndHourMinute && this.mEndHourSecond)) {
              this.$message.error('La hora ingresada no esta en el formato correcto');
              return;
            }
            this.$confirm('Esta seguro de actualizar el registro?', async () => {
              const obj = {
                tipoPrueba: this.mTipoExamen,
                tipoPlanificacion: this.mFaseOlimpiada,
                fechaHoraInicio: `${this.$datetime.formatStringToString(this.startDateFormatted)} ${this.mStartHour}:${this.mStartHourMinute}:${this.mStartHourSecond}`,
                fechaHoraFin: `${this.$datetime.formatStringToString(this.endDateFormatted)} ${this.mEndHour}:${this.mEndHourMinute}:${this.mEndHourSecond}`
              };
              const response = await this.$service.put(`calendarios/${this.idHoraAsignada}`, obj);
              if (response && response.isOK) {
                this.readyCalendar = false;
                setTimeout(async () => {
                  this.$message.success(response.mensaje || 'Registro actualizado satisfactoriamente');
                  this.readyCalendar = !this.readyCalendar;
                  await this.getStages();
                  this.getAreas();
                  this.reset();
                  this.editModal = !this.editModal;
                  this.selectedOpen = !this.selectedOpen;
                }, 10);
              }
            });
          } else {
            this.$message.error('Faltan campos que llenar');
          }
        } else {
          this.$confirm('¿Está seguro de crear el registro?', async () => {
            const obj = {
              tipoPrueba: this.mTipoExamen,
              tipoPlanificacion: this.mFaseOlimpiada,
              fechaHoraInicio: `${this.dateRange[0]} ${this.mStartHour}:${this.mStartHourMinute}:${this.mStartHourSecond}`,
              fechaHoraFin: `${this.dateRange[1]} ${this.mEndHour}:${this.mEndHourMinute}:${this.mEndHourSecond}`
            };
            if (!this.mTipoExamen) {
              this.$message.error('Le falta seleccionar el tipo de examen');
              return;
            }
            if (!this.mFaseOlimpiada) {
              this.$message.error('Le falta seleccionar la fase de la olimpiada');
              return;
            }
            const response = await this.$service.post(`etapasAreaGrado/${this.area && this.area.id ? this.area.id : this.area}/calendarios`, obj);
            if (response && response.isOK) {
              this.readyCalendar = false;
              this.$message.success('Hora del examen exitosamente creado');
              setTimeout(async () => {
                this.readyCalendar = !this.readyCalendar;
                await this.getStages();
                this.getAreas();
                this.reset();
                this.dialog = !this.dialog;
              }, 10);
            } else {
              this.correctInitHour = false;
              this.correctEndDate = false;
              this.correctTest = false;
              this.readyCalendar = true;
            }
          });
        }
      } catch (error) {
        this.correctInitHour = false;
        this.correctEndDate = false;
        this.correctTest = false;
        this.readyCalendar = true;
        this.$message.error(error.message || error.mensaje);
      }
    },
    showEvent ({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        requestAnimationFrame(() => requestAnimationFrame(() => this.selectedOpen = true));
      };

      if (this.selectedOpen) {
        this.selectedOpen = false;
        requestAnimationFrame(() => requestAnimationFrame(() => open()));
      } else {
        open();
      }
      nativeEvent.stopPropagation();
    },
    closeModalDate () {
      this.dialog = !this.dialog;
      this.calendar = '';
    },
    selectDay () {
      if (this.dateRange.length === 1) {
        const [date] = this.dateRange;
        this.dateRange[0] = this.backupInitDate;
        this.dateRange[1] = date;
      }
      this.$confirm(`Esta seguro de seleccionar el dia <strong>${this.$datetime.getDay(this.dateRange[1])} de ${this.$datetime.getLiteralMonth(this.dateRange[1])}</strong> como dia de cierre?`, () => {
        this.disabledDatePicker = true;
        this.correctEndDate = !this.correctEndDate;
      });
    },
    selectDate ({ date }) {
      this.getDataCalendar();
      if (!this.isValidDate(date)) {
        this.$message.error('No puede asignar un horario porque no esta en el rango de fechas de la etapa');
        return;
      }
      this.setDisabledDates();
      if (!this.area) {
        this.$message.error('Por favor seleccione el area');
        this.$refs.area ? this.$refs.area.focus() : null;
        return;
      }
      this.$confirm(`Esta seguro de seleccionar el dia <strong>${this.$datetime.getDay(date)} de ${this.$datetime.getLiteralMonth(date)}</strong> como apertura del examen?`, () => {
        this.dialog = !this.dialog;
        this.dateRange.push(date);
      });
    },
    setDisabledDates () {
      setTimeout(() => {
        const CLASSNAME_ALLDAYS = 'alldays';
        const CLASSNAME_DISABLED = 'disabled--calendar_day';
        const CLASSNAME_ENABLED = 'enabled--calendar_day';
        const SET_CLASSNAME_DISABLED = 'disabled--dc';
        const SET_CLASSNAME_ENABLED = 'enabled--dc';
        const disabledDays = document.getElementsByClassName(CLASSNAME_DISABLED);
        const enabledDays = document.getElementsByClassName(CLASSNAME_ENABLED);
        const allDays = document.getElementsByClassName(CLASSNAME_ALLDAYS);
        this.firstDate = allDays[0].children[0].getAttribute('id');
        this.lastDate = allDays[allDays.length - 1].children[0].getAttribute('id');
        allDays.forEach(item => item.parentElement.classList.remove(SET_CLASSNAME_DISABLED, SET_CLASSNAME_ENABLED));
        disabledDays.forEach(item => item.parentElement.classList.add(SET_CLASSNAME_DISABLED));
        enabledDays.forEach(item => item.parentElement.classList.add(SET_CLASSNAME_ENABLED));
      }, 100);
    },
    getStages () {
      return new Promise(async (resolve, reject) => {
        try {
          const aEtapas = await this.$service.get(`olimpiadas/${this.olimpiada}/etapas`);
          this.aEtapas = aEtapas.datos.filas;
          this.mEtapa = this.aEtapas.find(etapa => etapa.id === this.etapa.id);
          resolve(true);
        } catch (error) {
          reject(error.message);
        }
      });
    },
    getDataCalendar () {
      const { calendar } = this.$refs;
      this.mesSeleccionado = calendar.title;
      setTimeout(() => {
        this.sFirstDate = this.$datetime.getDayAndMonth(this.firstDate);
        this.sLastDate = this.$datetime.getDayAndMonth(this.lastDate);
      }, 110);
    },
    async getAreas () {
      this.readyCalendar = true;
      const minDate = new Date(this.mEtapa.fechaInicioMilis);
      const maxDate = new Date(this.mEtapa.fechaFinMilis);
      this.minDate = this.$datetime.format('YYYY-MM-DD', minDate);
      this.maxDate = this.$datetime.format('YYYY-MM-DD', maxDate);
      const aAreas = await this.$service.get(`etapas/${this.mEtapa.id}/etapaAreaGrados`);
      if (aAreas) {
        this.aAreas = aAreas.datos.filas.map(itemArea => {
          const obj = { ...itemArea };
          obj.nombre = `${itemArea.area.nombre} - ${itemArea.gradoEscolar.nombre}`;
          return obj;
        });
      }
      const events = await this.$service.get(`etapas/${this.mEtapa.id}/calendarios`);
      this.events = events.datos.filas.map(evt => {
        const objEvent = { ...evt };
        const findArea = this.aAreas.find(item => item.id === evt.etapaAreaGrado.id);
        objEvent.name = findArea ? `${findArea.area.nombre} - ${findArea.gradoEscolar.nombre}` : '';
        objEvent.start = new Date(evt.fechaHoraInicio);
        objEvent.end = new Date(evt.fechaHoraFin);
        objEvent.color = evt.etapaAreaGrado.color;
        objEvent.timed = true;
        objEvent.id = evt.id;
        objEvent.details = 'Se podrian agregar mas detalles...';
        return objEvent;
      });
      this.setDisabledDates();
      this.getDataCalendar();
    },
    getEventColor (event) {
      return event.color;
    },
    rnd (a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a;
    }
  },
  mounted () {
    this.$nextTick(async () => {
      await this.getStages();
      this.getAreas();
      const aTiposPlanificacion = await this.$service.get('calendarios/tiposPlanificacion');
      this.aTiposPlanificacion = aTiposPlanificacion.datos;
      this.calendar = this.etapa.fechaInicio;
    });
  }
};
</script>
<style lang="scss">
@import '../../scss/variables.scss';

.calendar-information {
  .v-toolbar__content {
    padding: 0 !important;
  }
}

.dias-habilitacion {
  .v-picker__title {
    display: none;
  }
}
.disabled--dc {
  background-color: $error !important;
  transition: all 0.5s;
  button,
  .v-calendar-weekly__day-label {
    cursor: not-allowed !important;
  }
}
.enabled--dc {
  background-color: $success !important;
  transition: all 0.5s;
}
.mask--hour {
  input {
    text-align: center;
  }
}
</style>
