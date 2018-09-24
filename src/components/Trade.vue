<template>
    <el-card class="stat">
      <h1 class="title">交易</h1>
      <el-row>
        <el-col :span="12">
          <h2 class="subtitle"> 买 </h2>
        </el-col>
        <el-col :span="12">
          <h2 class="subtitle"> 卖 </h2>
        </el-col>
      </el-row>
    </el-card>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex';
import { networks } from '../config';

const network = networks.kylin;
const requiredFields = { accounts: [network] };

export default {
  name: 'app',
  data: () => ({}),
  created() {
    // @TODO: replace with Scatter JS
    document.addEventListener('scatterLoaded', () => {
      console.log('Scatter Loaded');
      this.handleScatterLoaded();
    });
  },
  methods: {
    ...mapActions(['initScatter']),
    ...mapMutations(['setIdentity']),
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
  margin-top: 60px;
}
</style>
