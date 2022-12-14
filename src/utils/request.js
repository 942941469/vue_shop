import axios from 'axios'
// 引入进度条
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'
const requests = axios.create({
  // 配置对象
  // 基础路径
  baseURL: 'http://127.0.0.1:8888/api/private/v1',
  // 代表请求超时的时间5s
  timeout: 5000
})
// 请求拦截器
requests.interceptors.request.use((config) => {
  Nprogress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// 响应拦截器
requests.interceptors.response.use((config) => {
  Nprogress.done()
  return config
})
export default requests
