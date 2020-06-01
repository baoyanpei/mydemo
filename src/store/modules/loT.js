import Cookies from 'js-cookie'
import hasPermissionToOperation from '@/utils/permissionUrl' // 权限判断函数

const loT = {
  state: {
    VideoDialog: { //personInfo窗口
      refresh: 0,
      show: false,
      data: {}
    },
    LotListDialog: { // 列表窗口
      refresh: 0,
      show: false,
      data: {}
    },
    LotPositionDialog: { // 物联网设备位置设置
      refresh: 0,
      show: false,
      data: {}
    },
    LotInfoDetailDialog: { // 物联网设备位置设置
      refresh: 0,
      show: false,
      data: {}
    },
    LotPositionChange: {
      refresh: 0,
      data: {}
    },
    LotDeviceEditChange: { // 在建筑模型的物联网设备列表中选择了设备
      refresh: 0,
      data: {}
    },
    LotDeviceFindChange: { // 在建筑模型的物联网设备列表中查询设备
      refresh: 0,
      data: {}
    },
    LotInfoDetailSavedChange: { // 物联网信息保存完成
      refresh: 0,
      data: {}
    }
  },
  mutations: {
    SET_VEDIO_DIALOG: (state, data) => {
      state.VideoDialog = data
      const genRandom = (min, max) => (Math.random() * (max - min + 1) | 0) + min;
      state.VideoDialog.refresh = genRandom(1, 1000)
    },
    SHOW_LOT_LIST_DIALOG: (state, data) => {
      state.LotListDialog = data
      const genRandom = (min, max) => (Math.random() * (max - min + 1) | 0) + min;
      state.LotListDialog.refresh = genRandom(1, 1000)
    },
    SHOW_LOT_POSITION_DIALOG: (state, data) => {
      state.LotPositionDialog = data
      const genRandom = (min, max) => (Math.random() * (max - min + 1) | 0) + min;
      state.LotPositionDialog.refresh = genRandom(1, 1000)
    },
    SHOW_LOT_INFO_DETAIL_DIALOG: (state, data) => {
      state.LotInfoDetailDialog = data
      const genRandom = (min, max) => (Math.random() * (max - min + 1) | 0) + min;
      state.LotInfoDetailDialog.refresh = genRandom(1, 1000)
    },
    LOT_POSITION_CHANGE: (state, data) => {
      state.LotPositionChange = data
      const genRandom = (min, max) => (Math.random() * (max - min + 1) | 0) + min;
      state.LotPositionChange.refresh = genRandom(1, 1000)
    },
    LOT_DEVICE_EDIT_CHANGE: (state, data) => {
      state.LotDeviceEditChange = data
      const genRandom = (min, max) => (Math.random() * (max - min + 1) | 0) + min;
      state.LotDeviceEditChange.refresh = genRandom(1, 1000)
    },
    LOT_DEVICE_FIND_CHANGE: (state, data) => {
      state.LotDeviceFindChange = data
      const genRandom = (min, max) => (Math.random() * (max - min + 1) | 0) + min;
      state.LotDeviceFindChange.refresh = genRandom(1, 1000)
    },
    LOT_LOT_DETAIL_SAVED_CHANGE: (state, data) => {
      state.LotInfoDetailSavedChange = data
      const genRandom = (min, max) => (Math.random() * (max - min + 1) | 0) + min;
      state.LotInfoDetailSavedChange.refresh = genRandom(1, 1000)
    },

    
    

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
    },
    ShowLotListDialog({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        commit('SHOW_LOT_LIST_DIALOG', {
          ...param
        })
        resolve()
      })
    },
    ShowLotPositionDialog({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        commit('SHOW_LOT_POSITION_DIALOG', {
          ...param
        })
        resolve()
      })
    },
    ShowLotInfoDetailDialog({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        commit('SHOW_LOT_INFO_DETAIL_DIALOG', {
          ...param
        })
        resolve()
      })
    },
    SetLotPositionChange({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        commit('LOT_POSITION_CHANGE', param)
        resolve()
      })
    },
    SetLotDeviceEditChange({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        commit('LOT_DEVICE_EDIT_CHANGE', param)
        resolve()
      })
    },
    SetLotDeviceFindChange({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        commit('LOT_DEVICE_FIND_CHANGE', param)
        resolve()
      })
    },
    SetLotInfoDetailSavedChange({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        commit('LOT_LOT_DETAIL_SAVED_CHANGE', param)
        resolve()
      })
    },
    

    
    
  }
}

export default loT
