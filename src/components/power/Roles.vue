<template>
  <div>
    <Breadcrumb></Breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRole('add')">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="roleList" border stripe>
<!--    展开区域    -->
        <el-table-column type="expand">
          <template v-slot="{row}">
            <el-row :class="['bdBottom', 'vcenter', index ===  0 ? 'bdTop' : '']" v-for="(item1 , index) in row.children" :key="item1.id">
              <el-col :span="5">
                <el-tag closable @close="removeRightById(row, item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row :class="['vcenter', index ===  0 ? '' : 'bdTop']" v-for="(item2 , index) in item1.children" :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeRightById(row, item2.id)">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag type="warning" v-for="item3 in item2.children" :key="item3.id" closable @close="removeRightById(row, item3.id)">{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="序号" type="index">
        </el-table-column>
        <el-table-column prop="roleName" label="角色名称">
        </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述">
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="{row}">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="addRole('edit', row.id)">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteRole(row.roleName,row.id)">删除</el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting" width="300px" @click="setRights(row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
      <RolesDialog @getRolesList="getRolesList"></RolesDialog>
      <RightDialog @getRolesList="getRolesList"></RightDialog>
    </el-card>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import RolesDialog from '@/components/power/RolesDialog'
import RightDialog from '@/components/power/RightDialog'
export default {
  name: 'PowerRoles',
  components: { Breadcrumb, RolesDialog, RightDialog },
  data() {
    return {
      // 所有角色列表数据
      roleList: []
    }
  },
  mounted() {
    this.getRolesList()
  },
  methods: {
    // 获取所有角色列表数据
    async getRolesList() {
      const { data: res } = await this.$http.rights.reqGetRolesList()
      if (res.meta.status !== 200) return this.$message.error('获取角色列表失败')
      this.roleList = res.data
    },
    // 新增或编辑角色
    addRole(data, id) {
      this.$bus.$emit('RolesDialog', data, id)
    },
    // 删除角色
    async deleteRole(name, id) {
      const confirmResult = await this.$confirm(`此操作将永久删除${name}角色, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') return this.$message.info('取消删除')
      const { data: res } = await this.$http.rights.reqDeleteRole(id)
      if (res.meta.status !== 200) return this.$message.error('删除角色失败')
      this.$message.success('删除角色成功')
      await this.getRolesList()
    },
    // 删除权限
    async removeRightById(row, rightId) {
      const confirmResult = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') return this.$message.info('取消删除')
      const { data: res } = await this.$http.rights.reqDeleteRights(row.id, rightId)
      if (res.meta.status !== 200) return this.$message.error('删除权限失败')
      this.$message.success('删除权限成功')
      // 删除后会返回一个最新的data，直接赋值可以防止刷新关闭expand
      row.children = res.data
    },
    // 分配权限
    setRights(row) {
      this.$bus.$emit('RightDialog', row)
    }
  }
}
</script>

<style lang="less" scoped>
  .el-tag{
    margin: 7px;
  }
  .bdTop{
    border-top: 1px solid #eee;
  }
  .bdBottom{
    border-bottom: 1px solid #eee;
  }
  .vcenter{
    display: flex;
    align-items: center;
  }
</style>
