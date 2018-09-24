<template>
    <el-card class="stat">
      <h1 class="subtitle">状态栏</h1>
      <el-row>
        <el-col :span="6">
          <div class="scatter-stat">
            <p>Scatter 状态</p>
            <h2 class="small-title">{{ scatter ? "已加载" : "未发现" }}</h2>
          </div>
       </el-col>
        <el-col :span="6">
            <div class="scatter-id-stat">
              <p>你当前的账户</p>
              <div class="logined" v-if="account">
                <h2 class="small-title">{{account.name}}</h2>
                <el-button type="danger"  @click="forgetId">退出身份</el-button>
              </div>
              <div class="not-login" v-else>
                <h2 class="small-title"> 未登录 </h2>
                <el-button type="primary" :disabled="!scatter" @click="requestId">
                  通过 Scatter 登录
                </el-button>
              </div>
            </div>
        </el-col>
        <el-col :span="6">  </el-col>
        <el-col :span="6">  </el-col>
      </el-row>
    </el-card>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex';
import { networks } from '../config';

const network = networks.kylin;
const requiredFields = { accounts: [network] };

export default {
  name: 'Dashboard',
  data: () => ({}),
  methods: {
    ...mapActions(['initScatter']),
    ...mapMutations(['setIdentity']),
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
  margin-top: 60px;
}
</style>
