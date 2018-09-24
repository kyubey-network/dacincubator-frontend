<template>
  <div id="app">
    <div class="header">
      <h1 class="title"> Kyubey IBO <el-tag>Beta on Kylin</el-tag> </h1>
      <h2 class="subtitle"> 请认准 Kyubey 官方域名以防损失 </h2>
    </div>
    <el-card class="stat">
      <h2 class="subtitle">账户状态</h2>
      <div class="scatter-stat">
        <p> Scatter 状态：
          {{ scatter ? "已加载" : "未发现" }}
        </p>
      </div>
      <div class="scatter-id-stat">
        <div class="logined" v-if="scatter.identity">
          你的账户是: {{username}}
          <el-button type="danger"  @click="forgetId">退出身份</el-button>
        </div>
        <div class="not-login" v-else>
          你还没登录哦
          <el-button type="primary" :disabled="!scatter" @click="requestId">登录</el-button>
        </div>
      </div>
    </el-card>

  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import { networks } from './config';

const network = networks.kylin;
const requiredFields = { accounts: [network] };

export default {
  name: 'app',
  data: () => ({
  }),
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
    ...mapState({
      account_name: state => state.account.name,
    }),
    // account() {
    //   return this.identity.accounts.find(({ blockchain }) => blockchain === 'eos');
    // },
    username() {
      return this.account.name;
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
  margin-top: 60px;
}
</style>
