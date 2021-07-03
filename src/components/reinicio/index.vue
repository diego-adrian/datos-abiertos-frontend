<template>
  <v-row class="pa-4">
    <v-col cols="12">
      <v-row no-gutters>
        <v-col cols="12" class="fwb fs9 mb-2">Datos del estudiante:</v-col>
        <v-col cols="3" class="primary--text">Cedula de identidad:</v-col>
        <v-col cols="9">{{ student && student.nroDocumento ? student.nroDocumento : '' }}</v-col>
        <v-col cols="3" class="primary--text">Nombres y apellidos:</v-col>
        <v-col cols="9">
          {{ student && student.nombres ? student.nombres : '' }}
          {{ student && student.primerApellido ? student.primerApellido : ''}}
          {{ student && student.segundoApellido ? student.segundoApellido : ''}}
        </v-col>
        <v-col cols="3" class="primary--text">Unidad Educativa:</v-col>
        <v-col cols="9">{{ student && student.unidadEducativa ? student.unidadEducativa : '' }}</v-col>
        <v-col cols="3" class="primary--text">Departamento:</v-col>
        <v-col cols="9">{{ student && student.departamento ? student.departamento : '' }}</v-col>
        <v-col cols="3" class="primary--text">Distrito Educativo:</v-col>
        <v-col cols="9">{{ student && student.distritoEducativo ? student.distritoEducativo : '' }}</v-col>
      </v-row>
    </v-col>
    <v-col cols="12">
      <crud-table
        v-if="urlReinicio"
        :headers="headers"
        :url="urlReinicio"
        :widthModal="500"
        :filters="[]"
        :filtro-as-query="true"
        :custom="true">
        <template slot="items" slot-scope="items">
          <tr>
            <td>{{ items.items.olimpiada }}</td>
            <td>{{ items.items.etapa }}</td>
            <td>{{ items.items.area }}</td>
            <td>{{ items.items.gradoEscolar }}</td>
            <td>{{ items.items.estado }}</td>
            <td>{{ items.items.fechaInicio ? $datetime.format('DD/MM/YYYY', items.items.fechaInicio) : ' - '}}</td>
            <td>{{ items.items.fechaFin ? $datetime.format('DD/MM/YYYY', items.items.fechaFin) : ' - '}}</td>
            <td>{{ items.items.totalRespuestas }}</td>
            <td>{{ items.items.totalPreguntas }}</td>
            <td>{{ items.items.nroReinicios }}</td>
            <td>
              <v-tooltip bottom color="primary">
                <template v-slot:activator="{ on }">
                  <v-btn
                    icon
                    v-on="on"
                    color="primary"
                    @click="handleClickReboot(items)"
                  >
                    <v-icon-component icon="restart_alt"></v-icon-component>
                  </v-btn>
                </template>
                <span>Reiniciar el examen</span>
              </v-tooltip>
            </td>
          </tr>
        </template>
      </crud-table>
    </v-col>
  </v-row>
</template>
<script>
import CrudTable from '@/plugins/crud-table/CrudTable.vue';
import vIconComponent from '@/plugins/icon/index.vue';

export default {
  components: {
    CrudTable,
    vIconComponent
  },
  props: {
    student: {
      type: Object,
      default: () => {}
    },
    urlReinicio: {
      type: String,
      default: null
    }
  },
  data: () => ({
    headers: [
      {
        text: 'Competencia',
        align: 'center',
        value: 'olimpiada'
      },
      {
        text: 'Etapa',
        align: 'center',
        value: 'etapa'
      },
      {
        text: 'Area',
        align: 'center',
        value: 'area'
      },
      {
        text: 'Año de escolaridad',
        align: 'center',
        value: 'gradoEscolar'
      },
      {
        text: 'Estado del examen',
        align: 'center',
        value: 'estado'
      },
      {
        text: 'Fecha y hora de inicio',
        align: 'center',
        value: 'fechaInicio'
      },
      {
        text: 'Fecha y hora de finalizacion',
        align: 'center',
        value: 'fechaFin'
      },
      {
        text: 'Cantidad de preguntas respondidas',
        align: 'center',
        value: 'totalRespuestas'
      },
      {
        text: 'Total de preguntas examen',
        align: 'center',
        value: 'totalPreguntas'
      },
      {
        text: 'Cantidad de veces que reinicio',
        align: 'center',
        value: 'nroReinicios'
      },
      {
        text: 'Acciones',
        divider: false,
        sortable: false,
        align: 'center',
        value: 'ACTIONS'
      }
    ],
  }),
  methods: {
    async handleClickReboot ({ items: { idEtapaAreaGrado, idExamen, area } }) {
      let table = `
        <br/>
        Calendario activos: <br/><br/>
        <table style='width: 100%'>
          <tr>
            <td>Fecha Inicio</td>
            <td>Fecha Fin</td>
          </tr>
          <tr>
      `;
      const { id } = this.$storage.get('areaSeleccionada');
      const calendariosOnline = await this.$service.get(`etapasAreaGrado/${id}/calendariosOnline`);
      calendariosOnline.datos.filter(row => {
        table += `<td>
          ${this.$datetime.format('DD/MM/YYYY', new Date(row.fechaHoraInicio))}
          ${this.$datetime.getHour(new Date(row.fechaHoraInicio))}:${this.$datetime.getMinutes(new Date(row.fechaHoraInicio))}:${this.$datetime.getSeconds(new Date(row.fechaHoraInicio))}
        </td>`;
        table += `<td>
          ${this.$datetime.format('DD/MM/YYYY', new Date(row.fechaHoraFin))}
          ${this.$datetime.getHour(new Date(row.fechaHoraFin))}:${this.$datetime.getMinutes(new Date(row.fechaHoraFin))}:${this.$datetime.getSeconds(new Date(row.fechaHoraFin))}
        </td>`;
      });
      table += '</tr></table>';
      this.$confirm(`¿Está seguro de reiniciar el examen de <strong>${area}</strong> de <strong>${this.student.nombres} ${this.student.primerApellido || ''} ${this.student.segundoApellido || ''}</strong>?<br/>${table}`,
        async () => {
          const response = await this.$service.post(`examenes/${idExamen}/reiniciar`, {
            idEtapaAreaGrado,
            observacion: 'Reinicio de examen'
          });
          if (response && response.isOK) {
            this.$message.success('Examen reiniciado exitosamente');
            this.updateList();
          } else {
            this.$message.error(response.mensaje);
          }
        }, () => {}, 'Reiniciar', 'cancelar');
    }
  }
};
</script>
<style lang="scss">
  @import '../../scss/variables.scss';
  .form-reinicio {
    width: 350px;
  }
  .border--separator {
    width: 93%;
    margin: auto;
    border-bottom: 1px solid $fontColor;
    margin-bottom: 20px;
    opacity: .2;
  }
  .letterO {
    width: 20px;
    background: $backgroundColor;
    user-select: none;
    margin-bottom: -11px;
  }
</style>
