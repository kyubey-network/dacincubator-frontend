<template>
    <div class="buy">
               <h1>Current Group Purchase <br>Order KBY now!</h1>
               <!-- You can change the date time in init.js file -->
                <countdown :time="timeLeft">
                  <template slot-scope="props">
                      <ul class="countdown">
                            <!-- <li>
                                <span class="days">00</span>
                                <h3>Days</h3>
                            </li> -->
                            <li>
                                <span class="hours">{{ props.hours }}</span>
                                <h3>hours</h3>
                            </li>
                            <li>
                                <span class="minutes">{{ props.minutes }}</span>
                                <h3>minutes</h3>
                            </li>
                            <li>
                                <span class="seconds">{{ props.seconds }}</span>
                                <h3>seconds</h3>
                            </li>
                        </ul>
                    </template>
                </countdown>

<div class="subscribe-form">
  <div >
    <input type="text" name="amount" v-model="amountOfEOS" class="form-control" placeholder="输入EOS，最多保留后四位小数" required="">
    <button @click="buy" type="submit" class="form-control"><i class="fa fa-send-o"></i></button>
  </div>
</div>
          </div>
</template>


<script>
import { Notification } from 'element-ui';
import { mapState, mapActions, mapGetters } from 'vuex';
import VueCountdown from '@xkeshi/vue-countdown';
import { getContractGlobal } from '../blockchain';

export default {
  name: 'Buy',
  components: {
    countdown: VueCountdown,
  },
  data: () => ({
    global: {},
    eosLoaded: false,
    amountOfEOS: '',
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
    fetchCrowdSaleStatus() {
      getContractGlobal().then((res) => {
        this.global = res;
        this.reserveBalance = res.reserve;
      });
    },
    async buy() {
      let { eos, account, amountOfEOS } = this;
      amountOfEOS = Number(amountOfEOS);
      const memo = '';
      try {
        const result = await eos.transfer(
          account.name,
          'myeosgroupon',
          `${amountOfEOS.toFixed(4)} EOS`,
          `${memo}`,
          {
            authorization: [`${account.name}@${account.authority}`],
          },
        );
      } catch (error) {
        // @!workaround: I fucking hate EOS.JS, error is unpredictable
        // maybe return type error as type `string` or type `Error`
        if (typeof error === 'string') {
          error = JSON.parse(error);
        }
        console.error(error);
        let errorMsg;
        if (error.error) {
          errorMsg = `原因: ${error.error.details[0].message}`;
        } else {
          errorMsg = `原因: ${error.message}`;
        }
        Notification.error({
          title: '购买失败',
          message: errorMsg,
          duration: 0,
        });
      }
    },
  },
  computed: {
    ...mapState(['eos', 'tokenPrice']),
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
