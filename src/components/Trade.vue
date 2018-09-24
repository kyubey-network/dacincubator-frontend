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
          <el-button type="danger" disabled="disabled"> 暂不可用 </el-button>
        </el-col>
      </el-row>
    </el-card>
</template>

<script>
import { Notification } from "element-ui";
import { mapState, mapActions, mapMutations, mapGetters } from "vuex";
import { networks } from "../config";

const network = networks.kylin;
const requiredFields = { accounts: [network] };

export default {
  name: "Trade",
  data: () => ({}),
  methods: {
    async buy() {
      const { eos, account } = this;
      const amountOfEOS = Number(prompt("请输入你要购少 KBY 等值的 EOS？"));
      const memo = "buy";
      try {
        await eos.transfer(
          account.name,
          "dacincubator",
          `${amountOfEOS.toFixed(4)} EOS`,
          `${memo}`,
          {
            authorization: [`${account.name}@${account.authority}`]
          }
        );
        Notification.success({
          title: "购买成功",
          message: `请稍后查询你的余额`,
        });
      } catch (error) {
        Notification.error({
          title: "购买失败",
          message: `原因: ${error.message}`,
          duration: 0
        });
      }
    }
  },
  computed: {
    ...mapState(["identity", "scatter", "eos", "account"]),
    ...mapGetters(["account"])
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
