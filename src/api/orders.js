// 权限相关接口
import requests from '@/utils/request'
// 获取订单数据列表
export const reqGetOrders = (params) => requests.request({ url: '/orders', params, method: 'get' })
