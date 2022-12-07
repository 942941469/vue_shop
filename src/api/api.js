// 登录相关接口
import requests from '@/utils/request'
// 登录
export const reqLoginForm = (data) => requests.request({ url: '/login', data, method: 'post' })
// 获取权限列表
export const reqGetMenus = () => requests.request({ url: '/menus', method: 'get' })
// 所有角色列表数据
export const reqGetRolesList = () => requests.request({ url: '/menus', method: 'get' })
