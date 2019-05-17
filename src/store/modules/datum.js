import {
  queryDatumMeter,
  queryDatumMeterDays,
  queryDatumMeterHours,
  queryLocationHis
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
