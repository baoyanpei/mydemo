module.exports = {
  proxyList: {
    // '/api': {
    //   // 测试环境
    //   target: 'http://admin.yidebim.com', // 接口域名
    //   changeOrigin: true, //是否跨域
    //   pathRewrite: {
    //     '/api': '/api'
    //     //需要rewrite重写的,
    //   }
    // },
    '/BCP_FILE': {
      // 测试环境
      target: 'http://admin.yidebim.com', // 接口域名
      changeOrigin: true, //是否跨域
      pathRewrite: {
        '/BCP_FILE': '/BCP_FILE'
        //需要rewrite重写的,
      }
    }
  }
}
