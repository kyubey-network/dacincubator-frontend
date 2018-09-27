<template>
    <el-card class="stat" style="text-align: left;">
      <el-row :gutter="10">
        <el-col :span="8" :xs="12">
            <div class="timing" v-if="global.claim_time">
                <p> <i class="el-icon-time"></i> 团购剩余时间</p>
                <countdown :time="timeLeft">
                  <template slot-scope="props">
                    <h1 class="small-title">
                      {{ props.hours }}:{{ props.minutes }}:{{ props.seconds }}
                    </h1>
                    </template>
                </countdown>
            </div>
              <div class="token-price-stat">
              <p> <i class="iconfont icon-price"></i> KBY 参考价 <el-button icon="el-icon-refresh" @click="updatePrice" circle /></p>
                <h2 class="small-title"> {{tokenPrice}} </h2>
            </div>
        </el-col>
        <el-col :span="8" :xs="0">
              <div class="KBY-stat">
              <p>Market Supply</p>
              <h2 class="small-title">{{supply}} </h2>
              <p>Market Balance</p>
              <h2 class="small-title">{{mbalance}} </h2>
            </div>
        </el-col>
        <el-col :span="8" :xs="12">
            <div class="reserve-stat">
              <p> <i class="iconfont icon-trade"></i> 本轮预约金额</p>
              <h2 class="small-title"> {{reserveBalance}} </h2>
              <p> <i class="iconfont icon-user"></i> 本轮预约人数</p>
              <h2 class="small-title"> {{reservePeoples}} </h2>
            </div>
        </el-col>
      </el-row>
    </el-card>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import VueCountdown from '@xkeshi/vue-countdown';
import { getContractGlobal, getCrowdSaleOrders } from '../blockchain';

export default {
  name: 'CrowdSaleStat',
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
    ...mapActions(['updatePrice']),
    fetchCrowdSaleStatus() {
      getContractGlobal().then((res) => {
        this.global = res;
        this.reserveBalance = res.reserve;
      });
      getCrowdSaleOrders().then((res) => {
        this.reservePeoples = res.length;
      });
    },
  },
  computed: {
    ...mapState(['eos', 'mbalance', 'tokenPrice', 'supply']),
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
