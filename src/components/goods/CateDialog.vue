<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    width="50%"
    @close="dialogClose">
    <el-form :model="addCateFrom" :rules="CateFromRules" ref="CateFromRef" label-width="100px">
      <el-form-item label="分类名称：" prop="cat_name">
        <el-input v-model="addCateFrom.cat_name"></el-input>
      </el-form-item>
      <el-form-item label="父级分类：" :style="cascade">
<!--    级联选择器 options:数据源 props:配置对象 clearable清除选项  -->
        <el-cascader
          v-model="selectedKeys"
          :options="parentCateList"
          clearable
          :props="{ expandTrigger: 'hover',
          checkStrictly: 'true',
          value: 'cat_id',
          label:'cat_name',
          children: 'children'}"
          @change="parentCateChanged">
        </el-cascader>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="addOrEditCate">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>

export default {
  name: 'CateDialog',
  data() {
    return {
      // 对话框的显示
      dialogVisible: false,
      // 添加表单的数据
      addCateFrom: {
        cat_name: '',
        // 父级分类Id
        cat_pid: 0,
        // 添加分类的等级
        cat_level: 0
      },
      // 添加表单的验证规则
      CateFromRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 父级分类数据
      parentCateList: [],
      // 选择的父级分类id
      selectedKeys: [],
      // 添加或修改模式
      mod: '',
      // 修改分类的id
      cat_id: ''
    }
  },
  computed: {
    title() {
      return this.mod === 'add' ? '添加分类' : '编辑分类'
    },
    cascade() {
      return this.mod === 'add' ? '' : 'display: none'
    }
  },
  mounted() {
    // 展示对话框
    this.$bus.$on('CateDialog', (mod, id) => {
      this.dialogVisible = true
      this.mod = mod
      this.getCategoriesList()
      // 如果是修改则获取数据进行展示
      if (mod !== 'add') return this.getCategoriesInfo(id)
    })
  },
  // 解绑全局事件总线和自定义事件
  beforeDestroy() {
    this.$bus.$off('CateDialog')
    this.$off('getCategoriesList')
  },
  methods: {
    // 清空添加用户表单的数据
    dialogClose() {
      this.$refs.CateFromRef.resetFields()
      this.selectedKeys = []
      this.addCateFrom.cat_pid = 0
      this.addCateFrom.cat_level = 0
      this.cat_id = 0
    },
    // 获取商品分类的数据(1.2级)
    async getCategoriesList() {
      const { data: res } = await this.$http.categories.reqGetCategoriesList({ type: 2 })
      if (res.meta.status !== 200) return this.$message.error('获取商品分类失败')
      this.parentCateList = res.data
    },
    // 选择的父级Id的改变
    parentCateChanged() {
      if (this.selectedKeys.length > 0) {
        this.addCateFrom.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        this.addCateFrom.cat_level = this.selectedKeys.length
      } else {
        this.addCateFrom.cat_pid = 0
        this.addCateFrom.cat_level = 0
      }
    },
    // 添加分类
    addOrEditCate() {
      this.$refs.CateFromRef.validate(async valid => {
        if (!valid) return this.$message.error('请输入分类')
        if (this.mod === 'add') {
          const { data: res } = await this.$http.categories.reqAddCategories(this.addCateFrom)
          if (res.meta.status !== 201) return this.$message.error('添加分类失败')
          this.$message.success('添加分类成功')
        } else {
          const { data: res } = await this.$http.categories.reqEditCategories(this.cat_id, { cat_name: this.addCateFrom.cat_name })
          if (res.meta.status !== 200) return this.$message.error('修改分类失败')
          this.$message.success('修改分类成功')
        }
        this.dialogVisible = false
        this.$emit('getCategoriesList')
      })
    },
    // 根据ID查询信息
    async getCategoriesInfo(id) {
      const { data: res } = await this.$http.categories.reqGetCategoriesInfo(id)
      if (res.meta.status !== 200) return this.$message.error('获取用户信息失败')
      this.addCateFrom.cat_name = res.data.cat_name
      this.cat_id = res.data.cat_id
    }
  }
}
</script>

<style lang="less" scoped>
  .el-cascader{
    width: 100%;
  }
</style>
