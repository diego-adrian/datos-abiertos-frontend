<template>
  <v-card elevation="0">
    <!-- SLOT PARA EL FORMULARIO -->
    <app-dialog
        :dialog.sync="modalEtapaAreaGrado"
        :titulo="
        form.id
          ? 'Editar Etapas - área y grado'
          : 'Adicionar etapas-áreas-grados'
      "
        @open-dialog="modalEtapaAreaGrado = true"
        @close-dialog="closeModal"
        :texto-ejecutar="form.id ? 'Actualizar' : 'Enviar'"
        :mostrar-acciones="false"
        max-width="800px"
        @accion="save"
    >
      <template v-if="modalEtapaAreaGrado">
        <!-- FORMULARIO PARA AGREGAR O EDITAR -->
        <v-card elevation="0">
          <v-container fluid v-if="modalEtapaAreaGrado">
            <v-stepper v-model="pasoActual" class="elevation-0">
              <v-stepper-header class="elevation-0">
                <v-stepper-step :complete="pasoActual > 1" step="1">
                  Información
                </v-stepper-step>

                <v-divider></v-divider>

                <v-stepper-step :complete="pasoActual > 2" step="2">
                  Preguntas
                </v-stepper-step>

                <v-divider></v-divider>

                <v-stepper-step :complete="pasoActual > 3" step="3">
                  Medallero
                </v-stepper-step>

                <v-divider></v-divider>

                <v-stepper-step :complete="pasoActual > 4" step="4">
                  Clasificación
                </v-stepper-step>
              </v-stepper-header>
              <v-stepper-items>
                <v-stepper-content step="1">
                  <v-form
                      :key="`etapa-area-grado-form1-${form.id}`"
                      ref="form1"
                      v-model="valid"
                      lazy-validation
                      @submit.prevent="paso12"
                  >
                    <v-row>
                      <v-col cols="12">
                        <v-card elevation="0" class="primary--text mb-3"
                        >Información
                        </v-card>
                        <v-card class="pa-4" outlined rounded>
                          <v-row>
                            <v-col cols="12" md="6" xs="12" sm="12" lg="6">
                              <v-select
                                  color="primary"
                                  required
                                  readonly
                                  disabled
                                  item-color="primary"
                                  v-model="form.idOlimpiada"
                                  label="Olimpiadas"
                                  dense
                                  :items="olimpiadas"
                                  item-text="nombre"
                                  item-value="id"
                                  outlined
                                  :rules="$validate(['required'])"
                              >
                                <template v-slot:prepend>
                                  <v-icon-component
                                      icon="emoji_events"
                                      class="primary--text"
                                  />
                                </template>
                              </v-select>
                            </v-col>
                            <v-col cols="12" md="6" xs="12" sm="12" lg="6">
                              <v-select
                                  color="primary"
                                  required
                                  readonly
                                  item-color="primary"
                                  v-model="form.idEtapa"
                                  label="Etapa"
                                  dense
                                  disabled
                                  :items="etapas"
                                  item-text="nombre"
                                  item-value="id"
                                  outlined
                                  :rules="$validate(['required'])"
                              >
                                <template v-slot:prepend>
                                  <v-icon-component
                                      icon="emoji_flags"
                                      class="primary--text"
                                  />
                                </template>
                              </v-select>
                            </v-col>
                            <v-col cols="12" md="6" xs="12" sm="12" lg="6">
                              <v-select
                                  color="primary"
                                  required
                                  item-color="primary"
                                  v-model="form.idArea"
                                  label="Áreas"
                                  dense
                                  :items="areas"
                                  item-text="nombre"
                                  item-value="id"
                                  outlined
                                  :rules="$validate(['required'])"
                              >
                                <template v-slot:prepend>
                                  <v-icon-component
                                      icon="science"
                                      class="primary--text"
                                  />
                                </template>
                              </v-select>
                            </v-col>
                            <v-col cols="12" md="6" xs="12" sm="12" lg="6">
                              <v-select
                                  color="primary"
                                  required
                                  item-color="primary"
                                  v-model="form.idGradoEscolar"
                                  label="Grado de escolaridad"
                                  dense
                                  :items="gradosEscolares"
                                  item-text="nombre"
                                  item-value="id"
                                  outlined
                                  :rules="$validate(['required'])"
                              >
                                <template v-slot:prepend>
                                  <v-icon-component
                                      icon="school"
                                      class="primary--text"
                                  />
                                </template>
                              </v-select>
                            </v-col>
                          </v-row>
                        </v-card>
                        <v-card elevation="0" class="primary--text mb-4 mt-4">
                          Configuración de preguntas
                        </v-card>
                        <v-card class="pa-4" outlined rounded>
                          <v-row>
                            <v-col cols="12" md="12" xs="12" sm="12" lg="6">
                              <v-text-field
                                  color="primary"
                                  required
                                  type="number"
                                  :rules="$validate(['required', 'numeros'])"
                                  v-model="form.duracionMinutos"
                                  label="Tiempo de la prueba (minutos)"
                                  dense
                                  outlined
                                  oninput="if(this.value <= 0) this.value = '';"
                              >
                                <template v-slot:prepend>
                                  <v-icon-component
                                      icon="timer"
                                      class="primary--text"
                                  />
                                </template>
                              </v-text-field>
                            </v-col>
                            <v-col cols="12" md="12" xs="12" sm="12" lg="6">
                              <v-text-field
                                  color="primary"
                                  required
                                  type="number"
                                  :min="3"
                                  :rules="$validate(['required'])"
                                  v-model="form.totalPreguntas"
                                  label="Total de preguntas"
                                  dense
                                  outlined
                                  oninput="if(this.value <= 0) this.value = 3;"
                              >
                                <template v-slot:prepend>
                                  <v-icon-component
                                      icon="quiz"
                                      class="primary--text"
                                  />
                                </template>
                              </v-text-field>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col class="primary--text">
                              <v-icon-tooltip
                                  color="primary"
                                  icon="quiz"
                                  text="Total de preguntas"
                              />
                              Total de preguntas: {{ form.totalPreguntas }}
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col>
                              Preguntas de olimpiada:
                              {{ form.preguntasOlimpiada }}
                            </v-col>
                            <v-col>
                              Preguntas de currícula:
                              {{ form.preguntasCurricula }}
                            </v-col>
                          </v-row>
                          <v-slider
                              v-model="form.preguntasOlimpiada"
                              :color="ex1.color"
                              :max="form.totalPreguntas"
                          >
                          </v-slider>
                          <v-row>
                            <v-col class="primary--text">
                              Puntaje Total de preguntas:
                              {{ form.puntajeTotal }}
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col>
                              Puntaje Total de olimpiada:
                              {{ form.puntosPreguntaOlimpiada }}
                            </v-col>
                            <v-col>
                              Puntaje Total de curricula:
                              {{ form.puntosPreguntaCurricula }}
                            </v-col>
                          </v-row>
                          <v-slider
                              v-model="form.puntosPreguntaOlimpiada"
                              :color="ex1.color"
                              :max="form.puntajeTotal"
                          >
                          </v-slider>
                        </v-card>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col
                          justify="start"
                          xs="12"
                          sm="12"
                          md="4"
                          lg="4"
                          cols="12"
                          class="pr-0 pl-0"
                      >
                      </v-col>
                      <v-col sm="12" xs="12" md="4" lg="4" cols="12"></v-col>
                      <v-col sm="12" xs="12" md="4" lg="4" cols="12">
                        <v-btn
                            dark
                            block
                            color="primary"
                            @click.stop="paso12"
                            elevation="0"
                        >
                          <v-icon-component
                              icon="keyboard_tab"
                          ></v-icon-component>
                          Continuar
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-stepper-content>

                <v-stepper-content step="2">
                  <v-form
                      :key="`etapa-area-grado-form2-${form.id}`"
                      ref="form2"
                      v-model="valid"
                      lazy-validation
                      @submit.prevent="paso23"
                  >
                    <v-row>
                      <v-col>
                        <v-card elevation="0" class="primary--text mb-4 mt-4">
                          Configuración de preguntas de curricula y de olimpiada
                        </v-card>
                      </v-col>
                    </v-row>
                    <v-col cols="12">
                      <v-card class="pa-4" outlined rounded>
                        <v-row>
                          <v-col>
                            <v-icon-tooltip
                                color="primary"
                                icon="quiz"
                                text="Total de preguntas de currícula"
                            />
                            {{ form.preguntasCurricula }} preguntas de curricula
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col>
                            <v-icon-tooltip
                                color="success"
                                icon="speed"
                                text="Dificultad básica"
                            />
                            {{ form.preguntasCurriculaBaja }} preguntas
                          </v-col>
                          <v-col>
                            <v-icon-tooltip
                                color="warning"
                                icon="speed"
                                text="Dificultad intermedia"
                            />
                            {{ form.preguntasCurriculaMedia }} preguntas
                          </v-col>
                          <v-col>
                            <v-icon-tooltip
                                color="error"
                                icon="speed"
                                text="Dificultad avanzada"
                            />
                            {{ form.preguntasCurriculaAlta }} preguntas
                          </v-col>
                        </v-row>

                        <v-range-slider
                            hint="Preguntas de Currícula"
                            v-model="arregloPreguntasCurricula"
                            :max="form.preguntasCurricula"
                            min="0"
                        ></v-range-slider>

                        <v-row>
                          <v-col>
                            Total de puntaje de curricula:
                            {{ form.puntosPreguntaCurricula }}
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col>
                            <v-icon-tooltip
                                color="success"
                                icon="speed"
                                text="Puntos en total - Dificultad básica"
                            />
                            {{ form.totalPuntajeCurriculaBaja }} puntos
                          </v-col>
                          <v-col>
                            <v-icon-tooltip
                                color="warning"
                                icon="speed"
                                text="Puntos en total - Dificultad intermedia"
                            />
                            {{ form.totalPuntajeCurriculaMedia }} puntos
                          </v-col>
                          <v-col>
                            <v-icon-tooltip
                                color="error"
                                icon="speed"
                                text="Puntos en total - Dificultad avanzada"
                            />
                            {{ form.totalPuntajeCurriculaAlta }} puntos
                          </v-col>
                        </v-row>
                        <v-range-slider
                            hint="Puntaje de Curricula"
                            v-model="arregloPuntosCurricula"
                            :max="form.puntosPreguntaCurricula"
                            min="0"
                        ></v-range-slider>

                        <v-row>
                          <v-col>
                            {{
                              isFinite(
                                  this.form.totalPuntajeCurriculaBaja /
                                  this.form.preguntasCurriculaBaja
                              )
                                  ? (
                                      this.form.totalPuntajeCurriculaBaja /
                                      this.form.preguntasCurriculaBaja || 0
                                  ).toFixed(2)
                                  : 0
                            }}
                            puntos/pregunta
                          </v-col>
                          <v-col>
                            {{
                              isFinite(
                                  this.form.totalPuntajeCurriculaMedia /
                                  this.form.preguntasCurriculaMedia
                              )
                                  ? (
                                      this.form.totalPuntajeCurriculaMedia /
                                      this.form.preguntasCurriculaMedia || 0
                                  ).toFixed(2)
                                  : 0
                            }}
                            puntos/pregunta
                          </v-col>
                          <v-col>
                            {{
                              isFinite(
                                  this.form.totalPuntajeCurriculaAlta /
                                  this.form.preguntasCurriculaAlta
                              )
                                  ? (
                                      this.form.totalPuntajeCurriculaAlta /
                                      this.form.preguntasCurriculaAlta || 0
                                  ).toFixed(2)
                                  : 0
                            }}
                            puntos/pregunta
                          </v-col>
                        </v-row>
                      </v-card>
                    </v-col>

                    <v-col cols="12">
                      <v-card class="pa-4" outlined rounded>
                        <v-row>
                          <v-col>
                            <v-icon-tooltip
                                color="primary"
                                icon="quiz"
                                text="Total de preguntas de olimpiada"
                            />
                            {{ form.preguntasOlimpiada }} preguntas de olimpiada
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col>
                            <v-icon-tooltip
                                color="success"
                                icon="speed"
                                text="Dificultad básica"
                            />
                            {{ form.preguntasOlimpiadaBaja }} preguntas
                          </v-col>
                          <v-col>
                            <v-icon-tooltip
                                color="warning"
                                icon="speed"
                                text="Dificultad intermedia"
                            />
                            {{ form.preguntasOlimpiadaMedia }} preguntas
                          </v-col>
                          <v-col>
                            <v-icon-tooltip
                                color="error"
                                icon="speed"
                                text="Dificultad avanzada"
                            />
                            {{ form.preguntasOlimpiadaAlta }} preguntas
                          </v-col>
                        </v-row>
                        <v-range-slider
                            hint="Preguntas de olimpiada"
                            v-model="arregloPreguntasOlimpiada"
                            :max="form.preguntasOlimpiada"
                            min="0"
                        ></v-range-slider>
                        <v-row>
                          <v-col>
                            Total de puntaje de olimpiada:
                            {{ form.puntosPreguntaOlimpiada }}
                          </v-col>
                        </v-row>

                        <v-row>
                          <v-col>
                            <v-icon-tooltip
                                color="success"
                                icon="speed"
                                text="Puntos en total - Dificultad básica"
                            />
                            {{ form.totalPuntajeOlimpiadaBaja }} puntos
                          </v-col>
                          <v-col>
                            <v-icon-tooltip
                                color="warning"
                                icon="speed"
                                text="Puntos en total - Dificultad intermedia"
                            />
                            {{ form.totalPuntajeOlimpiadaMedia }} puntos
                          </v-col>
                          <v-col>
                            <v-icon-tooltip
                                color="error"
                                icon="speed"
                                text="Puntos en total - Dificultad avanzada"
                            />
                            {{ form.totalPuntajeOlimpiadaAlta }} puntos
                          </v-col>
                        </v-row>

                        <v-range-slider
                            hint="Puntaje de olimpiada"
                            v-model="arregloPuntosOlimpiada"
                            :max="form.puntosPreguntaOlimpiada"
                            min="0"
                        ></v-range-slider>

                        <v-row>
                          <v-col>
                            {{
                              isFinite(
                                  this.form.totalPuntajeOlimpiadaBaja /
                                  this.form.preguntasOlimpiadaBaja
                              )
                                  ? (
                                      this.form.totalPuntajeOlimpiadaBaja /
                                      this.form.preguntasOlimpiadaBaja || 0
                                  ).toFixed(2)
                                  : 0
                            }}
                            puntos/pregunta
                          </v-col>
                          <v-col>
                            {{
                              isFinite(
                                  this.form.totalPuntajeOlimpiadaMedia /
                                  this.form.preguntasOlimpiadaMedia
                              ) ?
                                  (
                                      this.form.totalPuntajeOlimpiadaMedia /
                                      this.form.preguntasOlimpiadaMedia || 0
                                  ).toFixed(2) : 0
                            }}
                            puntos/pregunta
                          </v-col>
                          <v-col>
                            {{
                              (
                                  this.form.totalPuntajeOlimpiadaAlta /
                                  this.form.preguntasOlimpiadaAlta || 0
                              ).toFixed(2)
                            }}
                            puntos/pregunta
                          </v-col>
                        </v-row>
                      </v-card>
                    </v-col>

                    <v-row class="pa-4">
                      <v-col
                          justify="start"
                          xs="12"
                          sm="12"
                          md="4"
                          lg="4"
                          cols="12"
                          class="pr-0 pl-0"
                      >
                      </v-col>
                      <v-col sm="12" xs="12" md="4" lg="4" cols="12">
                        <v-btn block @click.stop="pasoActual = 1" elevation="0">
                          <v-icon-component
                              icon="keyboard_backspace"
                          ></v-icon-component>
                          volver
                        </v-btn>
                      </v-col>
                      <v-col sm="12" xs="12" md="4" lg="4" cols="12">
                        <v-btn
                            dark
                            block
                            color="primary"
                            @click.stop="paso23"
                            elevation="0"
                        >
                          <v-icon-component
                              icon="keyboard_tab"
                          ></v-icon-component>
                          Continuar
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-stepper-content>

                <v-stepper-content step="3">
                  <v-form
                      :key="`etapa-area-grado-form3-${form.id}`"
                      ref="form3"
                      v-model="valid"
                      lazy-validation
                      @submit.prevent="paso34"
                  >
                    <v-row>
                      <v-col>
                        <v-card elevation="0" class="primary--text mb-4 mt-4">
                          Configuración de posiciones de medallero
                        </v-card>
                      </v-col>
                    </v-row>
                    <v-row class="mt-4">
                      <v-col cols="4">
                        <span class="font-weight-medium grey--text">
                          Puntaje minimo de medallero:
                        </span>
                      </v-col>
                      <v-col cols="7">
                        <v-row>
                          <v-icon-tooltip
                              color="primary"
                              icon="info"
                              text="Determina si existe algún criterio de calificación mínimo para ser adicionado al medallero."
                          />
                          <v-text-field
                              color="primary"
                              type="number"
                              :rules="$validate([])"
                              v-model="form.puntajeMinimoMedallero"
                              label=""
                              dense
                              outlined
                              oninput="if(this.value <= 0) this.value = '';"
                              max="100"
                          >
                          </v-text-field>
                        </v-row>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" md="12" xs="12" sm="12" lg="12">
                        <v-card class="pa-4" outlined rounded>
                          <v-card elevation="0" class="mb-3">
                            <v-row no-gutters>
                              <v-col cols="11" sm="11">
                                <v-row>
                                  <v-col cols="8">
                                    <div class="primary--text mb-3">
                                      <v-icon-tooltip
                                          color="primary"
                                          icon="leaderboard"
                                          text="Posiciones en el medallero"
                                      />
                                      Medallero
                                      {{ this.medalleroPosiciones.length }}
                                      posiciones:
                                    </div>
                                  </v-col>
                                  <v-col cols="4"></v-col>
                                </v-row>
                              </v-col>
                              <v-col cols="1" sm="1">
                                <v-tooltip bottom color="success">
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-btn
                                        icon
                                        color="success"
                                        v-bind="attrs"
                                        v-on="on"
                                        @click="addOption()"
                                    >
                                      <v-icon-component
                                          icon="add"
                                      ></v-icon-component>
                                    </v-btn>
                                  </template>
                                  <span>Agregar Posición</span>
                                </v-tooltip>
                              </v-col>
                            </v-row>
                          </v-card>
                          <v-card elevation="0">
                            <template
                                v-for="(opcion, idx) in medalleroPosiciones"
                            >
                              <v-row
                                  :key="`medalleroPosicion-${idx}`"
                                  class="ma-2"
                              >
                                <v-col cols="4" class="primary--text ma-2">
                                <span class="font-weight-medium grey--text">
                                  Posición {{ opcion.ordenGalardon }}
                                </span>
                                </v-col>
                                <v-col>
                                  <v-opciones-medallero
                                      :key="opcion.key"
                                      :id="opcion.key"
                                      :orden-galardon-inicial="
                                    opcion.ordenGalardon.toString()
                                  "
                                      :denominativoInicial="opcion.denominativo"
                                      :keyInicial="opcion.key"
                                      @setOption="setOption"
                                      :showDelete="
                                    medalleroPosiciones.length - 1 === idx
                                  "
                                      @deleteOption="
                                    deleteOption();
                                    medalleroPosicionRurales = [];
                                  "
                                  />
                                </v-col>
                              </v-row>
                            </template>
                          </v-card>
                        </v-card>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" md="12" xs="12" sm="12" lg="12">
                        <v-card class="pa-4" outlined rounded>
                          <v-card elevation="0" class="mb-3">
                            <v-row no-gutters>
                              <v-col cols="11" sm="11">
                                <v-row>
                                  <v-col cols="8">
                                    <div class="primary--text mb-3">
                                      <v-icon-tooltip
                                          color="primary"
                                          icon="leaderboard"
                                          text="Posiciones en el medallero rural"
                                      />
                                      Medallero rural:
                                      {{ medalleroPosicionRurales.length }}
                                      posiciones
                                    </div>
                                  </v-col>
                                  <v-col cols="4"></v-col>
                                </v-row>
                              </v-col>
                              <v-col cols="1" sm="1">
                                <v-tooltip bottom color="success">
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-btn
                                        icon
                                        color="success"
                                        v-bind="attrs"
                                        v-on="on"
                                        @click="addOptionRural()"
                                    >
                                      <v-icon-component
                                          icon="add"
                                      ></v-icon-component>
                                    </v-btn>
                                  </template>
                                  <span>Agregar Posición rural</span>
                                </v-tooltip>
                              </v-col>
                            </v-row>
                          </v-card>
                          <v-card elevation="0">
                            <template
                                v-for="(opcion, idx) in medalleroPosicionRurales"
                            >
                              <v-row
                                  :key="
                                `medalleroPosicionRural-${opcion.key}-${idx}`
                              "
                                  class="ma-4"
                              >
                                <v-col cols="4" class="primary--text ma-2">
                                <span class="font-weight-medium grey--text">
                                  Posición {{ opcion.orden }}:
                                </span>
                                </v-col>
                                <v-col>
                                  <v-opciones-medallero
                                      :key="opcion.key"
                                      :id="opcion.key"
                                      :keyInicial="opcion.key"
                                      :rural="true"
                                      :orden-inicial="opcion.orden.toString()"
                                      :minimoInicial="
                                    parseInt(opcion.posicionMinima)
                                  "
                                      :maximoInicial="
                                    parseInt(opcion.posicionMaxima)
                                  "
                                      :notaMinimaInicial=opcion.notaMinima
                                      @setOptionRural="setOptionRural"
                                      :showDelete="
                                    medalleroPosicionRurales.length - 1 === idx
                                  "
                                      @deleteOption="deleteOptionRural"
                                  />
                                </v-col>
                              </v-row>
                              <div
                                  v-if="opcion.campos && opcion.campos.length > 0"
                                  :key="`rol-${opcion.key}`"
                                  class="mb-3"
                              >
                                <div class="pl-5 font-weight-medium grey--text">
                                  Campos que debe llenar medallero:
                                </div>
                                <div
                                    v-for="(campo, id) in opcion.campos"
                                    :key="`campo-medallero-rural-${id}${campo}`"
                                >
                                  <div v-if="false">{{ id }} - {{ campo }}</div>
                                </div>
                              </div>
                            </template>
                          </v-card>
                        </v-card>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col
                          justify="start"
                          xs="12"
                          sm="12"
                          md="4"
                          lg="4"
                          cols="12"
                          class="pr-0 pl-0"
                      >
                      </v-col>
                      <v-col sm="12" xs="12" md="4" lg="4" cols="12">
                        <v-btn block @click.stop="pasoActual = 2" elevation="0">
                          <v-icon-component
                              icon="keyboard_backspace"
                          ></v-icon-component>
                          volver
                        </v-btn>
                      </v-col>
                      <v-col sm="12" xs="12" md="4" lg="4" cols="12">
                        <v-btn
                            dark
                            block
                            color="primary"
                            @click.stop="paso34"
                            elevation="0"
                        >
                          <v-icon-component
                              icon="keyboard_tab"
                          ></v-icon-component>
                          Continuar
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-stepper-content>

                <v-stepper-content step="4">
                  <v-form
                      :key="`etapa-area-grado-form4-${form.id}`"
                      ref="form4"
                      v-model="valid"
                      lazy-validation
                      @submit.prevent="paso4Enviar"
                  >
                    <v-col cols="12">
                      <v-card elevation="0">
                        <v-container fluid>
                          <v-row>
                            <v-col>
                              <v-card
                                  elevation="0"
                                  class="primary--text mb-4 mt-4"
                              >
                                Configuración de parámetros de clasificación
                              </v-card>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col>
                              <v-card class="pa-8" outlined>
                                <v-row>
                                  <v-col cols="7">
                                    <v-switch
                                        inset
                                        v-model="form.criterioCalificacion"
                                        label="Criterio Calificación"
                                        dense
                                    ></v-switch>
                                  </v-col>
                                </v-row>
                                <v-row
                                    class="mt-4"
                                    v-if="form.criterioCalificacion"
                                >
                                  <v-col>
                                    <v-row>
                                      <v-col cols="5">
                                        <span
                                            class="font-weight-medium grey--text"
                                        >
                                          Puntaje minimo de clasificación:
                                        </span>
                                      </v-col>
                                      <v-col cols="7">
                                        <v-row>
                                          <v-icon-component
                                              icon="flag"
                                              class="primary--text"
                                          />
                                          <v-text-field
                                              color="primary"
                                              required
                                              type="number"
                                              :rules="$validate([])"
                                              v-model="
                                              form.puntajeMinimoClasificacion
                                            "
                                              label="Puntaje minimo de clasificación"
                                              dense
                                              outlined
                                              oninput="if(this.value <= 0) this.value = ''; "
                                              max="100"
                                          />
                                        </v-row>
                                      </v-col>
                                    </v-row>
                                  </v-col>
                                </v-row>
                                <v-row>
                                  <v-col cols="7">
                                    <v-switch
                                        inset
                                        v-model="form.criterioMedallero"
                                        label="Criterio Medallero"
                                        dense
                                    ></v-switch>
                                  </v-col>
                                </v-row>
                                <v-row class="mt-4">
                                  <v-col cols="5">
                                    <span class="font-weight-medium grey--text">
                                      Cantidad máxima de clasificados:
                                    </span>
                                  </v-col>
                                  <v-col cols="7">
                                    <v-row>
                                      <v-icon-tooltip
                                          color="primary"
                                          icon="info"
                                          text="Ej. 80"
                                      />
                                      <v-text-field
                                          color="primary"
                                          required
                                          type="number"
                                          :rules="$validate([])"
                                          v-model="form.cantidadMaximaClasificados"
                                          label=""
                                          dense
                                          outlined
                                          oninput="if(this.value <= 0) this.value = '';"
                                      >
                                      </v-text-field>
                                    </v-row>
                                  </v-col>
                                </v-row>
                              </v-card>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col
                                justify="start"
                                xs="12"
                                sm="12"
                                md="4"
                                lg="4"
                                cols="12"
                                class="pr-0 pl-0"
                            >
                            </v-col>
                            <v-col sm="12" xs="12" md="4" lg="4" cols="12">
                              <v-btn
                                  block
                                  @click.stop="pasoActual = 3"
                                  elevation="0"
                              >
                                <v-icon-component
                                    icon="keyboard_backspace"
                                ></v-icon-component>
                                volver
                              </v-btn>
                            </v-col>
                            <v-col sm="12" xs="12" md="4" lg="4" cols="12">
                              <v-btn
                                  dark
                                  block
                                  color="primary"
                                  @click.stop="paso4Enviar"
                                  elevation="0"
                              >
                                <v-icon-component
                                    icon="check"
                                ></v-icon-component>
                                Enviar
                              </v-btn>
                            </v-col>
                          </v-row>
                        </v-container>
                      </v-card>
                    </v-col>
                  </v-form>
                </v-stepper-content>
              </v-stepper-items>
            </v-stepper>
            <v-row></v-row>
          </v-container>
        </v-card>
      </template>
    </app-dialog>
    <crud-table
        v-if="showCrudTable"
        description="Etapas por área y grado"
        :headers="headers"
        :url-inicial="obtenerRuta()"
        :parametros="parametros"
        :widthModal="500"
        :show-filter-init="true"
        :filters-inicial="filters"
        :order="order"
        :custom="true"
        :show-filter-options="false"
        :omitir-carga-on-mounted="true"
    >
      <template slot="buttons">
        <v-tooltip bottom color="primary">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
                id="btnCalendar"
                :small="['xs', 'sm'].includes($vuetify.breakpoint.name)"
                text
                depressed
                icon
                color="primary"
                class="primary--text"
                @click="setCalendar"
                v-bind="attrs"
                v-on="on"
            >
              <v-icon-component icon="date_range" color="primary"/>
            </v-btn>
          </template>
          <span>Configurar calendario</span>
        </v-tooltip>
        <v-icon-tooltip
            id="addArea"
            color="primary"
            icon="add"
            text="Agregar etapa area grado"
            v-if="btnAgregar && etapaSeleccionada != null && etapaSeleccionada.estado === 'CONFIGURACION_COMPETENCIA'"
            @accion="oModal({})"
        />
      </template>

      <template slot="items" slot-scope="items">
        <tr
            v-if="items.items.id === idSelected"
            :style="
            $vuetify.theme.dark ? 'background: #00516D' : 'background: #dbe9f5'
          "
        >
          <td
              colspan="9"
              class="pa-0 ma-0"
              style="
              height: 30px !important;
              min-height: 30px !important;
              border-bottom: none;
            "
          >
            <v-alert text width="100%" dense elevation="0" color="info">
              <v-card
                  elevation="0"
                  color="transparent"
                  class="fs8 primary--text pt-1 pb-1"
              >Esta etapa se encuentra seleccionada para crear o modificar el
                banco de preguntas
              </v-card>
            </v-alert>
          </td>
        </tr>
        <tr
            :class="
            items.items.id === idSelected
              ? `${
                  $vuetify.theme.dark ? 'dark-is-selected' : 'light-is-selected'
                }`
              : ''
          "
        >
          <td>{{ items.items.area ? items.items.area.nombre : '' }}<br/></td>
          <td>
            {{
              items.items.gradoEscolar ? items.items.gradoEscolar.nombre : ''
            }}
          </td>
          <td>
            <v-icon-tooltip
                color="primary"
                icon="timer"
                text="Tiempo de la prueba"
            />
            <span> {{ items.items.duracionMinutos }} minutos<br/> </span>

            <v-icon-tooltip
                color="primary"
                icon="quiz"
                text="Total de preguntas"
            />
            {{ items.items.totalPreguntas }} preguntas en total<br/>

            <v-icon-tooltip color="primary" icon="quiz">
              <template slot="contenido">
                <div>
                  Preguntas de curricula
                </div>
                <v-icon-tooltip
                    color="success"
                    icon="speed"
                    text="Dificultad básica"
                />
                {{ items.items.preguntasCurriculaBaja }}
                {{
                  items.items.preguntasCurriculaBaja > 1
                      ? 'preguntas'
                      : 'pregunta'
                }}, {{ items.items.puntajeCurriculaBaja }} puntos<br/>

                <v-icon-tooltip
                    color="warning"
                    icon="speed"
                    text="Dificultad media"
                />
                {{ items.items.preguntasCurriculaMedia }}
                {{
                  items.items.preguntasCurriculaMedia > 1
                      ? 'preguntas'
                      : 'pregunta'
                }}, {{ items.items.puntajeCurriculaMedia }} puntos<br/>

                <v-icon-tooltip
                    color="error"
                    icon="speed"
                    text="Dificultad avanzada"
                />
                {{ items.items.preguntasCurriculaAlta }}
                {{
                  items.items.preguntasCurriculaAlta > 1
                      ? 'preguntas'
                      : 'pregunta'
                }}, {{ items.items.puntajeCurriculaAlta }} puntos
              </template>
            </v-icon-tooltip>
            {{ items.items.preguntasCurricula }} preguntas de curricula,
            <span class="primary--text">
              {{ items.items.puntosPreguntaCurricula }}
            </span>
            puntos<br/>
            <v-icon-tooltip color="primary" icon="quiz">
              <template slot="contenido">
                <div>
                  Preguntas de olimpiada
                </div>
                <v-icon-tooltip
                    color="success"
                    icon="speed"
                    text="Dificultad básica"
                />
                {{ items.items.preguntasOlimpiadaBaja }}
                {{
                  items.items.preguntasOlimpiadaBaja > 1
                      ? 'preguntas'
                      : 'pregunta'
                }}, {{ items.items.puntajeOlimpiadaBaja }} puntos<br/>

                <v-icon-tooltip
                    color="warning"
                    icon="speed"
                    text="Dificultad media"
                />
                {{ items.items.preguntasOlimpiadaMedia }}
                {{
                  items.items.preguntasOlimpiadaMedia > 1
                      ? 'preguntas'
                      : 'pregunta'
                }}, {{ items.items.puntajeOlimpiadaMedia }} puntos<br/>

                <v-icon-tooltip
                    color="error"
                    icon="speed"
                    text="Dificultad avanzada"
                />
                {{ items.items.preguntasOlimpiadaAlta }}
                {{
                  items.items.preguntasOlimpiadaAlta > 1
                      ? 'preguntas'
                      : 'pregunta'
                }}, {{ items.items.puntajeOlimpiadaAlta }} puntos<br/>
              </template>
            </v-icon-tooltip>
            {{ items.items.preguntasOlimpiada }} preguntas de olimpiada,
            {{ items.items.puntosPreguntaOlimpiada }} puntos <br/>
          </td>

          <td>
            <div>
              <br/>
              <v-icon-tooltip
                  color="primary"
                  icon="leaderboard"
                  text="Nro. de posiciones"
              />
              {{ items.items.nroPosicionesTotal }}
              {{ items.items.nroPosicionesTotal === 1 ? 'posición' : 'posiciones' }}<br/>

              <v-icon-tooltip color="primary" icon="military_tech">
                <template slot="contenido">
                  <span
                      :key="`posicion-${idx}`"
                      v-for="(posicion, idx) in items.items.medalleroPosiciones"
                  >
                    {{ posicion.ordenGalardon }} - {{
                      posicion.denominativo
                    }}<br/>
                  </span>
                </template>
              </v-icon-tooltip>
              <span class="primary--text"> Medallero<br/> </span>
            </div>
            <div>
              <v-icon-tooltip
                  color="primary"
                  icon="military_tech"
              >
                <template slot="contenido">
                  <span v-if="items.items.medalleroPosicionRurales.length === 0">
                    No configurado
                  </span>
                  <span
                      :key="`posicion-rural-${idx}`"
                      v-for="(posicion, idx) in items.items
                      .medalleroPosicionRurales"
                      v-else
                  >
                      <span>
                        Posición: {{ posicion.orden }}<br/>
                        Posición Máxima: {{ posicion.posicionMaxima }}<br/>
                        Posición Mínima: {{ posicion.posicionMinima }}<br/>
                        Nota Mínima: {{ posicion.notaMinima }}<br/>
                    </span>
                  </span>
                </template>
              </v-icon-tooltip>
              <span class="primary--text"> Medallero rural<br/> </span>
            </div>
          </td>

          <td>
            <div>
              <v-icon-tooltip
                  :color="items.items.criterioCalificacion ? 'success': 'error'"
                  :icon="items.items.criterioCalificacion ? 'check_circle' : 'cancel'"
                  :text="items.items.criterioCalificacion ? 'Criterio Calificación - Activado': 'Criterio Calificación - Desactivado'"
              />
              Criterio calificación
            </div>
            <div v-if="items.items.criterioCalificacion">
              <v-icon-tooltip
                  color="primary"
                  icon="info"
                  text="Puntaje minimo de clasificación"
              />
              {{ items.items.puntajeMinimoClasificacion }} puntos<br/>
            </div>
            <div>
              <v-icon-tooltip
                  :color="items.items.criterioMedallero ? 'success': 'error'"
                  :icon="items.items.criterioMedallero ? 'check_circle' : 'cancel'"
                  :text="items.items.criterioMedallero ? 'Criterio Calificación - Activado': 'Criterio Medallero - Desactivado'"
              />
              Criterio medallero
            </div>
            <div v-if="items.items.cantidadMaximaClasificados">
              <v-icon-tooltip
                  color="primary"
                  icon="leaderboard"
                  text="Cantidad máxima de clasificados"
              />
              {{ items.items.cantidadMaximaClasificados }} clasificados<br/>
            </div>
          </td>

          <td>
            <v-btn
                outlined
                :color="items.items.estado === 'ACTIVO' ? 'info' : 'color1'"
            >{{ items.items.estado }}
            </v-btn>
          </td>

          <td>

            <span v-if="items.items.etapa.estado !== 'CONFIGURACION_COMPETENCIA'" class="font-weight-regular">
              Acciones no disponibles, etapa {{ items.items.etapa.nombre }} en estado {{ items.items.etapa.estado }}
            </span>

            <v-icon-tooltip
                color="success"
                icon="toggle_on"
                text="Inactivar"
                v-if="btnEditar && items.items.estado === 'ACTIVO' && items.items.etapa.estado === 'CONFIGURACION_COMPETENCIA'"
                @accion="inactivar(items.items)"
            />

            <v-icon-tooltip
                color="error"
                icon="toggle_off"
                text="Activar"
                v-if="btnEditar && items.items.estado === 'INACTIVO' && items.items.etapa.estado === 'CONFIGURACION_COMPETENCIA'"
                @accion="activar(items.items)"
            />

            <v-icon-tooltip
                color="success"
                icon="edit"
                text="Editar registro"
                v-if="btnEditar && items.items.etapa.estado === 'CONFIGURACION_COMPETENCIA'"
                @accion="oModal(items)"
            />

            <v-icon-tooltip
                color="error"
                icon="delete"
                text="Eliminar registro"
                v-if="btnEditar && items.items.etapa.estado === 'CONFIGURACION_COMPETENCIA'"
                @accion="itemDelete(items)"
            />
          </td>
        </tr>
      </template>
    </crud-table>
    <v-alert
        type="warning"
        dense
        text
        class="fs9"
        v-else
    >
      No existen etapas asignadas en esta competencia.
    </v-alert>
    <!-- MODAL PARA CARGAR CALENDARIOS -->
    <v-dialog v-model="$store.state.modal3" width="600" persistent>
      <v-card elevation="0">
        <v-card-title class="ma-0 pa-1">
          <v-container fluid>
            <v-row no-gutters>
              <v-col
                  align="start"
                  justify="center"
                  :cols="11"
                  class="
                  d-flex
                  flex-row
                  align-center
                  text-sm
                  color1--tex primary--text
                "
              >
                <v-icon-component
                    class="m-2"
                    icon="date_range"
                ></v-icon-component>
                <span class="fs10 pl-2">Seleccione una fecha por favor:</span>
              </v-col>
              <v-col :cols="1">
                <v-icon-tooltip
                    icon="close"
                    color="primary"
                    text="Cerrar ventana emergente"
                    @accion="$store.commit('closeModal', 3)"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card-title>
        <v-card-text class="pa-3 pt-0">
          <calendar
              :olimpiada="idOlimpiadaSeleccionada"
              :etapa="etapaSeleccionada"
              :area="form.id"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-card>
</template>
<script>
import { $Casbin } from '@/plugins/casbin';
import validate from '@/common/mixins/validate';
import Auth from '@/components/auth/mixins/auth';
import CrudTable from '@/plugins/crud-table/CrudTable.vue';
import actions from '@/plugins/crud-table/mixins/crud-table';
import vIconComponent from '@/plugins/icon/index.vue';

import AppDialog from '@/plugins/modal/AppDialog.vue';
import vOpcionesMedallero from '@/components/etapas-areas-grados/opcionesMedallero.vue';
import calendar from '../calendario/index.vue';

export default {
  mixins: [actions, validate, Auth],
  watch: {
    'form.totalPreguntas'() {
      if (this.indicadorModalAbierto) {
        this.form.preguntasCurricula = parseInt(this.form.totalPreguntas / 2);
        this.form.preguntasOlimpiada = this.form.totalPreguntas - this.form.preguntasCurricula;
      }
    },
    'form.preguntasOlimpiada'() {
      if (this.indicadorModalAbierto) {
        this.form.preguntasCurricula = this.form.totalPreguntas - this.form.preguntasOlimpiada;

        /// Preguntas de olimpiada

        this.form.preguntasOlimpiadaBaja = parseInt(
          this.form.preguntasOlimpiada / 3
        );
        this.form.preguntasOlimpiadaMedia = parseInt(
          this.form.preguntasOlimpiada / 3
        );
        this.form.preguntasOlimpiadaAlta = this.form.preguntasOlimpiada
            - this.form.preguntasOlimpiadaBaja
            - this.form.preguntasOlimpiadaMedia;

        this.arregloPreguntasOlimpiada = [
          this.form.preguntasOlimpiadaBaja,
          this.form.preguntasOlimpiadaMedia + this.form.preguntasOlimpiadaAlta,
        ];

        /// Preguntas de curricula

        this.form.preguntasCurriculaBaja = parseInt(
          this.form.preguntasCurricula / 3
        );
        this.form.preguntasCurriculaMedia = parseInt(
          this.form.preguntasCurricula / 3
        );
        this.form.preguntasCurriculaAlta = this.form.preguntasCurricula
            - this.form.preguntasCurriculaBaja
            - this.form.preguntasCurriculaMedia;

        this.arregloPreguntasCurricula = [
          this.form.preguntasCurriculaBaja,
          this.form.preguntasCurriculaMedia + this.form.preguntasCurriculaAlta,
        ];
      }
    },
    arregloPreguntasOlimpiada() {
      if (this.indicadorModalAbierto) {
        const [uno, dos] = this.arregloPreguntasOlimpiada;

        this.form.preguntasOlimpiadaBaja = uno;
        this.form.preguntasOlimpiadaMedia = dos - uno;
        this.form.preguntasOlimpiadaAlta = this.form.preguntasOlimpiada - dos;
      }
    },
    arregloPreguntasCurricula() {
      if (this.indicadorModalAbierto) {
        const [uno, dos] = this.arregloPreguntasCurricula;

        this.form.preguntasCurriculaBaja = uno;
        this.form.preguntasCurriculaMedia = dos - uno;
        this.form.preguntasCurriculaAlta = this.form.preguntasCurricula - dos;
      }
    },

    // Para puntaje

    'form.puntajeTotal'() {
      if (this.indicadorModalAbierto) {
        this.form.puntosPreguntaCurricula = parseInt(
          this.form.puntajeTotal / 2
        );

        this.form.puntosPreguntaOlimpiada = this.form.puntajeTotal - this.form.puntosPreguntaCurricula;
      }
    },

    'form.puntosPreguntaOlimpiada'() {
      if (this.indicadorModalAbierto) {
        this.form.puntosPreguntaCurricula = this.form.puntajeTotal - this.form.puntosPreguntaOlimpiada;

        /// Puntaje de olimpiada

        this.form.totalPuntajeOlimpiadaBaja = parseInt(
          this.form.puntosPreguntaOlimpiada / 3
        );
        this.form.totalPuntajeOlimpiadaMedia = parseInt(
          this.form.puntosPreguntaOlimpiada / 3
        );
        this.form.totalPuntajeOlimpiadaAlta = this.form.puntosPreguntaOlimpiada
            - this.form.totalPuntajeOlimpiadaBaja
            - this.form.totalPuntajeOlimpiadaMedia;

        this.arregloPuntosOlimpiada = [
          this.form.totalPuntajeOlimpiadaBaja,
          this.form.totalPuntajeOlimpiadaMedia
          + this.form.totalPuntajeOlimpiadaAlta,
        ];

        /// puntaje de curricula

        this.form.totalPuntajeCurriculaBaja = parseInt(
          this.form.puntosPreguntaCurricula / 3
        );
        this.form.totalPuntajeCurriculaMedia = parseInt(
          this.form.puntosPreguntaCurricula / 3
        );
        this.form.totalPuntajeCurriculaAlta = this.form.puntosPreguntaCurricula
            - this.form.totalPuntajeCurriculaBaja
            - this.form.totalPuntajeCurriculaMedia;

        this.arregloPuntosCurricula = [
          this.form.totalPuntajeCurriculaBaja,
          this.form.totalPuntajeCurriculaMedia
          + this.form.totalPuntajeCurriculaAlta,
        ];
      }
    },
    arregloPuntosOlimpiada() {
      if (this.indicadorModalAbierto) {
        const [uno, dos] = this.arregloPuntosOlimpiada;

        this.form.totalPuntajeOlimpiadaBaja = uno;
        this.form.totalPuntajeOlimpiadaMedia = dos - uno;
        this.form.totalPuntajeOlimpiadaAlta = this.form.puntosPreguntaOlimpiada - dos;
      }
    },
    arregloPuntosCurricula() {
      if (this.indicadorModalAbierto) {
        const [uno, dos] = this.arregloPuntosCurricula;

        this.form.totalPuntajeCurriculaBaja = uno;
        this.form.totalPuntajeCurriculaMedia = dos - uno;
        this.form.totalPuntajeCurriculaAlta = this.form.puntosPreguntaCurricula - dos;
      }
    },
  },
  data: () => ({
    ex1: {
      label: 'Total de preguntas',
      val: 25,
      color: 'orange darken-3',
    },
    idOlympiad: {
      type: String,
      default: null,
    },
    valid: false,
    url: null,
    idStage: null,
    parametros: null,
    idSelected: null,
    olimpiadas: [],
    order: ['createdAt', 'DESC'],
    headers: [
      {
        text: 'Área',
        sortable: false,
        align: 'center',
      },
      {
        text: 'Grado',
        sortable: false,
        align: 'center',
      },
      {
        text: 'Configuración de preguntas',
        sortable: false,
        align: 'center',
      },
      {
        text: 'Medallero',
        sortable: false,
        align: 'center',
      },
      {
        text: 'Clasificación',
        sortable: false,
        align: 'center',
      },
      {
        text: 'Estado',
        sortable: false,
        align: 'center',
      },
      {
        text: 'Acciones',
        sortable: false,
        align: 'center',
        value: 'ACTIONS',
      },
    ],
    form: {
      id: null,
      totalPreguntas: 0,
      preguntasCurricula: 0,
      preguntasOlimpiada: 0,
      puntosPreguntaCurricula: 0,
      puntosPreguntaOlimpiada: 0,
      duracionMinutos: 0,
      preguntasCurriculaBaja: 0,
      puntajeCurriculaBaja: 0,
      totalPuntajeCurriculaBaja: 0,
      preguntasCurriculaMedia: 0,
      puntajeCurriculaMedia: 0,
      totalPuntajeCurriculaMedia: 0,
      preguntasCurriculaAlta: 0,
      puntajeCurriculaAlta: 0,
      totalPuntajeCurriculaAlta: 0,
      preguntasOlimpiadaBaja: 0,
      puntajeOlimpiadaBaja: 0,
      totalPuntajeOlimpiadaBaja: 0,
      preguntasOlimpiadaMedia: 0,
      puntajeOlimpiadaMedia: 0,
      totalPuntajeOlimpiadaMedia: 0,
      preguntasOlimpiadaAlta: 0,
      puntajeOlimpiadaAlta: 0,
      totalPuntajeOlimpiadaAlta: 0,
      puntajeTotal: 0,
      estado: null,
      etapa: null,
      area: null,
      gradoEscolar: null,
      idOlimpiada: null,
      nroPosicionesTotal: 0,
      puntajeMinimoMedallero: null,
      nroPosicionesRural: 0,
      criterioCalificacion: false,
      criterioMedallero: false,
      puntajeMinimoClasificacion: 0,
      cantidadMaximaClasificados: 0,
    },
    medalleroPosiciones: [],
    medalleroPosicionRurales: [],
    filters: [],
    arregloPreguntasOlimpiada: [0, 0],
    arregloPreguntasCurricula: [0, 0],
    arregloPuntosOlimpiada: [0, 0],
    arregloPuntosCurricula: [0, 0],
    btnAgregar: true,
    btnEditar: true,
    btnEliminar: true,
    menufechaInicio: false,
    menufechaFin: false,
    menufechaInicioImpugnacion: false,
    menufechaFinImpugnacion: false,
    etapas: [],
    areas: [],
    gradosEscolares: [],
    modalEtapaAreaGrado: false,
    modalMedallero: false,
    indicadorModalAbierto: false,
    pasoActual: 1,
    olimpiadaSeleccionada: null,
    etapaSeleccionada: null,
    idOlimpiadaSeleccionada: null,
    idEtapaSeleccionada: null,
    showCrudTable: false
  }),
  mounted() {
    this.$nextTick(async () => {
      // Verificar permiso para crear
      if ($Casbin && $Casbin.enforcer) {
        const { rol } = this.$storage.get('rol');
        $Casbin.enforcer
          .enforce(rol, '/etapas-areas-grados', 'create')
          .then((permitido) => {
            this.btnAgregar = permitido;
          });
        $Casbin.enforcer
          .enforce(rol, '/etapas-areas-grados', 'update')
          .then((permitido) => {
            this.btnEditar = permitido;
          });
        $Casbin.enforcer
          .enforce(rol, '/etapas-areas-grados', 'delete')
          .then((permitido) => {
            this.btnEliminar = permitido;
          });
      }
      this.olimpiadaSeleccionada = this.$storage.get('olimpiadaSeleccionada');
      if (this.olimpiadaSeleccionada !== null) {
        this.idOlimpiadaSeleccionada = this.olimpiadaSeleccionada.id;
      } else {
        this.idOlimpiadaSeleccionada = null;
      }

      this.etapaSeleccionada = this.$storage.get('etapaSeleccionada');
      if (this.etapaSeleccionada !== null) {
        this.idEtapaSeleccionada = this.etapaSeleccionada.id;
        console.log(`etapaSeleccionada: ${JSON.stringify(this.etapaSeleccionada)}`);
      } else {
        this.idEtapaSeleccionada = null;
      }

      this.url = 'etapasAreaGrado';
      await this.loadParams();
    });
  },
  methods: {
    obtenerRuta() {
      return `etapas/${this.idEtapaSeleccionada}/etapasAreaGrado`;
    },
    setCalendar() {
      this.$store.commit('openModal', 3);
    },

    async actualizarOlimpiada(idOlimpiadaSeleccionadaNueva) {
      this.olimpiadaSeleccionada = this.olimpiadas.find(item => item.id === idOlimpiadaSeleccionadaNueva);
      this.idOlimpiadaSeleccionada = idOlimpiadaSeleccionadaNueva;
      if (this.olimpiadaSeleccionada != null) {
        this.$storage.set('olimpiadaSeleccionada', this.olimpiadaSeleccionada);
      }
      this.idEtapaSeleccionada = null;
      this.etapaSeleccionada = null;

      await this.cargarEtapas();

      this.$root.$refs.CrudTable.cargarFiltro(this.definirFiltros());

      this.$root.$refs.CrudTable.borrarLista();
    },
    actualizarEtapa(idEtapaSeleccionadaNueva) {
      this.etapaSeleccionada = this.etapas.find(item => item.id === idEtapaSeleccionadaNueva);
      this.idEtapaSeleccionada = idEtapaSeleccionadaNueva;
      if (this.etapaSeleccionada != null) {
        this.btnAgregar = this.etapaSeleccionada.estado === 'CONFIGURACION_COMPETENCIA';
        this.$storage.set('etapaSeleccionada', this.etapaSeleccionada);
      }
      if (this.$root.$refs.CrudTable) {
        this.$root.$refs.CrudTable.updateUrl(this.obtenerRuta());
        this.updateList();
      }
    },

    async cargarEtapas() {
      await this.$service.get(`olimpiadas/${this.olimpiadaSeleccionada.id}/etapas`)
        .then((resultado) => {
          this.etapas = resultado && resultado.datos && resultado.datos.filas
            ? resultado.datos.filas
            : [];
          this.actualizarEtapa(this.idEtapaSeleccionada);
        });
    },

    async loadParams() {
      await this.cargarEtapas();
      await this.$service.get('areas')
        .then((resultado) => {
          this.areas = resultado && resultado.datos && resultado.datos.filas
            ? resultado.datos.filas
            : [];
        });
      await this.$service.get('grados-escolares')
        .then((resultado) => {
          this.gradosEscolares = resultado && resultado.datos && resultado.datos.filas
            ? resultado.datos.filas
            : [];
        });
      await this.$service.get('olimpiadas?limite=50&pagina=1')
        .then((resultado) => {
          this.olimpiadas = resultado && resultado.datos && resultado.datos.filas
            ? resultado.datos.filas
            : [];
        });

      this.filters = this.definirFiltros();
      this.showCrudTable = true;
      setTimeout(() => {
        this.updateList();
      }, 100);
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
          values: this.olimpiadas.map(olimpiada => ({
            text: olimpiada.nombre,
            value: olimpiada.id
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
          values: this.etapas.map(etapa => ({
            text: `${etapa.nombre} - ${etapa.estado}`,
            value: etapa.id
          })),
        },
      ];
    },

    async activar(item) {
      const message = '¿Está seguro de activar?';
      this.$confirm(message, async () => {
        const response = await this.$service.patch(
          `${this.url}/activacion/${item.id}`,
          {}
        );
        if (response.isOK) {
          this.$message.success(response.mensaje);
        } else {
          this.$message.error(
            response.mensaje
              ?? response.message
              ?? `Error al activar ${item.nombre}`
          );
        }
        this.closeModal();
        this.updateList();
      });
    },
    async inactivar(item) {
      const message = '¿Está seguro de inactivar?';
      this.$confirm(message, async () => {
        const response = await this.$service.patch(
          `${this.url}/inactivacion/${item.id}`,
          {}
        );
        if (response.isOK) {
          this.$message.success(response.mensaje);
        } else {
          this.$message.error(
            response.mensaje
              ?? response.message
              ?? `Error al inactivar ${item.nombre}`
          );
        }
        this.closeModal();
        this.updateList();
      });
    },
    reset() {
      this.form = {
        id: null,
        totalPreguntas: 0,
        preguntasCurricula: 0,
        preguntasOlimpiada: 0,
        puntosPreguntaCurricula: 0,
        puntosPreguntaOlimpiada: 0,
        duracionMinutos: 0,
        preguntasCurriculaBaja: 0,
        totalPuntajeCurriculaBaja: 0,
        preguntasCurriculaMedia: 0,
        totalPuntajeCurriculaMedia: 0,
        preguntasCurriculaAlta: 0,
        totalPuntajeCurriculaAlta: 0,
        preguntasOlimpiadaBaja: 0,
        totalPuntajeOlimpiadaBaja: 0,
        preguntasOlimpiadaMedia: 0,
        totalPuntajeOlimpiadaMedia: 0,
        preguntasOlimpiadaAlta: 0,
        totalPuntajeOlimpiadaAlta: 0,
        puntajeTotal: 0,
        estado: null,
        etapa: null,
        area: null,
        gradoEscolar: null,
        idOlimpiada: null,
        arregloPreguntasOlimpiada: [0, 0],
        arregloPreguntasCurricula: [0, 0],
        arregloPuntosOlimpiada: [0, 0],
        arregloPuntosCurricula: [0, 0],
        nroPosicionesTotal: 0,
        puntajeMinimoMedallero: null,
        nroPosicionesRural: 0,
        criterioCalificacion: false,
        criterioMedallero: false,
        puntajeMinimoClasificacion: 0,
        cantidadMaximaClasificados: 0,
      };
      this.medalleroPosiciones = [];
      this.medalleroPosicionRuraleses = [];
    },
    formatFecha(dateOriginal, formato = 'DD/MM/YYYY') {
      return dateOriginal ? this.$datetime.format(formato, dateOriginal) : '';
    },
    async itemDelete({ items }) {
      // Verificar permiso para ejecutar esta funcion
      if ($Casbin && $Casbin.enforcer) {
        const { rol } = this.$storage.get('rol');
        const permitido = await $Casbin.enforcer.enforce(
          rol,
          '/etapas-areas-grados',
          'delete'
        );
        if (!permitido) {
          this.$message.warning('No tiene permisos');
          return;
        }
      }
      const message = '¿Está seguro de eliminar este registro?';
      this.$confirm(
        message,
        async () => {
          const response = await this.$service.delete(
            `${this.url}/${items.id}`
          );
          if (response.isOK) {
            this.updateList();
            this.closeModal();
            await this.getStages();
            await this.getAreas();
            this.$message.success('Registro eliminado satisfactoriamente');
          } else {
            this.$message.error(response.message ?? response.mensaje);
          }
        },
        () => {
        }
      );
    },
    validarCantidadExamenes() {
      return (
        parseInt(this.form.totalPreguntas)
          === parseInt(this.form.preguntasCurricula)
          + parseInt(this.form.preguntasOlimpiada)
      );
    },
    validarCantidadExamenesCurriculum() {
      return (
        parseInt(this.form.preguntasCurricula)
          === parseInt(this.form.preguntasCurriculaAlta)
          + parseInt(this.form.preguntasCurriculaMedia)
          + parseInt(this.form.preguntasCurriculaBaja)
      );
    },
    validarCantidadExamenesOlimpiada() {
      return (
        parseInt(this.form.preguntasOlimpiada)
          === parseInt(this.form.preguntasOlimpiadaAlta)
          + parseInt(this.form.preguntasOlimpiadaMedia)
          + parseInt(this.form.preguntasOlimpiadaBaja)
      );
    },
    paso12() {
      if (this.$refs.form1.validate()) {
        this.pasoActual = 2;
      } else {
        this.$message.error('Complete los campos obligatorios');
      }
    },
    paso23() {
      if (this.validarCantidadExamenesCurriculum()) {
        if (this.$refs.form2.validate()) {
          this.pasoActual = 3;
        } else {
          this.$message.error('Complete los campos obligatorios');
        }
      } else {
        this.$message.error(
          'El total de preguntas de currícula debe ser la suma de la cantidad de preguntas de currícula alta media y baja'
        );
      }
    },
    paso34() {
      if (this.validarCantidadExamenesOlimpiada()) {
        if (this.$refs.form3.validate()) {
          this.pasoActual = 4;
        } else {
          this.$message.error('Complete los campos obligatorios');
        }
      } else {
        this.$message.error(
          'El total de preguntas de olimpiada debe ser la suma de la cantidad de preguntas de olimpiada alta media y baja'
        );
      }
    },
    paso4Enviar() {
      if (this.$refs.form4.validate()) {
        this.save();
      } else {
        this.$message.error('Complete los campos obligatorios');
      }
    },
    closeModal() {
      this.modalEtapaAreaGrado = false;
      this.pasoActual = 1;
      this.reset();
      this.indicadorModalAbierto = false;
    },
    async oModal({ items }) {
      if (items?.id == null) {
        this.indicadorModalAbierto = true; // indicador para que se activen watchers cuando se añade un nuevo registro
      }
      await this.abrirModal(items);

      this.indicadorModalAbierto = true; // para activar watchers
    },
    async abrirModal(items) {
      if (items && items?.id) {
        this.form = { ...items };
        this.form.idEtapa = items.etapa.id;
        this.form.idArea = items.area.id;
        this.form.idGradoEscolar = items.gradoEscolar.id;
        // Asignando para mostrar modal
        this.form.totalPreguntas = parseInt(items.totalPreguntas);
        this.form.puntosPreguntaCurricula = parseInt(
          this.form.puntosPreguntaCurricula
        );
        this.form.puntosPreguntaOlimpiada = parseInt(
          this.form.puntosPreguntaOlimpiada
        );
        this.form.puntajeTotal = parseInt(items.puntosPreguntaCurricula)
            + parseInt(items.puntosPreguntaOlimpiada);
        this.form.preguntasOlimpiada = parseInt(items.preguntasOlimpiada);

        /// Asignando preguntas de curricula
        this.form.preguntasCurricula = parseInt(items.preguntasCurricula);

        /// Preguntas
        this.form.preguntasOlimpiadaBaja = parseInt(
          this.form.preguntasOlimpiadaBaja
        );
        this.form.preguntasOlimpiadaMedia = parseInt(
          this.form.preguntasOlimpiadaMedia
        );
        this.form.preguntasOlimpiadaAlta = parseInt(
          this.form.preguntasOlimpiadaAlta
        );

        this.arregloPreguntasOlimpiada = [
          this.form.preguntasOlimpiadaBaja,
          this.form.preguntasOlimpiadaBaja + this.form.preguntasOlimpiadaMedia,
        ];

        this.form.preguntasCurriculaBaja = parseInt(
          this.form.preguntasCurriculaBaja
        );
        this.form.preguntasCurriculaMedia = parseInt(
          this.form.preguntasCurriculaMedia
        );
        this.form.preguntasCurriculaAlta = parseInt(
          this.form.preguntasCurriculaAlta
        );

        this.arregloPreguntasCurricula = [
          this.form.preguntasCurriculaBaja,
          this.form.preguntasCurriculaBaja + this.form.preguntasCurriculaMedia,
        ];

        /// Puntaje

        this.form.puntosPreguntaCurricula = parseInt(
          this.form.puntosPreguntaCurricula
        );

        this.form.totalPuntajeOlimpiadaBaja = Math.round(
          parseFloat(
            this.form.puntajeOlimpiadaBaja
                * parseInt(this.form.preguntasOlimpiadaBaja)
          )
        );
        this.form.totalPuntajeOlimpiadaMedia = Math.round(
          parseFloat(
            this.form.puntajeOlimpiadaMedia
                * parseInt(this.form.preguntasOlimpiadaMedia)
          )
        );
        this.form.totalPuntajeOlimpiadaAlta = Math.round(
          parseFloat(
            this.form.puntajeOlimpiadaAlta
                * parseInt(this.form.preguntasOlimpiadaAlta)
          )
        );

        this.arregloPuntosOlimpiada = [
          this.form.totalPuntajeOlimpiadaBaja,
          this.form.totalPuntajeOlimpiadaBaja
          + this.form.totalPuntajeOlimpiadaMedia,
        ];

        this.form.totalPuntajeCurriculaBaja = Math.round(
          parseFloat(this.form.puntajeCurriculaBaja)
            * parseInt(this.form.preguntasCurriculaBaja)
        );
        this.form.totalPuntajeCurriculaMedia = Math.round(
          parseFloat(this.form.puntajeCurriculaMedia)
            * parseInt(this.form.preguntasCurriculaMedia)
        );
        this.form.totalPuntajeCurriculaAlta = Math.round(
          parseFloat(this.form.puntajeCurriculaAlta)
            * parseInt(this.form.preguntasCurriculaAlta)
        );

        this.arregloPuntosCurricula = [
          this.form.totalPuntajeCurriculaBaja,
          this.form.totalPuntajeCurriculaBaja
          + this.form.totalPuntajeCurriculaMedia,
        ];

        this.form.idOlimpiada = this.form.etapa.olimpiada.id;

        /// Medallero

        this.medalleroPosiciones = this.form.medalleroPosiciones ?? [];
        this.medalleroPosiciones = this.medalleroPosiciones.map((posicion) => {
          posicion.key = posicion.ordenGalardon.toString();
          return { ...posicion };
        });
        this.medalleroPosiciones.sort(
          (a, b) => parseFloat(a.ordenGalardon) - parseFloat(b.ordenGalardon)
        );

        this.nroPosicionesTotal = this.medalleroPosiciones.length;

        this.medalleroPosicionRurales = this.form.medalleroPosicionRurales ?? [];
        this.medalleroPosicionRurales = this.medalleroPosicionRurales.map(
          (posicion) => {
            posicion.key = posicion.orden.toString();
            return { ...posicion };
          }
        );
        this.medalleroPosicionRurales.sort(
          (a, b) => parseFloat(a.orden) - parseFloat(b.orden)
        );

        this.nroPosicionesRural = this.medalleroPosicionRurales.length;
      } else {
        this.reset();
        this.form.idEtapa = this.idEtapaSeleccionada;
        this.form.totalPreguntas = 20;
        this.form.puntajeTotal = 100;
        this.form.idOlimpiada = this.idOlimpiadaSeleccionada;

        this.medalleroPosiciones = [];
        this.nroPosicionesTotal = this.medalleroPosiciones.length;
        this.medalleroPosicionRurales = [];
        this.nroPosicionesRural = this.medalleroPosicionRurales.length;
      }
      this.modalEtapaAreaGrado = true; // para activar watchers
    },

    deleteOption(letter) {
      const index = this.medalleroPosiciones.findIndex(
        (option) => option.key === letter
      );
      this.medalleroPosiciones.splice(index, 1);
    },
    deleteOptionRural(letter) {
      const index = this.medalleroPosicionRurales.findIndex(
        (option) => option.key === letter
      );
      this.medalleroPosicionRurales.splice(index, 1);
    },
    setOption({
      key,
      id,
      text,
      ordenGalardon,
      denominativo,
      orden,
      minimo,
      maximo,
      notaMinima,
    }) {
      this.medalleroPosiciones.filter((option) => {
        if (option.key === key) {
          option.id = id ?? option.id;
          option.text = text ?? option.text;
          option.ordenGalardon = ordenGalardon ?? option.ordenGalardon;
          option.denominativo = denominativo ?? option.denominativo;
          option.orden = orden ?? option.orden;
          option.minimo = minimo ?? option.minimo;
          option.maximo = maximo ?? option.maximo;
          option.notaMinima = notaMinima ?? option.notaMinima;
        }
      });
    },
    setOptionRural({
      key,
      id,
      text,
      ordenGalardon,
      denominativo,
      orden,
      posicionMinima,
      posicionMaxima,
      notaMinima,
    }) {
      this.medalleroPosicionRurales.filter((option) => {
        if (option.key === key) {
          option.id = id ?? option.id;
          option.text = text ?? option.text;
          option.ordenGalardon = ordenGalardon ?? option.ordenGalardon;
          option.denominativo = denominativo ?? option.denominativo;
          option.orden = orden ?? option.orden;
          option.posicionMinima = !isNaN(posicionMinima)
            ? posicionMinima
            : option.posicionMinima;
          option.posicionMaxima = !isNaN(posicionMaxima)
            ? posicionMaxima
            : option.posicionMaxima;
          option.notaMinima = notaMinima;
        }
      });
    },
    addOption() {
      this.medalleroPosiciones = this.medalleroPosiciones.map((option) => {
        const obj = {};
        obj.key = option.key.toString();
        obj.id = option.id.toString();
        obj.text = option.text;
        obj.ordenGalardon = option.ordenGalardon;
        obj.denominativo = option.denominativo;
        obj.orden = option.orden;
        obj.minimo = option.minimo;
        obj.maximo = option.maximo;
        obj.notaMinima = option.notaMinima;

        return obj;
      });
      this.medalleroPosiciones.push({
        key: (this.medalleroPosiciones.length + 1).toString(),
        text: '',
        ordenGalardon: (this.medalleroPosiciones.length + 1).toString(),
        denominativo: '',
        orden: (this.medalleroPosiciones.length + 1).toString(),
        minimo: '',
        maximo: '',
        notaMinima: null,
      });
    },
    addOptionRural() {
      if (
        this.medalleroPosiciones.length >= this.medalleroPosicionRurales.length + 1
      ) {
        this.medalleroPosicionRurales = this.medalleroPosicionRurales.map(
          (option) => {
            const obj = {};
            obj.key = option.key;
            obj.id = option.id;
            obj.text = option.text;
            obj.ordenGalardon = option.ordenGalardon;
            obj.denominativo = option.denominativo;
            obj.orden = option.orden;
            obj.posicionMinima = option.posicionMinima;
            obj.posicionMaxima = option.posicionMaxima;
            obj.notaMinima = option.notaMinima;

            return obj;
          }
        );
        this.medalleroPosicionRurales.push({
          key: (this.medalleroPosicionRurales.length + 1).toString(),
          text: '',
          ordenGalardon: (this.medalleroPosicionRurales.length + 1).toString(),
          denominativo: '',
          orden: (this.medalleroPosicionRurales.length + 1).toString(),
          posicionMinima: (this.medalleroPosicionRurales.length + 1).toString(),
          posicionMaxima: 0,
          notaMinima: null,
        });
      } else {
        this.$message.error(
          'La cantidad de medallero en posición rural, no debe ser mayor a la cantidad del medallero'
        );
      }
    },

    /**
     * @function save
     * @description Esta funcion esta creada para guardar en la BD
     * @author dbarra@agetic.gob.bo
     */
    async save() {
      if (
        this.$refs.form1.validate()
          && this.$refs.form2.validate()
          && this.$refs.form3.validate()
          && this.$refs.form4.validate()
      ) {
        this.form.puntajeCurriculaBaja = this.form.totalPuntajeCurriculaBaja
            / this.form.preguntasCurriculaBaja || 0;
        this.form.puntajeCurriculaMedia = this.form.totalPuntajeCurriculaMedia
            / this.form.preguntasCurriculaMedia || 0;
        this.form.puntajeCurriculaAlta = this.form.totalPuntajeCurriculaAlta
            / this.form.preguntasCurriculaAlta || 0;

        this.form.puntajeOlimpiadaBaja = this.form.totalPuntajeOlimpiadaBaja
            / this.form.preguntasOlimpiadaBaja || 0;
        this.form.puntajeOlimpiadaMedia = this.form.totalPuntajeOlimpiadaMedia
            / this.form.preguntasOlimpiadaMedia || 0;
        this.form.puntajeOlimpiadaAlta = this.form.totalPuntajeOlimpiadaAlta
            / this.form.preguntasOlimpiadaAlta || 0;

        delete this.form.estado;

        const data = { ...({}, this.form) };

        // convirtiendo a string
        data.preguntasCurricula = `${this.form.preguntasCurricula}`;
        data.preguntasOlimpiada = `${this.form.preguntasOlimpiada}`;
        data.puntosPreguntaCurricula = `${this.form.puntosPreguntaCurricula}`;
        data.puntosPreguntaOlimpiada = `${this.form.puntosPreguntaOlimpiada}`;
        data.preguntasCurriculaBaja = `${this.form.preguntasCurriculaBaja}`;
        data.puntajeCurriculaBaja = `${this.form.puntajeCurriculaBaja}`;
        data.preguntasCurriculaMedia = `${this.form.preguntasCurriculaMedia}`;
        data.puntajeCurriculaMedia = `${this.form.puntajeCurriculaMedia}`;
        data.preguntasCurriculaAlta = `${this.form.preguntasCurriculaAlta}`;
        data.puntajeCurriculaAlta = `${this.form.puntajeCurriculaAlta}`;
        data.preguntasOlimpiadaBaja = `${this.form.preguntasOlimpiadaBaja}`;
        data.puntajeOlimpiadaBaja = `${this.form.puntajeOlimpiadaBaja}`;
        data.preguntasOlimpiadaMedia = `${this.form.preguntasOlimpiadaMedia}`;
        data.puntajeOlimpiadaMedia = `${this.form.puntajeOlimpiadaMedia}`;
        data.preguntasOlimpiadaAlta = `${this.form.preguntasOlimpiadaAlta}`;
        data.puntajeOlimpiadaAlta = `${this.form.puntajeOlimpiadaAlta}`;
        data.totalPreguntas = `${this.form.totalPreguntas}`;
        data.duracionMinutos = `${this.form.duracionMinutos}`;

        /// Asisgnando campos extra
        data.medalleroPosicion = this.medalleroPosiciones;
        data.nroPosicionesTotal = this.medalleroPosiciones.length;
        data.medalleroPosicionRural = this.medalleroPosicionRurales;
        data.nroPosicionesRural = this.medalleroPosicionRurales.length;

        if (data.id) {
          const response = await this.$service.patch(
            `${this.url}/${data.id}`,
            data
          );
          if (response.isOK) {
            this.closeModal();
            this.updateList();
            this.$message.success('Se actualizó el registro correctamente');
          } else {
            this.$message.error(
              response.mensaje ?? 'Ocurrio un error al tratar de enviar la data'
            );
          }
        } else {
          delete data.id;
          const response = await this.$service.post(this.url, data);
          if (response.isOK) {
            console.info(`Exito: ${response}`);
            this.closeModal();
            this.updateList();
            this.$message.success('El registro fue agregado correctamente');
          } else {
            console.info(`Error: ${response}`);
            this.$message.error(
              response.mensaje ?? 'Ocurrio un error al tratar de enviar la data'
            );
          }
        }
      } else {
        this.$message.error('Complete los campos obligatorios');
      }
    },
  },
  components: {
    vOpcionesMedallero,
    AppDialog,
    CrudTable,
    vIconComponent,

    calendar,
  },
};
</script>
<style lang="scss">
.dark-is-selected {
  background: #00516d !important;
}

.light-is-selected {
  background: #dbe9f5 !important;
}
</style>
