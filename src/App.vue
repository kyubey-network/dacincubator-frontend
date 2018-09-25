<template>
  <div id="app">
    <el-container>
        <el-header>
          <CustomHeader/>
        </el-header>
        <el-main>
            <Dashboard />
            <router-view />
        </el-main>
        <el-footer>
            <CustomFooter/>
        </el-footer>
    </el-container>


  </div>
</template>

<script>
import { Dashboard, Footer, Header } from './components';
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex';
import { network } from './config';

const requiredFields = { accounts: [network] };

export default {
  name: 'app',
  data: () => ({}),
  components: { Dashboard, CustomFooter: Footer, CustomHeader: Header },
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
    async buy() {
      const amountOfEOS = prompt('请输入你要购少 KBY 等值的 EOS？');
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
    // account() {
    //   return this.identity.accounts.find(({ blockchain }) => blockchain === 'eos');
    // },
    // username() {
    //   const { account } = this;
    //   return account ? account.name : null;
    // }
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
  margin-top: 60px;
}
</style>
