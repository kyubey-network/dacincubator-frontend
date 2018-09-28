import Vue from 'vue';
import Router from 'vue-router';
// import Home from './views/Home.vue';
import { Home, Buy, Sell, Orders, Help } from './views';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/buy',
      name: 'Buy',
      component: Buy,
    },
    {
      path: '/sell',
      name: 'Sell',
      component: Sell,
    },
    {
      path: '/orders',
      name: 'Orders',
      component: Orders,
    },
    {
      path: '/help',
      name: 'Help',
      component: Help,
    },
  ],
});
