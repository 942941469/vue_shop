import Vue from 'vue'
import VueRouter from 'vue-router'
// 路由懒加载
const Login = () => import('@/components/Login')
const Home = () => import('@/components/Home')
const Welcome = () => import('@/components/Home/Welcome')
const Users = () => import('@/components/users/Users')
const Rights = () => import('@/components/power/Rights')
const Roles = () => import('@/components/power/Roles')
const Categories = () => import('@/components/goods/Categories')
const Params = () => import('@/components/goods/Params')
const List = () => import('@/components/goods/List')
const AddGoods = () => import('@/components/goods/AddGoods')
const Order = () => import('@/components/order/Order')
const Report = () => import('@/components/report/Report')
Vue.use(VueRouter)
const routes = [
  {
    path: '/',
    // 重定向
    redirect: '/login'
  },
  {
    // 登录
    path: '/login',
    component: Login
  },
  {
    // 首页
    path: '/home',
    component: Home,
    redirect: '/home/welcome',
    // 路由元信息
    meta: {
      title: '首页'
    },
    children: [
      {
        // 首页欢迎
        path: 'welcome',
        component: Welcome
      },
      {
        // 用户
        path: 'users',
        component: Users,
        meta: {
          title: '用户列表'
        }
      },
      {
        // 权限列表
        path: 'rights',
        component: Rights,
        meta: {
          title: '权限列表'
        }
      },
      {
        // 角色列表
        path: 'roles',
        component: Roles,
        meta: {
          title: '角色列表'
        }
      },
      {
        // 商品分类
        path: 'params',
        component: Params,
        meta: {
          title: '商品分类'
        }
      },
      {
        // 分类参数
        path: 'categories',
        component: Categories,
        meta: {
          title: '分类参数'
        }
      },
      {
        // 商品列表
        path: 'goods',
        component: List,
        meta: {
          title: '商品列表'
        }
      },
      {
        // 添加商品
        path: 'goods/add',
        component: AddGoods,
        meta: {
          title: '添加商品'
        }
      },
      {
        // 订单管理
        path: 'orders',
        component: Order,
        meta: {
          title: '订单管理'
        }
      },
      {
        // 数据报表
        path: 'reports',
        component: Report,
        meta: {
          title: '数据报表'
        }
      }
    ]
  }
]

const router = new VueRouter({
  routes
})
// 挂载路由导航控制守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})
export default router
