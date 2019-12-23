import {
  queryDatumMeter,
  queryDatumMeterDays,
  queryDatumMeterHours,
  allpersondata,
  postmomment,
  allinfodictionary,
  queryLocationHis,
  safeinspection
} from '@/api/datum'

const datum = {
  state: {

  },
  mutations: {

  },

  actions: {
    // 查询列表
    QueryDatumMeter({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        queryDatumMeter(param).then(response => {
          //   commit('SET_PROJECT_PERSON_LIST', response.data)
          resolve(response.data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 历史记录
    QueryDatumMeterDays({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        queryDatumMeterDays(param).then(response => {
          //   commit('SET_PROJECT_PERSON_LIST', response.data)
          resolve(response.data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 小时记录
    QueryDatumMeterHours({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        queryDatumMeterHours(param).then(response => {
          //   commit('SET_PROJECT_PERSON_LIST', response.data)
          resolve(response.data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    //任務列表信息
    Allpersondata({
      commit
    },param){
      return new Promise((resolve, reject) => {
        allpersondata(param).then(response => {
          let _data = {
            data:response.data,
            count:response.count
          }
          resolve(_data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    //配置表
    Allinfodictionary({
      commit
    },param){
      return new Promise((resolve, reject) => {
        allinfodictionary(param).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    //上传评论信息
    Postmomment({
      commit
    },param){
      return new Promise((resolve, reject) => {
        postmomment(param).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    //安全巡检页面safeinspection
    SafeInspection({
      commit
    },param){
      return new Promise((resolve, reject) => {
        safeinspection(param).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 查询项目定位历史信息
    QueryLocationHis({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        queryLocationHis(param).then(response => {
          //   commit('SET_PROJECT_PERSON_LIST', response.data)
          resolve(response.data)
        }).catch(error => {
          reject(error)
        })
      })
    },

  }
}

export default datum
