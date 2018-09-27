<template>
    <el-card class="stat" style="text-align: left;">
          <div class="scatter-stat">
            <p> <i class="iconfont icon-scatter"></i> Scatter 状态</p>
            <h2 class="small-title">{{ scatter ? "已加载" : "未发现" }}</h2>
          </div>
            <div class="scatter-id-stat">
              <p> <i class="iconfont icon-user"></i> 你当前的账户</p>
              <div class="logined" v-if="account">
                <h2 class="small-title">{{account.name}}</h2>
                <div class="balance-stat">
                  <p><i class="iconfont icon-wallet"></i>
                    账户余额
                    <el-button icon="el-icon-refresh" circle @click="updateBalance" />
                  </p>
                    <h2 class="small-title"> <i class="iconfont icon-EOS"/> {{balance.eos}} </h2>
                    <h2 class="small-title"> {{balance.kby}} </h2>
                </div>
                <el-button type="danger"  @click="forgetId">退出身份</el-button>
              </div>
              <div class="not-login" v-else>
                <h2 class="small-title"> 未登录 </h2>
                <el-button type="primary" :disabled="!scatter" @click="requestId">
                  <i class="iconfont icon-scatter"></i>通过 Scatter 登录
                </el-button>
              </div>
            </div>
    </el-card>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex';
import { getContractGlobal, getCrowdSaleOrders } from '../blockchain';
import { network } from '../config';

const requiredFields = { accounts: [network] };

export default {
  name: 'Dashboard',
  data: () => ({
  }),
  created() {
  },
  methods: {
    ...mapActions(['setIdentity', 'updateBalance', 'updatePrice']),
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
    ...mapState(['identity', 'scatter', 'eos', 'account', 'balance', 'mbalance', 'tokenPrice', 'supply']),
    ...mapGetters(['account']),
  },
};
</script>

<style scoped>
/* .balance-stat .small-title {
  text-align: right
} */
.el-col {
  /* padding: 1rem; */
  /* border: 1px solid #eff2f6; */
}
</style>
