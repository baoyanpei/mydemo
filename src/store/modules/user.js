import {
  loginByUsername,
  loginByWXQRCode,
  logout,
  getUserInfo,
  getSmsCode
} from '@/api/login'
import {
  getToken,
  setToken,
  removeToken
} from '@/utils/auth'

const user = {
  state: {
    user: '',
    status: '',
    code: '',
    token: getToken(),
    name: '',
    avatar: '',
    introduction: '',
    roles: [],
    setting: {
      articlePlatform: []
    }
  },

  mutations: {
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // 用户名登录
    // source = 3
    LoginByUsername({
      commit
    }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        loginByUsername(username, userInfo.password).then(response => {

          const data = response
          commit('SET_TOKEN', data.access_token)
          // console.log('SET_TOKEN',data)
          setToken(data.access_token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 用户名登录
    // source = 3
    loginByWXQRCode({
      commit
    }, userInfo) {
      return new Promise((resolve, reject) => {
        console.log('userInfo', userInfo)
        loginByWXQRCode(userInfo.code, userInfo.status).then(res => {
          console.log('datadata', res)
          if (res.status === 'success') {
            commit('SET_TOKEN', res.access_token)
          }
          // // console.log('SET_TOKEN',data)
          setToken(res.access_token)
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取用户信息
    GetUserInfo({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
        getUserInfo(state.token).then(response => {
          response = {
            data: {
              roles: ['admin'],
              name: "",
              avatar: '',
              introduction: ''
            },
            status: 'success'
          }
          const data = response.data
          console.log("----1----", data)
          commit('SET_ROLES', data.roles)
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          commit('SET_INTRODUCTION', data.introduction)
          console.log("----2----")
          resolve(response)

          //
          // if (!response.data) { // 由于mockjs 不支持自定义状态码只能这样hack
          //   reject('error:GetUserInfo')
          // }
          // const data = response.data

          // if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
          //   commit('SET_ROLES', data.roles)
          // } else {
          //   reject('getInfo: roles must be a non-null array !')
          // }

          // commit('SET_NAME', data.name)
          // commit('SET_AVATAR', data.avatar)
          // commit('SET_INTRODUCTION', data.introduction)
          // resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 第三方验证登录
    // LoginByThirdparty({ commit, state }, code) {
    //   return new Promise((resolve, reject) => {
    //     commit('SET_CODE', code)
    //     loginByThirdparty(state.status, state.email, state.code).then(response => {
    //       commit('SET_TOKEN', response.data.token)
    //       setToken(response.data.token)
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 登出
    LogOut({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {

        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resolve()

        /*
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })*/
      })
    },

    // 前端 登出
    FedLogOut({
      commit
    }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    },

    // 动态修改权限
    ChangeRoles({
      commit
    }, role) {
      return new Promise(resolve => {
        commit('SET_TOKEN', role)
        setToken(role)
        getUserInfo(role).then(response => {
          const data = response.data
          commit('SET_ROLES', data.roles)
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          commit('SET_INTRODUCTION', data.introduction)
          resolve()
        })
      })
    },

    // 获取短信验证码
    GetSmsCode({
      commit
    }, username) {
      return new Promise((resolve, reject) => {
        getSmsCode(username).then(response => {
          // const data = response
          // commit('SET_TOKEN', data.access_token)
          // console.log('SET_TOKEN',data)
          // setToken(data.access_token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default user
