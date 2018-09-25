<template>
    <el-card class="stat">
      <el-alert title="为什么没有 KBY 的单价？" type="info"
          description="价格随着市场供需而定，在 IBO 中，市价由供需、保证金等因素决定，所以你可直接投入你的数字资产，我们的 Bancor 协议会帮你汇兑。" show-icon />
      <el-row>
        <el-col :span="12">
          <h2 class="subtitle"> 使用 EOS 买入 KBY </h2>
          <TradeToken />
          <!-- <el-button type="primary" @click="buy" :disabled="!account"> 简陋购买 </el-button> -->
        </el-col>
        <el-col :span="12">
          <h2 class="subtitle"> 卖出 KBY 得到 EOS </h2>
          <el-button type="danger" @click="sell" :disabled="!account"> 简陋卖出 </el-button>
        </el-col>
      </el-row>
    </el-card>
</template>

<script>
import { Notification } from 'element-ui';
import { TradeToken } from '../components';
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex';
import { networks } from '../config';

const network = networks.eosasia;
const requiredFields = { accounts: [network] };

export default {
  name: 'Trade',
  data: () => ({}),
  components: {
    TradeToken,
  },
  methods: {
    async buy() {
      const { eos, account } = this;
      const amountOfEOS = Number(prompt('请输入你要购少 KBYY 等值的 EOS？（格式1.0000)'));
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
      const amountOfKBYY = Number(prompt('请输入你出售多少个 KBYY？ （格式1.0000)')).toFixed(4);
      const memo = 'sell';
      try {
        await this.eosTokenTransfer({
          tokenContract: 'dacincubator',
          to: 'dacincubator',
          amount: `${amountOfKBYY} KBYY`,
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
  computed: {
    ...mapState(['identity', 'scatter', 'eos', 'account']),
    ...mapGetters(['account']),
  },
};
</script>

<style scoped>
</style>
