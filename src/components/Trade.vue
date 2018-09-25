<template>
    <el-card class="stat">
      <h1 class="title">交易</h1>
      <el-row>
        <el-col :span="12">
          <h2 class="subtitle"> 买 </h2>
          <el-button type="primary" @click="buy" :disabled="!account"> 简陋购买 </el-button>
        </el-col>
        <el-col :span="12">
          <h2 class="subtitle"> 卖 </h2>
          <el-button type="danger" @click="sell" :disabled="!account"> 简陋卖出 </el-button>
        </el-col>
      </el-row>
    </el-card>
</template>

<script>
import { Notification } from 'element-ui';
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex';
import { networks } from '../config';

const network = networks.kylin;
const requiredFields = { accounts: [network] };

export default {
  name: 'Trade',
  data: () => ({}),
  methods: {
    async buy() {
      const { eos, account } = this;
      const amountOfEOS = Number(prompt('请输入你要购少 KBY 等值的 EOS？（格式1.0000)'));
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
  computed: {
    ...mapState(['identity', 'scatter', 'eos', 'account']),
    ...mapGetters(['account']),
  },
};
</script>

<style scoped>
</style>
