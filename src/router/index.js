import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Welcome from '@/components/Home/Welcome'
import Users from '@/components/users/Users'
import Rights from '@/components/power/Rights'
import Roles from '@/components/power/Roles'
import Categories from '@/components/goods/Categories'
import Params from '@/components/goods/Params'
import List from '@/components/goods/List'
import AddGoods from '@/components/goods/AddGoods'
import Order from '@/components/order/Order'
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
