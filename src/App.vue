<template>
  <div id="app">
    <el-container>
        <el-header>
          <CustomHeader/>
        </el-header>
        <el-main>
          <el-row :gutter="10">
            <!-- Left Panel -->
            <el-col :span="6" :xs="24">
              <LeftPanel />
            </el-col>
            <el-col :span="12" :xs="24">
              <!-- Panel in the middle  -->
              <CrowdSaleStat/>
              <router-view />
            </el-col>
            <el-col :span="6" :xs="0" style="height: 12rem">
              <RightPanel />
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
import { mapState, mapActions, mapGetters } from 'vuex';
import { LeftPanel, CrowdSaleStat, Footer, Header, RightPanel } from './components';
import { network } from './config';

const requiredFields = { accounts: [network] };

export default {
  name: 'app',
  data: () => ({}),
  components: {
    LeftPanel,
    CustomFooter: Footer,
    CustomHeader: Header,
    CrowdSaleStat,
    RightPanel
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
