<template>
    <el-card class="stat" style="text-align: left;">
      <el-row :gutter="10">
        <el-col :span="8">
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
              <div class="token-price-stat">
              <p>KBY 目前单价 <el-button icon="el-icon-refresh" @click="updatePrice" circle /></p>
                <h2 class="small-title"> {{tokenPrice}} </h2>
            </div>
        </el-col>
        <el-col :span="8">
              <div class="KBY-stat">
              <p>Market Supply</p>
              <h2 class="small-title">{{supply}} </h2>
              <p>Market Balance</p>
              <h2 class="small-title">{{mbalance}} </h2>
            </div>
        </el-col>
        <el-col :span="8">
            <div class="reserve-stat">
              <p>本轮预约金额</p>
              <h2 class="small-title"> {{reserveBalance}} </h2>
              <p>本轮预约人数</p>
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
.el-col {
  /* padding: 1rem; */
  /* border: 1px solid #eff2f6; */
}
</style>
