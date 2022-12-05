import requests from '@/utils/request'
// 获取用户列表
export const reqGetUserList = (params) => requests.request({ url: '/users', params, method: 'get' })
// 修改用户状态
export const reqChangeUserState = (userinfo) => requests.request({ url: `/users/${userinfo.id}/state/${userinfo.mg_state}`, method: 'put' })
// 添加用户
export const reqAddUser = (data) => requests.request({ url: '/users', data, method: 'post' })
// 根据ID查询用户信息
export const reqGetUserInfo = (id) => requests.request({ url: `/users/${id}`, method: 'get' })
// 修改用户信息
export const reqEditUserInfo = (id, data) => requests.request({ url: `/users/${id}`, data, method: 'put' })
// 删除用户
export const reqDeleteUser = (id) => requests.request({ url: `/users/${id}`, method: 'delete' })
