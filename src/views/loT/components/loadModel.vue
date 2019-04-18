<style lang="scss">
  @import "./loadModel";

</style>
<template>
  <div class="load-model-area">
  </div>
</template>

<script>
  import lodash from 'lodash'
  import {
    // getOriStr,
    getOriMesh
  } from '@/utils/model3d'
  import IndexedDB from '../../../indexedDB/IndexedDB'
  // let worker = new Worker("/static/workIndexedDB.js");
  export default {
    name: 'model3d-tree-area',
    directives: {},
    components: {},
    data() {
      return {
        loadingDialog: null,
        loader: new THREE.ObjectLoader(),
        defaultExpandAll: true,
        autoExpandParent: false,
        renderAfterExpand: true,
        treeListData: [],
        defaultProps: {
          children: 'children',
          id: 'ID',
          label: 'NAME',
          isLeaf: 'leaf'
        },
        modelDB: null,
        // unitLoadingSet: new Set(), // 模型加载数组 
        // unitRemoveSet: new Set(), // 删除队列
        loadCurrentRemain: 0,
        timeoutid: null,
        timeRemove: null,
        mod_id_list_array: [],
        mod_id_list_queue: [],
        isLoadMods: false,
        worker: new Worker("/static/workIndexedDB.js"),

        treeAttachParamsListData: [],

        project_id: 10000,
        building_id: 87, // 87 周边
        modIDAPIList: [],
        modIDList: [],
        totalNeedModel: 0,
        totalOKModel: 0,
        indexedDBWaitList: []
      }
    },
    computed: {
      buildListByProID() {
        return this.$store.state.model3d.buildListByProID
      },
      floorListByBudID() {
        return this.$store.state.model3d.floorListByBudID
      },
      modListByFloorID() {
        return this.$store.state.model3d.modListByFloorID
      },
      // modelByID() {
      //   return this.$store.state.model3d.modelByID
      // },
      // modelMap() {
      //   return this.$store.state.model3d.modelMap
      // },
      // buildMap() {
      //   return this.$store.state.model3d.buildMap
      // },

    },
    created() {
      IndexedDB.openDB('tbbim', 1, this.modelDB, {
        name: 'model',
        key: 'modelID'
      }, (db) => {
        this.modelDB = db
      })
    },
    destroyed() {
      // 通过赋值null的方式，释放掉worker引用，这样就可以关闭worker，这是作者在github上说的
      this.worker = null
    },
    watch: {
      totalOKModel(curVal, oldVal) {
        // console.log('curVal', curVal)
        if (curVal === this.totalNeedModel) {
          // console.log('-- this.modIDAPIList', this.modIDAPIList)
          let _chunkList = lodash.chunk(this.modIDAPIList, this.modIDAPIList.length / 6)
          // console.log('_chunkList', _chunkList)

          for (let i = 0, len = _chunkList.length; i < len; i++) {
            let ids = _chunkList[i]
            this.getAPI(ids)
            // console.log('ids',ids)
            // await this.getModelFromAPI(ids)
          }

        }
      }

    },
    async mounted() {
      // this.loadingDialog = this.$loading({
      //   // lock: true,
      //   // text: '正在读取数据...',
      //   // spinner: 'el-icon-loading',
      //   // background: 'rgba(0, 0, 0, 0.5)',
      //   // customClass: 'loading-class',
      //   target: document.querySelector('.treeDiv')
      // });
      await this.getBuildingListByProID()
      // console.log('this.modIDList', this.modIDList)

      this.totalNeedModel = this.modIDList.length
      for (let i = 0, len = this.modIDList.length; i < len; i++) {
        let model_id = this.modIDList[i]
        IndexedDB.getData(this.modelDB, 'model', model_id, async (result) => {
          if (result) {
            this.$emit('unitGroupAddMesh', result.mesh, result.modelID, result.unit)
            // this.modIDIndexList.push(model_id)

          } else {

            // this.getModelFromAPI(model_id)
            // console.log('model_id', model_id)
            this.modIDAPIList.push(model_id)

          }
          this.totalOKModel++
        });
      }

      console.log('123', this.modIDAPIList.length)

    },
    methods: {
      async getAPI(idList) {
        console.log('----')
        let _chunkList = lodash.chunk(idList, 20)
        for (let i = 0, len = _chunkList.length; i < len; i++) {
          let ids = _chunkList[i].join(',')
          await this.getModelFromAPI(ids)
          // console.log('ids', ids)
        }
      },
      getBuildingListByProID() {
        return new Promise((resolve, reject) => {
          this.treeListData = []
          const param = {
            method: 'GetBuildingListByProID',
            project_id: this.project_id
          }
          this.$store.dispatch('QueryBuildingListByProID', param).then(async () => {

            for (let i = 0, len = this.buildListByProID.length; i < len; i++) {
              let build = this.buildListByProID[i]
              if (build.ID === 87 || build.ID === 86 || build.ID === 88 || build.ID === 89) { //   
                this.$emit('addLoadingText', `正在加载 ${build.NAME} 的楼层列表`)
                const _floorIDList = await this.getFloorListByBuildingID(build)
                // console.log('_floorIDList', _floorIDList)
                this.modIDList = [...this.modIDList, ..._floorIDList]
                // this.modIDList.push(model_id)
              }
            }
            // this.buildListByProID.forEach(async build => {
            //   if (build.ID === 87 || build.ID === 86) { //|| build.ID === 88 || build.ID === 89
            //     const _floorList = await this.getFloorListByBuildingID(build.ID)
            //   }
            // });

            resolve()
            // this.loadingDialog.close()
          }).catch((e) => {
            console.log("e", e)
            resolve()
          })

        })

      },
      getFloorListByBuildingID(building) {
        let building_id = building.ID
        return new Promise((resolve, reject) => {
          const param = {
            method: 'GetFloorListByBudID',
            project_id: this.project_id,
            building_id: building_id,

          }
          this.$store.dispatch('QueryFloorListByProID', param).then(async () => {
            // console.log("this.floorListByBudID", this.floorListByBudID)
            // this.optionsProjectPersion = this.projectPersonList
            // let listData = []



            // for (let i = 0, len = this.floorListByBudID.length; i < len; i++) {
            //   console.log('this.floorListByBudID');
            //   await wait(1000);
            // }
            // this.floorListByBudID.forEach(async floor => {
            let idList = []
            for (let i = 0, len = this.floorListByBudID.length; i < len; i++) {
              let floor = this.floorListByBudID[i]
              console.log('floor', floor)
              this.$emit('addLoadingText', `正在加载 ${building.NAME} 的 ${floor.NAME} 的模型列表`)
              // if (floor.NAME === '2F(4.200-8.400)' || floor.NAME === '3F(8.400-12.600)') {
              floor.BUILDID = building_id
              const _modList = await this.getModListByFloorID(building,floor)
              // console.log('_modList', _modList)
              // this.$emit('unitTotalAdd', _modList.length)

              _modList.forEach(mod => {

                // idList.push(mod.ID)
                if (building_id === 86 || building_id === 88 || building_id === 89) { //
                  let _PARAMS_TYPE = []
                  if (mod.PARAMS !== "") {
                    _PARAMS_TYPE = mod.PARAMS.split(',')
                    let _match = lodash.intersection(_PARAMS_TYPE, ['ST']) //ST 主体
                    if (_match.length > 0) {
                      // console.log('mod', mod)
                      idList.push(mod.ID)
                    }
                  }

                } else {
                  idList.push(mod.ID)
                }
              })



            };
            this.$emit('unitTotalAdd', idList.length)
            // for (let i = 0, len = idList.length; i < len; i++) {
            //   let _id = idList[i]
            //   // await this.getModdelByID(_id)
            //   this.getModdelByID(_id)
            // }
            resolve(idList)
          }).catch((e) => {
            console.log("e", e)
            resolve([])
          })
        })

      },
      getModListByFloorID(build,floor) {
        return new Promise((resolve, reject) => {
          const param = {
            method: 'GetModListByFloorID',
            // method: 'GetMergedModListByFloorID',
            project_id: this.project_id,
            floor_id: floor.ID,
            build_id: floor.BUILDID
          }
          let _modList = []
          // console.log('GetModListByFloorID', param)
          this.$store.dispatch('QueryModListByFloorID', param).then(() => {
            
            this.modListByFloorID.forEach(d => {
              // flag=1 可以画
              // if (d.FLAG === 1) {
                _modList.push(d)
              // }
            });
            resolve(_modList)
          }).catch((e) => {
            console.log("e", e)
            reject()
          })
        })

      },
      //根据模型ID获取模型信息
      getModdelByID(model_id) {
        return new Promise((resolve, reject) => {
          IndexedDB.getData(this.modelDB, 'model', model_id, (result) => {
            if (result) {
              // this.$emit('unitTotalAdd', 1)
              this.$emit('unitGroupAddMesh', result.mesh, result.modelID, result.unit)
              // this.modIDIndexList.push(model_id)
            } else {

              // this.getModelFromAPI(model_id)
              // console.log('model_id', model_id)
              this.modIDList.push(model_id)
            }
            resolve()
          });
        })

        // });

      },
      getModelFromAPI(model_id) {
        return new Promise((resolve, reject) => {
          const param = {
            method: 'GetModelByID',
            // method: 'GetMergedModelByID',
            project_id: this.project_id,
            model_id: model_id
          }
          this.$store.dispatch('QueryModdelByID', param).then((data) => {
            data.forEach(unit => {
              // console.log('unit', unit)
              if (unit.MESH_JSON !== '') {
                // this.$emit('unitTotalAdd', 1)
                let meshJson = getOriMesh(unit.MESH_JSON)
                let modelData = {
                  modelID: unit.ID,
                  unit: unit,
                  mesh: meshJson
                }
                this.$emit('unitGroupAddMesh', meshJson, unit.ID, unit)
                this.$emit('unitGroupAddDB', modelData)
                // let worker = new Worker("/static/workIndexedDB.js");
                // this.worker.postMessage(modelData); //向worker发送数据
                // worker.onmessage = function (evt) { //接收worker传过来的数据函数
                //   worker.terminate();
                // }
              } else {
                this.$emit('unitGroupAddMesh', null, null, null)
                let modelData = {
                  modelID: unit.ID,
                  unit: unit,
                  mesh: ''
                }
                this.$emit('unitGroupAddDB', modelData)
              }
              resolve()
            });
          }).catch((e) => {
            console.log(e)
          })
        })

      }
    }
  }

</script>
