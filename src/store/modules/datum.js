import {
    queryDatumMeter,
    queryDatumMeterDays
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
  
  
    }
  }
  
  export default datum
  