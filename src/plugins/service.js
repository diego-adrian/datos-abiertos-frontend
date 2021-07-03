import axios from 'axios';
import Auth from '@/components/auth/mixins/auth';
import router from '@/router';
import Store from '@/store';

const protocol = window.location.protocol.replace(':', '');
const PATERN_HOST = protocol === 'https' ? /(https:\/\/|www\.)\S+/i : /(http:\/\/|www\.)\S+/i;

axios.defaults.withCredentials = true;

const request = axios.create({
  withCredentials: true
});

export default {
  Store,
  router,
  install: (Vue, config) => {
    // Config
    const apiUrl = config && config.apiUrl ? config.apiUrl : '';
    const authToken = config && config.authToken ? config.authToken : 'Bearer';
    const baseServer = config && config.baseServer ? config.baseServer : '';
    // Plugins
    const instance = new Vue({
      mixins: [Auth]
    });

    const Util = instance.$util;
    const Progress = instance.$progress;
    const Message = instance.$message;
    const Storage = instance.$storage;
    const Confirm = instance.$confirm;
    const Waiting = instance.$waiting;

    const getUrl = (url, id) => {
      id = typeof id === 'string' || typeof id === 'number' ? `${id}` : '';
      if (url && url[url.length - 1] !== '/' && id.length > 1) {
        id = `/${id}`;
      }
      return PATERN_HOST.test(url) ? url + id : baseServer + url + id;
    };

    const filterResponse = response => {
      Progress.close();
      if (response && !response.hasOwnProperty('isOK')) response.isOK = true;
      return response;
    };

    const _http = (method, url, data) => {
      Progress.start();
      url = getUrl(url, data);
      if (process.env.VUE_APP_DEBUG_MODE && process.env.NODE_ENV === 'development') {
        console.info('URL:', method.toUpperCase(), url);
        if (data) {
          console.info('Params:', JSON.stringify(data));
        }
      }

      const setting = {
        method,
        url
      };

      if (typeof data === 'object' && Object.keys(data).length) {
        setting.data = data;
      }

      // Set token in headers
      if (Storage.exist('token')) {
        setting.headers = {
          Authorization: `${authToken} ${Storage.get('token')}`
        };
      }

      return request(setting)
        .then(response => filterResponse(response.data))
        .catch(error => handlingErrors(error));
    };
    const _httpConfig = (config) => {
      Progress.start();

      if (process.env.VUE_APP_DEBUG_MODE && process.env.NODE_ENV === 'development') {
        if (config) {
          console.info('config:', config.url);
        }
      }

      return request(config)
        .then(response => filterResponse(response.data))
        .catch(error => handlingErrors(error));
    };

    const Services = {
      options(url) {
        return _http('get', `${url}/fields`);
      },

      get(url, id) {
        return _http('get', url, id);
      },

      post(url, data) {
        return _http('post', url, data);
      },

      requestWithConfig(config) {
        return _httpConfig(config);
      },

      put(url, data) {
        return _http('put', url, data);
      },

      patch(url, data) {
        return _http('patch', url, data);
      },

      delete(url, id) {
        return _http('delete', url, id);
      },

      remove(url, id) {
        return this.delete(url, id);
      },

      list(url, query, filtro) {
        query = query ? '?' + Util.serialize(query) : '?';
        filtro = Array.isArray(filtro) && filtro.length > 0 ? '&filtro=' + filtro.join(',') : '';
        return _http('get', url + query + filtro);
      },

      save(url, data) {
        return _http(data.id ? 'put' : 'post', url, data);
      },

      file(
        url,
        type = 'application/pdf',
        forceDownload = false,
        responseData = true,
        method = 'GET',
        data = {}
      ) {
        try {
          return new Promise(async (resolve, reject) => {
            const response = await request({
              url,
              baseURL: baseServer,
              method,
              data,
              timeout: 10000,
              withCredentials: false,
              headers: {
                Authorization: `${authToken} ${Storage.get('token')}`
              }
            });

            if (!response) {
              reject(new Error('Error al tratar de procesar el archivo'));
            }
            const file = new window.Blob([response.data], {
              type
            });
            const fileURL = window.URL.createObjectURL(file);
            const link = document.createElement('a');
            link.href = fileURL;
            link.setAttribute(
              'download',
              `${new Date().toLocaleDateString()}.${type.split('/')[1]}`
            );
            if (forceDownload) {
              document.body.appendChild(link);
              link.click();
              resolve('Archivo exitosamente descargado');
            } else if (responseData) {
              resolve(response.data);
            } else {
              Confirm(
                '¿Desea descargar el archivo?',
                () => {
                  document.body.appendChild(link);
                  link.click();
                  resolve('Archivo exitosamente generado');
                },
                () => {
                  resolve(response.data);
                },
                'Descargar',
                'No descargar',
                600
              );
            }
            URL.revokeObjectURL(fileURL);
          });
        } catch (err) {
          Message.error(err.message);
        }
      }
    };

    const handlingErrors = error => {
      Progress.close();
      if (error.response) {
        const { data } = error.response;
        if (data?.datos?.errores?.length > 0) {
          let errores = '<ul>';
          for (const msjError of data.datos.errores) {
            errores += `<li>${msjError}</li>`;
          }
          errores += '</ul>';
          data.mensaje = `${data.mensaje} ${errores}`;
        }
        throw data;
      } else if (error.message) {
        if (error.message === 'Network Error') {
          Message.error('Network Error');
        } else {
          Message.error(error.message);
        }
      } else {
        Message.error('Network Error');
      }
    };

    // Add a response interceptor
    request.interceptors.response.use(
      response => response,
      error => {
        if (error.message === 'Network Error') {
          if (window.location.hash !== '#/login') {
            Message.error('Ocurrio un error');
            Storage.removeAll();
            router.push('/login');
            return;
          }
        }
        if (error.response) {
          Store.commit('setMain', true);
          if ([400, 500, 412].includes(error.response.status)) {
            const message = error.response.data.mensaje || error.message || 'Ocurrio un error';
            Waiting(false);
            Message.error(message);
          }
          if (error.response.status === 401) {
            if (window.location.hash !== '#/login') {
              Message.error('Terminó la sesión');
              instance.logout(router, Store);
            }
          }
          if (error.response.status === 402) {
            const message = error.response.data.mensaje;
            Message.error(message);
          }
          if (error.response.status === 403) {
            Store.commit('setState403', true);
            router.push('/404');
          }
        }
        // Adicionando la propiedad isError para indicar que es de tipo ERROR
        error.response.data.isOK = false;
        return error.response;
      }
    );

    // Interceptor para renovar access token en request
    request.interceptors.request.use(
      async config => {
        if (!config.url.includes('/auth') && !config.url.includes('/logout') && !config.url.includes('/perfil') && config.headers?.Authorization) {
          if (isTokenExp()) { // renovamos access token
            try {
              const reqToken = axios.create({
                withCredentials: true
              });
              const resp = await reqToken.post(getUrl('token'), {});
              const response = resp.data;
              const { datos } = response;
              if (datos?.access_token) {
                Storage.set('token', datos.access_token);
                const payload = getPayload(datos.access_token);
                const actualDate = Math.round(new Date().getTime() / 1000);
                Storage.set('ttl', payload.exp - payload.iat);
                Storage.set('t', actualDate);
                config.headers.Authorization = `${authToken} ${Storage.get('token')}`;
              }
            } catch (error) {
              // handlingErrors(error);
              // const cancelToken = axios.CancelToken.source();
              // config.cancelToken = cancelToken.token;
              console.error('error', error.message);
              Message.error('Terminó la sesión');
              instance.logout(router, Store);
            }
          }
        }
        return config;
      },
      error => Promise.reject(error)
    );

    const getPayload = (token) => {
      const jwtStr = token.split('.')[1];
      return JSON.parse(atob(jwtStr));
    };

    const isTokenExp = () => {
      const actualDate = Math.round(new Date().getTime() / 1000);
      const ttl = Storage.get('ttl');
      const t = Storage.get('t');

      return actualDate - t > ttl;
    };

    Vue.prototype.$service = Services;
    Vue.prototype.$http = request;
    Vue.prototype.$apiUrl = apiUrl;
    Vue.prototype.$authToken = authToken;
    Vue.prototype.$baseServer = baseServer;
  }
};
