import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/reset.css';
Vue.config.productionTip = false
import 'lib-flexible/flexible.js'
// import Antd from "ant-design-vue"
// import 'ant-design-vue/dist/antd.css';
import methods from "../src/assets/js/publicMethods"

import echarts from 'echarts'
Vue.prototype.$echarts = echarts;
Vue.use(methods)
Vue.use(ElementUI);
//Vue.use(Antd);


// 设置页面title
router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})
var arrs = []
router.beforeEach((to, from, next) => {
  if (to.path) {
    let obj = {
      paths: to.path,
      names: to.meta.title
    }
    arrs.push(obj)
  }
  if (to.path == '/dataBoard') {
    arrs = [
      {
        paths: '/dataBoard',
        names: '数据分析'
      },
    ]
    sessionStorage.setItem('arrs', JSON.stringify(arrs))
  }
  if (to.path == '/Home') {
    arrs = [
      {
        paths: '/Home',
        names: '首页'
      }
    ]
    sessionStorage.setItem('arrs', JSON.stringify(arrs))
  }
  if (to.path == '/thinktank') {
    arrs = [
      {
        paths: '/thinktank',
        names: '疫情填报'
      }
    ]
    sessionStorage.setItem('arrs', JSON.stringify(arrs))
  }
  let array = {}, List = []
  for (let i = 0; i < arrs.length; i++) {
    let item = arrs[i]
    if (!array[item['names']]) {
      array[item['names']] = List.push(item)
    }
  }
  // console.log(List,'2222222');
  sessionStorage.setItem('arrs', JSON.stringify(List))
  next()
})



new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
