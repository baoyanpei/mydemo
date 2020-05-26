  const componentLibrary = {
    state: {
      ComponentLibraryListDialog: { // 列表窗口
        refresh: 0,
        show: false,
        data: {}
      },
      ComponentDataAdd: {
        refresh: 0,
        data: {}
      }, // 数据发生变化
    },
    mutations: {
      SHOW_COMPONENT_LIBRARY_LIST_DIALOG: (state, data) => {
        state.ComponentLibraryListDialog = data
        const genRandom = (min, max) => (Math.random() * (max - min + 1) | 0) + min;
        state.ComponentLibraryListDialog.refresh = genRandom(1, 1000)
        console.log('----->', state.ComponentLibraryListDialog)
      },
      SET_COMPONENT_DATA_ADD: (state, data) => {
        state.ComponentDataAdd = data
        const genRandom = (min, max) => (Math.random() * (max - min + 1) | 0) + min;
        state.ComponentDataAdd.refresh = genRandom(1, 1000)
      },

    },
    actions: {
      ShowComponentLibraryListDialog({
        commit
      }, param) {
        return new Promise((resolve, reject) => {
          commit('SHOW_COMPONENT_LIBRARY_LIST_DIALOG', {
            ...param
          })
          resolve()
        })
      },
      SetComponentDataAdd({
        commit
      }, param) {
        return new Promise((resolve, reject) => {
          commit('SET_COMPONENT_DATA_ADD', param)
          resolve()
        })
      },
    }
  }

  export default componentLibrary
