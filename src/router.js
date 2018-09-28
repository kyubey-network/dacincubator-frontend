import Vue from 'vue';
import Router from 'vue-router';
// import Home from './views/Home.vue';
import { Trade } from './views';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Logo',
      redirect: { name: 'Home' }
    },
    {
      path: '/home',
      name: 'Home',
      redirect: { name: 'IBOCrowdSale' }
    },
    {
      path: '/IBO',
      name: 'IBOCrowdSale',
      component: Trade
    },
  ],
});
