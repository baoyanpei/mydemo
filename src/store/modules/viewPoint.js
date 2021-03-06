import {
  saveViewPoint,
  getViewpointsByProjectId,
  getViewpointsByFileId,
  getFileListByItemId,
  getViewpointsById,
  deleteViewpointById,
  getViewPoints
} from '@/api/view_point'

const viewPoint = {
  state: {
    ViewPointManageDialog: { // 管理窗口
      refresh: 0,
      show: false,
      data: {}
    },
    ViewPointCurrentShow: {
      refresh: 0,
      data: {}
    },
    ViewPointDataChanged: {
      refresh: 0,
      data: {}
    }, // 数据发生变化
    ViewPointSaveDialog: { // 保存窗口
      refresh: 0,
      show: false,
      data: {}
    },
    IsViewPointEditMode: false, // 是否为视点编辑模式
    PositionViewPointManageDialog: { // 位置视点保存窗口
      refresh: 0,
      show: false,
      data: {}
    },
    PositionPictureSaveDialog: { // 位置视点截图保存窗口
      refresh: 0,
      show: false,
      data: {}
    },
    PositionPictureSaveData: { // 位置视点截图
      refresh: 0,
      data: {}
    },
    ViewPointQrcodeDialog: { // 视点二维码dialog
      refresh: 0,
      show: false,
      data: {}
    }
  },
  mutations: {
    SHOW_VIEW_POINT_MANAGER_DIALOG: (state, data) => {
      state.ViewPointManageDialog = data
      const genRandom = (min, max) => (Math.random() * (max - min + 1) | 0) + min;
      state.ViewPointManageDialog.refresh = genRandom(1, 1000)
      console.log('----->', state.ViewPointManageDialog)
    },
    SHOW_VIEW_POINT_CURRENT_DATA: (state, data) => {
      state.ViewPointCurrentShow = data
      const genRandom = (min, max) => (Math.random() * (max - min + 1) | 0) + min;
      state.ViewPointCurrentShow.refresh = genRandom(1, 1000)
      console.log('----->', state.ViewPointCurrentShow)
    },
    SET_VIEW_POINT_DATA_IS_CHANGED: (state, data) => {
      state.ViewPointDataChanged = data
      const genRandom = (min, max) => (Math.random() * (max - min + 1) | 0) + min;
      state.ViewPointDataChanged.refresh = genRandom(1, 1000)
    },
    SHOW_VIEW_POINT_SAVE_DIALOG: (state, data) => {
      state.ViewPointSaveDialog = data
      const genRandom = (min, max) => (Math.random() * (max - min + 1) | 0) + min;
      state.ViewPointSaveDialog.refresh = genRandom(1, 1000)
      // console.log('----->', state.ViewPointSaveDialog)
    },
    SET_VIEW_POINT_EDIT_MODE: (state, isEditMode) => {
      // const genRandom = (min, max) => (Math.random() * (max - min + 1) | 0) + min;
      state.IsViewPointEditMode = isEditMode
    },
    SHOW_POSITION_VIEW_POINT_MANAGE_DIALOG: (state, data) => {
      state.PositionViewPointManageDialog = data
      const genRandom = (min, max) => (Math.random() * (max - min + 1) | 0) + min;
      state.PositionViewPointManageDialog.refresh = genRandom(1, 1000)
      // console.log('----->', state.PositionViewPointManageDialog)
    },
    SHOW_POSITION_PICTURE_SAVE_DIALOG: (state, data) => {
      state.PositionPictureSaveDialog = data
      const genRandom = (min, max) => (Math.random() * (max - min + 1) | 0) + min;
      state.PositionPictureSaveDialog.refresh = genRandom(1, 1000)
      // console.log('----->', state.PositionPictureSaveDialog)
    },
    GET_POSITION_PICTURE_SAVE_DATA: (state, data) => {
      state.PositionPictureSaveData = data
      const genRandom = (min, max) => (Math.random() * (max - min + 1) | 0) + min;
      state.PositionPictureSaveData.refresh = genRandom(1, 1000)
      // console.log('----->', state.PositionPictureSaveData)
    },
    SHOW_VIEW_POINT_QRCODE_DIALOG: (state, data) => {
      state.ViewPointQrcodeDialog = data
      const genRandom = (min, max) => (Math.random() * (max - min + 1) | 0) + min;
      state.ViewPointQrcodeDialog.refresh = genRandom(1, 1000)
    },

    

  },
  actions: {
    ShowViewPointManagerDialog({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        commit('SHOW_VIEW_POINT_MANAGER_DIALOG', {
          ...param
        })
        resolve()
      })
    },
    ShowViewPointSaveDialog({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        commit('SHOW_VIEW_POINT_SAVE_DIALOG', {
          ...param
        })
        resolve()
      })
    },
    ShowViewPointQrcodeDialog({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        commit('SHOW_VIEW_POINT_QRCODE_DIALOG', {
          ...param
        })
        resolve()
      })
    },
    ShowPositionViewPointSaveDialog({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        commit('SHOW_POSITION_VIEW_POINT_MANAGE_DIALOG', {
          ...param
        })
        resolve()
      })
    },
    ShowPositionPictureSaveDialog({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        commit('SHOW_POSITION_PICTURE_SAVE_DIALOG', {
          ...param
        })
        resolve()
      })
    },
    GetPositionPictureSaveData({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        commit('GET_POSITION_PICTURE_SAVE_DATA', {
          ...param
        })
        resolve()
      })
    },
    SaveViewPoint({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        saveViewPoint(param).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    GetViewpointsByProjectId({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        getViewpointsByProjectId(param).then(response => {
          resolve(response.data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    GetViewpointsByFileId({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        getViewpointsByFileId(param).then(response => {
          resolve(response.data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    GetFileListByItemId({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        getFileListByItemId(param).then(response => {
          resolve(response.data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    GetViewpointsById({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        getViewpointsById(param).then(response => {
          resolve(response.data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    GetViewPoints({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        getViewPoints(param).then(response => {
          resolve(response.data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    DeleteViewpointById({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        deleteViewpointById(param).then(response => {
          resolve(response.data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    SetViewPointsShow({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        commit('SHOW_VIEW_POINT_CURRENT_DATA', {
          ...param
        })
        resolve()
      })
    },
    SetViewPointDataChanged({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        commit('SET_VIEW_POINT_DATA_IS_CHANGED', param)
        resolve()
      })
    },
    SetViewPointEditMode({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        console.log('SetViewPointEditMode', param.isEditMode)
        commit('SET_VIEW_POINT_EDIT_MODE', param.isEditMode)
        resolve()
      })
    },
  }
}

export default viewPoint
