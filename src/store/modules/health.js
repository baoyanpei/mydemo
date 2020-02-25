import {
  personHealth,
  personHealthList,
  personHealthDay,
  personHealthDayList,
  personHealthDayLastList,
  personHealthExcel
} from '@/api/health'
const health = {
  state: {
    personHealthDialog: { // 健康编辑窗口
      refresh: 0,
      show: false,
      data: {}
    },
    personHealthDayDialog: { // 健康体检编辑窗口
      refresh: 0,
      show: false,
      data: {}
    },
    personHealthDayLogDialog: { // 健康日志
      refresh: 0,
      show: false,
      data: {}
    },
    personHealthDayChanged: 0 // 数据发生变化
  },
  mutations: {
    SET_PERSON_HEALTH_DIALOG: (state, data) => {
      // console.log('SET_PERSON_INFO_DIALOG', data)
      state.personHealthDialog = data
      const genRandom = (min, max) => (Math.random() * (max - min + 1) | 0) + min;
      // console.log('opShow', data.opShow)
      //   if (data.opShow === undefined) {
      //     // 是否显示操作按钮
      //     state.personHealthDialog.opShow = false
      //   }
      state.personHealthDialog.refresh = genRandom(1, 1000)
    },
    SET_PERSON_HEALTH_DAY_DIALOG: (state, data) => {
      // console.log('SET_PERSON_INFO_DIALOG', data)
      state.personHealthDayDialog = data
      const genRandom = (min, max) => (Math.random() * (max - min + 1) | 0) + min;
      // console.log('opShow', data.opShow)
      //   if (data.opShow === undefined) {
      //     // 是否显示操作按钮
      //     state.personHealthDialog.opShow = false
      //   }
      state.personHealthDayDialog.refresh = genRandom(1, 1000)
    },
    SET_PERSON_HEALTH_DAY_LOG_DIALOG: (state, data) => {
      // console.log('SET_PERSON_HEALTH_DAY_LOG_DIALOG', data)
      state.personHealthDayLogDialog = data
      const genRandom = (min, max) => (Math.random() * (max - min + 1) | 0) + min;
      // console.log('opShow', data.opShow)
      //   if (data.opShow === undefined) {
      //     // 是否显示操作按钮
      //     state.personHealthDialog.opShow = false
      //   }
      state.personHealthDayLogDialog.refresh = genRandom(1, 1000)
      console.log('SET_PERSON_HEALTH_DAY_LOG_DIALOG', state.personHealthDayLogDialog)
    },
    SET_PERSON_HEALTH_DAY_CHANGED: (state) => {
      const genRandom = (min, max) => (Math.random() * (max - min + 1) | 0) + min;
      state.personHealthDayChanged = genRandom(1, 1000)
    },
  },

  actions: {
    SetHealthDialog({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        commit('SET_PERSON_HEALTH_DIALOG', param)
        resolve()
      })
    },
    SetHealthDayDialog({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        commit('SET_PERSON_HEALTH_DAY_DIALOG', param)
        resolve()
      })
    },
    SetHealthDayLogDialog({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        commit('SET_PERSON_HEALTH_DAY_LOG_DIALOG', param)
        resolve()
      })
    },
    // 健康记录查询
    GetPersonHealthList({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        personHealthList(param).then(response => {
          resolve(response.data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 
    SetPersonHealth({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        personHealth(param).then(response => {
          resolve(response.data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 
    SetPersonHealthDay({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        personHealthDay(param).then(response => {
          resolve(response.data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 用户健康日记录
    GetPersonHealthDayList({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        personHealthDayList(param).then(response => {
          resolve(response.data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 健康记录按天最新查询
    GetPersonHealthDayLastList({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        personHealthDayLastList(param).then(response => {
          resolve(response.data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    SetPersonHealthDayChanged({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        commit('SET_PERSON_HEALTH_DAY_CHANGED')
        resolve()
      })
    },
    GetPersonHealthExcel({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        personHealthExcel(param).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
  }
}

export default health
