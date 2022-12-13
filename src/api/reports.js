// 报表相关接口
import requests from '@/utils/request'
// 基于时间统计的折线图
export const reqGetReports = () => requests.request({ url: '/reports/type/1', method: 'get' })
