import axios from 'axios'
import {
  Message
} from 'element-ui'
import store from '@/store'
import {
  getToken
} from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 50000// request timeout
})
// const _source = 3
// const _userid = 'admin_web'
// request interceptor
service.interceptors.request.use(

  config => {
   console.log("configconfig000011", config)
    config.headers = {

      'Content-Type': 'application/json'
    }

    /*

日志表logs_api 中的source为请求来源：来源：1为入职客户端（春春）2为道闸客户端（财建）3为web客户端4为微信5为android客户端6为苹果客户端

userid为登陆账号，user表的login_name;如果存在无需认证的情况，需带上机器请求账号
闸机程序账号：admin_sluice
PC网页账号：admin_web
手机请求账号：admin_phone

*/
    // if (config.method == 'post') {

    //   config.data = {
    //     ...config.data,
    //     source: _source,
    //     userid: _userid,
    //     _t: Date.parse(new Date()) / 1000,
    //   }
    // } else if (config.method == 'get') {
    //   config.params = {
    //     ...config.params,
    //     source: _source,
    //     userid: _userid,
    //     _t: Date.parse(new Date()) / 1000,

    //   }
    // }

    // Do something before request is sent
    // console.log('config.data', config.data.access_token)
    if (config.data.access_token !== undefined) {
      config.headers['Authorization'] = 'JWT ' + config.data.access_token
    } else if (store.getters.token) {
      // console.log("--->", store.getters.token)
      // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
      // config.headers['X-Token'] = getToken()
      config.headers['Authorization'] = 'JWT ' + getToken()
    }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// respone interceptor
service.interceptors.response.use(
  // response => response,
  /**
   * 下面的注释为通过在response里，自定义code来标示请求状态
   * 当code返回如下情况则说明权限有问题，登出并返回到登录页
   * 如想通过xmlhttprequest来状态码标识 逻辑可写在下面error中
   * 以下代码均为样例，请结合自生需求加以修改，若不需要，则可删除
   */
  response => {
    // console.log("response123", response)
    const status = response.status
    const res = response.data
    if (status === 200) {

      if (res.status !== 'success') {

        if (res.msg !== undefined && res.msg) {
          try {
            const _data = JSON.parse(response.config.data)
            console.log('_data_data', _data)
            if (_data.method === 'checkPersonAccess') { // url的访问权限判断
              return res
            } else if (_data.method === 'wx_qrcode') { // url的访问权限判断
              return res
            } else if (_data.method === 'set_outsys_info') { // url的访问权限判断
              return res
            } else {
              console.log('接口请求失败1', res.msg)
              // Message({
              //   message: res.msg + "（1接口status!=success）",
              //   type: 'error',
              //   duration: 5 * 1000
              // })
            }
          } catch (error) {
            console.log('接口请求失败2', res.msg)
          }


          return Promise.reject('error')
        } else {
          return res
        }

        //
      } else {
        return res
      }
    } else {
      console.log('err' + error) // for debug
      Message({
        message: 'error:' + status,
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(error)
    }
  },
  error => {
    console.log('error', error);
    console.log('response', error.response);
    if (error.response !== undefined) {
      const status = error.response.status
      if (status === 401) {
        store.dispatch('LogOut').then(() => {
          console.log('location', location)
          if (location.href.indexOf('/xcx/pvshow') >= 0) { // 小程序视点
            location.href = location.href + '&errormsg=token鉴权失败,请试试重新打开'
          } else if (location.href.indexOf('/xcx/model') >= 0) { // 小程序bim模型
            location.href = location.href + '&errormsg=token鉴权失败,请试试重新打开'
          }
          location.reload() // In order to re-instantiate the vue-router object to avoid bugs
        })
      }

      console.log('接口请求错误', error.message)
      // Message({
      //   message: error.message,
      //   type: 'error',
      //   duration: 5 * 1000
      // })
    }

    return Promise.reject(error)
  }
)

export default service
