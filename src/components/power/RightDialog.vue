<template>
  <el-dialog
    title="分配权限"
    :visible.sync="dialogVisible"
    width="50%"
    @close="dialogClose">
<!--  树形控件 show-checkbox:复选框  -->
      <el-tree
        :data="rightsList"
        :props="treeProps"
        ref="treeRef"
        show-checkbox
        default-expand-all
        :default-checked-keys="defKeys"
        node-key="id">
      </el-tree>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="allotRights">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'RightDialog',
  data() {
    return {
      // 对话框的显示
      dialogVisible: false,
      // 权限列表
      rightsList: [],
      // 树形控件显示
      treeProps: {
        // 显示哪一项
        label: 'authName',
        // 指定子树为节点对象的某个属性值
        children: 'children'
      },
      // 默认勾选的节点的key的数组
      defKeys: [],
      // 当前角色Id
      roleId: ''
    }
  },
  mounted() {
    // 展示对话框
    this.$bus.$on('RightDialog', (row) => {
      this.dialogVisible = true
      this.getRightsList()
      this.getLeafKeys(row, this.defKeys)
      this.roleId = row.id
    })
  },
  // 解绑全局事件总线和自定义事件
  beforeDestroy() {
    this.$bus.$off('RightDialog')
    this.$off('getRolesList')
  },
  methods: {
    // 获取权限列表
    async getRightsList() {
      const { data: res } = await this.$http.rights.reqGetRights('tree')
      if (res.meta.status !== 200) return this.$message.error('获取权限列表失败')
      this.rightsList = res.data
    },
    // 获取角色下所有三级权限的id
    getLeafKeys(node, arr) {
      // 判断是否为三级节点
      if (!node.children) return arr.push(node.id)
      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    // 为角色分配权限
    async allotRights() {
      // 当前选择与半选择的id，并用','分割 这里请求体格式为rids:权限id
      const idStr = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()].join(',')
      const { data: res } = await this.$http.rights.reqAllotRights(this.roleId, { rids: idStr })
      if (res.meta.status !== 200) return this.$message.error('分配权限失败')
      this.$message.success('分配权限成功')
      this.$emit('getRolesList')
      this.dialogVisible = false
    },
    // 关闭对话框清空勾选权限列表
    dialogClose() {
      this.defKeys = []
    }
  }
}
</script>

<style scoped>

</style>
