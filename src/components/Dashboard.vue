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
        <el-col :span="6">
            <div class="balance-stat">
              <p>账户余额</p>
                <h2 class="small-title"> {{eosBalance}} </h2>
                <h2 class="small-title"> {{kbyBalance}} </h2>
            </div>
        </el-col>
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
  data: () => ({
    eosBalance: '0.0000 EOS',
    kbyBalance: '0.0000 KBY',
  }),
  created() {
    if (this.account) {
      this.updateBalanceStat();
    }
  },
  watch: {
    account(val) {
      if (val) {
        this.updateBalanceStat();
      }
    },
  },
  methods: {
    ...mapActions(['initScatter']),
    ...mapMutations(['setIdentity']),
    async requestId() {
      await this.suggestNetworkSetting();
      const identity = await this.scatter.getIdentity(requiredFields);
      this.setIdentity(identity);
    },
    async updateBalanceStat() {
      const { account, eos } = this;
      eos.getCurrencyBalance('eosio.token', account.name, 'EOS')
        .then((res) => {
          this.eosBalance = res[0];
        });
      eos.getCurrencyBalance('dacincubator', account.name, 'KBY')
        .then((res) => {
          this.kbyBalance = res[0];
        });
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

<style scoped>
</style>
