<template>
          <div class="header">
              <el-menu router :default-active="$route.path" class="el-menu-demo" mode="horizontal" @select="handleSelect">
                <el-menu-item index="/">
                    <el-badge value="Beta" class="item">
                            <h1 class="title">Kyubey IBO </h1>
                    </el-badge >
                </el-menu-item>
                <el-menu-item index="/home"> 首页 </el-menu-item>
                <el-menu-item index="/IBO"> IBO </el-menu-item>
                <el-menu-item index="/manage" disabled=""> KBY 管理 </el-menu-item>
            </el-menu>
          </div>
</template>

<style scoped>
.header-link {
    text-decoration: none;
    color: #000;
}
.title {
    margin: 0;
}
</style>

<script>
export default {
    name: 'Header Navbar',
    created() {
        console.log(this.$route)
    }
}
</script>
