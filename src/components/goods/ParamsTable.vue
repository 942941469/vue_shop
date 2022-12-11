<template>
  <el-table :data="tableDate" border stripe>
    <el-table-column type="expand">
      <template v-slot="{row}">
<!--    循环渲染tag    -->
        <el-tag v-for="(item, index) in row.attr_vals" :key="index" closable @close="handleClose(index, row)">{{item}}</el-tag>
<!--    输入文本框    -->
        <el-input
        class="input-new-tag"
        v-if="row.inputVisible"
        v-model="row.inputValue"
        ref="saveTagInput"
        size="small"
        @keyup.enter.native="$event.target.blur(row)"
        @blur="handleInputConfirm(row)"
        >
        </el-input>
<!--    添加按钮    -->
        <el-button v-else class="button-new-tag" size="small" @click="showInput(row)">+ New Tag</el-button>
      </template>
    </el-table-column>
    <el-table-column type="index"></el-table-column>
    <el-table-column :label="label" prop="attr_name"></el-table-column>
    <el-table-column label="操作">
      <template v-slot="{row}">
        <el-button size="mini" type="primary" icon="el-icon-edit" @click=editAttr(row.attr_id)>编辑</el-button>
        <el-button size="mini" type="danger" icon="el-icon-delete" @click=deleteAttr(row.attr_id)>删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: 'ParamsTable',
  props: ['onlyTableDate', 'manyTableDate', 'activeName'],
  data() {
    return {
      onlyTable: [],
      manyTable: [],
      // 当前模式
      active: ''
    }
  },
  computed: {
    tableDate() {
      return this.activeName === 'many' ? this.manyTable : this.onlyTable
    },
    label() {
      return this.activeName === 'many' ? '属性名称' : '参数名称'
    }
  },
  // 将数据放入组件中
  watch: {
    onlyTableDate() {
      this.onlyTable = this.onlyTableDate
    },
    manyTableDate() {
      this.manyTable = this.manyTableDate
    },
    activeName() {
      this.active = this.activeName
    }
  },
  methods: {
    // 编辑参数
    editAttr(id) {
      this.$bus.$emit('editAttr', id)
    },
    // 删除参数
    deleteAttr(id) {
      this.$bus.$emit('deleteAttr', id)
    },
    // 文本框失去焦点或者回车
    handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        this.$message.error('输入不合法')
      } else {
        row.attr_vals.push(row.inputValue.trim())
        this.$bus.$emit('newTag', row.attr_id, {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        })
      }
      row.inputValue = ''
      row.inputVisible = false
    },
    // 显示文本输入框
    showInput(row) {
      row.inputVisible = true
      // 文本框自动获取焦点 页面渲染完毕再执行
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 删除Tag
    handleClose(index, row) {
      // 删除第index项1个数据
      row.attr_vals.splice(index, 1)
      this.$bus.$emit('newTag', row.attr_id, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(' ')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag{
  margin: 10px;
}
.input-new-tag{
  width: 120px;
}
</style>
