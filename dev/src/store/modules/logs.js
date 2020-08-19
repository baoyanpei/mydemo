import {
  setLogs
} from '@/api/logs'

const logs = {
    state: {
  
    },
    mutations: {
  
    },
  
    actions: {
      // 写入日志
      SetLogs({
        commit
      }, param) {
        return new Promise((resolve, reject) => {
            setLogs(param).then(response => {
            //   commit('SET_PROJECT_PERSON_LIST', response.data)
            resolve(response.data)
          }).catch(error => {
            reject(error)
          })
        })
      },
      
  
    }
  }
  
  export default logs