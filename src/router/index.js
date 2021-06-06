import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Index',
    component: resolve => (require(["@/views/Index"], resolve)),
    redirect: "/Login",
    children: [
      {
        path: '/Home',
        name: 'Home',
        component: resolve => (require(["@/views/Home"], resolve)),
        meta: {
          title: '首页'
        }

      },
      {
        path: '/dataBoard',
        name: 'dataBoard',
        component: resolve => (require(["@/views/dataBoard"], resolve)),
        meta: {
          title: '数据分析'
        }
      },
      {
        path: "/thinktank",
        name: 'thinktank',
        component: resolve => (require(["@/views/thinktank"], resolve)),
        meta: {
          title: '疫情填报'
        },
      },
      {
        path: "/ThinktankDetails",
        name: 'ThinktankDetails',
        component: resolve => (require(["@/views/ThinktankDetails"], resolve)),
        meta: {
          title: '政策详情'
        }
      },
      {
        path: "/ArticleDetails",
        name: 'ArticleDetails',
        component: resolve => (require(["@/views/ArticleDetails"], resolve)),
        meta: {
          title: '文章详情'
        }
      },
      {
        path: "/ThinkTankManagement",
        name: 'ThinkTankManagement',
        component: resolve => (require(["@/views/ThinkTankManagement"], resolve)),
        meta: {
          title: '信息管理'
        }
      },
      {
        path: "/personal",
        name: 'personal',
        component: resolve => (require(["@/views/Personal"], resolve)),
        meta: {
          title: '信息管理'
        }
      },
    ]
  },
  {
    path: '/Login',
    name: 'Login',
    component: resolve => (require(["@/views/login"], resolve)),
    meta: {
      title: '登录'
    }
  },
]


const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
