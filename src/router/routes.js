const routes = [
  {
    path: '/',
    name: 'root',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '../components/home/Home')
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
