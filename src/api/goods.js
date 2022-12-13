// 商品相关接口
import requests from '@/utils/request'
// 获取商品列表
export const reqGetGoodsList = (params) => requests.request({ url: '/goods', params, method: 'get' })
// 删除商品
export const reqDeleteGoods = (id) => requests.request({ url: `/goods/${id}`, method: 'delete' })
// 添加商品
export const reqAddGoods = (data) => requests.request({ url: '/goods', data, method: 'post' })
// 编辑商品
export const reqEditGoods = (id, data) => requests.request({ url: `/goods/${id}`, data, method: 'put' })
// 根据Id查询商品
export const reqGetGoodsInfo = (id) => requests.request({ url: `/goods/${id}`, method: 'get' })
