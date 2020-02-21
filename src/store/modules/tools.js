const tools = {
    state: {
      worldCitysDialog: { // 健康编辑窗口
        refresh: 0,
        show: false,
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
    }
  }
  
  export default tools
  