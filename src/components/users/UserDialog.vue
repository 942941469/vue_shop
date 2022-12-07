<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    width="30%"
    @close="dialogClose">
    <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
      <el-form-item label="用户名" :prop="usernameProp">
        <el-input v-model="addForm.username" :disabled="displayName"></el-input>
      </el-form-item>
<!--   注意修改界面不需要密码的验证   -->
      <el-form-item label="密码" :prop="passwordProp" :style="passwordStyle">
        <el-input v-model="addForm.password"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="addForm.email"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="addForm.mobile"></el-input>
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
  name: 'UserDialog',
  data() {
    //  自定义验证规则
    const checkEmail = (rules, values, callback) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(values)) return callback()
      callback(new Error('请输入合法的邮箱'))
    }
    const checkMobile = (rules, values, callback) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(values)) return callback()
      callback(new Error('请输入合法的手机'))
    }
    return {
      // 添加用户对话框的显示与隐藏
      dialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加用户的表单的验证规则
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ],
        noPassword: {},
        noUsername: {}
      },
      // 标记新增对话框还是修改对话框
      mod: '',
      // 当前用户ID
      userId: ''
    }
  },
  // 计算出修改与添加对话框显示的区别
  computed: {
    title() {
      return this.mod === 'add' ? '添加用户' : '修改用户'
    },
    displayName() {
      return this.mod !== 'add'
    },
    passwordStyle() {
      return this.mod !== 'add' ? 'display: none' : ''
    },
    passwordProp() {
      return this.mod === 'add' ? 'password' : 'noPassword'
    },
    usernameProp() {
      return this.mod === 'add' ? 'username' : 'noUsername'
    }
  },
  mounted() {
    // 展示对话框
    this.$bus.$on('addDialog', (data, id) => {
      this.dialogVisible = true
      this.mod = data
      this.userId = id
      // 如果是修改则获取数据进行展示
      if (data !== 'add') return this.getUserInfo(id)
    })
  },
  // 解绑全局事件总线和自定义事件
  beforeDestroy() {
    this.$bus.$off('userDialog')
    this.$off('getUserList')
  },
  methods: {
    // 清空添加用户表单的数据 resetField:element方法对该表单项进行重置，将其值重置为初始值并移除校验结果
    dialogClose() {
      this.$refs.addFormRef.resetFields()
      this.addForm.username = ''
    },
    // 添加或修改用户
    addOrEditUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return this.$message.error('数据错误')
        if (this.mod === 'add') {
          const { data: res } = await this.$http.users.reqAddUser(this.addForm)
          if (res.meta.status !== 201) return this.$message.error('添加用户失败')
          this.$message.success('添加用户成功')
        } else {
          const data = { email: this.addForm.email, mobile: this.addForm.mobile }
          const { data: res } = await this.$http.users.reqEditUserInfo(this.userId, data)
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
          this.$message.success('修改用户成功')
        }
        this.dialogVisible = false
        this.$emit('getUserList')
        this.$emit('handleCurrentChange', 1)
      })
    },
    // 根据ID查询信息
    async getUserInfo(id) {
      const { data: res } = await this.$http.users.reqGetUserInfo(id)
      if (res.meta.status !== 200) return this.$message.error('获取用户信息失败')
      this.addForm.username = res.data.username
      this.addForm.email = res.data.email
      this.addForm.mobile = res.data.mobile
    }
  }
}
</script>

<style scoped>

</style>
