import {
  getAllInstList,
  queryTaskAll,
  getdist
} from '@/api/workflow'

const workflow = {
  state: {

  },
  mutations: {

  },

  actions: {
    // 获取某个流程ID的所有流程实例,完成列表，或进行时列表
    GetAllInstList({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        getAllInstList(param).then(response => {
          //   commit('SET_PROJECT_PERSON_LIST', response.data)
          resolve(response.data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    GetDist({//配电箱巡检获取设备
        commit
      }, param) {
        return new Promise((resolve, reject) => {
          getdist(param).then(response => {
            resolve(response.data)
          }).catch(error => {
            reject(error)
          })
        })
    },
    // 获取任务列表
    QueryTaskAll({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        queryTaskAll(param).then(response => {
          //   commit('SET_PROJECT_PERSON_LIST', response.data)
          resolve(response.data)
        }).catch(error => {
          reject(error)
        })
      })
    }

  }
}

export default workflow
