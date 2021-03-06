
module.exports = {
  proxyList: {
    "/api": {
      // 测试环境
      target: "http://admin.man.yidebim.com/", // 接口域名
      changeOrigin: true, //是否跨域
      pathRewrite: {
        "/api": "/api"

        //需要rewrite重写的,dd
      },
      secure: false
    },
    "/BCP_FILE": {
      // 测试环境
      target: "http://admin.man.yidebim.com/", // 接口域名
      changeOrigin: true, //是否跨域
      pathRewrite: {
        "/BCP_FILE": "/BCP_FILE"
        //需要rewrite重写的,
      },
      secure: false
    },
    "/veh_pic": {
      // 测试环境
      target: "http://admin.man.yidebim.com/", // 接口域名
      changeOrigin: true, //是否跨域
      pathRewrite: {
        "/veh_pic": "/veh_pic"
        //需要rewrite重写的,
      },
      secure: false
    },
    "/org_images": {
      // 测试环境
      target: "http://w.yidebim.com:8899/", // 各个组织的logo等静态图片位置配置
      changeOrigin: true, //是否跨域
      pathRewrite: {
        "/org_images": "/org_images"
        //需要rewrite重写的,
      },
      secure: false
    }
  }
};
