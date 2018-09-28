<template>
  <div id="app">
    <section id="home">
        <div class="overlay"></div>
          <div class="container">
               <div class="row">
                    <div class="col-md-12 col-sm-12">
                         <div class="home-info">
                           <div>
                             <ul class="navigator">
                                <li :class="route.isNow ? 'active' : ''" v-for="route in navs" :key="route.name">
                                  <router-link :to="route.path"><i :class="'fa ' + route.icon"></i> {{route.name}} </router-link>
                                </li>
                             </ul>
                           </div>
                           <router-view />
                         </div>
                    </div>
               </div>
          </div>
     </section>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import { network } from './config';

const requiredFields = { accounts: [network] };

export default {
  name: 'app',
  data: () => ({}),
  components: {
  },
  created() {
    // @TODO: replace with Scatter JS
    document.addEventListener('scatterLoaded', () => {
      console.log('Scatter Loaded');
      this.handleScatterLoaded();
    });
  },
  methods: {
    ...mapActions(['initScatter', 'setIdentity']),
    handleScatterLoaded() {
      const { scatter } = window;
      this.initScatter(scatter);
      this.requestId();
    },
    async requestId() {
      await this.suggestNetworkSetting();
      const identity = await this.scatter.getIdentity(requiredFields);
      this.setIdentity(identity);
    },
    async forgetId() {
      await this.scatter.forgetIdentity();
      this.setIdentity(null);
    },
    async suggestNetworkSetting() {
      try {
        await this.scatter.suggestNetwork(network);
      } catch (error) {
        console.info('User canceled to suggestNetwork');
      }
    },
  },
  computed: {
    ...mapState(['identity', 'scatter', 'eos', 'account']),
    ...mapGetters(['account']),
    currentViewName() {
      const { name } = this.$route;
      return name;
    },
    navs() {
      const name = this.currentViewName;
      const routes = [
        {
          path: '/',
          icon: 'fa-home',
          name: 'Home',
        }, {
          path: '/buy',
          name: 'Buy',
          icon: 'fa-sign-in',
        },
        {
          path: '/sell',
          name: 'Sell',
          icon: 'fa-sign-out',
        },
        {
          path: '/orders',
          icon: 'fa-exchange',
          name: 'Orders',
        },
        {
          path: '/help',
          icon: 'fa-question',
          name: 'Help',
        }];
      return routes.map(route => Object.assign(route, { isNow: route.name === name }));
    },
  },
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 1rem;
}
</style>
