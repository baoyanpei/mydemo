
const bindBim = {
  state: {
    BindBimDialog: { // 管理窗口
      refresh: 0,
      show: false,
      data: {}
    },

  },
  mutations: {
    SHOW_BIND_BIM_DIALOG: (state, data) => {
      state.BindBimDialog = data
      const genRandom = (min, max) => (Math.random() * (max - min + 1) | 0) + min;
      state.BindBimDialog.refresh = genRandom(1, 1000)
      console.log('----->', state.BindBimDialog)
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
    }
  }
}

export default bindBim
