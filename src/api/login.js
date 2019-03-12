import request from '@/utils/request'

// 短信验证码登录
export function loginByUsername(username, password) {
  const data = {
    "method": "auth",
    "user": username,
    "code": password,
    "ver": "10",
    "source": 3 //日志表logs_api 中的source为请求来源：来源：1为入职客户端（春春）2为道闸客户端（财建）3为web客户端4为微信5为android客户端6为苹果客户端
  }
  return request({
    url: '/api/sms/code',
    method: 'post',
    data
  })
}

// 微信二维码登录
export function loginByWXQRCode(code, state) {
  const data = {
    "method": "wx_qrcode",
    "code": code,
    "state": state,
  }
  return request({
    url: '/api/sms/code',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/login/logout',
    method: 'post'
  })
}

export function getUserInfo(token) {
  return request({
    url: '/api/info/user',
    method: 'post',
    // params: {
    //   token
    // }
  })
}

export function getSmsCode(username) {
  const data = {
    "method": "get",
    "user": username,
    "code": "",
    "ver": "10",
  }
  return request({
    url: '/api/sms/code',
    method: 'POST',
    data
  })
}
