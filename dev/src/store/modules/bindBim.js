const bindBim = {
  state: {
    BindBimDialog: { // 管理窗口
      refresh: 0,
      show: false,
      data: {}
    },
    BindBimDataChanged: 0 // 数据发生变化
  },
  mutations: {
    SHOW_BIND_BIM_DIALOG: (state, data) => {
      state.BindBimDialog = data
      const genRandom = (min, max) => (Math.random() * (max - min + 1) | 0) + min;
      state.BindBimDialog.refresh = genRandom(1, 1000)
      console.log('----->', state.BindBimDialog)
    },
    SET_BIND_BIM_DATA_IS_CHANGED: (state) => {
      const genRandom = (min, max) => (Math.random() * (max - min + 1) | 0) + min;
      state.BindBimDataChanged = genRandom(1, 1000)
    },
  },
  actions: {
    ShowBindBimDialog({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        commit('SHOW_BIND_BIM_DIALOG', {
          ...param
        })
        resolve()
      })
    },
    SetBindBimDataChanged({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        commit('SET_BIND_BIM_DATA_IS_CHANGED')
        resolve()
      })
    },
  }
}

export default bindBim
