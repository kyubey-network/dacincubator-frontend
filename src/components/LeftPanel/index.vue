<template>
    <!-- Left Panel -->
    <el-row :gutter="10">
            <el-col :xs="24" :span="24">
                <Dashboard />
            </el-col>
            <el-col :xs="0" :span="24">
                <HistoryPanel />
            </el-col>
    </el-row>
</template>

<script>
import Dashboard from './Dashboard.vue';

export default {
  name: 'LeftPanel',
  components: {
    Dashboard,
    HistoryPanel: () => import(/* webpackChunkName: "ReservationOrders" */ './ReservationOrders/index.vue'),
  },
};
</script>
