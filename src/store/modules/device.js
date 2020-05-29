import {
  getDeviceType,
  getDeviceConfig,
  updateDeviceConfig
} from '@/api/device'

const device = {
  state: {

  },
  mutations: {


  },
  actions: {
    GetDeviceType({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        getDeviceType(param).then(response => {
          const _data = response.data
          // commit('SET_PROJECT_GATE_PERSON', _data)
          resolve(_data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    GetDeviceConfig({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        getDeviceConfig(param).then(response => {
          const _data = response.data
          // commit('SET_PROJECT_GATE_PERSON', _data)
          resolve(_data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    UpdateDeviceConfig({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        updateDeviceConfig(param).then(response => {
          resolve(response.data)
        }).catch(error => {
          reject(error)
        })
      })
    },
  }
}

export default device
