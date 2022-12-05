<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="../assets/heima.png" alt="">
        <span>管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
<!--  页面主体  -->
    <el-container>
<!--  侧边栏   -->
      <el-aside :width="asideWidth">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <SideBar></SideBar>
      </el-aside>
<!--   右侧主题   -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
// 侧边栏组件
import SideBar from '@/components/Home/Sidebar'
export default {
  name: 'MyHome',
  components: { SideBar },
  data() {
    return {
      isCollapse: false
    }
  },
  computed: {
    // 计算出侧边栏的宽度
    asideWidth() {
      return this.isCollapse ? '64px' : '200px'
    }
  },
  methods: {
    // 退出
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 折叠左侧菜单
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
      this.$bus.$emit('collapse', this.isCollapse)
    }
  }
}
</script>

<style lang="less" scoped>
  .home-container{
    height: 100%;
  }
  .el-header{
    background-color: #373d41;
    padding-left: 0;
    align-items: center;
    color: #fff;
    font-size: 20px;
    display: flex;
    // 左右贴变对齐
    justify-content: space-between;
    div{
      display: flex;
      align-items: center;
      span{
        margin-left: 15px;
      }
    }
  }
  .el-aside{
    background-color: #333744;
    transition: 0.5s;
    .toggle-button{
      background-color: #4A5064;
      font-size: 10px;
      line-height: 24px;
      color: #fff;
      text-align: center;
      // 字体间距
      letter-spacing: 0.2em;
      cursor: pointer;
    }
  }
  .el-main{
    background-color: #eaedf1;
  }
</style>
