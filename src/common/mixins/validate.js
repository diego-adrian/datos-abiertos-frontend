export default {
  methods: {
    $validate (rules = []) {
      const validations = [];
      for (const i in rules) {
        if (rules[i] === 'required') {
          validations.push(this.$validateRequired);
        }
        if (rules[i] === 'email') {
          validations.push(this.$validateEmail);
        }
        if (rules[i] === 'url') {
          validations.push(this.$validateUrl);
        }
        if (rules[i] === 'nro_documento') {
          validations.push(this.$validateNroDocumento);
        }
        if (rules[i] === 'caracteres') {
          validations.push(this.$validateCharacters);
        }
        if (rules[i] === 'celular') {
          validations.push(this.$validateCelular);
        }
        if (rules[i] === 'alfanumerico') {
          validations.push(this.$validateAlfanumerico);
        }
        if (rules[i] === 'numeros') {
          validations.push(this.$ValidateNumero);
        }
      }
      return validations;
    },
    $validateRequired (v) {
      return !!v || 'Este campo es requerido';
    },
    $validateEmail (v) {
      return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || !v || 'El formato de correo no es válido';
    },
    $validateUrl (v) {
      return /[-a-zA-Z0-9@:%_+.~#?&/=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_+.~#?&/=]*)?/.test(v) || 'El formato de la url no es válido';
    },
    $validateNroDocumento (v) {
      return /^(([eE]{1}-)?[0-9](-[0-9a-zA-Z]{2})?)+$/.test(v) || 'Debe ingresar un documento válido';
    },
    $validateCharacters (v) {
      return /^[A-Za-zÁ-ÖÚ-öú-ÿñÑ'\s]+$/.test(v) || v === '' || 'Existen caracteres no válidos.';
    },
    $validateCelular (v) {
      return /^[6-7]{1}[0-9]{7}$/.test(v) || v === '' || v === null || 'No es un número de celular válido';
    },
    $validateAlfanumerico (v) {
      // return /^[A-ZÀ-úa-z0-9 _-ÿ\u00f1\u00d1",.:-]+(\s*[a-zA-Z0-9À-ÿ\u00f1\u00d1",.:-]*)*[a-zA-Z0-9À-ÿ\u00f1\u00d1",.:-]+$/.test(v) || v === '' || v === null || 'Existen caracteres alfanuméricos no válidos.';
      return /^[A-Za-z0-9ñÑáéíóú\s]+$/g.test(v) || v === '' || v === null || 'Existen caracteres alfanuméricos no válidos.';
    },
    $ValidateNumero (v) {
      return /^[0-9]\d*$/.test(v) || v === '' || v === null || 'Existen caracteres no válidos.';
    }
  }
};
