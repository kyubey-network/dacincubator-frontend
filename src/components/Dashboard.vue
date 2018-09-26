<template>
    <el-card class="stat" style="text-align: left;">
      <el-row :gutter="10">
        <el-col :span="3">
          <div class="scatter-stat">
            <p>Scatter 状态</p>
            <h2 class="small-title">{{ scatter ? "已加载" : "未发现" }}</h2>
          </div>
            <div class="scatter-id-stat">
              <p>你当前的账户</p>
              <div class="logined" v-if="account">
                <h2 class="small-title">{{account.name}}</h2>
                <router-link to="/history"> See history </router-link>
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
        <el-col :span="4">
          <div class="timing" v-if="global.claim_time">
                <p>团购剩余时间</p>
                <countdown :time="timeLeft">
                  <template slot-scope="props">
                    <h2 class="small-title">
                      {{ props.hours }}:{{ props.minutes }}:{{ props.seconds }}
                    </h2>
                    </template>
                </countdown>
          </div>
        </el-col>
        <el-col :span="4">
            <div class="balance-stat">
              <p>账户余额 <el-button icon="el-icon-refresh" circle @click="updateBalance" /> </p>
                <h2 class="small-title"> {{balance.eos}} </h2>
                <h2 class="small-title"> {{balance.kby}} </h2>
            </div>
        </el-col>
        <el-col :span="4">
              <div class="token-price-stat">
              <p>KBY 价格 <el-button icon="el-icon-refresh" @click="updatePrice" circle /></p>
                <h2 class="small-title"> {{tokenPrice}} </h2>
                <h3> / KBY</h3>
            </div>
        </el-col>
        <el-col :span="4">
              <div class="KBY-stat">
              <p>Market Supply</p>
              <h2 class="small-title">{{supply}} </h2>
              <p>Market Balance</p>
              <h2 class="small-title">{{mbalance}} </h2>
            </div>
        </el-col>
        <el-col :span="4">
            <div class="reserve-stat">
              <p>预约金额</p>
              <h2 class="small-title"> {{reserveBalance}} </h2>
              <p>预约人数</p>
              <h2 class="small-title"> {{reservePeoples}} </h2>


            </div>
        </el-col>

      </el-row>
    </el-card>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex';
import VueCountdown from '@xkeshi/vue-countdown';
import { getContractGlobal, getCrowdSaleOrders } from '../blockchain';
import { network } from '../config';

const requiredFields = { accounts: [network] };

export default {
  name: 'Dashboard',
  components: {
    countdown: VueCountdown,
  },
  data: () => ({
    global: {},
    reserveBalance: '0.0000 EOS',
    reservePeoples: 0,
    eosLoaded: false,
  }),
  watch: {
    eos(val) {
      if (val && !this.eosLoaded) {
        this.eosLoaded = true;
        this.fetchCrowdSaleStatus();
      }
    },
  },
  created() {
    if (this.eos) {
      this.eosLoaded = true;
      this.fetchCrowdSaleStatus();
    }
  },
  methods: {
    ...mapActions(['setIdentity', 'updateBalance', 'updatePrice']),
    async requestId() {
      await this.suggestNetworkSetting();
      const identity = await this.scatter.getIdentity(requiredFields);
      this.setIdentity(identity);
    },
    fetchCrowdSaleStatus() {
      getContractGlobal().then((res) => {
        this.global = res;
        this.reserveBalance = res.reserve;
      });
      getCrowdSaleOrders().then((res) => {
        this.reservePeoples = res.length;
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
    ...mapState(['identity', 'scatter', 'eos', 'account', 'balance', 'mbalance', 'tokenPrice', 'supply']),
    ...mapGetters(['account']),
    startTime() {
      return this.global.claim_time * 1000;
    },
    timeLeft() {
      const crowdSaleInterval = 1000 * 60 * 60 * 6;
      return (this.startTime + crowdSaleInterval) - (new Date().getTime());
    },
  },
};
</script>

<style scoped>
/* .balance-stat .small-title {
  text-align: right
} */
/* .el-col {
  padding: 1rem;
  border-right: 1px solid #eff2f6;
}
.el-col:last-child {
    border-right: 0;
} */
</style>
