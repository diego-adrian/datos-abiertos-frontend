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
    path: '*',
    redirect: '/404'
  }
];

export default routes;
