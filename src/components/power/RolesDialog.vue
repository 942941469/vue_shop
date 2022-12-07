<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    width="30%"
    @close="dialogClose">
    <el-form :model="addForm" :rules="addFormRules" ref="RolesFormRef" label-width="70px">
      <el-form-item label="角色名称" prop="roleName" label-width="100px">
        <el-input v-model="addForm.roleName"></el-input>
      </el-form-item>
      <el-form-item label="角色描述" prop="roleDesc" label-width="100px">
        <el-input v-model="addForm.roleDesc"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="addOrEditUser">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'RolesDialog',
  computed: {
    title () {
      return this.mod === 'add' ? '添加角色' : '编辑角色'
    }
  },
  data() {
    return {
      // 对话框的显示
      dialogVisible: false,
      // 添加或编辑角色信息的数据
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      // 标记新增对话框还是修改对话框
      mod: '',
      // 当前角色的id
      rolesId: '',
      // 验证规则
      addFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    // 展示对话框
    this.$bus.$on('RolesDialog', (data, id) => {
      this.dialogVisible = true
      this.mod = data
      this.rolesId = id
      // 如果是修改则获取数据进行展示
      if (data !== 'add') return this.getRolesInfo(id)
    })
  },
  // 解绑全局事件总线和自定义事件
  beforeDestroy() {
    this.$bus.$off('RolesDialog')
    this.$off('getRolesList')
  },
  methods: {
    // 清空添加用户表单的数据
    dialogClose() {
      this.$refs.RolesFormRef.resetFields()
      this.rolesId = ''
    },
    // 添加或修改角色
    async addOrEditUser() {
      if (this.mod === 'add') {
        const { data: res } = await this.$http.rights.reqAddRole(this.addForm)
        if (res.meta.status !== 201) return this.$message.error('添加角色失败')
        this.$message.success('添加角色成功')
      } else {
        const { data: res } = await this.$http.rights.reqEditRole(this.rolesId, this.addForm)
        if (res.meta.status !== 200) return this.$message.error('修改角色失败')
        this.$message.success('修改角色成功')
      }
      this.dialogVisible = false
      this.$emit('getRolesList')
    },
    // 根据Id查询角色信息
    async getRolesInfo(id) {
      const { data: res } = await this.$http.rights.reqGetRoleInfo(id)
      if (res.meta.status !== 200) return this.$message.error('获取角色信息失败')
      this.addForm.roleName = res.data.roleName
      this.addForm.roleDesc = res.data.roleDesc
    }
  }
}
</script>

<style scoped>

</style>
