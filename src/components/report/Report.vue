<template>
  <div>
    <Breadcrumb></Breadcrumb>
    <div id="main" style="width:750px;height:400px;"></div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import * as echarts from 'echarts'
export default {
  name: 'ReportTable',
  components: { Breadcrumb },
  data() {
    return {
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  async mounted() {
    // 基于准备好的dom，初始化echarts实例
    const myChart = echarts.init(document.getElementById('main'))
    const { data: res } = await this.$http.reports.reqGetReports()
    if (res.meta.status !== 200) return this.$message.error('获取折线图失败')
    const option = Object.assign(this.options, res.data)
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option)
  }
}
</script>

<style scoped>

</style>
