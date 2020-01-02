import {
  saveViewPoint,
  getViewpointsByProjectId,
  getViewpointsByFileId,
  getFileListByItemId,
  getViewpointsById,
  deleteViewpointById
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
    ViewPointDataChanged: 0 // 数据发生变化
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
    SET_VIEW_POINT_DATA_IS_CHANGED: (state) => {
      const genRandom = (min, max) => (Math.random() * (max - min + 1) | 0) + min;
      state.ViewPointDataChanged = genRandom(1, 1000)
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
    SaveViewPoint({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        saveViewPoint(param).then(response => {
          resolve(response.data)
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
        commit('SET_VIEW_POINT_DATA_IS_CHANGED')
        resolve()
      })
    },
  }
}

export default viewPoint
