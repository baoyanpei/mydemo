const health = {
  state: {
    personHealthDialog: { // 健康编辑窗口
      refresh: 0,
      show: false,
      data: {}
    },
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
  }
}

export default health
