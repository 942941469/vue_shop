<template>
  <div>
    <Breadcrumb></Breadcrumb>
    <el-card>
<!--   警告   -->
      <el-alert
        title="注意：只允许为第三级分类设置相关参数"
        type="warning"
        :closable="false"
        show-icon>
      </el-alert>
      <div class="cat_opt">
        <span>选择商品分类：</span>
        <el-cascader
          v-model="selectedKeys"
          :options="cateList"
          :props="{ expandTrigger: 'hover',
          value: 'cat_id',
          label:'cat_name',
          children: 'children' }"
          @change="cateChange">
        </el-cascader>
      </div>
      <el-tabs v-model="activeName" @tab-click="handleTab" >
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialog">添加参数</el-button>
          <ParamsTable :manyTableDate="manyTableDate" :activeName="activeName" v-if="activeName === 'many'"></ParamsTable>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialog">添加属性</el-button>
          <ParamsTable :onlyTableDate="onlyTableDate" :activeName="activeName" v-if="activeName === 'only'"></ParamsTable>
        </el-tab-pane>
      </el-tabs>
      <el-dialog
        :title="title1 + title2"
        :visible.sync="dialogVisible"
        width="50%"
        @close="dialogClose">
        <el-form :model="addFrom" :rules="addFromRules" ref="addFromRef" label-width="100px">
          <el-form-item :label="title2" prop="attr_name">
            <el-input v-model="addFrom.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
         <el-button type="primary" @click=addGoodParams>确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import ParamsTable from '@/components/goods/ParamsTable'
export default {
  name: 'GoodsParams',
  components: { Breadcrumb, ParamsTable },
  data() {
    return {
      // 商品分类
      cateList: [],
      // 选择的id
      selectedKeys: [],
      // 激活的页签
      activeName: 'many',
      // 动态参数
      manyTableDate: [],
      // 静态属性
      onlyTableDate: [],
      // 对话框的显示
      dialogVisible: false,
      // 添加表单
      addFrom: {},
      // 表单验证
      addFromRules: {
        attr_name: [
          { required: true, message: '请输入参数', trigger: 'blur' }
        ]
      },
      // 修改参数还是添加
      isAddAttr: true,
      // 分类属性的id
      attrId: ''
    }
  },
  computed: {
    // 按钮是否禁用，也可用于判断是否选中三级Id
    isBtnDisabled() {
      return this.selectedKeys.length !== 3
    },
    // 当前三级分类Id
    cateId() {
      return this.selectedKeys.length === 3 ? this.selectedKeys[2] : ''
    },
    // 添加参数或属性
    title2() {
      return this.activeName === 'many' ? '动态参数' : '静态属性'
    },
    title1() {
      return this.isAddAttr ? '添加' : '修改'
    }
  },
  mounted() {
    this.getCategoriesList()
    // 修改属性的回调
    this.$bus.$on('editAttr', (id) => {
      this.isAddAttr = false
      this.attrId = id
      this.addDialog()
    })
    // 删除属性的回调
    this.$bus.$on('deleteAttr', async (id) => {
      const confirmResult = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') return this.$message.info('取消删除')
      const { data: res } = await this.$http.categories.reqDeleteAttr(this.cateId, id)
      if (res.meta.status !== 200) return this.$message.error('删除参数失败')
      this.$message.success('删除参数成功')
      await this.getAttr()
    })
    // 新增或删除tag的回调
    this.$bus.$on('newTag', async (id, data) => {
      const { data: res } = await this.$http.categories.reqEditAttr(this.cateId, id, data)
      if (res.meta.status !== 200) return this.$message.error('修改参数失败')
      this.$message.success('修改参数成功')
    })
  },
  // 解绑全局事件总线
  beforeDestroy() {
    this.$bus.$off('editAttr')
    this.$bus.$off('deleteAttr')
    this.$bus.$off('newTag')
  },
  methods: {
    // 获取所有商品分类
    async getCategoriesList() {
      const { data: res } = await this.$http.categories.reqGetCategoriesList()
      if (res.meta.status !== 200) return this.$message.error('获取商品分类失败')
      this.cateList = res.data
    },
    // 选择的Id的改变
    cateChange() {
      if (this.isBtnDisabled) {
        this.selectedKeys = []
        this.manyTableDate = []
        this.onlyTableDate = []
        this.$message.error('只能选择商品第三级分类')
      } else {
        this.getAttr()
      }
    },
    // 获取参数数据
    async getAttr() {
      if (!this.isBtnDisabled) {
        const { data: res } = await this.$http.categories.reqGetAttr(this.cateId, { sel: this.activeName })
        if (res.meta.status !== 200) return this.$message.error('获取参数列表失败')
        res.data.forEach(item => {
          // 如果为空字符串则则返回false将输出数组
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
          // 控制文本框的显示与隐藏
          item.inputVisible = false
          // 文本框的值
          item.inputValue = ''
        })
        // 判断获取的是哪个数据
        if (this.activeName === 'many') {
          this.manyTableDate = res.data
        } else {
          this.onlyTableDate = res.data
        }
      }
    },
    // Tab页签改变
    handleTab() {
      this.getAttr()
    },
    // 显示对话框
    addDialog() {
      this.dialogVisible = true
      // 如果是修改则参数则去获取数据进行展示
      if (!this.isAddAttr) {
        this.getAttrInfo()
      }
    },
    // 清空添加用户表单的数据 resetField:element方法对该表单项进行重置，将其值重置为初始值并移除校验结果
    dialogClose() {
      this.$refs.addFromRef.resetFields()
      this.isAddAttr = true
    },
    // 添加动态参数或者静态属性
    addGoodParams() {
      this.$refs.addFromRef.validate(async valid => {
        if (!valid) return this.$message.error('数据错误')
        if (this.isAddAttr) {
          const { data: res } = await this.$http.categories.reqAddAttr(this.cateId, {
            attr_name: this.addFrom.attr_name,
            attr_sel: this.activeName
          })
          if (res.meta.status !== 201) return this.$message.error('添加参数失败')
          this.$message.success('添加参数成功')
        } else {
          const { data: res } = await this.$http.categories.reqEditAttr(this.cateId, this.attrId, { attr_name: this.addFrom.attr_name, attr_sel: this.activeName })
          if (res.meta.status !== 200) return this.$message.error('修改参数失败')
          this.$message.success('修改参数成功')
        }
        this.dialogVisible = false
        this.isAddAttr = true
        await this.getAttr()
      })
    },
    // 根据Id查询数据
    async getAttrInfo() {
      const { data: res } = await this.$http.categories.reqGetAttrInfo(this.cateId, this.attrId, { attr_sel: this.activeName })
      if (res.meta.status !== 200) return this.$message.error('获取参数数据失败')
      this.addFrom = res.data
    }
  }
}
</script>

<style lang="less" scoped>
  .cat_opt{
    margin: 25px 0;
    span{
      margin-right: 20px;
    }
  }
</style>
