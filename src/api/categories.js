// 商品分类相关接口
import requests from '@/utils/request'
// 获取商品分类的数据
export const reqGetCategoriesList = (params) => requests.request({ url: '/categories', params, method: 'get' })
// 添加分类
export const reqAddCategories = (data) => requests.request({ url: '/categories', data, method: 'post' })
// 根据 id 查询分类
export const reqGetCategoriesInfo = (id) => requests.request({ url: `/categories/${id}`, method: 'get' })
// 编辑提交分类
export const reqEditCategories = (id, data) => requests.request({ url: `/categories/${id}`, data, method: 'put' })
// 删除分类
export const reqDeleteCategories = (id) => requests.request({ url: `/categories/${id}`, method: 'delete' })
