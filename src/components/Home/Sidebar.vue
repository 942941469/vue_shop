<template>
  <div>
<!--  侧边栏  -->
    <h5>自定义颜色</h5>
<!--  unique-opened:每次自能展开一项的设置加上:将字符串装为布尔值
      router:index作为path进行路由跳转  -->
    <el-menu
      background-color="#333744"
      text-color="#fff"
      active-text-color="#409EFF"
      :unique-opened="true"
      :collapse="isCollapse"
      :router="true"
      :default-active="activePath"
    >
<!--   一级菜单   -->
      <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
<!--    模板区域    -->
        <template slot="title">
<!--    图标      -->
          <i :class="iconsObj[item.id]"></i>
<!--    文本      -->
          <span>{{ item.authName }}</span>
        </template>
<!--    二级菜单      -->
        <el-menu-item
          :index="'/home/'+subItem.path"
          v-for="subItem in item.children"
          :key="subItem.id"
          @click="saveNavStatus('/home/'+subItem.path)"
        >
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span>{{ subItem.authName }}</span>
          </template>
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'SideBar',
  data() {
    return {
      // 菜单栏数据
      menuList: [],
      // 一级菜单图标
      iconsObj: {
        125: 'el-icon-s-custom',
        103: 'el-icon-s-check',
        101: 'el-icon-goods',
        102: 'el-icon-s-claim',
        145: 'el-icon-date'
      },
      // 左侧菜单栏是否折叠
      isCollapse: false,
      // 被激活的
      activePath: ''
    }
  },
  created() {
    this.getMenuList()
  },
  mounted() {
    this.$bus.$on('collapse', (data) => {
      this.isCollapse = data
    })
  },
  beforeDestroy() {
    this.$bus.$off('collapse')
  },
  methods: {
    // 获取菜单数据列表
    async getMenuList() {
      const { data: res } = await this.$http.api.reqGetMenus()
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
    },
    saveNavStatus(activePath) {
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
  .el-menu{
    border-right: none;
  }
</style>
