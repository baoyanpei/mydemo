const tools = {
  state: {
    worldCitysDialog: { // 健康编辑窗口
      refresh: 0,
      show: false,
      data: {}
    },
    healthWorldCitysData: { // 健康窗口
      data: {}
    },
  },
  mutations: {
    SET_WORLD_CITYS_DIALOG: (state, data) => {
      // console.log('SET_PERSON_INFO_DIALOG', data)
      state.worldCitysDialog = data
      const genRandom = (min, max) => (Math.random() * (max - min + 1) | 0) + min;
      state.worldCitysDialog.refresh = genRandom(1, 1000)
    },
    SET_WORLD_CITYS_DATA: (state, data) => {
      const genRandom = (min, max) => (Math.random() * (max - min + 1) | 0) + min;
      // console.log('SET_PERSON_INFO_DIALOG', data)
      state.healthWorldCitysData = {
        name: data.data,
        id: genRandom(1, 1000)
      }

      state.healthWorldCitysData.refresh = genRandom(1, 1000)
      console.log('state.healthWorldCitysData', state.healthWorldCitysData)
    },
  },

  actions: {
    SetWorldCitysDialog({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        commit('SET_WORLD_CITYS_DIALOG', param)
        resolve()
      })
    },
    SetHealthWorldCitysData({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        commit('SET_WORLD_CITYS_DATA', param)
        resolve()
      })
    },
  }
}

export default tools
