# Ministerio de Educación - Olimpiadas - Manual de instalación

## Requisitos

Para continuar con la instalación del proyecto se necesita contar con las siguientes instalaciones ya realizadas:

1. [Node y Npm](https://github.com/nodesource/distributions/blob/master/README.md): Considerar Nodejs 10.17 en adelante
2. [NVM](https://github.com/nvm-sh/nvm) Se recomienda NVM solo para ambientes de DESARROLLO.

## Configuración

La configuración de las variables de entorno se encuentran en el archivo .env.sample, con la cual se debe renombrar con .env

```bash
cp .env.sample .env
```

El anterior archivo debe contener las siguientes variables cuyos valores van a variar de acuerdo al ambiente. EJEMPLO:

```bash
VUE_APP_SITENAME=frontend_base
VUE_APP_FRONTEND=http://localhost:8079
VUE_APP_API_CIUDADANIA=http://localhost:2999
VUE_APP_API_URL=http://localhost:2999/api/v1/
VUE_APP_BASE_SERVER=http://localhost:2999/api/
VUE_APP_DEBUG_MODE=true
VUE_APP_PUBLIC_PATH=/
VUE_APP_AUTH_TOKEN=Bearer
```

- **VUE_APP_SITENAME**: Es el nombre del sitio, este nombre ayudara a gestionar la creación de cookies, almacenamiento en el storage, etc.
- **VUE_APP_FRONTEND**: Es la ruta expuesta para el frontend por ejemplo https://test.agetic.gob.bo/frontend_base
- **VUE_APP_API_CIUDADANIA**: Ruta al cual se accede para autenticarnos, desloguearnos con ciudadanía digital
- **VUE_APP_API_URL**: Ruta expuesta del backend para realizar todas los intercambios de informacion con el frontend
- **VUE_APP_BASE_SERVER**: Ruta base que manejara el backend
- **VUE_APP_DEBUG_MODE**: Para habilitar debug en modo produccion
- **VUE_APP_PUBLIC_PATH**: Para indicar si se tiene un subdominio o no, por ejemplo si se tiene subdominio tendra que ser de la siguiente manera /[MI_SUBDOMINIO]/
- **VUE_APP_AUTH_TOKEN**: Formato para enviar el token. Generalmente es *Bearer*.


## Instalando el proyecto

Siga los siguientes pasos:

### 1. Instalando dependencias

``` bash
npm install
```
### Iniciar en modo desarrollo

```
npm run start
```

### Iniciar para PRODUCCIÓN

1. Exportar las variables para producción, Seteando el ambiente:
```
export NODE_ENV=production
```

2. Seteando las  urls:

```
export VUE_APP_FRONTEND=[URL_PRODUCCION_FRONTEND]
export VUE_APP_API_URL=[URL_PRODUCCION_BACKEND]
export VUE_APP_BASE_SERVER=[URL_PRODUCCION_BACKEND]
export VUE_APP_PUBLIC_PATH=[SUBDOMINIO]
```

EJEMPLO:

```sh
export VUE_APP_FRONTEND=https://test.agetic.gob.bo/frontend_base
export VUE_APP_API_URL=https://test.agetic.gob.bo/backend_base/api/v1/
export VUE_APP_BASE_SERVER=https://test.agetic.gob.bo/backend_base/api/
export VUE_APP_PUBLIC_PATH=/misubdominio
```

3. Compilar para produccion

```
npm run build
```

4. Copiar el contenido generado en la carpeta `dist` a la carpeta de despliegue. Ej. apache, nginx, etc.
