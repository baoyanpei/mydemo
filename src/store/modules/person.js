import {
  queryPersonOnlineMax,
  queryPersonInfo,
  queryTjOnlineAgeByTime,
  queryTjOnlineAreaByTime
} from '@/api/person'

const person = {
  state: {
    personInfo: null,

    logsPersonComfirmDialog: { // 认证验证确认窗口
      show: false,
      data: {}
    },
    personGoOutDialog: { // 认证验证确认窗口
      show: false
    },
    personOnlineMaxList: []
  },
  mutations: {
    SET_PERSON_INFO: (state, data) => {
      // console.log('SET_PERSON_INFO', data)
      state.personInfo = data

    },
    SET_LOGS_PERSON_COMFIRM_DIALOG: (state, data) => {
      //show:true false
      console.log('logsPersonComfirmDialog1', data)
      state.logsPersonComfirmDialog = data

    },
    SET_PERSON_GO_OUT_DIALOG: (state, data) => {
      //show:true false
      // console.log('logsPersonComfirmDialog1', data)
      state.personGoOutDialog = data

    },
    // 设置计划列表数据
    SET_PERSON_ONLINE_MAX_LIST: (state, data) => {
      state.personOnlineMaxList = data
    },

  },

  actions: {
    //查询每天最大进场人数
    QueryPersonInfo({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        queryPersonInfo(param).then(response => {
          // console.log("queryPersonInfo", response.data)
          commit('SET_PERSON_INFO', response.data)
          resolve(response.data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    //  认证验证确认窗口
    SetLogsPersonComfirmDialog({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        // console.log('param11', param)
        commit('SET_LOGS_PERSON_COMFIRM_DIALOG', param)
        resolve()

      })
    },
    SetPersonGoOutDialog({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        // console.log('param11', param)
        commit('SET_PERSON_GO_OUT_DIALOG', param)
        resolve()

      })
    },
    //查询每天最大进场人数
    QueryPersonOnlineMaxList({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        queryPersonOnlineMax(param).then(response => {
          // console.log("QueryPersonOnlineMaxList", response.data)
          commit('SET_PERSON_ONLINE_MAX_LIST', response.data)
          resolve(response.data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    //按统计时段内区域人数
    QueryTjOnlineAgeByTime({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        queryTjOnlineAgeByTime(param).then(response => {
          // console.log("queryTjOnlineAgeByTime", response.data)
          resolve(response.data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    //按统计时段内区域人数
    queryTjOnlineAreaByTime({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        queryTjOnlineAreaByTime(param).then(response => {
          // console.log("queryTjOnlineAreaByTime", response.data)
          resolve(response.data)
        }).catch(error => {
          reject(error)
        })
      })
    }


  }
}

export default person
