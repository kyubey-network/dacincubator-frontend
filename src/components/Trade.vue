<template>
    <el-card class="stat">
      <h1 class="title">交易</h1>
      <el-row>
        <el-col :span="12">
          <h2 class="subtitle"> 买 </h2>
          <el-button type="primary"> 简陋购买 </el-button>
        </el-col>
        <el-col :span="12">
          <h2 class="subtitle"> 卖 </h2>
          <el-button type="danger" disabled="disabled"> 暂不可用 </el-button>
        </el-col>
      </el-row>
    </el-card>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex';
import { networks } from '../config';

const network = networks.kylin;
const requiredFields = { accounts: [network] };

export default {
  name: 'Trade',
  data: () => ({}),
  created() {
  },
  methods: {
    async buy() {
      const amountOfEOS = prompt('请输入你要购少 KBY 等值的 EOS？');
    },
  },
  computed: {
    ...mapState(['identity', 'scatter', 'eos', 'account']),
    ...mapGetters(['account']),
  },
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
