<style lang="scss">
@import './lotSetting';
</style>
<template>
  <div id="model-lot-setting" class="model-lot-setting" style="margin: 0px;">
    <div id="viewer-local"></div>
    <div v-if="isShowViewPointArea" class="viewPointShowArea">
      <div class="viewPointTitle">
        <div class="title">
          <span>物联网设备管理</span> -
          <span v-if="currentEditModelName.name === ''">新增设备模型</span>
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
        <font-awesome-icon :icon="['far','save']" @click="openLotInfoDetailDialogHandle()" />
      </el-button>
      <el-button class="marker-button" title="删除设备模型">
        <font-awesome-icon
          v-if="currentDeviceModel !== null"
          icon="trash-alt"
          @click="deleteLotDeviceModelHandle(0)"
        />
        <font-awesome-icon v-if="currentDeviceModel === null" icon="trash-alt" style="color:grey;" />
      </el-button>
      <el-button class="marker-button" title="调整位置">
        <font-awesome-icon
          v-if="currentDeviceModel !== null"
          icon="arrows-alt"
          @click="openLotPositionDialogHandle()"
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
      <el-button class="marker-button" title="高亮构件">
        <font-awesome-icon
          v-if="currentDeviceModel !== null"
          icon="lightbulb"
          @click="SelectModel()"
        />
        <font-awesome-icon v-if="currentDeviceModel === null" icon="lightbulb" style="color:grey;" />
      </el-button>
      <el-button class="marker-button" title="构件库">
        <font-awesome-icon icon="layer-group" @click="openComponentLibraryDialogHandle" />
      </el-button>
    </div>
    <!--物联网设备列表dialog-->
    <LotListDialog></LotListDialog>
    <!--物联网设备位置dialog-->
    <LotPositionDialog></LotPositionDialog>
    <!--物联网设备信息dialog-->
    <LotInfoDetailDIalog></LotInfoDetailDIalog>
  </div>
</template>

<script>
// 构件库列表
import LotListDialog from '@/views/modelDisplay/lotListDialog'

import LotPositionDialog from '@/views/modelDisplay/lotPositionDialog'

import LotInfoDetailDIalog from '@/views/modelDisplay/lotInfoDetailDIalog'

import loadJs from '@/utils/loadJs.js'
import Cookies from 'js-cookie'
import lodash from 'lodash'
let Base64 = require('js-base64').Base64

export default {
  name: 'model-lot-setting',
  components: {
    LotListDialog,
    LotPositionDialog,
    LotInfoDetailDIalog
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

      FamilyListMap: [], // 模型库数据
      LotDeviceList: [], // 已经绑定的物联网设备列表
      LotDeviceModelMap: null, // 物联网模型列表
      // currentDeviceOpType: 0, // 当前设备模型的编辑模式 0:新增模式 1:编辑模式
      currentDeviceModel: null, // 当前正在操作的设备模型
      currentDeviceData: null, // 当前正在操作的设备数据
      currentEditModelName: {
        name: ''
      }, // 当前编辑的模型信息，用于顶部title显示
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
    LotPositionChange() {
      return this.$store.state.loT.LotPositionChange
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
    ComponentDataAdd: {
      // 物联网设备列表中添加设备
      handler: function(newVal, oldVal) {
        console.log('ComponentDataAdd ', newVal)
        let _item = newVal.item
        this.AddComponentData(_item) // rvt 的设备模型
      },
      deep: true
    },
    LotPositionChange: {
      handler: function(newVal, oldVal) {
        console.log('LotPositionChange111 ', newVal)
        let _globalOffset = newVal.globalOffset
        this.currentDevicePosition = _globalOffset

        const _type = newVal.type
        // console.log('_rotate_x', _rotate_x)
        switch (_type) {
          case 'rotate_x':
            let _rotate_x = newVal.rotate.x - this.currentDeviceRotate.x
            this.RotateModel(this.currentDeviceModel, 1, 0, 0, _rotate_x)
            break
          case 'rotate_y':
            let _rotate_y = newVal.rotate.y - this.currentDeviceRotate.y
            this.RotateModel(this.currentDeviceModel, 0, 1, 0, _rotate_y)
            break
          case 'rotate_z':
            let _rotate_z = newVal.rotate.z - this.currentDeviceRotate.z
            this.RotateModel(this.currentDeviceModel, 0, 0, 1, _rotate_z)
            break
          default:
            this.MoveModel(
              this.currentDeviceModel,
              this.currentDevicePosition.x,
              this.currentDevicePosition.y,
              this.currentDevicePosition.z
            )
            break
        }
        this.currentDeviceRotate.x = newVal.rotate.x
        this.currentDeviceRotate.y = newVal.rotate.y
        this.currentDeviceRotate.z = newVal.rotate.z
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
      this.FamilyListMap = await this.getFamilyList()
      console.log('FamilyListMap', this.FamilyListMap)
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
    getFamilyList() {
      return new Promise((resolve, reject) => {
        this.buildList = []
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
        let itemList = []
        const param = {
          method: 'device_config',
          project_id: this.project_id,
          buliding_id: this.itemInfoList[0].item_id
        }
        this.$store.dispatch('GetDeviceConfig', param).then(_itemList => {
          console.log('GetDeviceConfig - _itemList', _itemList)
          _itemList.forEach(item => {
            if (item.device_type !== 13 && item.device_type !== 12) {
              itemList.push(item)
            }
          })
          resolve(itemList)
        })
      })
    },
    setLotDeviceModelList() {
      this.LotDeviceModelMap = new Map()
      this.LotDeviceList.forEach(itemInfo => {
        if (itemInfo.family_id > 0) {
          console.log('itemInfoitemInfo121113', itemInfo)
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
            },
            this.onLoadError
          )
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
              if (!this.viewer.overlays.hasScene('custom-scene-1')) {
                this.viewer.overlays.addScene('custom-scene-1')
              }
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
    openComponentLibraryDialogHandle() {
      // 打开构件列表窗口
      const param = {
        show: true
      }
      this.$store
        .dispatch('ShowComponentLibraryListDialog', param)
        .then(() => {})
        .catch(() => {})
    },
    openLotListDialogHandle() {
      // 打开物联网管理窗口
      const param = {
        show: true,
        buildItem: this.itemInfoList[0]
      }
      // this.$store.dispatch('SetVideoDialog', param).then(() => {}).catch(() => {})
      this.$store
        .dispatch('ShowLotListDialog', param)
        .then(() => {})
        .catch(() => {})
    },
    openLotPositionDialogHandle() {
      console.log('this.currentDevicePosition', this.currentDevicePosition)
      // 打开物联网位置
      const param = {
        show: true,
        position: this.currentDevicePosition,
        rotate: this.currentDeviceRotate
      }
      // this.$store.dispatch('SetVideoDialog', param).then(() => {}).catch(() => {})
      this.$store
        .dispatch('ShowLotPositionDialog', param)
        .then(() => {})
        .catch(() => {})
    },
    openLotInfoDetailDialogHandle() {
      // 打开物联网信息编辑窗口
      const param = {
        show: true,
        buildItem: this.itemInfoList[0],
        deviceModel: this.currentDeviceModel, // 当前的模型
        deviceEditData: this.currentDeviceData, // 当前设备的数据
        devicePosition: this.currentDevicePosition,
        deviceRotate: this.currentDeviceRotate
      }
      // this.$store.dispatch('SetVideoDialog', param).then(() => {}).catch(() => {})
      this.$store
        .dispatch('ShowLotInfoDetailDialog', param)
        .then(() => {})
        .catch(() => {})
    },
    AddComponentData(item) {
      this.addLotModelToView(item)
    },
    // 添加一个设备模型到viewer
    addLotModelToView(item) {
      let _url = item.file.replace('/BCP_FILE/', 'BCP_FILE/')
      if (this.currentDeviceModel !== null) {
        this.$message({
          message: '编辑模式下已经有设备存在，要新增设备必须要先删除设备！',
          type: 'error'
        })
        return
      }
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
          this.currentDeviceModel = model
          console.log('modelmodelmodel', model)
          this.currentDeviceModel.infoData = item
          this.currentDevicePosition.x = this.selectedPosition.x
          this.currentDevicePosition.y = this.selectedPosition.y
          this.currentDevicePosition.z = this.selectedPosition.z
          this.MoveModel(
            this.currentDeviceModel,
            this.currentDevicePosition.x,
            this.currentDevicePosition.y,
            this.currentDevicePosition.z
          )
          const _x = this.currentDeviceRotate.x
          const _y = this.currentDeviceRotate.y
          const _z = this.currentDeviceRotate.z
          this.RotateModel(this.currentDeviceModel, 1, 0, 0, _x)
          this.RotateModel(this.currentDeviceModel, 0, 1, 0, _y)
          this.RotateModel(this.currentDeviceModel, 0, 0, 1, _z)
        },
        this.onLoadError
      )
    },
    deleteLotDeviceModelHandle() {
      console.log('deleteLotDeviceModelHandle')
      if (this.currentDeviceModel !== null) {
        this.$confirm('是否确定删除此设备的模型?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
          // center: true
        })
          .then(() => {
            this.viewer.unloadModel(this.currentDeviceModel)
            this.currentDeviceModel = null
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
        this.LotDeviceNewModel() // 新增物联网模型
      }
      buttonEnterLotMode.addClass('enter-add-lot-button')
      buttonEnterLotMode.setToolTip('添加物联网设备')

      // 标注功能 - 标定项目位置标准视点
      let buttonLotListDialog = new Autodesk.Viewing.UI.Button(
        'lot-list-dialog-button'
      )
      buttonLotListDialog.addClass('lot-list-dialog-button')
      buttonLotListDialog.setToolTip('物联网设备列表')
      buttonLotListDialog.icon.style.backgroundImage =
        'url(./static/icon/ico_markup.png)'
      buttonLotListDialog.onClick = e => {
        this.openLotListDialogHandle()
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
    LotDeviceNewModel() {
      this.enterEditModeHandle()
      this.$store
        .dispatch('ShowLotListDialog', {
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
    },
    async exitEditModeHandle() {
      // 退出编辑模式

      this.$store
        .dispatch('ShowComponentLibraryListDialog', {
          show: false
        })
        .then(() => {})
        .catch(() => {})

      this.$store
        .dispatch('ShowLotPositionDialog', {
          show: false
        })
        .then(() => {})
        .catch(() => {})

      this.viewer.toolbar.addControl(this.ControlLotManager)
      this.isShowViewPointArea = false
      this.isShowToolbarMarker = false
      console.log('this.currentDeviceModel', this.currentDeviceModel)
      // this.viewer.unloadModel(this.currentDeviceModel)
      this.currentDeviceModel = null // 当前正在操作的设备模型
      this.currentDeviceData = null // 当前正在操作的设备数据
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

      this.$store
        .dispatch('SetViewPointEditMode', {
          isEditMode: false
        })
        .then(() => {})

      var scene = this.viewer.impl.modelQueue()
      var models = scene.getModels()
      console.log('this.models', models)
      let _modelMap = new Map()

      models.forEach(model => {
        console.log('model.infoData', model.infoData)
        console.log('modelmodel', model)
        let _umodel = model
        if (_umodel.infoData !== undefined) {
          _modelMap.set(model.id, model)
          // this.viewer.unloadModel(_umodel)
        }
      })
      console.log('_modelMap', _modelMap)
      _modelMap.forEach((value, key, map) => {
        //value和key就是map的key，value，map是map本身
        console.log('valuevaluevalue', value)
        this.viewer.unloadModel(value)
      })
      this.LotDeviceList = await this.getDeviceConfigList()
      // this.removeAllDeviceLabel()
      this.setLotDeviceModelList()
      // 加载设备标签
      this.addDeviveLabel()
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
    FindModel() {
      // 放大定位
      this.viewer.fitToView([1], this.currentDeviceModel)
      // console.log('fitToView', this.currentDeviceModel)
      // let instanceTree = this.currentDeviceModel.getData().instanceTree;
      // console.log('instanceTree', instanceTree)
      // let allDbIds = Object.keys(instanceTree.nodeAccess.dbIdToIndex);
      // console.log('allDbIds', allDbIds)
      // 选中这个模型
    },
    SelectModel() {
      this.viewer.select(
        [1],
        this.currentDeviceModel,
        Autodesk.Viewing.SelectionType.OVERLAYED
      )
    },
    getModelBox(model) {
      //   console.log('modelmodelmodelmodel', model)
      const thisModel = model // viewer.getAggregateSelection()[0].model
      const fragCount = thisModel.getFragmentList().fragments.fragId2dbId.length
      let fragIdsArray = []
      for (var fragId = 0; fragId < fragCount; ++fragId) {
        fragIdsArray.push(fragId)
      }
      var bBox = this.geWorldBoundingBox(
        fragIdsArray,
        thisModel.getFragmentList()
      )
      return model.myData.bbox
    },
    removeAllDeviceLabel() {
      $('.mymlLabel').remove()
    },
    addDeviveLabel() {
      this.LotDeviceList.forEach(deviceInfo => {
        // console.log("deviceInfo", deviceInfo);
        let _familyLocation = deviceInfo.family_location
        const familyLocation = JSON.parse(_familyLocation)

        const _x = familyLocation.position.x
        const _y = familyLocation.position.y
        const _z = familyLocation.position.z

        let _zzz = 0

        if (this.LotDeviceModelMap !== null) {
          let _modelData = this.LotDeviceModelMap.get(deviceInfo.id)
          // console.log("_modelData_modelData_modelData", _modelData);
          if (_modelData !== undefined) {
            let _model = _modelData.model
            const _bbox = this.getModelBox(_model)
            _zzz = Math.abs(_bbox.max.z - _bbox.min.z)
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
