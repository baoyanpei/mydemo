module.exports = {
  proxyList: {
    '/api': {
      // 测试环境
      target: 'http://admin.man.yidebim.com/', // 接口域名
      changeOrigin: true, //是否跨域
      pathRewrite: {
        '/api': '/api'
        //需要rewrite重写的,
      }
    },
    '/BCP_FILE': {
      // 测试环境
      target: 'http://admin.man.yidebim.com/', // 接口域名
      changeOrigin: true, //是否跨域
      pathRewrite: {
        '/BCP_FILE': '/BCP_FILE'
        //需要rewrite重写的,
      }
    },
    '/veh_pic': {
      // 测试环境
      target: 'http://admin.man.yidebim.com/', // 接口域名
      changeOrigin: true, //是否跨域
      pathRewrite: {
        '/veh_pic': '/veh_pic'
        //需要rewrite重写的,
      }
    }
  }
}
