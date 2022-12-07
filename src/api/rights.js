// 权限相关接口
import requests from '@/utils/request'
// 获取所有权限列表
export const reqGetRights = (data) => requests.request({ url: `/rights/${data}`, method: 'get' })
// 所有角色列表
export const reqGetRolesList = () => requests.request({ url: '/roles', method: 'get' })
// 添加角色
export const reqAddRole = (data) => requests.request({ url: '/roles', data, method: 'post' })
// 根据ID查询用户信息
export const reqGetRoleInfo = (id) => requests.request({ url: `/roles/${id}`, method: 'get' })
// 编辑角色
export const reqEditRole = (id, data) => requests.request({ url: `/roles/${id}`, data, method: 'put' })
// 删除角色
export const reqDeleteRole = (id) => requests.request({ url: `/roles/${id}`, method: 'delete' })
// 删除角色权限
export const reqDeleteRights = (roleId, rightId) => requests.request({ url: `/roles/${roleId}/rights/${rightId}`, method: 'delete' })
// 角色授权
export const reqAllotRights = (roleId, data) => requests.request({ url: `/roles/${roleId}/rights`, data, method: 'post' })
