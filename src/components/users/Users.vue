<template>
  <div>
    <Breadcrumb></Breadcrumb>
    <el-card>
      <!--   :gutter设置col的间距   -->
      <el-row :gutter="20">
        <el-col :span="8">
          <!--    搜索与添加 clearable:可清空   -->
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addUserDialog('add')">添加用户</el-button>
        </el-col>
      </el-row>
      <!--   用户列表 stripe:斑马纹  -->
      <el-table :data="userList" border stripe>
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template v-slot="{row}">
            <!--      状态开关      -->
            <el-switch
              v-model="row.mg_state"
              @change="userStateChange(row)"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template v-slot="{row}">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="addUserDialog('revise', row.id)"></el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteUser(row.id)"></el-button>
            <el-tooltip content="分配角色" placement="top-start" :enterable="false">{{ row }}}
              <el-button type="warning" size="mini" icon="el-icon-setting"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, ->, jumper"
        :total="total">
      </el-pagination>
<!--   添加用户对话框 传递两个自定义含税用于更新页面   -->
      <AddDialog @getUserList="getUserList" @handleCurrentChange="handleCurrentChange"></AddDialog>
    </el-card>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import AddDialog from '@/components/users/AddDialog'

export default {
  name: 'UsersAdminister',
  components: { Breadcrumb, AddDialog },
  data() {
    return {
      // 获取用户列表的参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      // 用户列表
      userList: [],
      // 数据总数
      total: 0
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    // 获取用户列表
    async getUserList() {
      const { data: res } = await this.$http.users.reqGetUserList(this.queryInfo)
      if (res.meta.status !== 200) return this.$message.error('获取用户列表失败')
      this.userList = res.data.users
      this.total = res.data.total
    },
    // 修改每页条数
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 当前页改变
    handleCurrentChange(newSize) {
      this.queryInfo.pagenum = newSize
      this.getUserList()
    },
    // 状态开关
    async userStateChange(userinfo) {
      const { data: res } = await this.$http.users.reqChangeUserState(userinfo)
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error('更新用户状态失败')
      }
      this.$message.success('更新用户状态成功')
    },
    // 添加用户
    addUserDialog(data, id) {
      this.$bus.$emit('addDialog', data, id)
    },
    // 删除用户
    async deleteUser(id) {
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') return this.$message.info('取消删除')
      const { data: res } = await this.$http.users.reqDeleteUser(id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除用户失败')
      }
      this.$message.success('删除用户成功')
      await this.getUserList()
      this.handleCurrentChange(this.userList.length > 0 ? this.queryInfo.pagenum : this.queryInfo.pagenum - 1)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
