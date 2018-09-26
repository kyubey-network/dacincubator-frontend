<template>
    <el-card class="actions-list">
        <h2 class="title">预约记录</h2>
        <el-table
            :data="actions"
            style="width: 100%">
            <el-table-column
                prop="account"
                label="账户"
                width="180">
            </el-table-column>
            <el-table-column
                prop="quantity"
                label="数额"
                width="180">
            </el-table-column>
            <el-table-column
                prop="time"
                label="时间">
            </el-table-column>
        </el-table>
    </el-card>
</template>

<script>
import { compose } from 'ramda';
import { receiptFilter, getTheReceipt, convertTimestamp } from './helper';
import { getActions } from '../../blockchain';

export default {
  name: 'ActionsList',
  async created() {
    const actions = await getActions();
    // Functional style babe!
    this.actions = compose(
      convertTimestamp,
      getTheReceipt,
      receiptFilter,
    )(actions);
  },
  data: () => ({
    actions: [],
  }),
  computed: {},
};
</script>
