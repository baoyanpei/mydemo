import Cookies from 'js-cookie'
import hasPermissionToOperation from '@/utils/permissionUrl' // 权限判断函数

const loT = {
  state: {
    VideoDialog: { //personInfo窗口
      refresh: 0,
      show: false,
      data: {}
    }
  },
  mutations: {
    SET_VEDIO_DIALOG: (state, data) => {
      state.VideoDialog = data
      const genRandom = (min, max) => (Math.random() * (max - min + 1) | 0) + min;
      state.VideoDialog.refresh = genRandom(1, 1000)
    }
  },
  actions: {
    SetVideoDialog({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        console.log('param', param)
        if (param.show === true) {
          commit('SET_VEDIO_DIALOG', {
            show: true,
            ...param
          })
          resolve()
        }
      })
    }
  }
}

export default loT
