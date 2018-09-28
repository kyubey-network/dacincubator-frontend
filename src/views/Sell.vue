<template>
    <div class="sell">
        <h1>Sell your KBY token <br>1.0000 KBY = 0.1234 EOS</h1>
        <div class="subscribe-form" style="margin-top: 30px;">
        <div>
            <input type="text" name="amount" v-model="amountOfKBY" class="form-control" placeholder="输入格式: ‘0.0000’，保留后四位小数" required="">
            <button type="submit" @click="sell" class="form-control"><i class="fa fa-send-o"></i></button>
        </div>
        </div>
    </div>
</template>

<script>
import { Notification } from 'element-ui';
import { mapState, mapGetters } from 'vuex';

export default {
  name: 'Sell',
  data: () => ({
    amountOfKBY: '',
  }),
  computed: {
    ...mapState(['identity', 'scatter', 'eos', 'account']),
    ...mapGetters(['account']),
  },
  methods: {
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
      var { account, amountOfKBY } = this;
      amountOfKBY = Number(amountOfKBY)
      const memo = 'sell';
      try {
        await this.eosTokenTransfer({
          tokenContract: 'dacincubator',
          to: 'dacincubator',
          amount: `${amountOfKBY.toFixed(4)} KBY`,
          memo,
          account,
        });
        Notification.success({
          title: '销售成功',
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

