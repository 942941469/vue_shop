<template>
 <div>
   <Breadcrumb></Breadcrumb>
   <el-card>
     <el-button type="primary" @click="addOrEditCategories('add')">添加分类</el-button>
     <tree-table
       class="treeTable"
       :data="cateList"
       :columns="columns"
       :selection-type="false"
       :expand-type="false"
       show-index
       :show-row-hover="false"
       border
       index-text="#">
<!--   是否有效    -->
       <template v-slot:isok="{row}">
         <i class="el-icon-success" v-if="row.cat_deleted === false" style="color:lightgreen"></i>
         <i class="el-icon-error" v-else style="color:red"></i>
       </template>
<!--   排序   -->
       <template v-slot:order="{row}">
         <el-tag size="mini" v-if="row.cat_level === 0">一级</el-tag>
         <el-tag size="mini" v-else-if="row.cat_level === 1" type="success">二级</el-tag>
         <el-tag size="mini" v-else type="warning">三级</el-tag>
       </template>
<!--   操作   -->
       <template v-slot:opt="{row}">
         <el-button type="primary" icon="el-icon-edit" size="mini" @click="addOrEditCategories('edit', row.cat_id)">编辑</el-button>
         <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteCategories(row.cat_id, row.cat_name)">删除</el-button>
       </template>
     </tree-table>
     <el-pagination
       @size-change="handleSizeChange"
       @current-change="handleCurrentChange"
       :current-page="queryInfo.pagenum"
       :page-sizes="[3, 5, 10]"
       :page-size="queryInfo.pagesize"
       layout="total, sizes, prev, pager, next, jumper"
       :total="total">
     </el-pagination>
     <CateDialog @getCategoriesList="getCategoriesList"></CateDialog>
   </el-card>
 </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import CateDialog from '@/components/goods/CateDialog'
export default {
  name: 'GoodsCategories',
  components: { CateDialog, Breadcrumb },
  data() {
    return {
      // 商品分类的数据列表
      cateList: [],
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 总数据数
      total: 0,
      // 为table指定列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ]
    }
  },
  mounted() {
    this.getCategoriesList()
  },
  methods: {
    // 获取商品分类的数据
    async getCategoriesList() {
      const { data: res } = await this.$http.categories.reqGetCategoriesList(this.queryInfo)
      if (res.meta.status !== 200) return this.$message.error('获取商品分类失败')
      this.cateList = res.data.result
      this.total = res.data.total
    },
    // 显示个数
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCategoriesList()
    },
    // 页码
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getCategoriesList()
    },
    // 添加分类
    addOrEditCategories(mod, id) {
      this.$bus.$emit('CateDialog', mod, id)
    },
    // 删除分类
    async deleteCategories(id, name) {
      const confirmResult = await this.$confirm(`此操作将永久删除${name}分类, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') return this.$message.info('取消删除')
      const { data: res } = await this.$http.categories.reqDeleteCategories(id)
      if (res.meta.status !== 200) return this.$message.error('删除分类失败')
      this.$message.success('删除分类成功')
      await this.getCategoriesList()
      this.handleCurrentChange(this.cateList.length > 0 ? this.queryInfo.pagenum : this.queryInfo.pagenum - 1)
    }
  }
}
</script>

<style lang="less" scoped>
  .treeTable{
    margin-top: 15px;
  }
</style>
