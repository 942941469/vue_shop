// 商品分类相关接口
import requests from '@/utils/request'
// 获取商品分类的数据
export const reqGetCategoriesList = (params) => requests.request({ url: '/categories', params, method: 'get' })
// 添加分类
export const reqAddCategories = (data) => requests.request({ url: '/categories', data, method: 'post' })
// 根据id查询分类
export const reqGetCategoriesInfo = (id) => requests.request({ url: `/categories/${id}`, method: 'get' })
// 编辑提交分类
export const reqEditCategories = (id, data) => requests.request({ url: `/categories/${id}`, data, method: 'put' })
// 删除分类
export const reqDeleteCategories = (id) => requests.request({ url: `/categories/${id}`, method: 'delete' })
// 参数列表
export const reqGetAttr = (id, params) => requests.request({ url: `/categories/${id}/attributes`, params, method: 'get' })
// 添加动态参数或者静态属性
export const reqAddAttr = (id, data) => requests.request({ url: `/categories/${id}/attributes`, data, method: 'post' })
// 根据id查询参数
export const reqGetAttrInfo = (id, attrId, params) => requests.request({ url: `/categories/${id}/attributes/${attrId}`, params, method: 'get' })
// 编辑提交参数
export const reqEditAttr = (id, attrId, data) => requests.request({ url: `/categories/${id}/attributes/${attrId}`, data, method: 'put' })
// 删除参数
export const reqDeleteAttr = (id, attrId) => requests.request({ url: `/categories/${id}/attributes/${attrId}`, method: 'delete' })
