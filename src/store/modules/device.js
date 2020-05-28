import {
  getDeviceConfig,
} from '@/api/device'

const device = {
  state: {

  },
  mutations: {


  },
  actions: {
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
  }
}

export default device
