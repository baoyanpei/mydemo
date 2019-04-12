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
        worker: null,

        treeAttachParamsListData: [],

        project_id: 10000,
        building_id: 87, // 87 周边
        modIDList: []
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
      modelMap() {
        return this.$store.state.model3d.modelMap
      },
      buildMap() {
        return this.$store.state.model3d.buildMap
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
    watch: {},
    async mounted() {
      this.loadingDialog = this.$loading({
        // lock: true,
        // text: '正在读取数据...',
        // spinner: 'el-icon-loading',
        // background: 'rgba(0, 0, 0, 0.5)',
        // customClass: 'loading-class',
        target: document.querySelector('.treeDiv')
      });
      await this.getBuildingListByProID()
      console.log('123')

    },
    methods: {
      getBuildingListByProID() {
        return new Promise((resolve, reject) => {
          this.treeListData = []
          const param = {
            method: 'GetBuildingListByProID',
            project_id: this.project_id
          }
          this.$store.dispatch('QueryBuildingListByProID', param).then(() => {
            this.buildListByProID.forEach(async build => {
              if (build.ID === 87 || build.ID === 86) {
                const _floorList = await this.getFloorListByBuildingID(build.ID)
                console.log('this.modIDList', this.modIDList)


              }
              resolve()
              this.loadingDialog.close()
            });
          }).catch((e) => {
            console.log("e", e)
            resolve()
          })

        })

      },
      getFloorListByBuildingID(building_id) {
        return new Promise((resolve, reject) => {
          const param = {
            method: 'GetFloorListByBudID',
            project_id: this.project_id,
            building_id: building_id,

          }
          this.$store.dispatch('QueryFloorListByProID', param).then(async () => {
            // console.log("this.floorListByBudID", this.floorListByBudID)
            this.optionsProjectPersion = this.projectPersonList
            let listData = []
            this.floorListByBudID.forEach(async floor => {
              // console.log('floor', floor)
              // if (floor.NAME === '2F(4.200-8.400)' || floor.NAME === '3F(8.400-12.600)') {
              floor.BUILDID = building_id
              const _modList = await this.getModListByFloorID(floor)
              // console.log('_modList', _modList)
              // this.$emit('unitTotalAdd', _modList.length)
              let idList = []
              _modList.forEach(mod => {
                if (building_id === 86) {
                  let _PARAMS_TYPE = []
                  if (mod.PARAMS !== "") {
                    _PARAMS_TYPE = mod.PARAMS.split(',')
                    let _match = lodash.intersection(_PARAMS_TYPE, ['ST']) //ST 主体
                    if (_match.length > 0) {
                      // console.log('mod', mod)
                      idList.push(mod.ID)
                      // this.getModdelByID(mod.ID)
                    }
                  }

                } else {
                  idList.push(mod.ID)
                  // this.getModdelByID(mod.ID)
                }
                // this.modIDList.push(mod.ID)
              })
              this.$emit('unitTotalAdd', idList.length)
              idList.forEach(id => {
                this.getModdelByID(id)
              })
              // }
            });
            resolve(listData)
          }).catch((e) => {
            console.log("e", e)
            resolve([])
          })
        })

      },
      getModListByFloorID(floor) {
        return new Promise((resolve, reject) => {
          const param = {
            method: 'GetModListByFloorID',
            project_id: this.project_id,
            floor_id: floor.ID,
            build_id: floor.BUILDID
          }
          let _modList = []
          // console.log('GetModListByFloorID', param)
          this.$store.dispatch('QueryModListByFloorID', param).then(() => {
            this.modListByFloorID.forEach(d => {
              // if (parentId === 0) {
              //   //是根元素的hua ,不做任何操作,如果是正常的for-i循环,可以直接continue.
              // } else {
              //如果ele是子元素的话 ,把ele扔到他的父亲的child数组中.
              // flag=1 可以画
              if (d.FLAG === 1) {
                _modList.push(d)
              }
            });
            //去除重复元素
            // listData = listData.filter(ele => ele.PARENT_ID === 0);

            // console.log("resolve", listData)
            resolve(_modList)
          }).catch((e) => {
            console.log("e", e)
            reject()
          })
        })

      },
      //根据模型ID获取模型信息
      getModdelByID(model_id) {
        IndexedDB.getData(this.modelDB, 'model', model_id, (result) => {
          if (result) {
            // this.$emit('unitTotalAdd', 1)
            this.$emit('unitGroupAddMesh', result.mesh, result.modelID, result.unit)
          } else {
            const param = {
              method: 'GetModelByID',
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
                  let worker = new Worker("/static/workIndexedDB.js");
                  worker.postMessage(modelData); //向worker发送数据
                  worker.onmessage = function (evt) { //接收worker传过来的数据函数
                    worker.terminate();
                  }
                } else {
                  this.$emit('unitGroupAddMesh', null, null, null)
                }

              });
            }).catch((e) => {
              console.log(e)
            })
          }
        });
        // });

      },
    }
  }

</script>
