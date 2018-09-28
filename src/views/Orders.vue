<template>
    <div class="orders">
        <table class="order-table">
            <thead>
            <tr>
                <th>Account</th>
                <th>Amount</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="order in ordersByPages[currentPage]" :key="order.account">
                <td>{{order.account}}</td>
                <td>{{order.quantity}}</td>
            </tr>
            </tbody>
        </table>
        <!-- <el-table
            :data="ordersByPages[currentPage]"
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
        </el-table> -->
        <el-pagination
            layout="prev, pager, next"
            :page-count="ordersByPages.length"
            :current-page.sync="currentPage" >
        </el-pagination>
    </div>
</template>

<script>
import { Table, TableColumn, Pagination } from "element-ui";
import { splitEvery } from "ramda";
import { mapState } from 'vuex';
import { getCrowdSaleOrders } from '@/blockchain';

export default {
  name: 'Orders',
  data: () => ({
    orders: [],
    ordersByPages: [],
    currentPage: 1
  }),
  components: {
      "el-table": Table,
      "el-table-column": TableColumn,
      "el-pagination": Pagination,
  },
  computed: {
    ...mapState(['eos']),
  },
  watch: {
    eos(val) {
      if (val && !this.eosLoaded) {
        this.eosLoaded = true;
        this.fetchActions();
      }
    },
  },

  async created() {
    if (this.eos) {
      this.eosLoaded = true;
      this.fetchActions();
    }
  },
  methods: {
    async fetchActions() {
      const orders = await getCrowdSaleOrders();
      const ordersByPages = splitEvery(10, orders)
      this.orders = orders;
      this.ordersByPages = ordersByPages;
    },
  },
};
</script>
