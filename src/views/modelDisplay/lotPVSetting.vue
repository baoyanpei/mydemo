<style lang="scss">
@import './lotPVSetting';
</style>
<template>
  <div id="lot-pv-setting" class="lot-pv-setting" style="margin: 0px;">
    <div id="viewer-local" v-show="tip_message===''"></div>
    <div v-if="nomodel_message!==''" class="nomodel_message" v-html="nomodel_message"></div>
    <div v-if="tip_message!==''" class="tip_message" v-html="tip_message"></div>
    <div v-if="tip_message==='' && isShowViewPointArea" class="viewPointShowArea">
      <div class="viewPointTitle">
        <div class="title">
          <span>物联网场景管理</span>
        </div>
      </div>
    </div>
    <div v-if="tip_message==='' && isShowToolbarMarker" class="toolbar-marker">
      <el-button class="marker-button" title="保存">
        <font-awesome-icon
          v-if="currentItemList.length >0"
          :icon="['far','save']"
          @click="saveViewPointHandle"
        />
        <font-awesome-icon
          v-if="currentItemList.length === 0"
          :icon="['far','save']"
          style="color:grey;"
        />
      </el-button>
      <el-button class="marker-button" title="删除">
        <font-awesome-icon
          v-if="viewPointCurrentData !== null"
          icon="trash-alt"
          @click="deleteLotViewPointHandle()"
        />
        <font-awesome-icon
          v-if="viewPointCurrentData === null"
          icon="trash-alt"
          style="color:grey;"
        />
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
      tip_message: '',
      nomodel_message: '',
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
          section: false
        },
        memory: {
          limit: 32 * 1024 // 32 GB
        }
        // loaderExtensions: { svf: "Autodesk.MemoryLimited" },
      },
      options: {
        env: 'Local', // AutodeskDevelopment
        offline: 'true',
        useConsolidation: true,
        useADP: false
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
      storageProgressiveRenderingKey:
        'Autodesk.Viewing.Private.GuiViewer3D.SavedSettings.progressiveRendering',
      isProgressiveRendering: true, // 模型是否重新渲染，闪烁  又叫渐进式显示 设置中有这个选项
      totalLowFps: 0, // 低速fps累计量
      FPS_LOW_LEVEL: 8, // 低于祯数 为慢
      FPS_HIGH_LEVEL: 15, // 高于祯数 为快
      FPS_LOW_TIMES: 50, // 低速fps累计次数

      FamilyListMap: [], // 模型库数据
      LotDeviceList: [], // 已经绑定的物联网设备列表
      LotDeviceModelMap: null, // 物联网模型列表
      TajiModelMap: null, // 塔机模型列表
      SjjModelMap: null, // 升降机模型列表
      // currentDeviceOpType: 0, // 当前设备模型的编辑模式 0:新增模式 1:编辑模式
      currentDeviceModel: null, // 当前正在操作的设备模型
      currentDeviceData: null, // 当前正在操作的设备数据
      currentEditModelName: {
        name: ''
      }, // 当前编辑的模型信息，用于顶部title显示
      currentItemIDList: [],
      currentItemList: [],
      currentItemModelList: [], // 当前加载的模型

      cameraInfo: null, //实时的视点
      allItemList: [], // 所有的模型列表

      isShowDevice: true, // 是否显示设备
      isShouBiaozhu: true // 是否显示标注
      // totalHighFps: 0 // 高速fps累计量
    }
  },
  computed: {
    personInfo() {
      return this.$store.state.person.personInfo
    },
    LotPVModelListChange() {
      return this.$store.state.loT.LotPVModelListChange
    }
  },
  created() {},
  watch: {
    LotPVModelListChange: {
      handler: async function(newVal, oldVal) {
        console.log('LotPVModelListChange ', newVal)
        let _selectedItemList = newVal.SelectedItemList
        console.log('_selectedItemList ', _selectedItemList)
        this.nomodel_message = ''

        if (this.currentItemList.length > 0) {
          this.cameraInfo = this.viewer.getState()
        }
        this.removeAllDeviceLabel()
        //清除数据
        this.clearData()
        this.getCurrentItemData(_selectedItemList)
        console.log('currentItemList', this.currentItemList)

        await this.loadManyModel()
        await this.setLotDeviceModelList()
        this.addDeviveLabel()
      },
      deep: true
    }
  },
  async mounted() {
    this.tip_message = '正在加载模型底层程序...'
    await loadJs(`./static/libs/viewer3D/viewer3D.min.js`)
    console.log('./static/libs/viewer3D/viewer3D.min.js')
    this.tip_message = ''
    // await loadJs(`./static/libs/viewers_7.15/extensions/iconExtension.js`)
    // console.log('./static/libs/viewers_7.15/extensions/iconExtension.js')
    const __PROJECT_ID = Cookies.get('PROJECT_ID')
    this.project_id = parseInt(__PROJECT_ID)
    this.init()
  },
  beforeDestroy() {},
  destroyed() {},
  methods: {
    async init() {
      this.allItemList = await this.getProjectItemsAll()
      await this.init3DView()

      this.viewer.addEventListener(
        // Autodesk.Viewing.SELECTION_CHANGED_EVENT,
        Autodesk.Viewing.AGGREGATE_SELECTION_CHANGED_EVENT,
        this.onSelectionChanged
      )
      // 恢复视点的模型
      this.viewPointCurrentData = await this.getViewPointsByType()
      console.log('this.viewPointCurrentData', this.viewPointCurrentData)
      if (this.viewPointCurrentData === null) {
        this.nomodel_message = '当前项目尚未配置建筑模型'
      }

      this.loadViewPointModel()
      this.FamilyListMap = await this.getFamilyList()
      console.log('this.FamilyListMap', this.FamilyListMap)
      this.allLotDeviceList = await this.getDeviceConfigList()
      console.log('this.allLotDeviceList', this.allLotDeviceList)
      await this.setLotDeviceModelList()
      //
      this.addDeviveLabel()
    },
    onSelectionChanged(event) {
      // console.log('this.viewer', this.viewer)
      // console.log('event1', event)
      let _selections = event.selections
      console.log('_selections', _selections)
      // this.selectedDbId = _dbIds
      this.selectedDbId = []
      _selections.forEach(selection => {
        let _dbIdArray = selection.dbIdArray
        _dbIdArray.forEach(dbId => {
          console.log('dbId', dbId)
          selection.model.getProperties(dbId, elements => {
            var dbid = elements.dbId
            this.selectedDbId.push(dbid)
            console.log('elements', elements)
            // let min = this.getFragXYZ(dbid)
            // this.drawViewPointLabel(min, 'aaa', 'asd', 'dasd')
          })
        })
      })
      // Asyncronous method that gets object properties
      // 异步获取模型的属性
      // this.viewer.getProperties(_dbIds[0],
      //   (elements) => {
      //     var dbid = elements.dbId;
      //     console.log('elements', elements)
      //     // let min = this.getFragXYZ(dbid)
      //     // this.drawViewPointLabel(min, 'aaa', 'asd', 'dasd')

      //   })
    },
    clearData() {
      this.currentItemModelList.forEach(model => {
        this.viewer.unloadModel(model)
      })
      this.currentItemModelList = []
      console.log('-->', this.LotDeviceModelMap)
      this.removeAllDeviceModel()
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
          let _cameraInfo = JSON.parse(
            Base64.decode(this.viewPointCurrentData.camera_info)
          )
          if (_cameraInfo !== null && _cameraInfo !== '') {
            this.cameraInfo = _cameraInfo
          }
        }
      }
      if (this.cameraInfo !== null) {
        console.log(
          'restoreStaterestoreStaterestoreStaterestoreState',
          this.cameraInfo
        )
        setTimeout(() => {
          this.viewer.restoreState(this.cameraInfo) //it fails to restore state
        }, 3000)

        // this.currentItemModelList.forEach(model => {
        //   this.viewer.impl.visibilityManager.isolate(-1, model);
        // })
      }
    },
    getViewPointsByType() {
      return new Promise((resolve, reject) => {
        const param = {
          method: 'GetViewPoints',
          type: 4, // 物联网的展示页面的视点类型
          project_id: this.project_id
        }
        this.$store.dispatch('GetViewPoints', param).then(_viewPointList => {
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
          project_id: this.project_id
          // access_token: this.access_token
        }
        this.$store.dispatch('GetProjectItems', param).then(_itemList => {
          console.log('getProjectItemsAll - _itemList', _itemList)
          _itemList.forEach(item => {
            this.itemsAllMap.set(item.id, item)
          })

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
      })
    },
    init3DView() {
      return new Promise((resolve, reject) => {
        // this.urns = modelURLList
        Autodesk.Viewing.Initializer(this.options, async () => {
          this.element = document.getElementById('viewer-local')
          this.viewer = new Autodesk.Viewing.Private.GuiViewer3D(
            this.element,
            this.config
          )

          this.viewer.addEventListener(
            Autodesk.Viewing.GEOMETRY_LOADED_EVENT,
            this.onLoadedEvent
          )
          var startedCode = this.viewer.start()
          if (startedCode > 0) {
            console.error('Failed to create a Viewer: WebGL not supported.')
            return
          }

          if (!this.viewer.overlays.hasScene('custom-scene')) {
            this.viewer.overlays.addScene('custom-scene')
          }
          this.viewer.setBackgroundColor(0, 59, 111, 255, 255, 255)
          this.viewer.addEventListener(
            Autodesk.Viewing.CAMERA_CHANGE_EVENT,
            rt => {
              // find out all pushpin markups
              var $eles = $("div[id^='mymk']")
              var DOMeles = $eles.get()

              for (var index in DOMeles) {
                // get each DOM element
                let DOMEle = DOMeles[index]
                let divEle = $('#' + DOMEle.id)
                // get out the 3D coordination
                let val = divEle.data('3DData')
                let pushpinModelPt = JSON.parse(val)
                // get the updated screen point
                let screenpoint = this.viewer.worldToClient(
                  new THREE.Vector3(
                    pushpinModelPt.x,
                    pushpinModelPt.y,
                    pushpinModelPt.z
                  )
                )
                // update the SVG position.
                divEle.css({
                  left: screenpoint.x - pushpinModelPt.radius * 2,
                  top: screenpoint.y - pushpinModelPt.radius
                })
              }
            }
          )

          resolve()
        })
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
            let p = await this.loadModel(
              modelURLList[i],
              this.currentItemList[i],
              i
            )
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
        _urlList.push(
          itemInfo.url
            .replace('/www/bim_proj/', '')
            .replace('/BCP_FILE/', 'BCP_FILE/')
        )
      })
      result = {
        urlList: _urlList
      }
      return result
    },
    onLoadedEvent(event) {
      console.log('ononLoadedEvent---123', event)
    },

    loadModel(modelURL, itemInfo, index) {
      return new Promise((resolve, reject) => {
        console.log('----------------', index)
        const modelOpts = {
          placementTransform: new THREE.Matrix4(),
          globalOffset: {
            x: 0,
            y: 0,
            z: 0
          }
        }
        this.viewer.loadModel(
          modelURL,
          modelOpts,
          async model => {
            model['item_id'] = itemInfo.item_id
            this.currentItemModelList.push(model)
            // this.loadedModels.push(model)
            if (index === 0) {
              this.viewer.setBackgroundColor(0, 59, 111, 255, 255, 255)
              this.viewer.setGroundShadow(true)
              this.viewer.setReverseZoomDirection(true) //true 滚动向前为放大
              this.viewer.setProgressiveRendering(this.isProgressiveRendering)

              this.addLotToolBar()
            }
            resolve(index)
          },
          this.onLoadError
        )
      })
    },
    openLotPVModelListSettingDialogHandle() {
      // 打开构件列表窗口
      const param = {
        show: true,
        item_id_list: this.currentItemIDList,
        all_item_ist: this.allItemList
      }
      this.$store
        .dispatch('ShowLotPVModelListSettingDialog', param)
        .then(() => {})
        .catch(() => {})
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
      let saveStatus = JSON.stringify(this.viewer.getState())
      // let _item_ids = []
      // if (this.currentItemIDList.length>0){

      // }
      const param = {
        method: 'SaveViewPoint',
        // "editType": 4, // 物联网视点
        type: 4, // 物联网视点
        project_id: this.project_id,
        name: '',
        desc: '',
        // "file_ids": this.itemCurrentFileIdList.join(','),
        item_ids: this.currentItemIDList.join(','),
        camera_info: Base64.encode(saveStatus),
        // "picture_info": markupsBase64,
        // "svg_info": Base64.encode(markupsExtData),
        creator: this.personInfo.person.id
        // "itemInfoList": this.currentItemList,
        // "ViewPointCurrentData": this.ViewPointCurrentData
      }
      if (this.viewPointCurrentData !== null) {
        param['id'] = this.viewPointCurrentData.id
      }
      console.log('param', param)
      this.$store.dispatch('SaveViewPoint', param).then(async result => {
        console.log('result', result)
        if (result.status === 'success') {
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
        this.$store.dispatch('DeleteViewpointById', param).then(result => {
          // console.log('DeleteViewpointById - result', result)
          // this.getData()
          this.viewPointCurrentData = null
          this.clearData()
          this.getCurrentItemData([])
          this.removeAllDeviceLabel()
          this.$message({
            message: '物联网建筑配置删除成功！',
            type: 'success'
          })
          if (this.viewPointCurrentData === null) {
            this.nomodel_message = '当前项目尚未配置建筑模型'
          }
          // this.viewPointAllList = _viewPointList
          // resolve()
        })
      })
    },
    getFamilyList() {
      return new Promise((resolve, reject) => {
        const param = {
          method: 'family_query',
          project_id: this.project_id
          // access_token: this.access_token
        }
        this.$store.dispatch('GetFamilyQuery', param).then(_itemList => {
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
          project_id: this.project_id
          // buliding_id: this.itemInfoList[0].item_id
        }
        this.$store.dispatch('GetDeviceConfig', param).then(_itemList => {
          console.log('GetDeviceConfig - _itemList', _itemList)

          resolve(_itemList)
        })
      })
    },
    // 清除所有的设备
    removeAllDeviceModel() {
      if (this.LotDeviceModelMap !== null) {
        this.LotDeviceModelMap.forEach((value, key) => {
          console.log('valuevaluevaluevalue', value)
          if (value.deviceData.device_type === 13) {
            this.viewer.overlays.impl.removeOverlay('custom-scene', value.model)
          } else if (value.deviceData.device_type === 12) {
            this.viewer.overlays.impl.removeOverlay(
              'custom-scene',
              value.elevatorModel
            )
            this.viewer.overlays.impl.removeOverlay(
              'custom-scene',
              value.sectionModel
            )
          } else if (
            value.deviceData.family_id > 0 &&
            value.deviceData.family_id < 999999
          ) {
            this.viewer.unloadModel(value.model)
          }

          // this.viewer.unloadModel(this.viewer.model)
        })
        this.TajiModelMap = null
        this.SjjModelMap = null
        this.LotDeviceModelMap = null
      }
    },
    // 获取当前建筑已经配置的设备列表
    getLotDeviceList() {
      this.LotDeviceList = []
      this.currentItemList.forEach(item => {
        console.log('item', item)
        this.allLotDeviceList.forEach(device => {
          if (item.id === device.buliding_id) {
            this.LotDeviceList.push(device)
          }
        })
      })
    },
    async setLotDeviceModelList() {
      return new Promise(async (resolve, reject) => {
        if (this.isShowDevice === false) {
          resolve()
          return
        }
        this.LotDeviceModelMap = new Map()
        this.TajiModelMap = new Map()
        this.SjjModelMap = new Map()
        this.getLotDeviceList()

        let _Plist = []
        for (var i = 0; i < this.LotDeviceList.length; i++) {
          const LotDevice = this.LotDeviceList[i]
          if (LotDevice.device_type === 13) {
            // 塔吊
            this.loadTajiModel(LotDevice)
          } else if (LotDevice.device_type === 12) {
            // 升降机
            this.loadSjjModel(LotDevice)
          } else {
            // 其他物联网设备
            let p = await this.loadDeviceModel(LotDevice, i)
            _Plist.push(p)
          }
        }

        Promise.all(_Plist).then(result => {
          resolve()
        })
      })
    },
    loadDeviceModel(itemInfo, index) {
      return new Promise((resolve, reject) => {
        let _familyModel = this.FamilyListMap.get(itemInfo.family_id)
        let _family_location = itemInfo.family_location
        const familyLocation = JSON.parse(_family_location)
        console.log(
          '_model_model',
          _familyModel,
          _family_location,
          familyLocation
        )

        let _url = _familyModel.file.replace('/BCP_FILE/', 'BCP_FILE/')

        const modelOpts = {
          placementTransform: new THREE.Matrix4(),
          globalOffset: {
            x: 0,
            y: 0,
            z: 0
          }
        }
        this.viewer.loadModel(
          _url,
          modelOpts,
          model => {
            model.infoData = _familyModel
            this.LotDeviceModelMap.set(itemInfo.id, {
              deviceData: itemInfo,
              model: model
            })
            console.log(
              '---->',
              familyLocation.position.x,
              familyLocation.position.y,
              familyLocation.position.z
            )
            const _x = familyLocation.rotate.x
            const _y = familyLocation.rotate.y
            const _z = familyLocation.rotate.z
            this.RotateModel(model, 1, 0, 0, _x)
            this.RotateModel(model, 0, 1, 0, _y)
            this.RotateModel(model, 0, 0, 1, _z)
            this.MoveModel(
              model,
              familyLocation.position.x,
              familyLocation.position.y,
              familyLocation.position.z
            )

            console.log('this.LotDeviceModelMap', this.LotDeviceModelMap)
            resolve(index)
          },
          this.onLoadError
        )
      })
    },
    loadTajiModel(tajiData) {
      console.log('tajiData', tajiData)
      if (tajiData.family_id > 0) {
        const familyLocation = JSON.parse(tajiData.family_location)
        let towerGroup = new THREE.Group()
        towerGroup.scale.set(
          familyLocation.scale,
          familyLocation.scale,
          familyLocation.scale
        )
        towerGroup.position.set(
          familyLocation.position.x,
          familyLocation.position.y,
          familyLocation.position.z
        )
        // towerGroup.name = `towerGroup${tajiData.id}`;
        modifyTower2(
          towerGroup,
          `towerGroup${tajiData.id}`,
          familyLocation.height,
          familyLocation.rotate.z,
          0,
          0,
          0
        ) // towerGroup,名称，高度，初始化角度大臂角度，小车距离，吊钩线长

        this.viewer.overlays.impl.addOverlay('custom-scene', towerGroup)

        // let _familyModel = this.FamilyListMap.get(tajiData.family_id);
        // towerGroup.infoData = _familyModel;
        this.LotDeviceModelMap.set(tajiData.id, {
          deviceData: tajiData,
          model: towerGroup
        })

        this.TajiModelMap.set(tajiData.device_id, {
          deviceData: tajiData,
          model: towerGroup
        })
      }
    },
    loadSjjModel(sjjData) {
      console.log('sjjData', sjjData)
      if (sjjData.family_id > 0) {
        const familyLocation = JSON.parse(sjjData.family_location)
        let elevatorGroup = new THREE.Group()
        elevatorGroup.scale.set(
          familyLocation.scale,
          familyLocation.scale,
          familyLocation.scale
        )
        elevatorGroup.position.set(
          familyLocation.elevatorPosition.x,
          familyLocation.elevatorPosition.y,
          familyLocation.elevatorPosition.z
        )

        elevatorGroup.rotateZ(familyLocation.elevatorRotate.z * (Math.PI / 180))

        modifyElevator(elevatorGroup, `elevatorGroup${sjjData.id}`, 0, false) // 名称，高度，门的开启状态
        this.viewer.overlays.impl.addOverlay('custom-scene', elevatorGroup)

        // 升降机的轨道
        let sectionGroup = new THREE.Group()
        sectionGroup.scale.set(
          familyLocation.scale,
          familyLocation.scale,
          familyLocation.scale
        )

        sectionGroup.position.set(
          familyLocation.sectionPosition.x,
          familyLocation.sectionPosition.y,
          familyLocation.sectionPosition.z
        )

        sectionGroup.rotateZ(familyLocation.sectionRotate.z * (Math.PI / 180))

        this.viewer.overlays.impl.addOverlay('custom-scene', sectionGroup)
        LoadSection(sectionGroup, familyLocation.sectionHeight)

        this.LotDeviceModelMap.set(sjjData.id, {
          deviceData: sjjData,
          elevatorModel: elevatorGroup,
          sectionModel: sectionGroup
        })

        this.SjjModelMap.set(sjjData.device_id, {
          deviceData: sjjData,
          elevatorModel: elevatorGroup,
          sectionModel: sectionGroup
        })
        // this.viewer.impl.invalidate(true, true, true)
      }
    },
    MoveModel(model, x, y, z) {
      const thisModel = model //viewer.getAggregateSelection()[0].model
      const fragCount = thisModel.getFragmentList().fragments.fragId2dbId.length
      for (let fragId = 0; fragId < fragCount; ++fragId) {
        const fragProxy = this.viewer.impl.getFragmentProxy(thisModel, fragId)
        fragProxy.getAnimTransform()
        // const position = new THREE.Vector3(
        //   fragProxy.position.x + x,
        //   fragProxy.position.y + y,
        //   fragProxy.position.z + z
        // );
        const position = new THREE.Vector3(x, y, z)
        fragProxy.position = position
        fragProxy.updateAnimTransform()
      }
      this.viewer.impl.sceneUpdated(true)
    },
    geWorldBoundingBox(fragIds, fragList) {
      var fragbBox = new THREE.Box3()
      var nodebBox = new THREE.Box3()
      fragIds.forEach(fragId => {
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
        var fragProxy = this.viewer.impl.getFragmentProxy(model, fragId)
        fragProxy.getAnimTransform()
        var position = new THREE.Vector3(
          fragProxy.position.x - center.x,
          fragProxy.position.y - center.y,
          fragProxy.position.z - center.z
        )
        position.applyQuaternion(quaternion)
        position.add(center)
        fragProxy.position = position
        fragProxy.quaternion.multiplyQuaternions(
          quaternion,
          fragProxy.quaternion
        )
        if (idx === 0) {
          var euler = new THREE.Euler()
          euler.setFromQuaternion(fragProxy.quaternion, 0)
          // this.emit('transform.rotate', {
          //     rotation: euler,
          //     model
          // })
        }
        fragProxy.updateAnimTransform()
      })
      this.viewer.impl.sceneUpdated(true)
    },
    RotateModel(model, axisX, axisY, axisZ, angle) {
      const thisModel = model //viewer.getAggregateSelection()[0].model
      const fragCount = thisModel.getFragmentList().fragments.fragId2dbId.length
      let fragIdsArray = []
      for (var fragId = 0; fragId < fragCount; ++fragId) {
        fragIdsArray.push(fragId)
      }
      var bBox = this.geWorldBoundingBox(
        fragIdsArray,
        thisModel.getFragmentList()
      )
      var center = new THREE.Vector3(
        (bBox.min.x + bBox.max.x) / 2,
        (bBox.min.y + bBox.max.y) / 2,
        (bBox.min.z + bBox.max.z) / 2
      )

      // var size = Math.max(
      //     bBox.max.x - bBox.min.x,
      //     bBox.max.y - bBox.min.y,
      //     bBox.max.z - bBox.min.z) * 0.8

      var axis = new THREE.Vector3(axisX, axisY, axisZ)
      this.rotateFragments(
        thisModel,
        fragIdsArray,
        axis,
        (angle * Math.PI) / 180,
        center
      )
    },
    getModelBox(model) {
      console.log('modelmodelmodelmodel', model)
      const thisModel = model //viewer.getAggregateSelection()[0].model
      const fragCount = thisModel.getFragmentList().fragments.fragId2dbId.length
      let fragIdsArray = []
      for (var fragId = 0; fragId < fragCount; ++fragId) {
        fragIdsArray.push(fragId)
      }
      var bBox = this.geWorldBoundingBox(
        fragIdsArray,
        thisModel.getFragmentList()
      )
      console.log('bBox', model.myData.bbox.min.z)
      // var center = new THREE.Vector3(
      //   (bBox.min.x + bBox.max.x) / 2,
      //   (bBox.min.y + bBox.max.y) / 2,
      //   (bBox.min.z + bBox.max.z) / 2)
      return model.myData.bbox
    },
    removeAllDeviceLabel() {
      $('.mymlLabel').remove()
    },
    addDeviveLabel() {
      if (this.isShouBiaozhu === false) {
        return
      }
      this.removeAllDeviceLabel()
      this.getLotDeviceList()
      this.LotDeviceList.forEach(deviceInfo => {
        console.log('deviceInfo', deviceInfo)
        let _family_location = deviceInfo.family_location
        const familyLocation = JSON.parse(_family_location)

        if (deviceInfo.device_type === 12) {
          familyLocation.position = familyLocation.sectionPosition
        }
        const _x = familyLocation.position.x
        const _y = familyLocation.position.y
        const _z = familyLocation.position.z

        console.log(
          'LotDeviceModelMapLotDeviceModelMapLotDeviceModelMap',
          this.LotDeviceModelMap
        )
        let _zzz = 0
        if (this.LotDeviceModelMap !== null) {
          let _modelData = this.LotDeviceModelMap.get(deviceInfo.id)

          if (_modelData !== undefined) {
            if (deviceInfo.device_type === 13) {
              console.log('计算塔机的标签')
            } else if (deviceInfo.device_type === 12) {
              console.log('计算升降机的标签')
            } else {
              let _model = _modelData.model
              const _bbox = this.getModelBox(_model)
              _zzz = Math.abs(_bbox.max.z - _bbox.min.z)
            }
          }
        }

        // let _xxx = Math.abs(_bbox.max.x - _bbox.min.x)
        // let _yyy = Math.abs(_bbox.max.y - _bbox.min.y)
        this.drawPushpinLot(
          {
            x: _x,
            y: _y,
            z: _z + _zzz
          },
          deviceInfo.id,
          deviceInfo.device_name,
          deviceInfo
        )
      })
    },
    drawPushpinLot(pushpinModelPt, id, name, data) {
      // this.viewer.loadExtension('IconMarkupExtension', {
      //   icons: [{
      //     dbId: 495,
      //     label: '300C',
      //     css: 'fas fa-thermometer'
      //   }]
      // });
      // console.log('idididid', id)
      // convert 3D position to 2D screen coordination
      var screenpoint = this.viewer.worldToClient(
        new THREE.Vector3(pushpinModelPt.x, pushpinModelPt.y, pushpinModelPt.z)
      )
      $('#mymk' + randomId).remove()
      // build the div container
      var randomId = id //makeid();
      var htmlMarker =
        '<div id="mymk' + randomId + '" class="mymlLabel">' + name + '</div>'
      var parent = this.viewer.container
      $(parent).append(htmlMarker)
      $('#mymk' + randomId).css({
        // 'pointer-events': 'none',
        width: '80px',
        // 'height': '16px',
        position: 'absolute',
        overflow: 'visible'
      })
      $('#mymk' + randomId).click(() => {
        console.log('data', data)
        if (data.device_type === 16) {
          let deviceData = data
          if (deviceData === undefined) {
            this.$message({
              message: '此摄像头未配置数据',
              type: 'error'
            })
          } else if (deviceData.video_url === '') {
            this.$message({
              message: '此摄像头无法直播',
              type: 'error'
            })
          } else {
            const param = {
              show: true,
              deviceData: deviceData
            }
            this.$store
              .dispatch('SetVideoDialog', param)
              .then(() => {})
              .catch(() => {})
          }
        }
      })
      // build the svg element and draw a circle
      // $('#mymk' + randomId).append('<svg id="mysvg' + randomId + '"></svg>')

      // var snap = Snap($('#mysvg' + randomId)[0]);
      var rad = 27
      // set the position of the SVG
      // adjust to make the circle center is the position of the click point
      var $container = $('#mymk' + randomId)
      $container.css({
        left: screenpoint.x - rad * 2,
        top: screenpoint.y
      })

      // store 3D point data to the DOM
      var div = $('#mymk' + randomId)
      // add radius info with the 3D data
      pushpinModelPt.radius = rad
      var storeData = JSON.stringify(pushpinModelPt)
      div.data('3DData', storeData)
    },

    addLotToolBar() {
      console.log('addLotToolBar')
      // 设备显示开关
      let buttonEnterLotMode = new Autodesk.Viewing.UI.Button(
        'enter-add-lot-button'
      )
      buttonEnterLotMode.addClass('enter-add-lot-button')
      buttonEnterLotMode.setToolTip('物联网设备模型显示开关')

      if (this.isShowDevice === true) {
        buttonEnterLotMode.icon.style.backgroundImage =
          'url(./static/icon/ico_shebei_b.png)'
      } else {
        buttonEnterLotMode.icon.style.backgroundImage =
          'url(./static/icon/ico_shebei.png)'
      }
      buttonEnterLotMode.onClick = async e => {
        this.isShowDevice = !this.isShowDevice
        if (this.isShowDevice === true) {
          await this.setLotDeviceModelList()
          if (this.isShouBiaozhu === true) {
            this.addDeviveLabel()
          }
          buttonEnterLotMode.icon.style.backgroundImage =
            'url(./static/icon/ico_shebei_b.png)'
        } else {
          this.removeAllDeviceModel()
          buttonEnterLotMode.icon.style.backgroundImage =
            'url(./static/icon/ico_shebei.png)'
        }
      }

      // 标注显示开关
      let buttonLotListDialog = new Autodesk.Viewing.UI.Button(
        'lot-list-dialog-button'
      )
      buttonLotListDialog.addClass('lot-list-dialog-button')
      buttonLotListDialog.setToolTip('物联网设备标签显示开关')
      if (this.isShouBiaozhu === true) {
        buttonLotListDialog.icon.style.backgroundImage =
          'url(./static/icon/ico_biaozhu_b.png)'
      } else {
        buttonLotListDialog.icon.style.backgroundImage =
          'url(./static/icon/ico_biaozhu.png)'
      }

      buttonLotListDialog.onClick = e => {
        this.isShouBiaozhu = !this.isShouBiaozhu
        if (this.isShouBiaozhu === true) {
          this.addDeviveLabel()
          buttonLotListDialog.icon.style.backgroundImage =
            'url(./static/icon/ico_biaozhu_b.png)'
        } else {
          this.removeAllDeviceLabel()
          buttonLotListDialog.icon.style.backgroundImage =
            'url(./static/icon/ico_biaozhu.png)'
        }
      }
      // SubToolbar
      this.ControlLotManager = new Autodesk.Viewing.UI.ControlGroup(
        'my-view-point-toolbar'
      )
      this.ControlLotManager.addControl(buttonEnterLotMode)
      this.ControlLotManager.addControl(buttonLotListDialog)

      // Add subToolbar to main toolbar
      this.viewer.toolbar.addControl(this.ControlLotManager)
    }
  }
}
</script>
