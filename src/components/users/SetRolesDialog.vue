<template>
  <el-dialog
    title="分配角色"
    :visible.sync="dialogVisible"
    width="50%"
    @close="dialogClose">
    <p>当前的用户：{{userInfo.username}}</p>
    <p>当前的角色：{{userInfo.role_name}}</p>
    <p>分配角色：
      <el-select v-model="selectRoleId" placeholder="请选择">
        <el-option
          v-for="item in roleList"
          :key="item.id"
          :label="item.roleName"
          :value="item.id">
        </el-option>
      </el-select>
    </p>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'SetRolesDialog',
  data() {
    return {
      dialogVisible: false,
      // 分配角色的用户信息
      userInfo: {},
      // 所有角色的数据
      roleList: [],
      // 选中角色的Id
      selectRoleId: ''
    }
  },
  mounted() {
    this.$bus.$on('setRolesDialog', async (row) => {
      this.dialogVisible = true
      this.userInfo = row
      const { data: res } = await this.$http.rights.reqGetRolesList()
      if (res.meta.status !== 200) return this.$message.error('获取角色列表失败')
      this.roleList = res.data
    })
  },
  // 解绑全局事件总线和自定义事件
  beforeDestroy() {
    this.$bus.$off('setRolesDialog')
    this.$off('getRolesList')
  },
  methods: {
    // 分配角色
    async saveRoleInfo() {
      if (!this.selectRoleId) return this.$message.error('请选择要分配的角色')
      const { data: res } = await this.$http.users.reqSaveUserRoleInfo(this.userInfo.id, { rid: this.selectRoleId })
      if (res.meta.status !== 200) return this.$message.error('更新用户角色失败')
      this.$message.success('更新用户角色成功')
      this.$emit('getUserList')
      this.dialogVisible = false
    },
    // 清空上次数据
    dialogClose() {
      this.selectRoleId = ''
    }
  }
}
</script>

<style scoped>

</style>
