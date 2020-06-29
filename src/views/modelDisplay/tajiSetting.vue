<style lang="scss">
@import './tajiSetting';
</style>
<template>
  <div id="model-taji-setting" class="model-taji-setting" style="margin: 0px;">
    <div id="viewer-local"></div>
    <div v-if="isShowViewPointArea" class="viewPointShowArea">
      <div class="viewPointTitle">
        <div class="title">
          <span>塔机管理</span> -
          <span v-if="currentEditModelName.name === ''">新增塔机</span>
          <span v-if="currentEditModelName.name !== ''">{{currentEditModelName.name}}</span>
        </div>
        <el-button
          type="danger"
          class="btn-close-view-point"
          @click="exitEditModeHandle"
          size="small"
          style="width:130px;"
        >
          <font-awesome-icon icon="times-circle" style="font-size: 12px;" />&nbsp;&nbsp;&nbsp;&nbsp;关&nbsp;&nbsp;&nbsp;闭
        </el-button>
      </div>
    </div>
    <div v-if="isShowToolbarMarker" class="toolbar-marker">
      <el-button class="marker-button" title="保存">
        <font-awesome-icon :icon="['far','save']" @click="openTajiInfoDetailDialogHandle()" />
      </el-button>
      <el-button class="marker-button" title="删除当前塔机">
        <font-awesome-icon
          v-if="currentDeviceModel !== null"
          icon="trash-alt"
          @click="deleteTajiModelHandle(0)"
        />
        <font-awesome-icon v-if="currentDeviceModel === null" icon="trash-alt" style="color:grey;" />
      </el-button>
      <el-button class="marker-button" title="调整位置">
        <font-awesome-icon
          v-if="currentDeviceModel !== null"
          icon="arrows-alt"
          @click="openTajiPositionDialogHandle()"
        />
        <font-awesome-icon
          v-if="currentDeviceModel === null"
          icon="arrows-alt"
          style="color:grey;"
          disabled
        />
      </el-button>
      <hr />
      <el-button class="marker-button" title="定位构件">
        <font-awesome-icon
          v-if="currentDeviceModel !== null"
          icon="search-location"
          @click="FindModel()"
        />
        <font-awesome-icon
          v-if="currentDeviceModel === null"
          icon="search-location"
          style="color:grey;"
        />
      </el-button>
      <!-- <el-button class="marker-button" title="高亮构件">
        <font-awesome-icon v-if="currentDeviceModel !== null" icon="lightbulb" @click="SelectModel()" />
        <font-awesome-icon v-if="currentDeviceModel === null" icon="lightbulb" style="color:grey;" />
      </el-button>-->
      <el-button class="marker-button" title="添加塔机">
        <font-awesome-icon icon="layer-group" @click="addTajiModelHandle" />
      </el-button>
    </div>
    <!--塔机设备列表dialog-->
    <TajiListDialog></TajiListDialog>
    <!--塔机位置dialog-->
    <TajiPositionDialog></TajiPositionDialog>
    <!--塔机设备信息dialog-->
    <TajiInfoDetailDIalog></TajiInfoDetailDIalog>
  </div>
</template>

<script>
// 构件库列表
import TajiListDialog from '@/views/modelDisplay/tajiListDialog'

import TajiPositionDialog from '@/views/modelDisplay/tajiPositionDialog'

import TajiInfoDetailDIalog from '@/views/modelDisplay/tajiInfoDetailDIalog'

import loadJs from '@/utils/loadJs.js'
import Cookies from 'js-cookie'
import lodash from 'lodash'
let Base64 = require('js-base64').Base64

export default {
  name: 'model-taji-setting',
  components: {
    TajiListDialog,
    TajiPositionDialog,
    TajiInfoDetailDIalog
  },
  data() {
    return {
      viewer: null, //new Autodesk.Viewing.Private.GuiViewer3D(element, config);
      urns: [],
      element: null, //document.getElementById('viewer-local');
      project_id: '',
      modelData: null,
      itemList: [],
      itemCurrentFileIdList: [], //当前显示模型的FILE
      itemCurrentItemIdList: [],
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
      isSaveViewValid: false, // 保存视点的按钮是否有效
      ControlLotManager: null,
      isShowViewPointArea: false,
      isShowToolbarMarker: false,
      saveStatus: null,
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

      LotDeviceList: [], // 已经绑定的塔机设备列表
      LotDeviceModelMap: null, // 塔机模型列表
      // currentDeviceOpType: 0, // 当前设备模型的编辑模式 0:新增模式 1:编辑模式
      currentDeviceModel: null, // 当前正在操作的设备模型
      currentDeviceData: null, // 当前正在操作的设备数据
      currentEditModelName: {
        name: ''
      }, // 当前编辑的模型信息，用于顶部title显示
      currentDeviceHeight: 20, // 初始化塔机的高度
      currentDeviceScale: 1, // 初始化塔机的缩放
      towerModelName: 'Tower',
      selectedPosition: {
        // 选择的构件位置
        x: 0,
        y: 0,
        z: 0
      },
      currentDevicePosition: {
        //
        x: 0,
        y: 0,
        z: 0
      },
      currentDeviceRotate: {
        x: 0,
        y: 0,
        z: 0
      }
      // totalHighFps: 0 // 高速fps累计量
    }
  },
  computed: {
    personInfo() {
      return this.$store.state.person.personInfo
    },
    ComponentDataAdd() {
      return this.$store.state.componentLibrary.ComponentDataAdd
    },
    TajiPositionChange() {
      return this.$store.state.loT.TajiPositionChange
    },
    LotDeviceEditChange() {
      return this.$store.state.loT.LotDeviceEditChange
    },
    LotDeviceFindChange() {
      return this.$store.state.loT.LotDeviceFindChange
    },
    LotInfoDetailSavedChange() {
      return this.$store.state.loT.LotInfoDetailSavedChange
    }
  },
  created() {},
  watch: {
    TajiPositionChange: {
      handler: function(newVal, oldVal) {
        console.log('TajiPositionChange1112 ', newVal)

        let _globalOffset = newVal.globalOffset
        this.currentDevicePosition = _globalOffset
        this.currentDeviceHeight = newVal.height
        this.currentDeviceRotate.x = newVal.rotate.x
        this.currentDeviceRotate.y = newVal.rotate.y
        this.currentDeviceRotate.z = newVal.rotate.z
        this.currentDeviceScale = newVal.scale
        const _type = newVal.type
        // console.log('_rotate_x', _rotate_x)
        switch (_type) {
          case 'rotate_z':
            modifyTower2(
              this.currentDeviceModel,
              this.towerModelName,
              this.currentDeviceHeight,
              newVal.rotate.z,
              0,
              0,
              0
            )
            this.viewer.impl.invalidate(true, true, true)
            break
          case 'height':
            this.viewer.overlays.impl.removeOverlay(
              'custom-scene',
              this.currentDeviceModel
            )
            this.currentDeviceModel = null
            this.addTajiModelToView()
            this.viewer.impl.invalidate(true, true, true)
            break
          case 'scale':
            this.viewer.overlays.impl.removeOverlay(
              'custom-scene',
              this.currentDeviceModel
            )
            this.currentDeviceModel = null
            this.addTajiModelToView()
            this.viewer.impl.invalidate(true, true, true)
            break
          default:
            this.currentDeviceModel.position.set(
              this.currentDevicePosition.x,
              this.currentDevicePosition.y,
              this.currentDevicePosition.z
            ) // 红 绿
            this.viewer.impl.invalidate(true, true, true)
            break
        }

        console.log(
          'this.currentDeviceRotate.currentDeviceRotate',
          this.currentDeviceRotate
        )
      },
      deep: true
    },
    LotDeviceFindChange: {
      handler: function(newVal, oldVal) {
        console.log('LotDeviceFindChange ', newVal)
        let _device = newVal.device
        let _type = newVal.type
        let _modelData = this.LotDeviceModelMap.get(_device.id)
        // console.log('this.LotDeviceModelMap', _device.id, this.LotDeviceModelMap)
        // console.log('LotDeviceFindChange - _modelData ', _modelData)
        switch (_type) {
          case 'find':
            this.viewer.fitToView([1], _modelData.model)
            break
          case 'select':
            this.viewer.select(
              [1],
              _modelData.model,
              Autodesk.Viewing.SelectionType.OVERLAYED
            )
            break
        }
      },
      deep: true
    },
    LotDeviceEditChange: {
      handler: function(newVal, oldVal) {
        console.log('LotDeviceEditChange ', newVal)

        this.enterEditModeHandle()
        let _device = newVal.device
        this.currentEditModelName.name = _device.device_name
        let _modelData = this.LotDeviceModelMap.get(_device.id)
        console.log(
          'this.LotDeviceModelMap',
          _device.id,
          this.LotDeviceModelMap
        )
        console.log('LotDeviceEditChange - _modelData ', _modelData)

        let _family_location = _device.family_location
        const familyLocation = JSON.parse(_family_location)
        this.currentDeviceModel = _modelData.model
        this.currentDeviceData = _device
        console.log('familyLocationfamilyLocation', familyLocation)
        // // this.currentDeviceModel.infoData = item
        this.currentDevicePosition.x = familyLocation.position.x
        this.currentDevicePosition.y = familyLocation.position.y
        this.currentDevicePosition.z = familyLocation.position.z

        this.currentDeviceRotate.x = familyLocation.rotate.x
        this.currentDeviceRotate.y = familyLocation.rotate.y
        this.currentDeviceRotate.z = familyLocation.rotate.z

        this.currentDeviceHeight = familyLocation.height // 塔机的高度
        this.currentDeviceScale = familyLocation.scale // 塔机的缩放
      },
      deep: true
    },
    LotInfoDetailSavedChange: {
      handler: function(newVal, oldVal) {
        console.log('LotInfoDetailSavedChange ', newVal)
        this.currentEditModelName.name = newVal.device_name
      },
      deep: true
    }
  },
  async mounted() {
    await loadJs(`./static/libs/viewer3D/viewer3D.min.js`)
    console.log('./static/libs/viewer3D/viewer3D.min.js')
    const __PROJECT_ID = Cookies.get('PROJECT_ID')
    this.project_id = parseInt(__PROJECT_ID)
    this.init()
  },
  beforeDestroy() {},
  destroyed() {},
  methods: {
    async init() {
      // this.project_id = 10000
      let MODEL_DISPLAY_DATA = Cookies.get('MODEL_DISPLAY_DATA')
      if (MODEL_DISPLAY_DATA === undefined) {
        this.$router.push({
          path: '/projectSelect'
        })
        return
      } else {
        this.modelData = JSON.parse(MODEL_DISPLAY_DATA)
      }
      this.itemList = this.modelData.item_list
      // console.log('this.itemList', this.itemList)
      let itemIDList = []
      this.itemList.forEach(item => {
        itemIDList.push(item.ITEM_ID)
        // this.itemCurrentFileIdList.push(item.FILE_ID)
        // this.itemCurrentItemIdList.push(item.ITEM_ID)
      })
      // console.log('itemIDList', itemIDList, itemIDList.join(','))
      await this.getItemInfoListByItemIDs(itemIDList.join(','))
      await this.getUrlAndInitView()
      this.LotDeviceList = await this.getDeviceConfigList()
      console.log('LotDeviceList', this.LotDeviceList)

      this.setLotDeviceModelList()
    },

    getDeviceConfigList() {
      return new Promise((resolve, reject) => {
        let tajiList = []
        const param = {
          method: 'device_config',
          project_id: this.project_id,
          buliding_id: this.itemInfoList[0].item_id
        }
        this.$store.dispatch('GetDeviceConfig', param).then(_itemList => {
          console.log('GetDeviceConfig - _itemList', _itemList)
          _itemList.forEach(item => {
            if (item.device_type === 13) tajiList.push(item)
          })
          resolve(tajiList)
        })
      })
    },
    setLotDeviceModelList() {
      this.LotDeviceModelMap = new Map()
      this.LotDeviceList.forEach(itemInfo => {
        if (itemInfo.family_id > 0) {
          console.log('itemInfoitemInfo121113', itemInfo)
          let _family_location = itemInfo.family_location
          const familyLocation = JSON.parse(_family_location)
          console.log('_model_model', _family_location, familyLocation)

          let towerGroup = new THREE.Group()
          // towerGroup.name = `towerGroup${itemInfo.id}`
          towerGroup.scale.set(
            familyLocation.scale,
            familyLocation.scale,
            familyLocation.scale
          )

          // let _towerHeight = this.currentDeviceHeight
          towerGroup.position.set(
            familyLocation.position.x,
            familyLocation.position.y,
            familyLocation.position.z
          )
          console.log(
            '--->1',
            familyLocation.position.x,
            familyLocation.position.y,
            familyLocation.position.z
          )
          console.log(
            '--->',
            towerGroup,
            towerGroup.name,
            familyLocation.height,
            familyLocation.rotate.z
          )
          console.log('towerGrouptowerGroup', towerGroup)
          modifyTower2(
            towerGroup,
            `towerGroup${itemInfo.id}`,
            familyLocation.height,
            familyLocation.rotate.z,
            0,
            0,
            0
          ) // towerGroup,名称，高度，初始化角度大臂角度，小车距离，吊钩线长

          this.viewer.overlays.impl.addOverlay('custom-scene', towerGroup)

          this.LotDeviceModelMap.set(itemInfo.id, {
            deviceData: itemInfo,
            model: towerGroup
          })
          this.viewer.impl.invalidate(true, true, true)
          console.log('this.LotDeviceModelMap', this.LotDeviceModelMap)
        }
      })
    },
    initProgressiveRendering() {
      // 初始化设置 渐进式显示
      let storageProgressiveRendering = this.storage[
        this.storageProgressiveRenderingKey
      ]
      if (storageProgressiveRendering === undefined) {
        this.storage[
          this.storageProgressiveRenderingKey
        ] = this.isProgressiveRendering
      }
      console.log(
        'this.storage[storageProgressiveRenderingKey]',
        this.storage[this.storageProgressiveRenderingKey]
      )
      this.viewer.setProgressiveRendering(this.isProgressiveRendering)
    },
    getItemInfoListByItemIDs(item_ids) {
      // console.log('this.project_id', this.project_id)
      return new Promise((resolve, reject) => {
        const param = {
          method: 'GetItemInfoListByItemIDs',
          project_id: this.project_id,
          item_id: item_ids
        }
        this.$store
          .dispatch('GetItemInfoListByItemIDs', param)
          .then(_itemList => {
            this.itemInfoList = _itemList
            resolve()
          })
      })
    },
    async getUrlAndInitView() {
      return new Promise(async (resolve, reject) => {
        let _result = this.getModelUrl()
        // console.log('_result', _result)
        let _urlList = _result['urlList']
        // let _itemInfoList = _result['itemInfoList']
        if (_urlList.length !== 0) {
          this.loadedModels = []
          // console.log('_result123 _itemInfoList', _itemInfoList)
          this.itemCurrentFileIdList = []
          this.itemCurrentItemIdList = []
          this.itemInfoList.forEach(itemInfo => {
            // console.log('itemInfoitemInfo123',itemInfo)
            this.itemCurrentFileIdList.push(itemInfo.file_id)
            this.itemCurrentItemIdList.push(itemInfo.item_id)
            if (itemInfo.item_id === undefined) {
              itemInfo['item_id'] = itemInfo.id
            }
          })

          await this.init3DView(_urlList, this.itemInfoList)
          this.addLotToolBar()
          // console.log('init3DView - complete')
          this.viewer.addEventListener(
            // Autodesk.Viewing.SELECTION_CHANGED_EVENT,
            Autodesk.Viewing.AGGREGATE_SELECTION_CHANGED_EVENT,
            this.onSelectionChanged
          )
          this.initEvent()
        }
        resolve()
      })
    },
    getModelUrl() {
      let result = null
      let _urlList = []
      // let _itemInfoList = []
      this.itemInfoList.forEach(itemInfo => {
        // console.log('itemInfo111', itemInfo)
        // 服务端地址转换
        // console.log('process.env.BASE_DOMAIN_BIM', process.env.BASE_DOMAIN_BIM)
        // _urlList.push(itemInfo.url.replace('/www/bim_proj/', process.env.BASE_DOMAIN_BIM))
        _urlList.push(
          itemInfo.url
            .replace('/www/bim_proj/', '')
            .replace('/BCP_FILE/', 'BCP_FILE/')
        )
        // _itemInfoList.push(itemInfo)
        // 本地地址转换
        // _urlList.push(build.ITEM_URL.replace('/www/bim_proj/', '/static/'))
      })
      result = {
        urlList: _urlList
        // 'itemInfoList': _itemInfoList
      }
      return result
    },
    init3DView(modelURLList, itemInfoList) {
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
          let _Plist = []
          // viewer.loadModel("https://lmv-models.s3.amazonaws.com/toy_plane/toy_plane.svf", undefined,
          // onLoadSuccess, onLoadError);
          for (var i = 0; i < modelURLList.length; i++) {
            let p = await this.loadModel(modelURLList[i], itemInfoList[i], i)
            _Plist.push(p)
          }

          Promise.all(_Plist).then(result => {
            resolve()
          })
          if (!this.viewer.overlays.hasScene('custom-scene')) {
            this.viewer.overlays.addScene('custom-scene')
          }
          // 初始化设置 渐进式显示
          this.initProgressiveRendering()
        })
      })
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
        }
        this.viewer.loadModel(
          modelURL,
          modelOpts,
          model => {
            model['item_id'] = itemInfo.item_id
            this.loadedModels.push(model)
            if (index === 0) {
              this.viewer.setBackgroundColor(0, 59, 111, 255, 255, 255)
              this.viewer.setGroundShadow(true)
              this.viewer.setReverseZoomDirection(true) //true 滚动向前为放大
              //
              this.saveStatus = JSON.stringify(this.viewer.getState())

              this.addLotToolBar()
            }
            resolve(index)
          },
          this.onLoadError
        )
      })
    },

    initEvent() {
      this.viewer.addEventListener(
        Autodesk.Viewing.CAMERA_CHANGE_EVENT,
        rt => {}
      )
    },
    onLoadError(event) {
      console.log('fail')
    },
    onSelectionChanged(event) {
      // console.log('this.viewer', this.viewer)
      // console.log('event1', event)
      let _selections = event.selections
      console.log('_selections', _selections)
      // this.selectedDbId = _dbIds
      this.selectedPosition = {
        x: 0,
        y: 0,
        z: 0
      }
      this.selectedDbId = []
      console.log('_selections.length', _selections.length)
      if (_selections.length > 0) {
        _selections.forEach(selection => {
          let _dbIdArray = selection.dbIdArray
          _dbIdArray.forEach(dbId => {
            console.log('dbId', dbId)
            selection.model.getProperties(dbId, elements => {
              var dbid = elements.dbId
              this.selectedDbId.push(dbid)
              console.log('elements', elements)
              let average = this.getFragXYZ(selection.model, dbid)
              console.log('average', average)
              this.selectedPosition = {
                x: parseInt(average.x),
                y: parseInt(average.y),
                z: parseInt(average.z)
              }
              console.log('this.selectedPosition', this.selectedPosition)
              // let min = this.getFragXYZ(dbid)
              // this.drawViewPointLabel(min, 'aaa', 'asd', 'dasd')
            })
          })
        })
      }
      // console.log('this.selectedPosition', this.selectedPosition)
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
    getFragXYZ(model, dbid) {
      // View里如何获取模型的坐标信息
      var bounds = new THREE.Box3()
      var box = new THREE.Box3()
      // console.log('this.viewer', this.viewer)
      var instanceTree = model.getData().instanceTree
      var fragList = model.getFragmentList()
      // var instanceTree = this.viewer.impl.model.getData().instanceTree;
      // var fragList = this.viewer.impl.model.getFragmentList();

      instanceTree.enumNodeFragments(
        dbid,
        fragId => {
          // console.log('fragId:' + fragId);

          //某几何单元的全局坐标系包围盒
          fragList.getWorldBounds(fragId, box)
          //合并计算最终整个构件包围盒
          bounds.union(box)

          //某几何单元的全局坐标系变换矩阵
          //从中读取平移或旋转数值
          //由于构件的几何单元应该都是同步变换，所以这些矩阵初始值应该是一样的
          var fm = new THREE.Matrix4()
          fragList.getWorldMatrix(fragId, fm)
          // console.log('frag matrix:' + JSON.stringify(fm));
        },
        true
      )

      // var tree = this.viewer.impl.model.getData().instanceTree;
      var tree = model.getData().instanceTree
      var tmpBox = new Float32Array(6)
      tree.getNodeBox(dbid, tmpBox)
      var min = new THREE.Vector3(tmpBox[0], tmpBox[1], tmpBox[2])
      var max = new THREE.Vector3(tmpBox[3], tmpBox[4], tmpBox[5])

      var average = new THREE.Vector3(
        (tmpBox[3] + tmpBox[0]) / 2,
        (tmpBox[4] + tmpBox[1]) / 2,
        (tmpBox[5] + tmpBox[2]) / 2
      )
      // var max = new THREE.Vector3(tmpBox[3], tmpBox[4], tmpBox[5]);
      // console.log('min,max', min, max, average)
      return average
    },
    // openComponentLibraryDialogHandle() {

    //   // 打开构件列表窗口
    //   const param = {
    //     show: true,
    //   }
    //   this.$store.dispatch('ShowComponentLibraryListDialog', param).then(() => {}).catch(() => {})

    // },
    openTajiListDialogHandle() {
      // 打开塔机管理窗口
      const param = {
        show: true,
        buildItem: this.itemInfoList[0]
      }
      // this.$store.dispatch('SetVideoDialog', param).then(() => {}).catch(() => {})
      this.$store
        .dispatch('ShowTajiListDialog', param)
        .then(() => {})
        .catch(() => {})
    },
    openTajiPositionDialogHandle() {
      console.log('this.currentDevicePosition', this.currentDevicePosition)
      // 打开塔机位置
      const param = {
        show: true,
        position: this.currentDevicePosition,
        rotate: this.currentDeviceRotate,
        height: this.currentDeviceHeight,
        scale: this.currentDeviceScale
      }
      // this.$store.dispatch('SetVideoDialog', param).then(() => {}).catch(() => {})
      this.$store
        .dispatch('ShowTajiPositionDialog', param)
        .then(() => {})
        .catch(() => {})
    },
    openTajiInfoDetailDialogHandle() {
      // 打开塔机信息编辑窗口
      const param = {
        show: true,
        buildItem: this.itemInfoList[0],
        deviceModel: this.currentDeviceModel, // 当前的模型
        deviceEditData: this.currentDeviceData, // 当前设备的数据
        devicePosition: this.currentDevicePosition,
        deviceRotate: this.currentDeviceRotate,
        tajiHeight: this.currentDeviceHeight,
        tajiScale: this.currentDeviceScale
      }
      // this.$store.dispatch('SetVideoDialog', param).then(() => {}).catch(() => {})
      this.$store
        .dispatch('ShowTajiInfoDetailDialog', param)
        .then(() => {})
        .catch(() => {})
    },

    addTajiModelHandle() {
      if (this.currentDeviceModel !== null) {
        this.$message({
          message: '编辑模式下已经有设备存在，要新增设备必须要先删除设备！',
          type: 'error'
        })
        return
      }
      this.currentDevicePosition.x = this.selectedPosition.x
      this.currentDevicePosition.y = this.selectedPosition.y
      this.currentDevicePosition.z = this.selectedPosition.z
      this.addTajiModelToView()
    },
    addTajiModelToView() {
      let towerGroup = new THREE.Group()
      this.currentDeviceModel = towerGroup
      // towerGroup.name = 'towerGroup'
      towerGroup.scale.set(
        this.currentDeviceScale,
        this.currentDeviceScale,
        this.currentDeviceScale
      )

      // let _towerHeight = this.currentDeviceHeight
      towerGroup.position.set(
        this.currentDevicePosition.x,
        this.currentDevicePosition.y,
        this.currentDevicePosition.z
      ) // 红 绿
      console.log('this.towerGroupthis.towerGroupthis.towerGroup', towerGroup)
      modifyTower2(
        towerGroup,
        this.towerModelName,
        this.currentDeviceHeight,
        this.currentDeviceRotate.z,
        0,
        0,
        0
      ) // towerGroup,名称，高度，初始化角度大臂角度，小车距离，吊钩线长

      this.viewer.overlays.impl.addOverlay('custom-scene', towerGroup)
    },
    deleteTajiModelHandle() {
      console.log('deleteTajiModelHandle')
      if (this.currentDeviceModel !== null) {
        this.$confirm('是否确定删除此设备的模型?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
          // center: true
        })
          .then(() => {
            this.clearEditModelData('delete')
          })
          .catch(() => {})
      }
    },

    addLotToolBar() {
      // 标注功能 - 普通标注视点
      let buttonEnterLotMode = new Autodesk.Viewing.UI.Button(
        'enter-add-lot-button'
      )
      buttonEnterLotMode.icon.style.backgroundImage =
        'url(./static/icon/ico_marker.png)'

      buttonEnterLotMode.onClick = e => {
        this.TajiDeviceNewModel() // 新增塔机模型
      }
      buttonEnterLotMode.addClass('enter-add-lot-button')
      buttonEnterLotMode.setToolTip('添加塔机设备')

      // 标注功能 - 标定项目位置标准视点
      let buttonLotListDialog = new Autodesk.Viewing.UI.Button(
        'lot-list-dialog-button'
      )
      buttonLotListDialog.addClass('lot-list-dialog-button')
      buttonLotListDialog.setToolTip('塔机设备列表')
      buttonLotListDialog.icon.style.backgroundImage =
        'url(./static/icon/ico_markup.png)'
      buttonLotListDialog.onClick = e => {
        this.openTajiListDialogHandle()
      }
      // SubToolbar
      this.ControlLotManager = new Autodesk.Viewing.UI.ControlGroup(
        'my-view-point-toolbar'
      )
      this.ControlLotManager.addControl(buttonEnterLotMode)
      this.ControlLotManager.addControl(buttonLotListDialog)

      // Add subToolbar to main toolbar
      this.viewer.toolbar.addControl(this.ControlLotManager)
    },
    TajiDeviceNewModel() {
      this.enterEditModeHandle()
      this.$store
        .dispatch('ShowTajiListDialog', {
          show: false
        })
        .then(() => {})
        .catch(() => {})
    },
    enterEditModeHandle() {
      // 进入编辑模式
      // this.currentDeviceOpType = DeviceOpType
      this.viewer.toolbar.removeControl(this.ControlLotManager)
      this.isShowViewPointArea = true
      this.isShowToolbarMarker = true
      this.$store
        .dispatch('SetViewPointEditMode', {
          isEditMode: true
        })
        .then(() => {})

      this.$store
        .dispatch('ShowTajiListDialog', {
          show: false
        })
        .then(() => {})
        .catch(() => {})
    },
    clearEditModelData(type) {
      switch (type) {
        case 'delete':
          if (this.currentDeviceModel !== null) {
            this.viewer.overlays.impl.removeOverlay(
              'custom-scene',
              this.currentDeviceModel
            )
          }
          break
        case 'clear':
          this.viewer.overlays.removeScene('custom-scene')
          this.viewer.overlays.addScene('custom-scene')
          this.currentDeviceData = null // 当前正在操作的设备数据
          break
      }

      this.currentDeviceModel = null // 当前正在操作的设备模型
      this.currentEditModelName.name = ''
      this.selectedPosition = {
        // 选择的构件位置
        x: 0,
        y: 0,
        z: 0
      }
      this.currentDevicePosition = {
        //
        x: 0,
        y: 0,
        z: 0
      }
      this.currentDeviceRotate = {
        x: 0,
        y: 0,
        z: 0
      }
      this.currentDeviceHeight = 20
      this.currentDeviceScale = 1
    },
    async exitEditModeHandle() {
      // 退出编辑模式

      // this.$store.dispatch('ShowComponentLibraryListDialog', {
      //   show: false,
      // }).then(() => {}).catch(() => {})

      this.$store
        .dispatch('ShowTajiPositionDialog', {
          show: false
        })
        .then(() => {})
        .catch(() => {})

      this.viewer.toolbar.addControl(this.ControlLotManager)
      this.isShowViewPointArea = false
      this.isShowToolbarMarker = false
      console.log('this.currentDeviceModel', this.currentDeviceModel)
      // this.viewer.unloadModel(this.currentDeviceModel)

      this.clearEditModelData('clear')

      this.$store
        .dispatch('SetViewPointEditMode', {
          isEditMode: false
        })
        .then(() => {})
      this.LotDeviceList = await this.getDeviceConfigList()
      this.setLotDeviceModelList()
    },
    FindModel() {
      // 放大定位
      this.viewer.fitToView([1], this.currentDeviceModel)
    },
    SelectModel() {
      this.viewer.select(
        [1],
        this.currentDeviceModel,
        Autodesk.Viewing.SelectionType.OVERLAYED
      )
    }
  }
}
</script>
