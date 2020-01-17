import {
  addBimBuilding,
  removeBimBuilding,
  queryBimBuildingAll,
  addBimItem,
  updateBimItem,
  removeBimItem,
  //   uploadBimItem,
  getProjectItems,
  getItemInfoListByProID,
  getOutsysInfo,
  setOutsysInfo
} from '@/api/bim_project'

const bim = {
  state: {
    UploadModelDialog: { // 分享窗口
      refresh: 0,
      show: false,
      data: {}
    },
    UploadProgressDialog: { // 分享窗口
      refresh: 0,
      show: false,
      data: {}
    },
    uploadProgress: null, // 文件上传进度数据
    uploadIsErr: false // 文件上传是否已经报错
  },
  mutations: {
    SET_UPLOAD_MODEL_DIALOG: (state, data) => {
      state.UploadModelDialog = data
      const genRandom = (min, max) => (Math.random() * (max - min + 1) | 0) + min;
      state.UploadModelDialog.refresh = genRandom(1, 1000)
      console.log('----->', state.UploadModelDialog)
    },
    SET_UPLOAD_PROGRESS: (state, data) => {
      state.uploadProgress = data
      console.log('state.uploadProgress', state.uploadProgress)
    },
    SET_UPLOAD_PROGRESS_DIALOG: (state, data) => {
      state.UploadProgressDialog = data
      const genRandom = (min, max) => (Math.random() * (max - min + 1) | 0) + min;
      state.UploadProgressDialog.refresh = genRandom(1, 1000)
      console.log('----->', state.UploadProgressDialog)
    },
    SET_UPLOAD_IS_ERROR: (state, data) => {
      state.uploadIsErr = data.uploadIsErr
      console.log('state.uploadIsErr', state.uploadIsErr)
    },
  },
  actions: {
    SetUploadModelDialog({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        console.log('param', param)
        if (param.show === true) {

        }
        commit('SET_UPLOAD_MODEL_DIALOG', {
          show: true,
          ...param
        })
        resolve()
      })
    },
    SetUploadProgressDialog({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        console.log('param', param)
        if (param.show === true) {

        }
        commit('SET_UPLOAD_PROGRESS_DIALOG', {
          show: true,
          ...param
        })
        resolve()
      })
    },
    AddBimBuilding({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        addBimBuilding(param).then(response => {
          // console.log("QueryBuildingListByProID", response.data)
          // commit('SET_BUILDING_LIST_BY_PROID', response.data)
          resolve(response.data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    RemoveBimBuilding({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        removeBimBuilding(param).then(response => {
          // console.log("QueryBuildingListByProID", response.data)
          // commit('SET_BUILDING_LIST_BY_PROID', response.data)
          resolve(response.data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    QueryBimBuildingAll({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        queryBimBuildingAll(param).then(response => {
          const _data = response.data
          // commit('SET_PROJECT_GATE_PERSON', _data)
          resolve(_data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    UpdateBimItem({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        updateBimItem(param).then(response => {
          const _data = response.data
          // commit('SET_PROJECT_GATE_PERSON', _data)
          resolve(_data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    AddBimItem({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        addBimItem(param).then(response => {
          const _data = response.data
          // commit('SET_PROJECT_GATE_PERSON', _data)
          resolve(_data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    RemoveBimItem({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        removeBimItem(param).then(response => {
          const _data = response.data
          // commit('SET_PROJECT_GATE_PERSON', _data)
          resolve(_data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // UploadBimItem({
    //   commit
    // }, param) {
    //   return new Promise((resolve, reject) => {
    //     uploadBimItem(param.data, param.params, param.that).then(response => {
    //       const _data = response.data
    //       // commit('SET_PROJECT_GATE_PERSON', _data)
    //       resolve(_data)
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },
    SetUploadProgress({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        // console.log('SetUploadProgress', param)
        commit('SET_UPLOAD_PROGRESS', param)
      })
    },
    SetUploadIsError({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        // console.log('SetUploadProgress', param)
        commit('SET_UPLOAD_IS_ERROR', param)
      })
    },
    GetProjectItems({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        getProjectItems(param).then(response => {
          const _data = response.data
          // commit('SET_PROJECT_GATE_PERSON', _data)
          resolve(_data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    GetItemInfoListByProID({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        getItemInfoListByProID(param).then(response => {
          resolve(response.data)
        }).catch(error => {
          console.log(error)
          reject(error)
        })
      })
    },
    GetOutsysInfo({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        getOutsysInfo(param).then(response => {
          resolve(response.data)
        }).catch(error => {
          console.log(error)
          reject(error)
        })
      })
    },
    SetOutsysInfo({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        setOutsysInfo(param).then(response => {
          const _data = response
          // commit('SET_PROJECT_GATE_PERSON', _data)
          resolve(_data)
        }).catch(error => {
          reject(error)
        })
      })
    },
  }
}

export default bim
