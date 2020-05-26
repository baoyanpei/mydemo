  const componentLibrary = {
    state: {
      ComponentLibraryListDialog: { // 列表窗口
        refresh: 0,
        show: false,
        data: {}
      },
    },
    mutations: {
      SHOW_COMPONENT_LIBRARY_LIST_DIALOG: (state, data) => {
        state.ComponentLibraryListDialog = data
        const genRandom = (min, max) => (Math.random() * (max - min + 1) | 0) + min;
        state.ComponentLibraryListDialog.refresh = genRandom(1, 1000)
        console.log('----->', state.ComponentLibraryListDialog)
      }

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
    }
  }

  export default componentLibrary
