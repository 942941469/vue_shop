<template>
  <div>
    <Breadcrumb></Breadcrumb>
    <el-card>
      <el-table :data="rightsList" border stripe>
        <el-table-column label="序号" type="index">
        </el-table-column>
        <el-table-column prop="authName" label="权限名称">
        </el-table-column>
        <el-table-column prop="path" label="路径">
        </el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template v-slot="{row}">
            <el-tag v-if="row.level === '0'">一级</el-tag>
            <el-tag type="success" v-else-if="row.level === '1'">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
export default {
  name: 'PowerRights',
  components: { Breadcrumb },
  data() {
    return {
    // 权限列表
      rightsList: []
    }
  },
  mounted() {
    this.getRightsList()
  },
  methods: {
    // 获取权限列表
    async getRightsList() {
      const { data: res } = await this.$http.rights.reqGetRights('list')
      if (res.meta.status !== 200) return this.$message.error('获取权限列表失败')
      this.rightsList = res.data
    }
  }
}
</script>

<style scoped>

</style>
