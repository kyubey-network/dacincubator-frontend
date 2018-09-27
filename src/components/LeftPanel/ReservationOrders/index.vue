<template>
    <el-card class="orders-list">
        <h2 class="title">当前预约 <el-button circle @click="fetchActions" icon="el-icon-refresh" ></el-button> </h2>
        <el-table
            :data="orders"
            style="width: 100%">
            <el-table-column
                prop="account"
                label="账户"
                width="110">
            </el-table-column>
            <el-table-column
                prop="quantity"
                label="数额"
                width="150">
            </el-table-column>
        </el-table>
    </el-card>
</template>

<script>
import { mapState } from 'vuex';
import { compose } from 'ramda';
import { receiptFilter, getTheReceipt, convertTimestamp } from './helper';
import { getCrowdSaleOrders } from '@/blockchain';

export default {
  name: 'ReservationOrders',
  watch: {
    eos(val) {
      if (val && !this.eosLoaded) {
        this.eosLoaded = true;
        this.fetchActions();
      }
    },
  },

  async created() {
    if (eos) {
      this.eosLoaded = true;
      this.fetchActions();
    }
  },
  data: () => ({
    orders: [],
    eosLoaded: false,
  }),
  methods: {
    async fetchActions() {
      const orders = await getCrowdSaleOrders();
      this.orders = orders;
    },
  },
  computed: {
    ...mapState(['eos']),
  },
};
</script>
