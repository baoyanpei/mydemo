module.exports = {
  proxyList: {
    '/api/bcp/web': {
      // 测试环境
      target: 'http://admin.yidebim.com', // 接口域名
      changeOrigin: true, //是否跨域
      pathRewrite: {
        '/api/bcp/web': '/api/bcp/web'
        //需要rewrite重写的,
      }
    },
    '/api/bcp/pm': {
      // 测试环境
      target: 'http://admin.yidebim.com', // 接口域名
      changeOrigin: true, //是否跨域
      pathRewrite: {
        '/api/bcp/pm': '/api/bcp/pm'
        //需要rewrite重写的,
      }
    },
    '/api': {
      // 测试环境
      target: 'http://w.yidebim.com:3002', // 接口域名
      changeOrigin: true, //是否跨域
      pathRewrite: {
        '/api': '/api'
        //需要rewrite重写的,
      }
    },
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
