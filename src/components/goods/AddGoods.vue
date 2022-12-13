<template>
  <div>
    <Breadcrumb></Breadcrumb>
    <el-alert title="添加商品信息" type="info" :closable="false"></el-alert>
    <el-card>
<!--   步骤条 -0转为数值  -->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form :model="addFrom" :rules="addFromRules" ref="addFromRef" label-width="100px" label-position="top">
        <el-tabs v-model="activeIndex" :tab-position="'left'" :before-leave="beforeTabLeave" @tab-click="tabClicked">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addFrom.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addFrom.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addFrom.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addFrom.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addFrom.goods_cat"
                :options="cateList"
                :props="{ expandTrigger: 'hover', label: 'cat_name', value: 'cat_id', children: 'children' }"
                @change="handleChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
<!--       复选框       -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="val" v-for="(val, index) in item.attr_vals" :key="index" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :headers="headerObj"
              :on-success="handleSuccess"
              list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
<!--      富文本编辑器      -->
            <quill-editor v-model="addFrom.goods_introduce"></quill-editor>
            <el-button type="primary" class="btnAdd" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <el-dialog
        title="图片预览"
        :visible.sync="dialogVisible"
        width="50%">
        <img :src="previewPath" alt="" class="previewImg">
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import _ from 'lodash'

export default {
  name: 'AddGoods',
  components: { Breadcrumb },
  data() {
    return {
      // 绑定值，选中对应选项卡的name属性
      activeIndex: '0',
      // 添加商品表单数据
      addFrom: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品所属的分类数组
        goods_cat: [],
        // 图片上传临时路径
        pics: [],
        // 商品描述
        goods_introduce: '',
        // 商品的参数包含动态参数和静态属性
        attrs: []
      },
      addFromRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      // 商品分类
      cateList: [],
      // 动态参数列表
      manyTableData: [],
      // 静态属性列表
      onlyTableData: [],
      // 图片上传组件请求头
      headerObj: { Authorization: window.sessionStorage.getItem('token') },
      // 图片预览地址
      previewPath: '',
      // 预览对话框
      dialogVisible: false,
      // 当前模式
      mod: '',
      // 修改商品的id
      id: ''
    }
  },
  computed: {
    cateId() {
      return this.addFrom.goods_cat[2]
    }
  },
  mounted() {
    this.getCategoriesList()
    this.$bus.$on('editGoods', id => {
      this.getGoodsInfo(id)
      this.mod = 'edit'
      this.id = id
    })
  },
  beforeDestroy() {
    this.$bus.$off('editGoods')
  },
  methods: {
    // 获取商品分类的数据
    async getCategoriesList() {
      const { data: res } = await this.$http.categories.reqGetCategoriesList()
      if (res.meta.status !== 200) return this.$message.error('获取商品分类失败')
      this.cateList = res.data
    },
    // 选择分类变化
    handleChange() {
      if (this.addFrom.goods_cat.length !== 3) this.addFrom.goods_cat = []
    },
    // 离开标签页的回调
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addFrom.goods_cat.length !== 3) {
        this.$message.error('请选择商品分类')
        return false
      }
    },
    // tag页签点击
    async tabClicked() {
      if (this.activeIndex === '1') {
        const { data: res } = await this.$http.categories.reqGetAttr(this.cateId, { sel: 'many' })
        if (res.meta.status !== 200) return this.$message.error('获取参数列表失败')
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.manyTableData = res.data
      } else if (this.activeIndex === '2') {
        const { data: res } = await this.$http.categories.reqGetAttr(this.cateId, { sel: 'only' })
        if (res.meta.status !== 200) return this.$message.error('获取属性列表失败')
        this.onlyTableData = res.data
      }
    },
    // 图片预览
    handlePreview(file) {
      this.previewPath = file.response.data.url
      this.dialogVisible = true
    },
    // 移除图片
    handleRemove(file) {
      const filePath = file.response.data.tmp_path
      this.addFrom.pics = this.addFrom.pics.filter(item => item.pic !== filePath)
    },
    // 图片上传成功
    handleSuccess(response) {
      // 将临时存放路径放入表单中
      const picInfo = { pic: response.data.tmp_path }
      this.addFrom.pics.push(picInfo)
    },
    // 添加商品
    addGoods() {
      this.$refs.addFromRef.validate(async valid => {
        if (!valid) return this.$message.error('请填写必要的表单项')
        // 深拷贝防止表单报错
        const form = _.cloneDeep(this.addFrom)
        form.goods_cat = form.goods_cat.join(',')
        form.attrs = this.addFrom.attrs
        if (this.mod === 'edit') {
          const { data: res } = await this.$http.goods.reqEditGoods(this.id, form)
          if (res.meta.status !== 200) return this.$message.error('修改商品失败')
          this.$message.success('修改商品成功')
          await this.$router.push('/home/goods')
        } else {
          const { data: res } = await this.$http.goods.reqAddGoods(form)
          if (res.meta.status !== 201) return this.$message.error('添加商品失败')
          this.$message.success('添加商品成功')
          await this.$router.push('/home/goods')
        }
      })
    },
    // 根据Id查询商品信息
    async getGoodsInfo(id) {
      const { data: res } = await this.$http.goods.reqGetGoodsInfo(id)
      if (res.meta.status !== 200) return this.$message.error('获取商品数据失败')
      res.data.goods_cat = res.data.goods_cat.split(',').map(Number)
      this.addFrom.goods_name = res.data.goods_name
      this.addFrom.goods_price = res.data.goods_price
      this.addFrom.goods_weight = res.data.goods_weight
      this.addFrom.goods_number = res.data.goods_number
      this.addFrom.goods_cat = res.data.goods_cat
      this.addFrom.pics = res.data.pics
      this.addFrom.goods_introduce = res.data.goods_introduce
    }
  }
}
</script>

<style lang="less" scoped>
.el-checkbox {
  margin: 0 10px !important;
}
.previewImg {
  width: 100%;
}
.btnAdd {
  margin-top: 15px;
}
</style>
