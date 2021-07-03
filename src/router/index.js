import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './routes';

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => { console.info(err.message); });
};

Vue.use(VueRouter);

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
