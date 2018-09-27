<template>
    <el-card class="stat">
      <el-alert title="为什么没有 KBY 的单价？" type="info" style="text-align: left;"
          description="价格随着市场供需而定，在 IBO 中，市价由供需、保证金等因素决定，所以你可直接投入你的数字资产，我们的 Bancor 协议会帮你汇兑。" show-icon />
      <el-alert title="好消息！好消息！" type="warning" style="text-align: left;"
          description="我们开启了 IBO 团购通道。通过团购合约进行 IBO 有优惠价哦，名额与份额有限，让我们一起“拼”吧。（拼团购买的 KBY 代币需要等拼团结束后才发放）" show-icon />
      <el-row>
        <el-col :span="12" :xs="24">
          <h2 class="subtitle"> 使用 EOS <del>买入</del> 团购 KBY </h2>
          <CrowdSale />
        </el-col>
        <el-col :span="12" :xs="24">
          <h2 class="subtitle"> 卖出 KBY 得到 EOS </h2>
          <el-button type="danger" @click="sell" :disabled="!account"> 简陋卖出 </el-button>
        </el-col>
      </el-row>
    </el-card>
</template>

<script>
import { Notification } from 'element-ui';
import { CrowdSale } from '../components';
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex';
import { network } from '../config';

const requiredFields = { accounts: [network] };

export default {
  name: 'Trade',
  data: () => ({}),
  components: {
    CrowdSale,
  },
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
