<style lang="scss">
@import './sjjSetting';
</style>
<template>
  <div id="model-sjj-setting" class="model-sjj-setting" style="margin: 0px;">
    <div id="viewer-local"></div>
    <div v-if="isShowViewPointArea" class="viewPointShowArea">
      <div class="viewPointTitle">
        <div class="title">
          <span>升降机管理</span> -
          <span v-if="currentEditModelName.name === ''">新增升降机</span>
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
        <font-awesome-icon :icon="['far','save']" @click="openSjjInfoDetailDialogHandle()" />
      </el-button>
      <el-button class="marker-button" title="删除当前升降机">
        <font-awesome-icon
          v-if="currentElevatorModel !== null"
          icon="trash-alt"
          @click="deleteSjjModelHandle(0)"
        />
        <font-awesome-icon
          v-if="currentElevatorModel === null"
          icon="trash-alt"
          style="color:grey;"
        />
      </el-button>
      <el-button class="marker-button" title="调整位置">
        <font-awesome-icon
          v-if="currentElevatorModel !== null"
          icon="arrows-alt"
          @click="openSjjPositionDialogHandle()"
        />
        <font-awesome-icon
          v-if="currentElevatorModel === null"
          icon="arrows-alt"
          style="color:grey;"
          disabled
        />
      </el-button>
      <hr />
      <el-button class="marker-button" title="定位构件">
        <font-awesome-icon
          v-if="currentElevatorModel !== null"
          icon="search-location"
          @click="FindModel()"
        />
        <font-awesome-icon
          v-if="currentElevatorModel === null"
          icon="search-location"
          style="color:grey;"
        />
      </el-button>
      <!-- <el-button class="marker-button" title="高亮构件">
          <font-awesome-icon v-if="currentElevatorModel !== null" icon="lightbulb" @click="SelectModel()" />
          <font-awesome-icon v-if="currentElevatorModel === null" icon="lightbulb" style="color:grey;" />
      </el-button>-->
      <el-button class="marker-button" title="添加升降机">
        <font-awesome-icon icon="layer-group" @click="addSjjModelHandle" />
      </el-button>
    </div>
    <!--升降机设备列表dialog-->
    <SjjListDialog></SjjListDialog>
    <!--升降机位置dialog-->
    <SjjPositionDialog></SjjPositionDialog>
    <!--升降机设备信息dialog-->
    <SjjInfoDetailDIalog></SjjInfoDetailDIalog>
  </div>
</template>

<script>
// 构件库列表
import SjjListDialog from '@/views/modelDisplay/sjjListDialog'

import SjjPositionDialog from '@/views/modelDisplay/sjjPositionDialog'

import SjjInfoDetailDIalog from '@/views/modelDisplay/sjjInfoDetailDIalog'

import loadJs from '@/utils/loadJs.js'
import Cookies from 'js-cookie'
import lodash from 'lodash'
let Base64 = require('js-base64').Base64

export default {
  name: 'model-sjj-setting',
  components: {
    SjjListDialog,
    SjjPositionDialog,
    SjjInfoDetailDIalog
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

      LotDeviceList: [], // 已经绑定的升降机设备列表
      LotDeviceModelMap: null, // 升降机模型列表
      // currentDeviceOpType: 0, // 当前设备模型的编辑模式 0:新增模式 1:编辑模式
      currentElevatorModel: null, // 当前Elevator模型
      currentElevatorData: null, // 当前正在操作的设备数据
      currentSectionModel: null, // 当前Section模型

      currentEditModelName: {
        name: ''
      }, // 当前编辑的模型信息，用于顶部title显示
      currentSectionHeight: 20, // 初始化升降机的高度
      currentDeviceScale: 1, // 初始化升降机的缩放
      towerModelName: 'Tower',
      selectedPosition: {
        // 选择的构件位置
        x: 0,
        y: 0,
        z: 0
      },
      currentElevatorPosition: {
        //
        x: 0,
        y: 0,
        z: 0
      },
      currentElevatorRotate: {
        x: 0,
        y: 0,
        z: 0
      },
      currentSectionPosition: {
        //
        x: 0,
        y: 0,
        z: 0
      },
      currentSectionRotate: {
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
    SjjPositionChange() {
      return this.$store.state.loT.SjjPositionChange
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
    SjjPositionChange: {
      handler: function(newVal, oldVal) {
        // console.log('SjjPositionChange1112 ', newVal)

        this.currentElevatorPosition = newVal.elevatorPosition
        this.currentSectionPosition = newVal.sectionPosition
        this.currentSectionHeight = newVal.sectionHeight
        this.currentDeviceScale = newVal.scale
        const _type = newVal.type
        switch (_type) {
          case 'elevator_position':
            this.currentElevatorModel.position.set(
              this.currentElevatorPosition.x,
              this.currentElevatorPosition.y,
              this.currentElevatorPosition.z
            )
            this.viewer.impl.invalidate(true, true, true)
            break
          case 'section_position':
            this.currentSectionModel.position.set(
              this.currentSectionPosition.x,
              this.currentSectionPosition.y,
              this.currentSectionPosition.z
            )
            this.viewer.impl.invalidate(true, true, true)
            break
          case 'elevator_rotate_z':
            let _elevator_rotate_z =
              newVal.elevatorRotate.z - this.currentElevatorRotate.z
            this.currentElevatorModel.rotateZ(
              _elevator_rotate_z * (Math.PI / 180)
            )
            this.viewer.impl.invalidate(true, true, true)
            break
          case 'section_rotate_z':
            let _section_rotate_z =
              newVal.sectionRotate.z - this.currentSectionRotate.z
            this.currentSectionModel.rotateZ(
              _section_rotate_z * (Math.PI / 180)
            )
            this.viewer.impl.invalidate(true, true, true)
            break

          case 'section_height':
            this.viewer.overlays.impl.removeOverlay(
              'custom-scene',
              this.currentElevatorModel
            )
            this.currentElevatorModel = null
            this.viewer.overlays.impl.removeOverlay(
              'custom-scene',
              this.currentSectionModel
            )
            this.currentSectionModel = null
            this.addSjjModelToView()
            this.viewer.impl.invalidate(true, true, true)
            break
          case 'scale':
            this.viewer.overlays.impl.removeOverlay(
              'custom-scene',
              this.currentElevatorModel
            )
            this.currentElevatorModel = null
            this.viewer.overlays.impl.removeOverlay(
              'custom-scene',
              this.currentSectionModel
            )
            this.currentSectionModel = null
            this.addSjjModelToView()
            this.viewer.impl.invalidate(true, true, true)
            break

          default:
            break
        }
        this.currentElevatorRotate.x = newVal.elevatorRotate.x
        this.currentElevatorRotate.y = newVal.elevatorRotate.y
        this.currentElevatorRotate.z = newVal.elevatorRotate.z

        this.currentSectionRotate.x = newVal.sectionRotate.x
        this.currentSectionRotate.y = newVal.sectionRotate.y
        this.currentSectionRotate.z = newVal.sectionRotate.z
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
        this.currentElevatorModel = _modelData.elevatorModel
        this.currentSectionModel = _modelData.sectionModel
        this.currentElevatorData = _device
        console.log('familyLocationfamilyLocation', familyLocation)
        // // this.currentElevatorModel.infoData = item
        /*
          elevatorPosition: {x: 3, y: 6, z: 12}
          elevatorRotate: {x: 0, y: 0, z: 41}
          scale: 2
          sectionHeight: 13
          sectionPosition: {x: 5, y: 7, z: 18}
          sectionRotate: {x: 0, y: 0, z: 43}
        */
        this.currentElevatorPosition.x = familyLocation.elevatorPosition.x
        this.currentElevatorPosition.y = familyLocation.elevatorPosition.y
        this.currentElevatorPosition.z = familyLocation.elevatorPosition.z

        this.currentElevatorRotate.x = familyLocation.elevatorRotate.x
        this.currentElevatorRotate.y = familyLocation.elevatorRotate.y
        this.currentElevatorRotate.z = familyLocation.elevatorRotate.z

        this.currentSectionPosition.x = familyLocation.sectionPosition.x
        this.currentSectionPosition.y = familyLocation.sectionPosition.y
        this.currentSectionPosition.z = familyLocation.sectionPosition.z

        this.currentSectionRotate.x = familyLocation.sectionRotate.x
        this.currentSectionRotate.y = familyLocation.sectionRotate.y
        this.currentSectionRotate.z = familyLocation.sectionRotate.z

        this.currentSectionHeight = familyLocation.sectionHeight

        this.currentDeviceScale = familyLocation.scale
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
      // 加载设备标签
      this.addDeviveLabel()

      // 初始化镜头的变化事件
      this.initCameraChangeEvent()
    },
    initCameraChangeEvent() {
      // 在场景中通过点击添加圆圈标记
      // $(this.viewer.container).bind('click', this.onMouseClick)
      this.viewer.addEventListener(Autodesk.Viewing.CAMERA_CHANGE_EVENT, rt => {
        // find out all pushpin markups
        // var $eles = $("div[id^='mymk']"),id^='personLabel'
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
          // console.log('pushpinModelPt', pushpinModelPt)
          divEle.css({
            left: screenpoint.x - pushpinModelPt.radius,
            top: screenpoint.y - pushpinModelPt.radius
          })
        }
      })

      // drawPushpinLot({
      //   x: -12.590157398363942,
      //   y: -256.6158517922297,
      //   z: -33.46542876355482
      // }, 'lot5', '摄像头');
    },
    getDeviceConfigList() {
      return new Promise((resolve, reject) => {
        let sjjList = []
        const param = {
          method: 'device_config',
          project_id: this.project_id,
          buliding_id: this.itemInfoList[0].item_id
        }
        this.$store.dispatch('GetDeviceConfig', param).then(_itemList => {
          console.log('GetDeviceConfig - _itemList', _itemList)
          _itemList.forEach(item => {
            if (item.device_type === 12) sjjList.push(item)
          })
          resolve(sjjList)
        })
      })
    },
    setLotDeviceModelList() {
      this.LotDeviceModelMap = new Map()
      this.LotDeviceList.forEach(itemInfo => {
        if (itemInfo.family_id > 0) {
          let _family_location = itemInfo.family_location
          const familyLocation = JSON.parse(_family_location)
          console.log('familyLocation', familyLocation)

          /*
            elevatorPosition: {x: 3, y: 6, z: 12}
            elevatorRotate: {x: 0, y: 0, z: 41}
            scale: 2
            sectionHeight: 13
            sectionPosition: {x: 5, y: 7, z: 18}
            sectionRotate: {x: 0, y: 0, z: 43}
          */

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

          elevatorGroup.rotateZ(
            familyLocation.elevatorRotate.z * (Math.PI / 180)
          )

          modifyElevator(elevatorGroup, `elevatorGroup${itemInfo.id}`, 0, false) // 名称，高度，门的开启状态
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

          this.LotDeviceModelMap.set(itemInfo.id, {
            deviceData: itemInfo,
            elevatorModel: elevatorGroup,
            sectionModel: sectionGroup
          })
          this.viewer.impl.invalidate(true, true, true)
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
    openSjjListDialogHandle() {
      // 打开升降机管理窗口
      const param = {
        show: true,
        buildItem: this.itemInfoList[0]
      }
      // this.$store.dispatch('SetVideoDialog', param).then(() => {}).catch(() => {})
      this.$store
        .dispatch('ShowSjjListDialog', param)
        .then(() => {})
        .catch(() => {})
    },
    openSjjPositionDialogHandle() {
      // 打开升降机位置
      const param = {
        show: true,
        elevatorPosition: this.currentElevatorPosition,
        elevatorRotate: this.currentElevatorRotate,
        sectionPosition: this.currentSectionPosition,
        sectionRotate: this.currentSectionRotate,
        sectionHeight: this.currentSectionHeight,
        scale: this.currentDeviceScale
      }
      this.$store
        .dispatch('ShowSjjPositionDialog', param)
        .then(() => {})
        .catch(() => {})
    },
    openSjjInfoDetailDialogHandle() {
      // 打开升降机信息编辑窗口
      const param = {
        show: true,
        buildItem: this.itemInfoList[0],
        deviceModel: this.currentElevatorModel, // 当前的模型
        deviceEditData: this.currentElevatorData, // 当前设备的数据
        elevatorPosition: this.currentElevatorPosition,
        elevatorRotate: this.currentElevatorRotate,
        sectionPosition: this.currentSectionPosition,
        sectionRotate: this.currentSectionRotate,
        sectionHeight: this.currentSectionHeight,
        scale: this.currentDeviceScale
      }
      // this.$store.dispatch('SetVideoDialog', param).then(() => {}).catch(() => {})
      this.$store
        .dispatch('ShowSjjInfoDetailDialog', param)
        .then(() => {})
        .catch(() => {})
    },

    addSjjModelHandle() {
      if (this.currentElevatorModel !== null) {
        this.$message({
          message: '编辑模式下已经有设备存在，要新增设备必须要先删除设备！',
          type: 'error'
        })
        return
      }
      this.currentElevatorPosition.x = this.selectedPosition.x
      this.currentElevatorPosition.y = this.selectedPosition.y
      this.currentElevatorPosition.z = this.selectedPosition.z

      this.currentSectionPosition.x = this.selectedPosition.x
      this.currentSectionPosition.y = this.selectedPosition.y
      this.currentSectionPosition.z = this.selectedPosition.z
      this.addSjjModelToView()
    },
    addSjjModelToView() {
      // 升降机的轿箱
      let elevatorGroup = new THREE.Group()
      this.currentElevatorModel = elevatorGroup
      elevatorGroup.scale.set(
        this.currentDeviceScale,
        this.currentDeviceScale,
        this.currentDeviceScale
      )
      elevatorGroup.position.set(
        this.currentElevatorPosition.x,
        this.currentElevatorPosition.y,
        this.currentElevatorPosition.z
      )

      this.currentElevatorModel.rotateZ(
        this.currentElevatorRotate.z * (Math.PI / 180)
      )

      modifyElevator(elevatorGroup, this.towerModelName, 0, false) // 名称，高度，门的开启状态
      this.viewer.overlays.impl.addOverlay('custom-scene', elevatorGroup)

      // 升降机的轨道
      let sectionGroup = new THREE.Group()
      this.currentSectionModel = sectionGroup
      sectionGroup.scale.set(
        this.currentDeviceScale,
        this.currentDeviceScale,
        this.currentDeviceScale
      )

      sectionGroup.position.set(
        this.currentSectionPosition.x,
        this.currentSectionPosition.y,
        this.currentSectionPosition.z
      )

      this.currentSectionModel.rotateZ(
        this.currentSectionRotate.z * (Math.PI / 180)
      )

      this.viewer.overlays.impl.addOverlay('custom-scene', sectionGroup)
      LoadSection(sectionGroup, this.currentSectionHeight)
    },
    deleteSjjModelHandle() {
      console.log('deleteSjjModelHandle')
      if (this.currentElevatorModel !== null) {
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
        this.SjjDeviceNewModel() // 新增升降机模型
      }
      buttonEnterLotMode.addClass('enter-add-lot-button')
      buttonEnterLotMode.setToolTip('添加升降机设备')

      // 标注功能 - 标定项目位置标准视点
      let buttonLotListDialog = new Autodesk.Viewing.UI.Button(
        'lot-list-dialog-button'
      )
      buttonLotListDialog.addClass('lot-list-dialog-button')
      buttonLotListDialog.setToolTip('升降机设备列表')
      buttonLotListDialog.icon.style.backgroundImage =
        'url(./static/icon/ico_markup.png)'
      buttonLotListDialog.onClick = e => {
        this.openSjjListDialogHandle()
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
    SjjDeviceNewModel() {
      this.enterEditModeHandle()
      this.$store
        .dispatch('ShowSjjListDialog', {
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
      this.removeAllDeviceLabel()
      this.$store
        .dispatch('SetViewPointEditMode', {
          isEditMode: true
        })
        .then(() => {})

      this.$store
        .dispatch('ShowSjjListDialog', {
          show: false
        })
        .then(() => {})
        .catch(() => {})
    },
    clearEditModelData(type) {
      switch (type) {
        case 'delete':
          if (this.currentElevatorModel !== null) {
            this.viewer.overlays.impl.removeOverlay(
              'custom-scene',
              this.currentElevatorModel
            )
          }
          if (this.currentSectionModel !== null) {
            this.viewer.overlays.impl.removeOverlay(
              'custom-scene',
              this.currentSectionModel
            )
          }

          break
        case 'clear':
          this.viewer.overlays.removeScene('custom-scene')
          this.viewer.overlays.addScene('custom-scene')
          this.currentElevatorData = null // 当前正在操作的设备数据
          break
      }

      this.currentElevatorModel = null // 当前正在操作的设备模型
      this.currentSectionModel = null
      this.currentEditModelName.name = ''
      this.selectedPosition = {
        // 选择的构件位置
        x: 0,
        y: 0,
        z: 0
      }
      this.currentElevatorPosition = {
        x: 0,
        y: 0,
        z: 0
      }
      this.currentSectionPosition = {
        x: 0,
        y: 0,
        z: 0
      }
      this.currentElevatorRotate = {
        x: 0,
        y: 0,
        z: 0
      }
      this.currentSectionRotate = {
        x: 0,
        y: 0,
        z: 0
      }
      this.currentSectionHeight = 20
      this.currentDeviceScale = 1
    },
    async exitEditModeHandle() {
      // 退出编辑模式

      // this.$store.dispatch('ShowComponentLibraryListDialog', {
      //   show: false,
      // }).then(() => {}).catch(() => {})

      this.$store
        .dispatch('ShowSjjPositionDialog', {
          show: false
        })
        .then(() => {})
        .catch(() => {})

      this.viewer.toolbar.addControl(this.ControlLotManager)
      this.isShowViewPointArea = false
      this.isShowToolbarMarker = false
      console.log('this.currentElevatorModel', this.currentElevatorModel)
      // this.viewer.unloadModel(this.currentElevatorModel)

      this.clearEditModelData('clear')

      this.$store
        .dispatch('SetViewPointEditMode', {
          isEditMode: false
        })
        .then(() => {})
      this.LotDeviceList = await this.getDeviceConfigList()
      this.setLotDeviceModelList()
      // 加载设备标签
      this.addDeviveLabel()
    },
    FindModel() {
      // 放大定位
      this.viewer.fitToView([1], this.currentElevatorModel)
    },
    SelectModel() {
      this.viewer.select(
        [1],
        this.currentElevatorModel,
        Autodesk.Viewing.SelectionType.OVERLAYED
      )
    },
    removeAllDeviceLabel() {
      $('.mymlLabel').remove()
    },
    addDeviveLabel() {
      this.LotDeviceList.forEach(deviceInfo => {
        // console.log("deviceInfo", deviceInfo);
        let _familyLocation = deviceInfo.family_location
        const familyLocation = JSON.parse(_familyLocation)
        if (deviceInfo.device_type === 12) {
          familyLocation.position = familyLocation.sectionPosition
        }
        const _x = familyLocation.position.x
        const _y = familyLocation.position.y
        const _z = familyLocation.position.z

        let _zzz = 0

        if (this.LotDeviceModelMap !== null) {
          let _modelData = this.LotDeviceModelMap.get(deviceInfo.id)
          // console.log("_modelData_modelData_modelData", _modelData);
          if (_modelData !== undefined) {
            if (deviceInfo.device_type === 12) {
              console.log('计算升降机的标签')
            }
          }
        }
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
      const screenpoint = this.viewer.worldToClient(
        new THREE.Vector3(pushpinModelPt.x, pushpinModelPt.y, pushpinModelPt.z)
      )
      const randomId = id // makeid();
      $('#mymk' + randomId).remove()
      // build the div container

      var htmlMarker =
        '<div id="mymk' + randomId + '" class="mymlLabel">' + name + '</div>'
      var parent = this.viewer.container
      $(parent).append(htmlMarker)
      if (this.isShowBiaozhu === false) {
        $('#mymk' + randomId).hide()
      }

      $('#mymk' + randomId).css({
        // 'pointer-events': 'none',
        width: '80px',
        // 'height': '16px',
        position: 'absolute',
        overflow: 'visible'
      })

      // build the svg element and draw a circle
      // $('#mymk' + randomId).append('<svg id="mysvg' + randomId + '"></svg>')

      // var snap = Snap($('#mysvg' + randomId)[0]);
      var rad = 40
      // set the position of the SVG
      // adjust to make the circle center is the position of the click point
      var $container = $('#mymk' + randomId)
      $container.css({
        left: screenpoint.x - rad,
        top: screenpoint.y - rad
      })

      // store 3D point data to the DOM
      var div = $('#mymk' + randomId)
      // add radius info with the 3D data
      pushpinModelPt.radius = rad
      var storeData = JSON.stringify(pushpinModelPt)
      div.data('3DData', storeData)
    }
  }
}
</script>
