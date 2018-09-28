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
            <tr v-for="order in orders" :key="order.account">
                <td>{{order.account}}</td>
                <td>{{order.quantity}}</td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { getCrowdSaleOrders } from '@/blockchain';

export default {
  name: 'Orders',
  data: () => ({
    orders: [],
  }),
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
      this.orders = orders;
    },
  },
};
</script>
