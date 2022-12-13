<template>
  <div>
    <Breadcrumb></Breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="orderList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template v-slot="{row}">
            <el-tag type="success" v-if="row.pay_status === 1">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单事件" prop="create_time">
          <template v-slot="{row}">
            {{ row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="{row}">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="editDialog(row)"></el-button>
            <el-button type="success" size="mini" icon="el-icon-location" @click="showProgressBox"></el-button>
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
        :total="total">
      </el-pagination>
      <el-dialog
        title="修改地址"
        :visible.sync="dialogVisible"
        width="50%"
        @close="dialogClose">
        <el-form ref="addressFromRef" :model="addressFrom" label-width="100px">
          <el-form-item label="省/市区县" prop="address1">
            <el-cascader :options="cityData" v-model="addressFrom.address1"></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="address2">
            <el-input v-model="addressFrom.address2"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="物流进度"
        :visible.sync="logisticsDialogVisible"
        width="50%">
<!--    时间线    -->
        <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in progressInfo"
            :key="index"
            :timestamp="activity.time">
            {{activity.context}}
          </el-timeline-item>
        </el-timeline>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import cityData from '@/components/order/citydata'
export default {
  name: 'OrderList',
  components: { Breadcrumb },
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 订单列表
      orderList: [],
      // 总数据量
      total: 0,
      // 对话框的显示
      dialogVisible: false,
      // 物流信息对话框
      logisticsDialogVisible: false,
      // 修改地址的表单
      addressFrom: {
        address1: [],
        address2: ''
      },
      addressFromRules: {
        address1: [
          { required: true, message: '请选择省/市区县', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请选择详细地址', trigger: 'blur' }
        ]
      },
      // 城市数据
      cityData,
      // 物流信息
      progressInfo: []
    }
  },
  mounted() {
    this.getOrderList()
  },
  methods: {
    // 获取订单数据
    async getOrderList() {
      const { data: res } = await this.$http.orders.reqGetOrders(this.queryInfo)
      if (res.meta.status !== 200) return this.$message.error('获取订单列表失败')
      this.total = res.data.total
      this.orderList = res.data.goods
    },
    // 显示个数
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    // 页码
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    // 修改地址
    editDialog(row) {
      this.dialogVisible = true
    },
    // 清空表单的数据
    dialogClose() {
      this.$refs.addressFromRef.resetFields()
    },
    // 展示物流进度
    showProgressBox() {
      // 接口废弃，这里直接写死数据
      this.progressInfo = [
        {
          time: '2018-05-10 09:39:00',
          ftime: '2018-05-10 09:39:00',
          context: '已签收,感谢使用顺丰,期待再次为您服务',
          location: ''
        },
        {
          time: '2018-05-10 08:23:00',
          ftime: '2018-05-10 08:23:00',
          context: '【北京市】北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件',
          location: ''
        },
        {
          time: '2018-05-10 07:32:00',
          ftime: '2018-05-10 07:32:00',
          context: '快件到达 【北京海淀育新小区营业点】',
          location: ''
        },
        {
          time: '2018-05-10 02:03:00',
          ftime: '2018-05-10 02:03:00',
          context: '快件在【北京顺义集散中心】已装车,准备发往 【北京海淀育新小区营业点】',
          location: ''
        },
        {
          time: '2018-05-09 23:05:00',
          ftime: '2018-05-09 23:05:00',
          context: '快件到达 【北京顺义集散中心】',
          location: ''
        },
        {
          time: '2018-05-09 21:21:00',
          ftime: '2018-05-09 21:21:00',
          context: '快件在【北京宝胜营业点】已装车,准备发往 【北京顺义集散中心】',
          location: ''
        },
        {
          time: '2018-05-09 13:07:00',
          ftime: '2018-05-09 13:07:00',
          context: '顺丰速运 已收取快件',
          location: ''
        },
        {
          time: '2018-05-09 12:25:03',
          ftime: '2018-05-09 12:25:03',
          context: '卖家发货',
          location: ''
        },
        {
          time: '2018-05-09 12:22:24',
          ftime: '2018-05-09 12:22:24',
          context: '您的订单将由HLA（北京海淀区清河中街店）门店安排发货。',
          location: ''
        },
        {
          time: '2018-05-08 21:36:04',
          ftime: '2018-05-08 21:36:04',
          context: '商品已经下单',
          location: ''
        }
      ]
      this.logisticsDialogVisible = true
    }
  }
}
</script>

<style lang="less" scoped>
.el-cascader{
  width: 100%;
}
</style>
