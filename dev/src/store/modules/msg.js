import {
  queryInfoMsg,
  addInfoMsg
} from '@/api/msg'

const msg = {
  state: {
    publishDialog: { //人员考勤person 窗口
      refresh: 0,
      show: false,
      data: {}
    }

  },
  mutations: {
    SET_PUBLISH_DIALOG: (state, data) => {
      console.log('SET_PUBLISH_DIALOG', data)
      state.publishDialog = data
      const genRandom = (min, max) => (Math.random() * (max - min + 1) | 0) + min;

      state.publishDialog.refresh = genRandom(1, 1000)
      // console.log('dasdasd', data)
    }

  },

  actions: {
    // Publish窗口
    SetPublishDialog({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        console.log('asd')
        commit('SET_PUBLISH_DIALOG', param)
        // console.log('param123123', param)
        resolve()

      })
    },
    // 查询
    QueryInfoMsg({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        queryInfoMsg(param).then(response => {
          const _data = response.data
          resolve(_data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 修改信息
    AddInfoMsg({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        addInfoMsg(param).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
  }
}

export default msg
