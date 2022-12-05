import requests from '@/utils/request'
// 登录
export const reqLoginForm = (data) => requests.request({ url: '/login', data, method: 'post' })
// 左侧菜单栏数据
export const reqGetMenus = () => requests.request({ url: '/menus', method: 'get' })
