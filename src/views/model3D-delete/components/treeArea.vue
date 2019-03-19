<style lang="scss">
  @import "./treeArea";

</style>
<template>
  <div class="model3d-tree-area">
    <div class="treeDiv">
      <el-tabs type="border-card">
        <el-tab-pane label="建筑结构">
          <div class="model-tree">
            <!--:load="loadNode" lazy-->
            <el-tree :data="treeListData" :load="loadNode" lazy show-checkbox :render-after-expand="renderAfterExpand"
              node-key="ID" :props="defaultProps" style="height:100%" @check-change="handleCheckChange" @check="handlecheck">
            </el-tree>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
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
        loader: new THREE.ObjectLoader(),
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
        worker: null
      }
    },
    computed: {
      project_id() {
        return this.$store.state.project.project_id
      },
      buildListByProID() {
        return this.$store.state.model3d.buildListByProID
      },
      floorListByBudID() {
        return this.$store.state.model3d.floorListByBudID
      },
      modListByFloorID() {
        return this.$store.state.model3d.modListByFloorID
      },
      modelByID() {
        return this.$store.state.model3d.modelByID
      },
      modelMap() {
        return this.$store.state.model3d.modelMap
      },
      buildMap() {
        return this.$store.state.model3d.buildMap
      },
      modelTreeData1() {
        return this.$store.state.model3d.modelTreeData1
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
          this.getBuildingListByProID()
        }
      },
    },
    mounted() {
      if (this.project_id !== null) {
        this.getBuildingListByProID()


      }

    },
    methods: {
      getBuildingListByProID() {
        this.treeListData = []
        const param = {
          method: 'GetBuildingListByProID',
          project_id: this.project_id
        }
        this.$store.dispatch('QueryBuildingListByProID', param).then(() => {
          this.buildListByProID.forEach(build => {
            this.treeListData.push({
              ID: build.ID,
              NAME: build.NAME,
              children: [],
              type: 'build'
            })
          });
          // console.log("this.treeListData", this.treeListData)


        }).catch((e) => {
          console.log("e", e)
        })
      },
      getFloorListByProID(building_id, resolve) {
        const param = {
          method: 'GetFloorListByBudID',
          project_id: this.project_id,
          building_id: building_id
        }
        this.$store.dispatch('QueryFloorListByProID', param).then(() => {
          console.log("this.floorListByBudID", this.floorListByBudID)
          this.optionsProjectPersion = this.projectPersonList
          let listData = []
          this.floorListByBudID.forEach(floor => {
            listData.push({
              ID: floor.ID,
              BUILDID: param.building_id,
              NAME: floor.NAME,
              children: [],
              type: 'floor'
            })

          });

          resolve(listData)
        }).catch((e) => {
          console.log("e", e)
          resolve([])
        })
      },

      getModListByFloorID(floor, resolve) {
        const param = {
          method: 'GetModListByFloorID',
          project_id: this.project_id,
          floor_id: floor.ID,
          build_id: floor.BUILDID
        }
        this.$store.dispatch('QueryModListByFloorID', param).then(() => {
          // console.log("this.modListByFloorID", this.modListByFloorID)

          let listData = this.modListByFloorID
          listData.forEach(ele => {
            let parentId = ele.PARENT_ID;
            if (parentId === 0) {
              //是根元素的hua ,不做任何操作,如果是正常的for-i循环,可以直接continue.
            } else {
              //如果ele是子元素的话 ,把ele扔到他的父亲的child数组中.
              listData.forEach(d => {
                // console.log("d", d)
                // flag=1 可以画
                if (d.ID === parentId && d.FLAG !== 1) {
                  let childArray = d.children;
                  if (!childArray) {
                    childArray = []
                  }
                  childArray.push(ele);
                  d.children = childArray;
                }

                if (d.FLAG === 1) {
                  d.leaf = true
                  d.type = "model"
                } else {
                  d.leaf = false
                  d.type = "model"
                }
              })
            }
          });
          //去除重复元素
          listData = listData.filter(ele => ele.PARENT_ID === 0);

          // console.log("resolve", listData)
          resolve(listData)
        }).catch((e) => {
          console.log("e", e)
        })
      },
      //根据模型ID获取模型信息
      getModdelByID(model_id) {
        this.$emit('unitTotalAdd', 1)

        IndexedDB.getData(this.modelDB, 'model', model_id, (result) => {
          if (result) {
            this.$emit('unitGroupAddMesh', result.mesh, result.modelID)
          } else {
            const param = {
              method: 'GetModelByID',
              project_id: this.project_id,
              model_id: model_id
            }
            this.$store.dispatch('QueryModdelByID', param).then((data) => {
              data.forEach(unit => {
                let meshJson = getOriMesh(unit.MESH_JSON)
                let modelData = {
                  modelID: unit.ID,
                  unit: unit,
                  mesh: meshJson
                }
                this.$emit('unitGroupAddMesh', meshJson, unit.ID)
                // IndexedDB.putData(modelDB, 'model', [modelData]);
                let worker = new Worker("/static/workIndexedDB.js");
                worker.postMessage(modelData); //向worker发送数据
                worker.onmessage = function (evt) { //接收worker传过来的数据函数
                  // console.log('success', evt.data); //输出worker发送来的数据
                  worker.terminate();
                  // self.close();
                }

              });

            }).catch((e) => {
              console.log(e)
            })

          }
        });
        // });

      },
      loadNode(node, resolve) {
        // console.log("node, resolve", node, resolve)
        if (node.level === 1) {
          this.getFloorListByProID(node.data.ID, resolve)
        } else if (node.level === 2) {
          // console.log("node.data", node.data)
          this.getModListByFloorID(node.data, resolve)
        } else if (node.level > 2) {
          if (node.data.children !== undefined && node.data.children.length > 0) {
            return resolve(node.data.children);
          } else {
            return resolve([]);
          }

        }
      },
      handlecheck(data, checkObj) {
        const nodeChecked = data
        const checkedNodes = checkObj.checkedNodes
        let checked = false
        checkedNodes.forEach(node => {
          // console.log('node', node)
          if (nodeChecked.type === node.type && nodeChecked.ID === node.ID) {
            checked = true
          }
        })
        this.$emit('unitTotalRemove') // 清除统计的数据
        // 点击了某一个模型节点
        if (data.type === "model") {
          if (checked === true) {
            if (data.FLAG === 1) { // 可以画
              this.getModdelByID(data.ID)
            } else {
              const _children = data.children
              if (_children.length > 0) {
                this.getModDetail(_children)
              }
            }
          } else {
            console.log('delete', data)
            if (data.FLAG === 1) {
              this.$emit('unitRemove', data)
            } else {
              const _children = data.children
              // console.log('_children', _children)
              if (_children.length > 0) {
                _children.forEach(model => {
                  this.$emit('unitRemove', model)
                })
              }
            }
          }
        } else if (data.type === "build") {
          if (checked === true) {
            this.getBuildDetal(data)
          } else {
            // 删除模型
            const buildInfo = this.buildMap.get(data.ID)
            buildInfo.floor.forEach(floorInfo => {
              floorInfo.model.forEach(modelInfo => {
                this.$emit('unitRemove', modelInfo)
              })
            })
          }

        } else if (data.type === "floor") {
          if (checked === true) {
            this.getFloorDetail(data)
          } else {
            // 删除模型
            const buildInfo = this.buildMap.get(data.BUILDID)
            const floorInfo = buildInfo.floor.get(data.ID)
            floorInfo.model.forEach(modelInfo => {
              this.$emit('unitRemove', modelInfo)
            })
          }
        }
        // console.log('checkedNodes', checkedNodes)
      },
      handleCheckChange(data, checked, indeterminate) {
        // console.log("handleCheckChange", data, checked, indeterminate)

      },
      getBuildDetal(data) {
        const build_id = data.ID
        const buildInfo = this.buildMap.get(build_id)
        const floorMap = buildInfo.floor
        if (floorMap === undefined) {
          this.$store.dispatch('QueryFloorList', {
            method: 'GetFloorListByBudID',
            project_id: this.project_id,
            building_id: build_id
          }).then((data) => {
            let floorIDList = []
            data.data.forEach(floor => {
              floorIDList.push(floor.ID)
            })
            this.getFloorQueue(data, floorIDList)

          }).catch((e) => {
            console.log(e)
          })
        } else {
          console.log("加载", floorMap)

          let floorIDList = []
          floorMap.forEach(floor => {
            floorIDList.push(floor.ID)
          })
          // console.log("floorIDList", data, floorIDList)
          data['param'] = {
            project_id: this.project_id,
            building_id: build_id
          }
          this.getFloorQueue(data, floorIDList)
        }
      },
      getFloorQueue(data, list_array) {
        list_array.forEach(floorID => {
          this.getFloorDetail({
            BUILDID: data.param.building_id,
            ID: floorID,
          })
        })
      },
      getFloorDetail(data) {
        const build_id = data.BUILDID
        // const buildInfo = this.buildMap.get(build_id)
        const floor_id = data.ID

        this.$store.dispatch('QueryModList', {
          method: 'GetModListByFloorID',
          project_id: this.project_id,
          floor_id: floor_id,
          build_id: build_id
        }).then((data) => {
          console.log("GetModListByFloorIDGetModListByFloorID", build_id, floor_id, data.data)
          this.getModDetail(data.data)
        }).catch((e) => {
          console.log(e)
        })

      },
      getModDetail(modList) {
        const _listArray = [
          [],
          [],
          [],
          []
        ]
        let total = 0
        let totalAdd = 0

        modList.forEach(mod => {
          if (mod.FLAG === 1) {
            totalAdd++
            // console.log('IndexedDB.getData', mod.ID)
            IndexedDB.getData(this.modelDB, 'model', mod.ID, (result) => {
              this.$emit('unitTotalAdd', 1)
              total++
              if (result) {
                this.$emit('unitGroupAddMesh', result.mesh, result.modelID)
              } else {
                // 从云端获取
                // console.log('未获得数据记录');
                if (mod.ID % 4 == 0) {
                  _listArray[0].push(mod.ID)
                } else if (mod.ID % 4 == 1) {
                  _listArray[1].push(mod.ID)
                } else if (mod.ID % 4 == 2) {
                  _listArray[2].push(mod.ID)
                } else if (mod.ID % 4 == 3) {
                  _listArray[3].push(mod.ID)
                }
              }
              if (totalAdd === total) {
                // console.log("_listArray", _listArray)
                let spliceTotal = 50
                if (modList.length > 500 && modList.length <= 1000) {
                  spliceTotal = 100
                } else if (modList.length > 1000 && modList.length <= 5000) {
                  spliceTotal = 300
                } else if (modList.length > 5000) {
                  spliceTotal = 500
                }

                this.getModQueue(_listArray[0], spliceTotal)
                this.getModQueue(_listArray[1], spliceTotal)
                this.getModQueue(_listArray[2], spliceTotal)
                this.getModQueue(_listArray[3], spliceTotal)
              }
            });
          }
        })
        // });
      },
      getModQueue(list_array, spliceTotal) {
        let mod_id_list_queue = list_array.splice(0, spliceTotal)
        if (mod_id_list_queue.length > 0) {
          // 从云端获取
          this.$store.dispatch('QueryModdelByID', {
            method: 'GetModelByID',
            project_id: this.project_id,
            model_id: mod_id_list_queue.join(',')
          }).then((data) => {
            // let modelDB = this.modelDB;
            data.forEach(unit => {

              let meshJson = getOriMesh(unit.MESH_JSON)
              let modelData = {
                modelID: unit.ID,
                unit: unit,
                mesh: meshJson
              }
              this.$emit('unitGroupAddMesh', meshJson, unit.ID)
              let worker = new Worker("/static/workIndexedDB.js");
              worker.postMessage(modelData); //向worker发送数据
              worker.onmessage = (evt) => { //接收worker传过来的数据函数
                worker.terminate();
                if (list_array.length > 0) {
                  console.log('this.getModQueue')
                  this.getModQueue(list_array, spliceTotal)
                }
              }


            });
          }).catch((e) => {
            console.log(e)
          })
        }
      }
    }
  }

</script>
