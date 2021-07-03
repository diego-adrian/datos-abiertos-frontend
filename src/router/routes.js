import { $Casbin } from '@/plugins/casbin';

const getStorage = (key) => {
  const appName = process.env.VUE_APP_SITENAME || 'app';
  const data = window.localStorage.getItem(`${appName}_${key}`);
  try {
    return data ? JSON.parse(data) : null;
  } catch (Exception) {
    return data;
  }
};

const isAllowed = (to, from, next) => {
  const { rol } = getStorage('rol');
  const user = getStorage('user');
  if ($Casbin.enforcer && rol) {
    const [sub, obj, act] = [rol || user, to.path, 'read'];
    $Casbin.enforcer.enforce(sub, obj, act)
      .then((permitido) => {
        if (permitido) {
          next();
        } else {
          next({
            path: '/403',
            replace: true
          });
        }
      })
      .catch(() => {
        next(false);
      });
  } else {
    const tmpInt = window.setInterval(() => {
      if ($Casbin.enforcer && rol) {
        window.clearInterval(tmpInt);
        $Casbin.enforcer.enforce(rol, to.path, 'read')
          .then((permitido) => {
            if (permitido) {
              next();
            } else {
              next({
                path: '/403',
                replace: true
              });
            }
          });
      }
    }, 100);
  }
};

const routes = [
  {
    path: '/',
    name: 'root',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '../components/auth/Login.vue')
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import(/* webpackChunkName: "home" */ '../components/home/Home')
  },
  {
    path: '/calificacion-publicacion',
    name: 'Calificacion Publicacion',
    component: () => import(/* webpackChunkName: "home" */ '../components/calificacion/index.vue')
  },
  {
    path: '/politicas',
    name: 'Políticas',
    component: () => import(/* webpackChunkName: "politicas" */ '../components/politicas'),
    beforeEnter: isAllowed
  },
  {
    path: '/usuarios',
    name: 'Usuarios',
    component: () => import(/* webpackChunkName: "usuarios" */ '../components/usuarios'),
    beforeEnter: isAllowed
  },
  {
    path: '/perfil',
    name: 'Perfil',
    component: () => import(/* webpackChunkName: "perfil" */ '../components/usuarios/Perfil.vue'),
    beforeEnter: isAllowed
  },
  {
    path: '/entidades',
    name: 'Entidades',
    component: () => import(/* webpackChunkName: "entidades" */ '../components/entidades'),
    beforeEnter: isAllowed
  },
  {
    path: '/competencias',
    name: 'Competencias',
    component: () => import(/* webpackChunkName: "olimpiadas" */ '../components/competencias'),
    beforeEnter: isAllowed
  },
  {
    path: '/olimpiadas',
    name: 'Olimpiadas',
    component: () => import(/* webpackChunkName: "olimpiadas" */ '../components/olimpiada'),
    beforeEnter: isAllowed
  },
  {
    path: '/banco-preguntas',
    name: 'Banco Preguntas',
    component: () => import(/* webpackChunkName: "olimpiadas" */ '../components/bancoPreguntas'),
    beforeEnter: isAllowed
  },
  {
    path: '/parametros',
    name: 'Parámetros',
    component: () => import(/* webpackChunkName: "parametros" */ '../components/parametros'),
    beforeEnter: isAllowed

  },
  {
    path: '/areas',
    name: 'Areas',
    component: () => import(/* webpackChunkName: "areas" */ '../components/areas'),
  },
  {
    path: '/grados-escolares',
    name: 'Grados de escolaridad',
    component: () => import(/* webpackChunkName: "gradoEscolaridad" */ '../components/grado-escolaridad'),
  },
  {
    path: '/etapas',
    name: 'Etapas',
    component: () => import(/* webpackChunkName: "etapas" */ '../components/etapas'),
  },
  {
    path: '/distritos',
    name: 'Distritos',
    component: () => import(/* webpackChunkName: "distritos" */ '../components/distritos'),
  },
  {
    path: '/unidades-educativas',
    name: 'Unidades Educativas',
    component: () => import(/* webpackChunkName: "unidadesEducativas" */ '../components/unidadesEducativas'),
  },
  {
    path: '/inscripciones',
    name: 'Inscripciones',
    component: () => import(/* webpackChunkName: "bancoPreguntas" */ '../components/inscripciones'),
  },
  {
    path: '/etapas-areas-grados',
    name: 'Etapas por área y por grado',
    component: () => import(/* webpackChunkName: "entidades" */ '../components/etapas-areas-grados'),
  },
  {
    path: '/medalleros-generar',
    name: 'Medalleros Generar',
    component: () => import(/* webpackChunkName: "home" */ '../components/medalleros')
  },
  {
    path: '/404',
    name: 'notfound',
    component: () => import(/* webpackChunkName: "notFound" */ '../layout/AppNotFound.vue')
  },
  {
    path: '/403',
    name: 'forbidden',
    component: () => import(/* webpackChunkName: "forbidden" */ '../layout/AppForbidden.vue')
  },
  {
    path: '/desbloqueo',
    name: 'desbloqueo',
    component: () => import(/* webpackChunkName: "desbloqueo" */ '../layout/AppDesbloqueo.vue')
  },
  {
    path: '/examen-offline',
    name: 'Pruebas offline',
    component: () => import(/* webpackChunkName: "desbloqueo" */ '../components/examenOffline')
  },
  {
    path: '/impugnacion',
    name: 'Impugnación de preguntas',
    component: () => import(/* webpackChunkName: "desbloqueo" */ '../components/impugnacion')
  },

  {
    path: '*',
    redirect: '/404'
  }
];

export default routes;
