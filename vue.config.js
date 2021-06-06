// vue.config.js
const {init} = require('./service/index')
const ENV = process.env.NODE_ENV;
module.exports = {
  publicPath: ENV === "development" ? "" : "/epidemic/",
    chainWebpack:async config => {
     await init()
     await config.module
        .rule('css')
        .test(/\.css$/)
        .oneOf('vue')
        .resourceQuery(/\?vue/)
        .use('px2rem')
        .loader('px2rem-loader')
        .options({
          remUnit: 192   //代表的是 1rem = ？px  这里假设设计稿是 1920px ，那么这里的比例就是 1/10
        })
        .end()
    },
    configureWebpack: {
      externals: {
          AMap: "AMap"
      }
    },
  }