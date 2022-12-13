<template>
  <div>
    <Breadcrumb></Breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容"  v-model="queryInfo.query" clearable @clear="getGoodList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addPage">添加商品</el-button>
        </el-col>
      </el-row>
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格(元)" prop="goods_price" width="95px"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="70px"></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="140px">
          <template v-slot="{row}">
<!--      管道符处理时间      -->
            {{row.add_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作"  width="130px">
          <template v-slot="{row}">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="editPage(row.goods_id)"></el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeGoodsById(row.goods_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background>
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
export default {
  name: 'GoodList',
  components: { Breadcrumb },
  data() {
    return {
      // 查询参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 商品列表数据
      goodsList: [],
      // 总数据条数
      total: 0
    }
  },
  mounted() {
    this.getGoodList()
  },
  methods: {
    // 根据分页获取列表数据
    async getGoodList() {
      const { data: res } = await this.$http.goods.reqGetGoodsList(this.queryInfo)
      if (res.meta.status !== 200) return this.$message.error('获取商品列表失败')
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    // 页面显示个数改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodList()
    },
    // 页码改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodList()
    },
    // 删除商品
    async removeGoodsById(id) {
      const confirmResult = await this.$confirm('此操作将永久删除商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') return this.$message.info('取消删除')
      const { data: res } = await this.$http.goods.reqDeleteGoods(id)
      if (res.meta.status !== 200) return this.$message.error('删除商品失败')
      this.$message.success('删除商品成功')
      await this.getGoodList()
    },
    // 添加商品
    addPage() {
      this.$router.push('/home/goods/add')
    },
    // 修改商品
    editPage(id) {
      this.$router.push('/home/goods/add')
      // 进行路由跳转，组件销毁这时需要$nextTick，让$on先建立
      this.$nextTick(() => {
        this.$bus.$emit('editGoods', id)
      })
    }
  }
}
</script>

<style scoped>

</style>
