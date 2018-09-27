<template>
  <div id="app">
    <el-container>
        <el-header>
          <CustomHeader/>
        </el-header>
        <el-main>
          <el-row :gutter="10">
            <el-col :span="6" :xs="24">
              <el-row :gutter="10">
                <el-col :xs="24" :span="24">
                  <Dashboard />
                </el-col>
                <el-col :xs="0" :span="24">
                  <HistoryPanel />
                </el-col>
              </el-row>
              
            </el-col>
            <el-col :span="12" :xs="24">
              <CrowdSaleStat/>
              <router-view />
            </el-col>
            <el-col :span="6" :xs="0" style="color: #FFF ;background: #555; height: 12rem">
              Coming soon
            </el-col>
          </el-row>

        </el-main>
        <el-footer>
            <CustomFooter/>
        </el-footer>
    </el-container>


  </div>
</template>

<script>
import { Dashboard, CrowdSaleStat, Footer, Header } from './components';
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex';
import { network } from './config';

const requiredFields = { accounts: [network] };

export default {
  name: 'app',
  data: () => ({}),
  components: {
    Dashboard,
    CustomFooter: Footer,
    CustomHeader: Header,
    CrowdSaleStat,
    HistoryPanel: () => import(/* webpackChunkName: "ReservationHistory" */ './components/ReservationHistory'),
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
