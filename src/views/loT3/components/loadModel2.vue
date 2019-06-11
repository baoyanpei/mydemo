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

        // project_id: null,
        // building_id: 87, // 87 周边
        modIDAPIList: [],
        modIDList: [],
        totalNeedModel: 0,
        totalOKModel: 0,
        indexedDBWaitList: []
      }
    },
    computed: {
      project_id() {
        return this.$store.state.project.project_id
      },
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
      project_id(curVal, oldVal) {
        if (curVal !== null) {
          this.init()
        }
      },
      totalOKModel(curVal, oldVal) {
        if (curVal === this.totalNeedModel) {
          let _modIDAPIList = lodash.chunk(this.modIDAPIList, Math.ceil(this.modIDAPIList.length / 6))
          for (let i = 0, len = _modIDAPIList.length; i < len; i++) {
            let unitList = _modIDAPIList[i]
            this.getAPI(unitList)
          }
        }
      }

    },
    mounted() {

    },
    methods: {
      async init() {
        this.modIDList = []
        await this.getBuildingListByProID()
        this.totalNeedModel = this.modIDList.length
        for (let i = 0, len = this.modIDList.length; i < len; i++) {
          let model_id = this.modIDList[i].ID
          let model_geom = this.modIDList[i].GEOM
          IndexedDB.getData(this.modelDB, 'model', model_id, async (result) => {
            if (result) {
              let _mesh = this.loader.parse(result.mesh)
              this.$emit('unitGroupAddMesh', _mesh, result.modelID, result.unit)
            } else {
              this.modIDAPIList.push(this.modIDList[i])
            }
            this.totalOKModel++
          });
        }
      },
      async getAPI(unitList) {
        // let _chunkList = lodash.chunk(unitList, 1)
        for (let i = 0, len = unitList.length; i < len; i++) {
          let unit = unitList[i]
          await this.getModelFromGEOM(unit)
          // await this.getModelFromAPI(ids)
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
          this.$store.dispatch('QueryBuildingListByProID', param).then(async (buildList) => {
            console.log('buildList', buildList)
            for (let i = 0, len = buildList.length; i < len; i++) {
              let build = buildList[i]
              if (build.DEVICE_USEFLAG === 1) {
                // if ((this.project_id === 10000 && build.ID ===
                //   87) || (this.project_id === 10001 && build.ID ===
                //   98)) { //  build.ID === 87 || build.ID === 86 || build.ID === 88 || build.ID === 89
                this.$emit('addLoadingText', `正在加载 ${build.NAME} 的楼层列表`)
                const _floorIDList = await this.getFloorListByBuildingID(build)
                // console.log('_floorIDList', _floorIDList)
                this.modIDList = [...this.modIDList, ..._floorIDList]
                // this.modIDList.push(model_id)
              }
            }
            // console.log('this.modIDList', this.modIDList)
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
          this.$store.dispatch('QueryFloorListByProID2', param).then(async (floorListByBudID) => {
            // console.log("floorListByBudID", floorListByBudID)
            let idList = []
            for (let i = 0, len = floorListByBudID.length; i < len; i++) {
              let floor = floorListByBudID[i]
              // console.log('floor', floor)
              this.$emit('addLoadingText', `正在加载 ${building.NAME} 的 ${floor.NAME} 的模型列表`)
              // if (floor.NAME === '2F(4.200-8.400)' || floor.NAME === '3F(8.400-12.600)') {
              floor.BUILDID = building_id
              // console.log('building, floor',building, floor)
              const _modList = await this.getModListByFloorID(building, floor)
              // console.log('_modList', _modList)
              // this.$emit('unitTotalAdd', _modList.length)

              _modList.forEach(mod => {
                mod.BUILDID = building_id
                idList.push(mod)
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
      getModListByFloorID(build, floor) {
        return new Promise((resolve, reject) => {
          const param = {
            // method: 'GetModListByFloorID',
            method: 'GetMergedModListByFloorID',
            project_id: this.project_id,
            floor_id: floor.ID,
            build_id: floor.BUILDID
          }
          // let _modList = []
          // console.log('GetModListByFloorID', param)
          this.$store.dispatch('QueryModListByFloorID2', param).then((modListByFloorID) => {
            resolve(modListByFloorID)
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

              this.modIDList.push(model_id)
            }
            resolve()
          });
        })

        // });

      },
      getModelFromGEOM(unit) {
        return new Promise(async (resolve, reject) => {
          let geom = unit.GEOM
          if (geom !== '') {

            let meshJsonURL = geom.replace('/data/root_www/bim_proj/',
              '/static/')
            // let meshJsonURL = geom.replace('/data/root_www/bim_proj/',
            //   '')
            // console.log('meshJsonURL', meshJsonURL)
            let mesh = await this.getJsonFile(meshJsonURL)
            if (mesh === null) {
              this.$emit('unitGroupAddMesh', null, null, null)
            } else {
              // this.$emit('unitTotalAdd', 1)
              // let meshJson = getOriMesh(unit.MESH_JSON)
              let modelData = {
                modelID: unit.ID,
                unit: unit,
                mesh: mesh.toJSON()
              }
              this.$emit('unitGroupAddMesh', mesh, unit.ID, unit)
              this.$emit('unitGroupAddDB', modelData)

            }


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
        })

      },
      getJsonFile(meshJsonURL) {
        // this.$emit('unitGroupAddMesh1', meshJsonURL)
        return new Promise((resolve, reject) => {
          let loader = new THREE.ObjectLoader()
          loader.load(meshJsonURL, (_mesh) => {
            // console.log('meshJsonURL - 加载', meshJsonURL)
            // this.$emit('unitGroupAddMesh1', _mesh)
            // loader = null
            resolve(_mesh)
          }, (xhr) => {
            // console.log('xhr', xhr)
          }, (error) => {
            // console.log('An error happened', error);
            resolve(null)
          })
        })

      }
    }
  }

</script>
