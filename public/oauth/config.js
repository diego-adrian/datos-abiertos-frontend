const config = {
  backendApi: 'http://localhost:3000',
  subdomain: 'http://localhost:8080', // subdominio donde está instalado el frontend si está en la raiz se colocar vacio
  page: '', // pagina que a la que redireccionara
  appName: 'minedu_frontend_admin' // prefijo para los localstorage del sistema
};

config.urlLogin = `${config.subdomain}/`; // Ruta del login del frontend
config.urlHome = `${config.subdomain}/`; // Ruta del frontend
config.urlCiudadaniaCallback = `${config.backendApi}/api/ciudadania-callback`; // Ruta de autorización en el backend

// Array de items de localstorage que no se quieren que se borren cuando se cierre sesión en ciudadanía
// EJEMPLO:
// config.exceptions = [ config.appName + '_ejemplo' ];
config.exceptions = [];
