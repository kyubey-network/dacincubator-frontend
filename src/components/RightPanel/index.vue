<template>
    <el-card class="scan-to-trade">
        <h1 class="title">没有 Scatter 插件？<br> 懒得在电脑操作？ </h1>
        <p class="subtitle"> 你现在可以使用 TokenPocket 钱包 App 扫描下方二维码，在手机上参加本场团购 </p>
        <qrcode :value="currentUrl" :options="{ size: 200 }" />
    </el-card>
</template>


<script>
import qrcode from "@xkeshi/vue-qrcode";
export default {
    data: "RightPanel",
    components: {
        qrcode
    },
    computed: {
        currentUrl() {
            return window.location.href
        }
    }
}
</script>
