<style lang="scss">
  @import "./lotPVSetting";

</style>
<template>
  <div id="lot-pv-setting" class="lot-pv-setting" style="margin: 0px;">
    <div id="viewer-local"></div>
    <div v-if="isShowViewPointArea" class="viewPointShowArea">
      <div class="viewPointTitle">
        <div class="title">
          <span>物联网场景管理</span>
        </div>
      </div>
    </div>
    <div v-if="isShowToolbarMarker" class="toolbar-marker">
      <el-button class="marker-button" title="保存">
        <font-awesome-icon v-if="currentItemList.length >0" :icon="['far','save']" @click="saveViewPointHandle" />
        <font-awesome-icon v-if="currentItemList.length === 0" :icon="['far','save']" style="color:grey;" />
      </el-button>
      <el-button class="marker-button" title="删除">
        <font-awesome-icon v-if="viewPointCurrentData !== null" icon="trash-alt" @click="deleteLotViewPointHandle()" />
        <font-awesome-icon v-if="viewPointCurrentData === null" icon="trash-alt" style="color:grey;" />
      </el-button>
      <hr />

      <el-button class="marker-button" title="建筑模型设置">
        <font-awesome-icon icon="layer-group" @click="openLotPVModelListSettingDialogHandle" />
      </el-button>


    </div>
    <lotPVModelListSettingDialog></lotPVModelListSettingDialog>
  </div>
</template>

<script>
  // 构件库列表

  import loadJs from '@/utils/loadJs.js'
  import Cookies from 'js-cookie'
  import lodash from 'lodash'
  let Base64 = require('js-base64').Base64

  import lotPVModelListSettingDialog from '@/views/modelDisplay/lotPVModelListSettingDialog'

  export default {
    name: 'lot-pv-setting',
    components: {
      lotPVModelListSettingDialog
    },
    data() {
      return {

        viewer: null, //new Autodesk.Viewing.Private.GuiViewer3D(element, config);
        urns: [],
        element: null, //document.getElementById('viewer-local');
        project_id: '',
        modelData: null,
        itemList: [],
        itemsAllMap: new Map(),
        itemInfoList: [],
        config: {
          extensions: [
            // "Autodesk.Viewing.ZoomWindow",
            // "markup3d",
            // "Autodesk.Section",
            // "Autodesk.Viewing.MarkupsCore",
            // "Autodesk.Viewing.AxisHelper"
            // 'Autodesk.Viewing.MemoryLimitedDebug'
          ],
          disabledExtensions: {
            measure: false,
            section: false,
          },
          memory: {
            limit: 32 * 1024 // 32 GB
          },
          // loaderExtensions: { svf: "Autodesk.MemoryLimited" },

        },
        options: {
          env: 'Local', // AutodeskDevelopment
          offline: 'true',
          useConsolidation: true,
          useADP: false,
          // consolidationMemoryLimit: 15000 * 1024 * 1024 // 150MB - Optional, defaults to 100MB
        },
        // MarkupsCore: null,
        ControlLotManager: null,
        isShowViewPointArea: true,
        isShowToolbarMarker: true,
        saveStatus: null,
        viewPointCurrentData: null, //当前的视点数据
        selectedDbId: [], // 选择的构件id
        loadedModels: [],
        storage: window.localStorage,
        storageProgressiveRenderingKey: 'Autodesk.Viewing.Private.GuiViewer3D.SavedSettings.progressiveRendering',
        isProgressiveRendering: true, // 模型是否重新渲染，闪烁  又叫渐进式显示 设置中有这个选项
        totalLowFps: 0, // 低速fps累计量
        FPS_LOW_LEVEL: 8, // 低于祯数 为慢
        FPS_HIGH_LEVEL: 15, // 高于祯数 为快
        FPS_LOW_TIMES: 50, // 低速fps累计次数

        FamilyListMap: [], // 模型库数据
        LotDeviceList: [], // 已经绑定的物联网设备列表
        LotDeviceModelMap: null, // 物联网模型列表
        // currentDeviceOpType: 0, // 当前设备模型的编辑模式 0:新增模式 1:编辑模式
        currentDeviceModel: null, // 当前正在操作的设备模型
        currentDeviceData: null, // 当前正在操作的设备数据
        currentEditModelName: {
          name: ''
        }, // 当前编辑的模型信息，用于顶部title显示
        currentItemIDList: [],
        currentItemList: [],

        cameraInfo: null, //实时的视点
        allItemList: [] // 所有的模型列表
        // totalHighFps: 0 // 高速fps累计量
      }
    },
    computed: {
      personInfo() {
        return this.$store.state.person.personInfo
      },
      LotPVModelListChange() {
        return this.$store.state.loT.LotPVModelListChange
      },

    },
    created() {

    },
    watch: {
      LotPVModelListChange: {
        handler: async function (newVal, oldVal) {
          console.log('LotPVModelListChange ', newVal)
          let _selectedItemList = newVal.SelectedItemList
          console.log('_selectedItemList ', _selectedItemList)


          if (this.currentItemList.length > 0) {
            this.cameraInfo = this.viewer.getState()
          }
          //清除数据
          this.clearData()
          this.getCurrentItemData(_selectedItemList)
          console.log('currentItemList', this.currentItemList)

          await this.loadManyModel()
          this.setLotDeviceModelList()

        },
        deep: true
      },

    },
    async mounted() {

      await loadJs(`./static/libs/viewer3D/viewer3D.min.js`)
      console.log('./static/libs/viewer3D/viewer3D.min.js')
      const __PROJECT_ID = Cookies.get("PROJECT_ID")
      this.project_id = parseInt(__PROJECT_ID)
      this.init()

    },
    beforeDestroy() {},
    destroyed() {},
    methods: {
      async init() {
        this.allItemList = await this.getProjectItemsAll()
        await this.init3DView()

        // 恢复视点的模型
        this.viewPointCurrentData = await this.getViewPointsByType()
        console.log('this.viewPointCurrentData', this.viewPointCurrentData)
        this.loadViewPointModel()
        this.FamilyListMap = await this.getFamilyList()
        console.log('this.FamilyListMap', this.FamilyListMap)
        this.allLotDeviceList = await this.getDeviceConfigList()
        console.log('this.allLotDeviceList', this.allLotDeviceList)
        this.setLotDeviceModelList()
        // 



      },
      clearData() {
        this.currentItemList.forEach(item => {
          this.viewer.unloadModel(this.viewer.model)
        })
        // this.currentItemList = []
        // this.currentItemIDList = []
        console.log("-->", this.LotDeviceModelMap);
        this.LotDeviceModelMap.forEach((value, key) => {
          this.viewer.unloadModel(this.viewer.model)
        });
        // this.LotDeviceModelMap = new map()
      },
      async loadViewPointModel() {
        if (this.viewPointCurrentData !== null) {
          let _item_ids = this.viewPointCurrentData.item_ids
          if (_item_ids !== null && _item_ids !== '') {
            let _itemIdlist = JSON.parse(_item_ids)
            if (_itemIdlist.length > 0) {
              this.getCurrentItemData(_itemIdlist)
              await this.loadManyModel()
            }
          }
        }
      },
      restoreState() {
        if (this.cameraInfo === null) {
          // this.cameraInfo = this.viewer.getState()
          if (this.viewPointCurrentData !== null) {
            let _cameraInfo = JSON.parse(Base64.decode(this.viewPointCurrentData.camera_info))
            if (_cameraInfo !== null && _cameraInfo !== '') {
              this.cameraInfo = _cameraInfo
            }
          }
        }
        if (this.cameraInfo !== null) {
          console.log('restoreStaterestoreStaterestoreStaterestoreState', this.cameraInfo)
          this.viewer.restoreState(this.cameraInfo); //it fails to restore state
        }

      },
      getViewPointsByType() {
        return new Promise((resolve, reject) => {
          const param = {
            method: 'GetViewPoints',
            type: 4, // 物联网的展示页面的视点类型
            project_id: this.project_id
          }
          this.$store.dispatch('GetViewPoints', param).then((_viewPointList) => {
            console.log('GetViewPoints', _viewPointList)
            let _viewPoint = null
            if (_viewPointList.length > 0) {
              _viewPoint = _viewPointList[0]
            }

            resolve(_viewPoint)
          })

        })
      },
      getProjectItemsAll() {
        return new Promise((resolve, reject) => {
          const param = {
            method: 'project_items',
            project_id: this.project_id,
            // access_token: this.access_token
          }
          this.$store.dispatch('GetProjectItems', param).then((_itemList) => {
            console.log('getProjectItemsAll - _itemList', _itemList)
            _itemList.forEach(item => {
              this.itemsAllMap.set(item.id, item)
            });

            resolve(_itemList)

          })

        })
      },
      getCurrentItemData(itemIdList) {
        this.currentItemList = []
        this.currentItemIDList = []
        itemIdList.forEach(_id => {
          let _item = this.itemsAllMap.get(_id)
          this.currentItemList.push(_item)
          this.currentItemIDList.push(_item.id)
        });
      },
      init3DView() {
        return new Promise((resolve, reject) => {
          // this.urns = modelURLList
          Autodesk.Viewing.Initializer(this.options, async () => {
            this.element = document.getElementById('viewer-local');
            this.viewer = new Autodesk.Viewing.Private.GuiViewer3D(this.element, this.config);

            this.viewer.addEventListener(
              Autodesk.Viewing.GEOMETRY_LOADED_EVENT,
              this.onLoadedEvent
            );
            var startedCode = this.viewer.start();
            if (startedCode > 0) {
              console.error('Failed to create a Viewer: WebGL not supported.');
              return;
            }
            this.viewer.setBackgroundColor(0, 59, 111, 255, 255, 255);
            this.viewer.addEventListener(Autodesk.Viewing.CAMERA_CHANGE_EVENT, (rt) => {})

            resolve()

          });

        })
      },
      async loadManyModel() {
        return new Promise(async (resolve, reject) => {
          let _result = this.getModelUrl()
          console.log('getModelUrl - result', _result)
          let modelURLList = _result['urlList']

          if (modelURLList.length === 0) {
            resolve()
          } else {
            let _Plist = []
            for (var i = 0; i < modelURLList.length; i++) {
              let p = await this.loadModel(modelURLList[i], this.currentItemList[i], i)
              _Plist.push(p)
            }
            Promise.all(_Plist).then(result => {
              this.restoreState()
              resolve()
            })
          }

        })

      },
      getModelUrl() {
        let result = null
        let _urlList = []
        this.currentItemList.forEach(itemInfo => {
          _urlList.push(itemInfo.url.replace('/www/bim_proj/', '').replace('/BCP_FILE/', 'BCP_FILE/'))
        });
        result = {
          'urlList': _urlList,
        }
        return result
      },
      onLoadedEvent(event) {
        console.log('ononLoadedEvent---123', event)
      },

      loadModel(modelURL, itemInfo, index) {
        return new Promise((resolve, reject) => {
          const modelOpts = {
            placementTransform: new THREE.Matrix4(),
            globalOffset: {
              x: 0,
              y: 0,
              z: 0
            }
          };
          this.viewer.loadModel(modelURL, modelOpts, async (model) => {
            model['item_id'] = itemInfo.item_id
            // this.loadedModels.push(model)
            if (index === 0) {
              this.viewer.setBackgroundColor(0, 59, 111, 255, 255, 255);
              this.viewer.setGroundShadow(true)
              this.viewer.setReverseZoomDirection(true) //true 滚动向前为放大
              this.viewer.setProgressiveRendering(this.isProgressiveRendering)

              // this.restoreState()
              // if (!this.viewer.overlays.hasScene('custom-scene-1')) {
              //   this.viewer.overlays.addScene('custom-scene-1');
              // }
              // this.saveStatus = JSON.stringify(this.viewer.getState());
              // this.addCustomToolBar()
              // this.addViewpointToolBar()
              // this.showAllViewpointToolBar()
            }
            // this.restoreState()
            resolve(index)
          }, this.onLoadError);


        })
      },
      openLotPVModelListSettingDialogHandle() {
        // 打开构件列表窗口
        const param = {
          show: true,
          item_id_list: this.currentItemIDList,
          all_item_ist: this.allItemList
        }
        this.$store.dispatch('ShowLotPVModelListSettingDialog', param).then(() => {}).catch(() => {})
      },
      saveViewPointHandle() {
        if (this.currentItemList.length === 0) {
          this.$message({
            message: '请添加要显示的模型',
            type: 'error'
          })
          return
        }
        // 视点数据
        let saveStatus = JSON.stringify(this.viewer.getState());
        // let _item_ids = []
        // if (this.currentItemIDList.length>0){

        // }
        const param = {
          "method": "SaveViewPoint",
          // "editType": 4, // 物联网视点
          "type": 4, // 物联网视点
          "project_id": this.project_id,
          "name": "",
          "desc": "",
          // "file_ids": this.itemCurrentFileIdList.join(','),
          "item_ids": this.currentItemIDList.join(','),
          "camera_info": Base64.encode(saveStatus),
          // "picture_info": markupsBase64,
          // "svg_info": Base64.encode(markupsExtData),
          "creator": this.personInfo.person.id,
          // "itemInfoList": this.currentItemList,
          // "ViewPointCurrentData": this.ViewPointCurrentData
        }
        if (this.viewPointCurrentData !== null) {
          param['id'] = this.viewPointCurrentData.id
        }
        console.log('param', param)
        this.$store.dispatch('SaveViewPoint', param).then(async (result) => {
          console.log('result', result)
          if (result.status === "success") {
            this.viewPointCurrentData = await this.getViewPointsByType()
            this.$message({
              message: '物联网视点保存成功！',
              type: 'success'
            })

          }
        })
      },
      deleteLotViewPointHandle() {
        this.$confirm(`是否要删除物联网建筑配置?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          dangerouslyUseHTMLString: true
        }).then(() => {
          const param = {
            method: 'DeleteViewpointById',
            id: this.viewPointCurrentData.id,
            project_id: this.project_id
          }
          this.$store.dispatch('DeleteViewpointById', param).then((result) => {
            // console.log('DeleteViewpointById - result', result)
            // this.getData()
            this.viewPointCurrentData = null
            this.clearData()
            this.getCurrentItemData([])
            this.$message({
              message: '物联网建筑配置删除成功！',
              type: 'success'
            })
            // this.viewPointAllList = _viewPointList
            // resolve()
          })
        })
      },
      getFamilyList() {
        return new Promise((resolve, reject) => {
          const param = {
            method: 'family_query',
            project_id: this.project_id,
            // access_token: this.access_token
          }
          this.$store.dispatch('GetFamilyQuery', param).then((_itemList) => {
            console.log('GetFamilyQuery - _itemList', _itemList)
            let _mapData = new Map()
            _itemList.forEach(itemInfo => {
              _mapData.set(itemInfo.id, itemInfo)
            })

            resolve(_mapData)
          })

        })
      },
      getDeviceConfigList() {
        return new Promise((resolve, reject) => {
          this.buildList = []
          const param = {
            method: 'device_config',
            project_id: this.project_id,
            // buliding_id: this.itemInfoList[0].item_id
          }
          this.$store.dispatch('GetDeviceConfig', param).then((_itemList) => {
            console.log('GetDeviceConfig - _itemList', _itemList)

            resolve(_itemList)
          })

        })
      },
      setLotDeviceModelList() {
        this.LotDeviceModelMap = new Map()

        this.LotDeviceList = []
        this.currentItemList.forEach(item => {
          console.log('item', item)
          this.allLotDeviceList.forEach(device => {
            if (item.id === device.buliding_id) {
              this.LotDeviceList.push(device)
            }
          })
        })

        this.LotDeviceList.forEach(itemInfo => {
          if (itemInfo.family_id > 0) {
            console.log('itemInfoitemInfo121113', itemInfo)
            let _familyModel = this.FamilyListMap.get(itemInfo.family_id)
            let _family_location = itemInfo.family_location
            const familyLocation = JSON.parse(_family_location);
            console.log('_model_model', _familyModel, _family_location, familyLocation)

            let _url = _familyModel.file.replace('/BCP_FILE/', 'BCP_FILE/')

            const modelOpts = {
              placementTransform: new THREE.Matrix4(),
              globalOffset: {
                x: 0,
                y: 0,
                z: 0
              }
            };

            this.viewer.loadModel(_url, modelOpts, (model) => {
              model.infoData = _familyModel
              this.LotDeviceModelMap.set(itemInfo.id, {
                deviceData: itemInfo,
                model: model
              })
              console.log('---->', familyLocation.position.x, familyLocation.position.y, familyLocation.position
                .z)
              const _x = familyLocation.rotate.x;
              const _y = familyLocation.rotate.y;
              const _z = familyLocation.rotate.z;
              this.RotateModel(model, 1, 0, 0, _x)
              this.RotateModel(model, 0, 1, 0, _y)
              this.RotateModel(model, 0, 0, 1, _z)
              this.MoveModel(model,
                familyLocation.position.x,
                familyLocation.position.y,
                familyLocation.position.z)


              console.log('this.LotDeviceModelMap', this.LotDeviceModelMap)
            }, this.onLoadError);
          }

        })
      },
      MoveModel(model, x, y, z) {
        const thisModel = model; //viewer.getAggregateSelection()[0].model
        const fragCount = thisModel.getFragmentList().fragments.fragId2dbId.length;
        for (let fragId = 0; fragId < fragCount; ++fragId) {
          const fragProxy = this.viewer.impl.getFragmentProxy(thisModel, fragId);
          fragProxy.getAnimTransform();
          // const position = new THREE.Vector3(
          //   fragProxy.position.x + x,
          //   fragProxy.position.y + y,
          //   fragProxy.position.z + z
          // );
          const position = new THREE.Vector3(
            x,
            y,
            z
          );
          fragProxy.position = position;
          fragProxy.updateAnimTransform();
        }
        this.viewer.impl.sceneUpdated(true);
      },
      geWorldBoundingBox(fragIds, fragList) {
        var fragbBox = new THREE.Box3()
        var nodebBox = new THREE.Box3()
        fragIds.forEach((fragId) => {
          fragList.getWorldBounds(fragId, fragbBox)
          nodebBox.union(fragbBox)
        })
        return nodebBox
      },
      rotateFragments(model, fragIdsArray, axis, angle, center) {
        console.log('angle', angle, axis)
        var quaternion = new THREE.Quaternion()
        quaternion.setFromAxisAngle(axis, angle)
        fragIdsArray.forEach((fragId, idx) => {
          var fragProxy = this.viewer.impl.getFragmentProxy(
            model, fragId)
          fragProxy.getAnimTransform()
          var position = new THREE.Vector3(
            fragProxy.position.x - center.x,
            fragProxy.position.y - center.y,
            fragProxy.position.z - center.z)
          position.applyQuaternion(quaternion)
          position.add(center)
          fragProxy.position = position
          fragProxy.quaternion.multiplyQuaternions(
            quaternion, fragProxy.quaternion)
          if (idx === 0) {
            var euler = new THREE.Euler()
            euler.setFromQuaternion(
              fragProxy.quaternion, 0)
            // this.emit('transform.rotate', {
            //     rotation: euler,
            //     model
            // })
          }
          fragProxy.updateAnimTransform()
        })
        this.viewer.impl.sceneUpdated(true);
      },
      RotateModel(model, axisX, axisY, axisZ, angle) {
        const thisModel = model //viewer.getAggregateSelection()[0].model
        const fragCount = thisModel.getFragmentList().fragments.fragId2dbId.length;
        let fragIdsArray = []
        for (var fragId = 0; fragId < fragCount; ++fragId) {
          fragIdsArray.push(fragId)
        }
        var bBox = this.geWorldBoundingBox(fragIdsArray, thisModel.getFragmentList())
        var center = new THREE.Vector3(
          (bBox.min.x + bBox.max.x) / 2,
          (bBox.min.y + bBox.max.y) / 2,
          (bBox.min.z + bBox.max.z) / 2)

        // var size = Math.max(
        //     bBox.max.x - bBox.min.x,
        //     bBox.max.y - bBox.min.y,
        //     bBox.max.z - bBox.min.z) * 0.8

        var axis = new THREE.Vector3(axisX, axisY, axisZ)
        this.rotateFragments(thisModel, fragIdsArray, axis, angle * Math.PI / 180, center)
      },
    }
  }

</script>
