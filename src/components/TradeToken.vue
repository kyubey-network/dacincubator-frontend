<template>
    <el-card class="trade-panel">

        <el-form label-position="left" label-width="120px" :model="orderForm">
            <el-form-item label="投入 EOS 数量">
                        <el-input-number placeholder="价格最多可精确到后4位小数点" controls-position="right"
                        :precision="4" :step="0.0001" :min="0.0001" v-model="orderForm.amount" />
            </el-form-item>
            <!-- <el-form-item label="快速调整">
                <el-button-group>
                <el-button type="primary" size="mini">25%</el-button>
                <el-button type="primary" size="mini">50%</el-button>
                <el-button type="primary" size="mini">75%</el-button>
                <el-button type="primary" size="mini">梭哈</el-button>
                </el-button-group>
            </el-form-item> -->
            <!-- <el-form-item label="目前单价">
                <el-input v-model="kbyInEOS" disabled="disabled">
                    <template slot="append">{{tokenA.name}}</template>
                </el-input>
            </el-form-item>
            <el-form-item label="预计结果">
                <el-input v-model="totalPrice">
                    <template slot="append">{{tokenA.name}}</template>
                </el-input>
            </el-form-item> -->
        </el-form>
        <el-button type="primary" @click="buy"> 购买 </el-button>
    </el-card>
</template>

<script>
import { Notification } from 'element-ui';
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex';

export default {
  name: 'TradeComponent',
  props: {
    actionType: {
      type: String,
      default: 'BUY',
      validator(value) {
        // The value must match one of these strings
        return ['BUY', 'SELL'].indexOf(value) !== -1;
      },
    },
    tokenA: {
      type: Object,
      default: () => ({
        name: 'EOS',
        contract: 'eosio.token',
      }),
    },
    tokenB: {
      type: Object,
      default: () => ({
        name: 'KBY',
        contract: 'dacincubator',
      }),
    },
  },
  data: () => ({
    kbyInEOS: 114.5141,
    orderForm: {
      amount: 0.0001,
    },
  }),
  computed: {
    ...mapState(['identity', 'scatter', 'eos', 'account']),
    ...mapGetters(['account']),
  },
  methods: {
    async buy() {
      const { eos, account } = this;
      const amountOfEOS = this.orderForm.amount;
      const memo = 'buy';
      try {
        await eos.transfer(
          account.name,
          'dacincubator',
          `${amountOfEOS.toFixed(4)} EOS`,
          `${memo}`,
          {
            authorization: [`${account.name}@${account.authority}`],
          },
        );
        Notification.success({
          title: '购买成功',
          message: '请稍后查询你的余额',
        });
      } catch (error) {
        Notification.error({
          title: '购买失败',
          message: `原因: ${error.message}`,
          duration: 0,
        });
      }
    },
    async eosTokenTransfer({
      tokenContract, to, amount, memo, account,
    }) {
      const { eos } = this;
      const contract = await eos.contract(tokenContract);
      return contract.transfer(account.name, to, amount, memo, {
        authorization: [`${account.name}@${account.authority}`],
      });
    },
    async sell() {
      const { eos, account } = this;
      const amountOfKBY = Number(prompt('请输入你出售多少个 KBY？ （格式1.0000)')).toFixed(4);
      const memo = 'sell';
      try {
        await this.eosTokenTransfer({
          tokenContract: 'dacincubator',
          to: 'dacincubator',
          amount: `${amountOfKBY} KBY`,
          memo,
          account,
        });
        Notification.success({
          title: '购买成功',
          message: '请稍后查询你的余额',
        });
      } catch (error) {
        Notification.error({
          title: '购买失败',
          message: `原因: ${error.message}`,
          duration: 0,
        });
      }
    },
  },
};
</script>

<style scoped>
.trade-panel {
    max-width: 26rem;
}
</style>
