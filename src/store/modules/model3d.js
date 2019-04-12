import {
  queryBuildingListByProID,
  queryPropertyListByProID,
  queryFloorListByBudID,
  queryModListByFloorID,
  queryModelByID
} from '@/api/model3d'
import {
  // getOriStr,
  getOriMesh
} from '@/utils/model3d'
const model3d = {
  state: {
    buildListByProID: null,
    propertyListByProID: null,
    floorListByBudID: null,
    modListByFloorID: null,
    modelByID: null,
    buildMap: new Map(),
    modelMap: new Map(),
    // modelMergeArray: [],
    // geometryMerge: new THREE.Geometry(),
    // bufferGeometryMerge: new THREE.BufferGeometry(),
    // bufferGeometryMergeArray: [],
    // sumPosArr: [], //new Float32Array(),
    // sumNormArr: [], //new Float32Array(),
    // sumUvsArr: [], //new Float32Array(),
    // materialArr: [],
    // geometryMergeI: 1,
    // modelDataMap: new Map(),
    modelTreeData1: null,
    modelDetailDialog: { // model-detail
      show: false,
      data: {}
    }
  },
  mutations: {
    SET_MODEL_DETAIL_DIALOG: async (state, data) => { // 人员考勤
      state.modelDetailDialog = data
      console.log("datadatadata", data)
    },
    SET_MODEL_TREE_DATA: (state, data) => {
      // console.log('SET_PERSON_INFO', data)
      state.modelTreeData1 = data
    },
    SET_BUILDING_LIST_BY_PROID: (state, data) => {
      // console.log('SET_PERSON_INFO', data)
      // console.log('build', data)
      data.forEach(build => {
        // console.log('build123', build)
        state.buildMap.set(build.ID, build)
      })
      // console.log("state.buildMap", state.buildMap)
      state.buildListByProID = data
    },
    SET_PROPERTY_LIST_BY_PROID: (state, data) => {
      // console.log('SET_PERSON_INFO', data)
      state.propertyListByProID = data
    },

    SET_FLOOR_LIST_BY_BUDID: (state, data) => {
      // console.log('SET_FLOOR_LIST_BY_BUDID', data.data, data.param)
      const buildID = data.param.building_id
      let buildInfo = state.buildMap.get(buildID)
      const floorList = data.data
      if (buildInfo.floor === undefined) {
        buildInfo.floor = new Map()
      }
      floorList.forEach(floor => {
        let floorInfo = buildInfo.floor.get(floor.ID)
        if (floorInfo === undefined) {
          buildInfo.floor.set(floor.ID, floor)
        }
      })
      state.floorListByBudID = floorList
    },
    SET_MOD_LIST_BY_FLOORID: (state, data) => {
      // console.log('1data', data)
      const floorID = data.param.floor_id
      const buildID = data.param.build_id
      let buildInfo = state.buildMap.get(buildID)
      const modList = data.data
      let floorInfo = buildInfo.floor.get(floorID)

      if (floorInfo.model === undefined) {
        floorInfo.model = new Map()
      }
      modList.forEach(mod => {
        let modelInfo = floorInfo.model.get(mod.ID)
        if (modelInfo === undefined) {
          floorInfo.model.set(mod.ID, mod)
          // const parantID = mod.PARENT_ID
          // if (parantID > 0) {
          //   console.log('mod.PARENT_ID', mod.PARENT_ID)
          // }
        }
      })
      // const build_id = data.param.building_id
      // let buildInfo = state.buildMap.get(build_id)
      // buildInfo.floor = data.data
      state.modListByFloorID = data.data
    },
    // SET_MOD_DETAIL: (state, data) => {
    // },
    SET_MODEL_BY_ID: (state, data) => {
      // console.log('_data', data)
      // let _unit = data.data
      // let _meshArray = data.mesh
      let loader = new THREE.ObjectLoader()
      if (data.length > 0) {
        data.forEach(_data => {
          // console.log('_u', _u)
          const _u = _data.unit
          let model = state.modelMap.get(_u.ID)
          // console.log('_u.ID', _u.ID)
          if (model === undefined) {
            // console.log('_data', _data)
            let mesh = loader.parse(_data.mesh)
            // state.modelMap.set(_u.ID, mesh)
          }
        })
      }
    },
    SET_MODEL_FROM_API: (state, data) => {
      // console.log('_data123', data)
      // let _unit = data.data
      // let _meshArray = data.mesh
      let loader = new THREE.ObjectLoader()
      if (data.length > 0) {
        data.forEach(_u => {
          // console.log('_u', _u)
          let model = state.modelMap.get(_u.ID)
          if (model === undefined) {
            let _mJson = getOriMesh(_u.MESH_JSON)
            let mesh = loader.parse(_mJson)
            // state.modelMap.set(_u.ID, mesh)
          }
        })
      }
    },
    SET_MODEL_IDLIST: (state, data) => {
      const _param = data.param
      const _data = {
        meshID: _param.meshID,
        groupIndex: _param.groupIndex
      }
      state.modelMap.set(_param.modelID, _data)
    }
  },

  actions: {
    SetModelDetailDialog({
      commit,
      rootState
    }, param) {
      return new Promise((resolve, reject) => {
        console.log('project_id', rootState.project.project_id)

        console.log('SetModelDetailDialog')
        // return
        commit('SET_MODEL_DETAIL_DIALOG', param)
        resolve()
      })
    },
    QueryBuildingAllFloorByProID({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        queryBuildingListByProID(param).then(response => {
          let treeList = []
          let buildList = response.data
          let buildProArr = []
          buildList.forEach(build => {
            buildProArr.push(
              new Promise((resolve, reject) => {
                let _buildData = {
                  id: build.ID,
                  text: build.NAME,
                  icon: '',
                  children: [],
                  type: 'build'
                }
                queryFloorListByBudID({
                  method: 'GetFloorListByBudID',
                  project_id: param.project_id,
                  building_id: build.ID
                }).then(response => {
                  let floorList = response.data
                  floorList.forEach(floor => {
                    let _floorData = {
                      id: floor.ID,
                      text: floor.NAME,
                      children: [],
                      type: 'floor'
                    }
                    _buildData.children.push(_floorData)
                  })
                  treeList.push(_buildData)
                  resolve()
                }).catch(error => {
                  console.log(error)
                  reject(error)
                })
              })
            )
          })

          Promise.all(buildProArr)
            .then(res => {
              // console.log("treeList", treeList)
              // treeList.push()
              // console.log()

              commit('SET_MODEL_TREE_DATA', treeList)
              resolve()
            })
            .catch((error) => {
              console.log(error)
              reject(error)
            })
        }).catch(error => {
          console.log(error)
          reject(error)
        })
      })
    },
    QueryBuildingAllModelByProID({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        queryBuildingListByProID(param).then(response => {
          let treeList = []
          let buildList = response.data
          let buildProArr = []

          buildList.forEach(build => {
            buildProArr.push(
              new Promise((resolve, reject) => {
                let _buildData = {
                  ID: build.ID,
                  NAME: build.NAME,
                  children: [],
                  type: 'build'
                }
                queryFloorListByBudID({
                  method: 'GetFloorListByBudID',
                  project_id: param.project_id,
                  building_id: build.ID
                }).then(response => {
                  let floorList = response.data

                  let floorProArr = []
                  floorList.forEach(floor => {
                    floorProArr.push(
                      new Promise((resolve, reject) => {
                        queryModListByFloorID({
                          method: 'GetModListByFloorID',
                          project_id: param.project_id,
                          floor_id: floor.ID
                        }).then(response => {
                          let modList = response.data
                          let _floorData = {
                            ID: floor.ID,
                            NAME: floor.NAME,
                            children: [],
                            type: 'floor'
                          }

                          modList.forEach(ele => {
                            let parentId = ele.PARENT_ID
                            if (parentId === 0) {
                              // 是根元素的hua ,不做任何操作,如果是正常的for-i循环,可以直接continue.
                            } else {
                              // 如果ele是子元素的话 ,把ele扔到他的父亲的child数组中.
                              modList.forEach(d => {
                                // console.log("d", d)
                                // flag=1 可以画
                                if (d.ID === parentId && d.FLAG !== 1) {
                                  let childArray = d.children
                                  if (!childArray) {
                                    childArray = []
                                  }
                                  childArray.push(ele)
                                  d.children = childArray
                                }

                                if (d.FLAG === 1) {
                                  d.leaf = true
                                  d.type = 'model'
                                }
                              })
                            }
                          })
                          // 去除重复元素
                          modList = modList.filter(ele => ele.PARENT_ID === 0)
                          _floorData.children = modList
                          _buildData.children.push(_floorData)
                          // console.log("modlist", modList)
                          // console.log("_floorData", _floorData)
                          resolve()
                        }).catch(error => {
                          reject(error)
                        })
                      })
                    )
                  })
                  Promise.all(floorProArr)
                    .then(res => {
                      // console.log("_buildData", _buildData)
                      treeList.push(_buildData)
                      resolve()
                    })
                    .catch((error) => {
                      console.log(error)
                      reject(error)
                    })
                  // resolve()
                }).catch(error => {
                  console.log(error)
                  reject(error)
                })
              })
            )
          })

          Promise.all(buildProArr)
            .then(res => {
              // console.log("treeList", treeList)
              // treeList.push()
              // console.log()

              commit('SET_MODEL_TREE_DATA', treeList)
              resolve()
            })
            .catch((error) => {
              console.log(error)
              reject(error)
            })
        }).catch(error => {
          console.log(error)
          reject(error)
        })
      })
    },
    // #通过项目ID获取Building列表，用于构造菜单树
    QueryBuildingListByProID({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        queryBuildingListByProID(param).then(response => {
          // console.log("QueryBuildingListByProID", response.data)
          commit('SET_BUILDING_LIST_BY_PROID', response.data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // #通过项目ID获取Building列表，用于构造菜单树
    QueryPropertyListByProID({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        queryPropertyListByProID(param).then(response => {
          // console.log("queryPersonInfo", response.data)
          commit('SET_PROPERTY_LIST_BY_PROID', response.data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // #通过BuildingID获取楼层列表，用于构造菜单树
    QueryFloorListByProID({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        queryFloorListByBudID(param).then(response => {
          // console.log("queryPersonInfo", response.data)
          commit('SET_FLOOR_LIST_BY_BUDID', {
            'data': response.data,
            'param': param
          })
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // #通过楼层ID获取这个楼层所有构件的列表
    QueryModListByFloorID({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        queryModListByFloorID(param).then(response => {
          // console.log("queryPersonInfo", response.data)
          commit('SET_MOD_LIST_BY_FLOORID', {
            'data': response.data,
            'param': param
          })
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // #通过模型构件的ID获取构件模型数据
    QueryModdelByID({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        queryModelByID(param).then(response => {
          // console.log('QueryModdelByID', response.data)
          // commit('SET_MODEL_FROM_API', response.data)
          resolve(response.data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    QueryModdelByIDFromDB({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        // console.log('paramparamparam', param.data)
        // commit('SET_MODEL_BY_ID', param.data)
        resolve({
          'result': 'success',
          'data': param.data
        })
      })
    },
    // #通过BuildingID获取楼层列表，用于构造菜单树
    QueryFloorList({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        queryFloorListByBudID(param).then(response => {
          // console.log("queryPersonInfo", response.data)
          commit('SET_FLOOR_LIST_BY_BUDID', {
            'data': response.data,
            'param': param
          })
          resolve({
            'data': response.data,
            'param': param
          })
        }).catch(error => {
          reject(error)
        })
      })
    },
    // #通过楼层ID获取这个楼层所有构件的列表
    QueryModList({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        queryModListByFloorID(param).then(response => {
          commit('SET_MOD_LIST_BY_FLOORID', {
            'data': response.data,
            'param': param
          })
          resolve({
            'data': response.data,
            'param': param
          })
        }).catch(error => {
          reject(error)
        })
      })
    },
    // #通过楼层ID获取这个楼层所有构件的列表
    SetModelIDlist({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        commit('SET_MODEL_IDLIST', {
          'param': param
        })
        resolve({
          'param': param
        })
      })
    }
  }
}

export default model3d
