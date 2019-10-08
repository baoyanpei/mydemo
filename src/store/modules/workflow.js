import {
  getAllInstList
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

  }
}

export default workflow
