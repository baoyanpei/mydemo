import moment from 'moment'
import loadJs from '@/utils/loadJs.js'
let Base64 = require('js-base64').Base64
export default {
  name: 'Lot6-index',
  components: {},
  data() {
    return {
      projID: null,
      tip_message: '',
      nomodel_message: '',
      useFrom: '', // 用途来源  'screen':大屏, 'lot':物联网
      element: null, // document.getElementById('viewer-local');
      viewer: null, // new Autodesk.Viewing.Private.GuiViewer3D(element, config);
      towerGroup: null, // 塔机
      elevatorGroup: null, // 升降机
      sectionGroup: null, // 升降机轨道
      personGroup: null,
      datumMeterMap: new Map(),
      externalExtensionPerson: null,
      globalOffset: null,
      options: {
        env: 'Local',
        offline: 'true',
        useConsolidation: true,
        useADP: false
      },
      ModelUrlList: [],
      LoadItemIDList: [],
      noModelTip: '',
      towerHeight: 0, // 塔吊高度 28米
      hideDbid: 0, // 需要替换的原始塔吊的id，0为不替换
      showTadiaoInfo: true,
      showShenjiangjiInfo: true,
      showWeatherInfo: true,
      showShuibiaoInfo: true,
      showDianbiaoInfo: true,
      tdData: { // 塔吊面板数据
        tdgd: 0,
        dbjd: '-',
        xcjl: '-',
        dggd: '-',
        sbsj: '-'
      },
      sjjData: { // 升降机面板数据
        sjjgd: '-',
        sjjlc: '-',
        sbsj: '-',
        mzt: '-'
      },
      weather_data: {
        temp: '-',
        h: '-',
        noise: '-',
        wind: '-',
        pm10: '-',
        pm2_5: '-'
      },
      shuibiaoTotalUsed: '-',
      dianbiaoTotalUsed: '-',
      urns: [],
      config: {
        extensions: [
          // "Autodesk.Viewing.ZoomWindow",
          // "markup3d",
          // "Autodesk.Section"
          // "Autodesk.Viewing.MarkupsCore",
          // "Autodesk.Viewing.AxisHelper"
          // "Viewing.Extension.MeshSelection"
        ],
        disabledExtensions: {
          measure: false,
          section: false
        },
        memory: {
          limit: 32 * 1024 // 32 GB
        }
      },
      storage: window.localStorage,
      storageProgressiveRenderingKey: 'Autodesk.Viewing.Private.GuiViewer3D.SavedSettings.progressiveRendering',
      isProgressiveRendering: false, // 模型是否重新渲染，闪烁  又叫渐进式显示 设置中有这个选项
      totalLowFps: 0, // 低速fps累计量
      FPS_LOW_LEVEL: 8, // 低于祯数 为慢
      FPS_HIGH_LEVEL: 15, // 高于祯数 为快
      FPS_LOW_TIMES: 50, // 低速fps累计次数

      FamilyListMap: [], // 模型库数据
      LotDeviceList: [], // 已经绑定的物联网设备列表
      LotDeviceModelMap: null, // 物联网模型列表

      viewPointCurrentData: null, // 当前的视点数据
      itemsAllMap: new Map(),

      currentItemIDList: [],
      currentItemList: [],
      currentItemModelList: [], // 当前加载的模型

      cameraInfo: null, // 实时的视点
      allItemList: [], // 所有的模型列表

      isShowDevice: true, // 是否显示设备
      isShouBiaozhu: true // 是否显示标注
    }
  },
  computed: {

  },
  watch: {

  },
  created() {

  },
  async mounted() {


  },
  destroyed() {},
  methods: {
    async init(projectId) {
      this.nomodel_message = ''
      this.tip_message = '正在加载模型底层程序...'
      await loadJs(`./static/libs/viewer3D/viewer3D.min.js`)
      console.log('./static/libs/viewer3D/viewer3D.min.js')

      await loadJs(`./static/libs/viewer3D/extensions/Viewing.Extension.MeshSelection.js`)
      this.tip_message = ''
      console.log('this.useFrom', this.useFrom)
      console.log('lot6-init-init')
      this.projID = projectId
      if (this.projID === null) {
        return
      }


      // 恢复视点的模型
      this.viewPointCurrentData = await this.getViewPointsByType()
      console.log('this.viewPointCurrentData', this.viewPointCurrentData)
      if (this.viewPointCurrentData === null) {
        this.nomodel_message = '当前项目尚未配置物联网建筑模型'
        return
      }


      this.allItemList = await this.getProjectItemsAll()
      await this.init3DView()
      await this.loadViewPointModel()

      this.viewer.addEventListener(
        // Autodesk.Viewing.SELECTION_CHANGED_EVENT,
        Autodesk.Viewing.AGGREGATE_SELECTION_CHANGED_EVENT,
        this.onSelectionChanged
      )




      this.FamilyListMap = await this.getFamilyList()
      console.log('this.FamilyListMap', this.FamilyListMap)
      this.allLotDeviceList = await this.getDeviceConfigList()
      console.log('this.allLotDeviceList', this.allLotDeviceList)
      await this.setLotDeviceModelList()
      this.addDeviveLabel()

      await this.initDevlist()
      await this.initExtPerson()
      this.$refs.historyLocation.getLocationHisData(this.projID)
      this.$refs.mqttLocation.init(this.projID)
      this.$refs.mqttBim.init(this.projID, this.datumMeterMap)
      this.initData()
      this.initCameraChangeEvent()
      await this.restoreViewState()
      // 必须先恢复了视点以后才能初始化渐进式显示
      // 初始化设置 渐进式显示
      this.initProgressiveRendering()



    },
    initProgressiveRendering() {
      // 初始化设置 渐进式显示
      let storageProgressiveRendering = this.storage[this.storageProgressiveRenderingKey]
      if (storageProgressiveRendering === undefined) {
        this.storage[this.storageProgressiveRenderingKey] = this.isProgressiveRendering
      }
      console.log('this.storage[storageProgressiveRenderingKey]', this.storage[this.storageProgressiveRenderingKey])
      this.viewer.setProgressiveRendering(this.isProgressiveRendering)
    },
    initCameraChangeEvent() {
      // console.log('viewer.container', viewer.container)
      // delegate the mouse click event

      // 在场景中通过点击添加圆圈标记
      // $(this.viewer.container).bind('click', this.onMouseClick)

      // delegate the event of CAMERA_CHANGE_EVENT

      // this.viewer.setBackgroundColor(0, 59, 111, 255, 255, 255);

      this.viewer.addEventListener(Autodesk.Viewing.CAMERA_CHANGE_EVENT, (rt) => {

        const _fps = this.viewer.impl.fps()

        // this.avgFps = (this.avgFps + _fps) / 2
        // console.log('avgFps', this.avgFps, this.totalLowFps)
        if (_fps <= this.FPS_LOW_LEVEL) {
          this.totalLowFps++
        } else if (_fps >= this.FPS_HIGH_LEVEL) {
          if (this.totalLowFps > 0) {
            this.totalLowFps--
          }
        }
        console.log('当前帧数', _fps, '低于', this.FPS_LOW_LEVEL, '帧累计次数:', this.totalLowFps)
        // let storageData = this.storage["lot3-control-" + this.project_id]
        // if (this.isProgressiveRendering === false) {
        if (this.totalLowFps >= this.FPS_LOW_TIMES) {
          this.totalLowFps = 0
          // this.totalHighFps = 0
          this.isProgressiveRendering = true
          this.viewer.setProgressiveRendering(this.isProgressiveRendering)
          this.storage[this.storageProgressiveRenderingKey] = this.isProgressiveRendering
          console.log('自动打开渐进式显示')
          this.$message({
            message: '由于您的模型显示不流畅，已经切换为渐进式显示！',
            type: 'success'
          })
        }

        // find out all pushpin markups
        // var $eles = $("div[id^='mymk']"),id^='personLabel'
        var $eles = $("div[id^='mymk'],div[id^='personLabel']")
        var DOMeles = $eles.get()

        for (var index in DOMeles) {

          // get each DOM element
          let DOMEle = DOMeles[index]
          let divEle = $('#' + DOMEle.id)
          // get out the 3D coordination
          let val = divEle.data('3DData')
          let pushpinModelPt = JSON.parse(val)
          // get the updated screen point
          let screenpoint = this.viewer.worldToClient(new THREE.Vector3(
            pushpinModelPt.x,
            pushpinModelPt.y,
            pushpinModelPt.z))
          // update the SVG position.
          console.log('pushpinModelPt', pushpinModelPt)
          divEle.css({
            'left': screenpoint.x - pushpinModelPt.radius,
            'top': screenpoint.y - pushpinModelPt.radius
          })
        }

      })

      // drawPushpinLot({
      //   x: -12.590157398363942,
      //   y: -256.6158517922297,
      //   z: -33.46542876355482
      // }, 'lot5', '摄像头');

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
          selection.model.getProperties(dbId,
            (elements) => {
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
    addCustomToolBar() {
      // 截屏
      let buttonSnapshot = new Autodesk.Viewing.UI.Button('my-snapshot-button')
      buttonSnapshot.icon.style.backgroundImage = 'url(./static/icon/ico_restoreMarkup.png)' // camera

      // 截屏按钮
      buttonSnapshot.onClick = (e) => {
        // viewer.setViewCube('front')
        // this.snaphot('open')
        this.isProgressiveRendering = !this.isProgressiveRendering
        this.viewer.setProgressiveRendering(this.isProgressiveRendering)
        this.storage[this.storageProgressiveRenderingKey] = this.isProgressiveRendering

        if (this.isProgressiveRendering === true) {
          this.$message({
            message: '渐进式显示 已经打开！',
            type: 'success'
          })
        } else {
          this.$message({
            message: '渐进式显示 已经关闭！',
            type: 'success'
          })
        }
      }
      buttonSnapshot.addClass('my-snapshot-button')
      buttonSnapshot.setToolTip('关闭/打开渐进式显示（关闭后拖动和旋转时不闪烁，但可能会影响流畅度）')

      // SubToolbar
      let subToolbar = new Autodesk.Viewing.UI.ControlGroup('my-custom-view-toolbar')
      // subToolbar.addControl(buttonShare)

      // subToolbar.addControl(buttonRestoreMarker)

      subToolbar.addControl(buttonSnapshot)
      // Add subToolbar to main toolbar
      this.viewer.toolbar.addControl(subToolbar)
    },
    addLotToolBar() {
      console.log('addLotToolBar')
      // 设备显示开关
      let buttonEnterLotMode = new Autodesk.Viewing.UI.Button('enter-add-lot-button')
      buttonEnterLotMode.addClass('enter-add-lot-button')
      buttonEnterLotMode.setToolTip('物联网设备模型显示开关')

      if (this.isShowDevice === true) {
        buttonEnterLotMode.icon.style.backgroundImage = 'url(./static/icon/ico_shebei_b.png)'
      } else {
        buttonEnterLotMode.icon.style.backgroundImage = 'url(./static/icon/ico_shebei.png)'
      }
      buttonEnterLotMode.onClick = async (e) => {

        this.isShowDevice = !this.isShowDevice
        if (this.isShowDevice === true) {
          await this.setLotDeviceModelList()
          if (this.isShouBiaozhu === true) {
            this.addDeviveLabel()
          }
          buttonEnterLotMode.icon.style.backgroundImage = 'url(./static/icon/ico_shebei_b.png)'
        } else {
          this.removeAllDeviceModel()
          buttonEnterLotMode.icon.style.backgroundImage = 'url(./static/icon/ico_shebei.png)'
        }
      }

      // 标注显示开关
      let buttonLotListDialog = new Autodesk.Viewing.UI.Button('lot-list-dialog-button')
      buttonLotListDialog.addClass('lot-list-dialog-button')
      buttonLotListDialog.setToolTip('物联网设备标签显示开关')
      if (this.isShouBiaozhu === true) {
        buttonLotListDialog.icon.style.backgroundImage = 'url(./static/icon/ico_biaozhu_b.png)'
      } else {
        buttonLotListDialog.icon.style.backgroundImage = 'url(./static/icon/ico_biaozhu.png)'
      }

      buttonLotListDialog.onClick = (e) => {

        this.isShouBiaozhu = !this.isShouBiaozhu
        if (this.isShouBiaozhu === true) {
          this.addDeviveLabel()
          buttonLotListDialog.icon.style.backgroundImage = 'url(./static/icon/ico_biaozhu_b.png)'

        } else {
          this.removeAllDeviceLabel()
          buttonLotListDialog.icon.style.backgroundImage = 'url(./static/icon/ico_biaozhu.png)'
        }

      }

      // SubToolbar
      this.ControlLotManager = new Autodesk.Viewing.UI.ControlGroup('my-view-point-toolbar')
      this.ControlLotManager.addControl(buttonEnterLotMode)
      this.ControlLotManager.addControl(buttonLotListDialog)

      // Add subToolbar to main toolbar
      this.viewer.toolbar.addControl(this.ControlLotManager)

    },
    getProjectItemsAll() {
      return new Promise((resolve, reject) => {
        const param = {
          method: 'project_items',
          project_id: this.projID,
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
    init3DView() {
      return new Promise((resolve, reject) => {
        // this.urns = modelURLList
        Autodesk.Viewing.Initializer(this.options, async () => {
          this.element = document.getElementById('viewer-local');
          this.viewer = new Autodesk.Viewing.Private.GuiViewer3D(this.element, this.config)

          this.viewer.addEventListener(
            Autodesk.Viewing.GEOMETRY_LOADED_EVENT,
            this.onLoadedEvent
          );
          var startedCode = this.viewer.start();
          if (startedCode > 0) {
            console.error('Failed to create a Viewer: WebGL not supported.');
            return;
          }



          resolve()

        });

      })
    },
    getViewPointsByType() {
      return new Promise((resolve, reject) => {
        const param = {
          method: 'GetViewPoints',
          type: 4, // 物联网的展示页面的视点类型
          project_id: this.projID
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
    loadViewPointModel() {
      return new Promise(async (resolve, reject) => {
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
        resolve()
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
            let p = await this.loadBuildModel(modelURLList[i], this.currentItemList[i], i)
            _Plist.push(p)
          }
          Promise.all(_Plist).then(result => {
            // this.restoreViewState()
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
      //   console.log('ononLoadedEvent---123', event)
    },
    loadBuildModel(modelURL, itemInfo, index) {
      return new Promise((resolve, reject) => {
        console.log("----------------", index)
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
          this.currentItemModelList.push(model)
          // this.loadedModels.push(model)
          if (index === 0) {
            if (this.useFrom === 'screen') {
              // this.viewer.fitToView()
              this.viewer.setBackgroundColor(22, 39, 61, 13, 20, 51)
            } else {
              // this.viewer.fitToView()
              this.viewer.setBackgroundColor(0, 59, 111, 255, 255, 255)
            }
            // this.viewer.setGroundShadow(true)
            this.viewer.setReverseZoomDirection(true) // true 滚动向前为放大
            // this.viewer.setProgressiveRendering(this.isProgressiveRendering)

            this.addLotToolBar()
            this.addCustomToolBar()
          }
          resolve(index)
        }, this.onLoadError);


      })
    },
    getFamilyList() {
      return new Promise((resolve, reject) => {
        const param = {
          method: 'family_query',
          project_id: this.projID,
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
          project_id: this.projID,
          // buliding_id: this.itemInfoList[0].item_id
        }
        this.$store.dispatch('GetDeviceConfig', param).then((_itemList) => {
          console.log('GetDeviceConfig - _itemList', _itemList)

          resolve(_itemList)
        })

      })
    },
    async setLotDeviceModelList() {
      return new Promise(async (resolve, reject) => {

        if (this.isShowDevice === false) {
          return
        }
        this.LotDeviceModelMap = new Map()

        this.getLotDeviceList()

        let _Plist = []
        for (var i = 0; i < this.LotDeviceList.length; i++) {
          let p = await this.loadDeviceModel(this.LotDeviceList[i], i)
          _Plist.push(p)
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
        }
        this.viewer.loadModel(_url, modelOpts, (model) => {
          model.infoData = _familyModel
          this.LotDeviceModelMap.set(itemInfo.id, {
            deviceData: itemInfo,
            model: model
          })
          console.log('---->', familyLocation.position.x, familyLocation.position.y, familyLocation.position
            .z)
          const _x = familyLocation.rotate.x
          const _y = familyLocation.rotate.y
          const _z = familyLocation.rotate.z
          this.RotateModel(model, 1, 0, 0, _x)
          this.RotateModel(model, 0, 1, 0, _y)
          this.RotateModel(model, 0, 0, 1, _z)
          this.MoveModel(model,
            familyLocation.position.x,
            familyLocation.position.y,
            familyLocation.position.z)


          console.log('this.LotDeviceModelMap', this.LotDeviceModelMap)
          resolve(index)
        }, this.onLoadError)
      })
    },
    onLoadError(event) {
      console.log('fail')
    },
    initData() {
      this.datumMeterMap.forEach(datum => {
        if (datum.device_type === 13) { // 塔机

          console.log('datum.params_json', datum.params_json)

          if (datum.params_json !== '' && datum.params_json != null) {
            let paramsJson = JSON.parse(datum.params_json)
            console.log('paramsJson123', paramsJson)
            console.log('hide_dbid', paramsJson.hide_dbid)
            // if (paramsJson.hide_dbid !== undefined) {
            //   this.hideDbid = paramsJson.hide_dbid
            // }

            this.towerHeight = paramsJson.height
            this.tdData.tdgd = this.towerHeight
            /*
            this.towerGroup = new THREE.Group()
            this.towerGroup.visible = false
            this.towerGroup.name = 'towerGroup'
            this.towerGroup.scale.set(3, 3, 3)
            this.towerGroup.position.set(paramsJson.pos_x, paramsJson.pos_y, paramsJson.pos_z) // 红 绿
            modifyTower(this.towerGroup, `T${datum.device_id}`, this.towerHeight + 15, 0, 0, 0) // 名称，高度，大臂角度，小车距离，吊钩线长
            */
          }

          // this.viewer.hide(118)
          console.log('viewer123', this.viewer.overlays.impl)
          console.log('viewer234', this.viewer)
          this.viewer.overlays.impl.addOverlay('custom-scene', this.towerGroup)
        } else if (datum.device_type === 12) { // 升降机
          // $('.divDataShenJiangJi').show()

          this.elevatorGroup = new THREE.Group()
          this.elevatorGroup.name = 'elevatorGroup'

          this.elevatorGroup.scale.set(3, 3, 3)

          let paramsJson = JSON.parse(datum.params_json)
          // {"pos_x":78.5,"pos_y":24,"pos_z":0,"mqtt":"BIM/Sets/zhgd/DEYE/18090302/#"}
          this.elevatorGroup.position.set(paramsJson.pos_x, paramsJson.pos_y, paramsJson.pos_z);
          // this.elevatorGroup.position.set(181, 34, 0) // y 前后
          this.viewer.overlays.impl.addOverlay('custom-scene', this.elevatorGroup)
          // viewer.impl.scene.add(elevatorGroup);

          modifyElevator(this.elevatorGroup, `E${datum.device_id}`, -91 / 3, false) // 名称，高度，门的开启状态
          // this.viewer.hide(118)
        } else if (datum.device_type === 100) { // 升降机轨道
          this.sectionGroup = new THREE.Group()
          this.sectionGroup.name = 'sectionGroup'

          this.sectionGroup.scale.set(3, 3, 3)

          let paramsJson = JSON.parse(datum.params_json)
          this.sectionGroup.position.set(paramsJson.pos_x, paramsJson.pos_y, paramsJson.pos_z) // 红 绿
          // this.sectionGroup.position.set(185, 39, -90);
          // console.log('paramsJson.height', paramsJson.height)
          // viewer.impl.scene.add(sectionGroup);
          this.viewer.overlays.impl.addOverlay('custom-scene', this.sectionGroup)
          LoadSection(this.sectionGroup, paramsJson.height)
        }
      })

      // viewer.loadExtension('Viewing.Extension.MeshSelection').then(

      // )
    },
    // 清除所有的设备
    removeAllDeviceModel() {
      if (this.LotDeviceModelMap !== null) {
        this.LotDeviceModelMap.forEach((value, key) => {
          console.log(value)
          this.viewer.unloadModel(value.model)
          // this.viewer.unloadModel(this.viewer.model)
        });
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
    restoreViewState() {
      return new Promise((resolve, reject) => {
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

          setTimeout(() => {
            console.log('restoreStaterestoreStaterestoreStaterestoreState', this.cameraInfo)
            this.viewer.restoreState(this.cameraInfo) // it fails to restore state
            resolve()
          }, 3000)
          // this.currentItemModelList.forEach(model => {
          //   this.viewer.impl.visibilityManager.isolate(-1, model);
          // })
        }
      })
    },
    MoveModel(model, x, y, z) {
      const thisModel = model // viewer.getAggregateSelection()[0].model
      const fragCount = thisModel.getFragmentList().fragments.fragId2dbId.length
      for (let fragId = 0; fragId < fragCount; ++fragId) {
        const fragProxy = this.viewer.impl.getFragmentProxy(thisModel, fragId)
        fragProxy.getAnimTransform()
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
        fragProxy.position = position
        fragProxy.updateAnimTransform()
      }
      this.viewer.impl.sceneUpdated(true)
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
    getModelBox(model) {
      //   console.log('modelmodelmodelmodel', model)
      const thisModel = model //viewer.getAggregateSelection()[0].model
      const fragCount = thisModel.getFragmentList().fragments.fragId2dbId.length;
      let fragIdsArray = []
      for (var fragId = 0; fragId < fragCount; ++fragId) {
        fragIdsArray.push(fragId)
      }
      var bBox = this.geWorldBoundingBox(fragIdsArray, thisModel.getFragmentList())
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

        const _x = familyLocation.position.x
        const _y = familyLocation.position.y
        const _z = familyLocation.position.z

        // console.log('LotDeviceModelMapLotDeviceModelMapLotDeviceModelMap', this.LotDeviceModelMap)
        let _zzz = 0
        if (this.LotDeviceModelMap !== null) {
          let _modelData = this.LotDeviceModelMap.get(deviceInfo.id)
          //   console.log('_modelData_modelData_modelData', _modelData)
          let _model = _modelData.model
          const _bbox = this.getModelBox(_model)
          _zzz = Math.abs(_bbox.max.z - _bbox.min.z)
        }

        // let _xxx = Math.abs(_bbox.max.x - _bbox.min.x)
        // let _yyy = Math.abs(_bbox.max.y - _bbox.min.y)
        this.drawPushpinLot({
          x: _x,
          y: _y,
          z: _z + _zzz
        }, deviceInfo.id, deviceInfo.device_name, deviceInfo);
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
      const screenpoint = this.viewer.worldToClient(
        new THREE.Vector3(pushpinModelPt.x,
          pushpinModelPt.y,
          pushpinModelPt.z))
      const randomId = id // makeid();
      $('#mymk' + randomId).remove()
      // build the div container

      var htmlMarker = '<div id="mymk' + randomId + '" class="mymlLabel">' + name + '</div>'
      var parent = this.viewer.container
      $(parent).append(htmlMarker)
      $('#mymk' + randomId).css({
        // 'pointer-events': 'none',
        'width': '80px',
        // 'height': '16px',
        'position': 'absolute',
        'overflow': 'visible',
      });
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
            this.$store.dispatch('SetVideoDialog', param).then(() => {}).catch(() => {})
          }
        }
      })
      // build the svg element and draw a circle
      // $('#mymk' + randomId).append('<svg id="mysvg' + randomId + '"></svg>')

      // var snap = Snap($('#mysvg' + randomId)[0]);
      var rad = 40
      // set the position of the SVG
      // adjust to make the circle center is the position of the click point
      var $container = $('#mymk' + randomId)
      $container.css({
        'left': screenpoint.x - rad,
        'top': screenpoint.y - rad
      })

      // store 3D point data to the DOM
      var div = $('#mymk' + randomId)
      // add radius info with the 3D data
      pushpinModelPt.radius = rad
      var storeData = JSON.stringify(pushpinModelPt)
      div.data('3DData', storeData)
    },
    mqttWeather(data) {
      // console.log('weather', data)
      const _data = JSON.parse(data)
      // console.log('_data', _data)
      this.weather_data = _data
      // $('#divHJJCY').html(_h)
      // this.$refs.weather.updateData(_data)

    },
    mqttTaDiao(cmd, data) { // 塔吊
      console.log('塔吊', cmd, data)
      const _data = JSON.parse(data)
      // console.log('幅度-RRange:', _data.RRange, '高度-Height:', _data.Height, '角度-Angle:', _data.Angle)
      // console.log('RealtimeDataCrane', _data)
      $("#td_dbjd").html(_data.rotate) // 回转
      $("#td_xcjl").html(_data.extent) // 幅度
      $("#td_dggd").html(_data.height) // 吊钩高度
      $("#td_sbsj").html(moment(_data.created_time).format('HH:mm:ss')) // moment(_data.RTime).format('HH:mm:ss')


      if (this.towerGroup !== null) {
        let _dgxc = this.towerHeight - _data.height // 吊钩线长

        modifyTower(this.towerGroup, `T${_data.device_id}`, this.towerHeight, _data.rotate, _data.extent, _dgxc)
        // this.viewer.refresh(true)
        // 刷新模型
        if (this.isProgressiveRendering === false) { // 渐进显示关闭状态下
          this.viewer.impl.invalidate(true, true, true)
        }

        // 名称，高度，大臂角度，小车距离，吊钩线长
        console.log('塔吊_data', _data)
        // $("#td_dbjd").html(_data.rotate) // 回转
        // $("#td_xcjl").html(_data.extent) // 幅度
        // $("#td_dggd").html(_data.height) // 吊钩高度
        // $("#td_sbsj").html(moment(_data.created_time).format('HH:mm:ss')) // moment(_data.RTime).format('HH:mm:ss')
        if (this.towerHeight > 0) {
          if (this.towerGroup !== null && this.towerGroup.visible !== undefined && this.towerGroup.visible === false) {
            console.log('this.towerGroup.visible', this.towerGroup.visible)
            this.towerGroup.visible = true
            // console.log("isNodeVisible", this.viewer.isNodeVisible(118))
            if (this.hideDbid > 0) {
              this.hideNode(this.hideDbid) // 隐藏一个塔吊
            }

          }
        }

      }
    },
    mqttShenJiangJi(cmd, data) { // 升降机
      // console.log('升降机', cmd)
      let _data = null
      switch (cmd) {
        case "RealtimeDataElevator": // 2.11上报升降机实时数据（专用）
          _data = JSON.parse(data)
          // console.log('RealtimeDataElevator', _data)
          // console.log('高度', _data.Height)
          // 获取数据之后调用方法初始化或者调整状态
          let doorOpen = true
          if (_data.DoorState === '0') {
            doorOpen = false
          }
          if (this.elevatorGroup === null) {
            return
          }
          console.log('升降机高度', `E${_data.HxzId}`, _data.Height, _data.Height - (91 / 3))
          // viewer.overlays.impl.removeOverlay('custom-scene', elevatorGroup)
          modifyElevator(this.levatorGroup, `E${_data.HxzId}`, _data.Height - (91 / 3), doorOpen) // 名称，高度，门的开启状态
          // 刷新模型
          if (this.isProgressiveRendering === false) { // 渐进显示关闭状态下
            this.viewer.impl.invalidate(true, true, true)
          }
          // viewer.overlays.impl.addOverlay('custom-scene', elevatorGroup)
          // viewer.impl.invalidate(true);
          // viewer.overlays.impl.sceneUpdated(true)
          $("#sjj_gd").html(_data.Height)
          $("#sjj_lc").html(_data.Floor)
          $("#sjj_sbsj").html(moment(_data.RTime).format("HH:mm:ss"))
          /*
          0:内外笼门全关
          1:内外笼门全开
          2:仅内笼门开
          3:仅外笼门开
          */
          switch (_data.DoorState) {
            case "0":
              $("#sjj_lmzt").html('内外笼门全关')
              break;
            case "1":
              $("#sjj_lmzt").html('内外笼门全开')
              break;
            case "2":
              $("#sjj_lmzt").html('仅内笼门开')
              break;
            case "3":
              $("#sjj_lmzt").html('仅外笼门开')
              break;
          }

          // this.$refs.taji.updateData(_data)
          // this.$refs.shenjiangji.updateData(_data)
          break
        case "WorkDataElevator": // 2.11上报升降机工作循环数据（专用）
          _data = JSON.parse(data)
          // console.log('WorkDataElevator', _data)
          // this.$refs.taji.updateData(_data)
          break
      }
    },
    initPerson(obj) { // 收到定位数据以后，被调用
      console.log('objobjobj', obj)
      let _position = {
        x: obj.x / 1000,
        y: obj.y / 1000 + 150,
        z: (obj.layer - 1) * 3.5 + 1.6
      }
      this.addPersonMesh(obj.name, obj, _position)
    },
    initDevlist() {
      return new Promise((resolve, reject) => {
        const param = {
          method: 'devlist',
          project_id: this.projID
        }
        // this.datumMeterMap = new Map()
        this.$store.dispatch('QueryDatumMeter', param).then((data) => {
          // console.log('QueryDatumMeter - data', data)
          data.forEach(datum => {
            this.datumMeterMap.set(datum.device_id, datum)
          })
          // this.datumMeterMap = datumMeterMap
          this.updateDeviceData()
          resolve()
        }).catch((e) => {
          console.log(e)
          resolve()
        })
      })
    },
    updateDeviceData() {
      setTimeout(() => {
        const param = {
          method: 'devlist',
          project_id: this.projID
        }
        this.$store.dispatch('QueryDatumMeter', param).then((deviceList) => {
          deviceList.forEach(device => {
            // this.datumMeterMap.set(datum.device_id, datum)
            if (device.device_type === 10) { // 电表
              // console.log('devicdianbiaoTotalUsede1234', device)
              this.dianbiaoTotalUsed = device.total_used
              $('#divDianBiao' + device.device_id).html(device.total_used)

            } else if (device.device_type === 11) { // 水表
              // console.log('shuibiaoTotalUsed', device)
              this.shuibiaoTotalUsed = device.total_used
              $('#divShuiBiao' + device.device_id).html(device.total_used)
            }
          })
          this.updateDeviceData()
        }).catch((e) => {
          console.log(e)
        })
      }, 60 * 1000)
    },
    initExtPerson() {
      return new Promise((resolve, reject) => {
        console.log('MeshSelectionMeshSelectionMeshSelection')
        this.viewer.loadExtension('Viewing.Extension.MeshSelection').then(
          (externalExtension) => {
            this.externalExtensionPerson = externalExtension
            resolve()
          }
        )
      })
    },
    addPersonMesh(name, userData, position) {
      const geometry = new THREE.BoxGeometry(5, 5, 5)

      const color = '#FF0000' // Math.floor(Math.random() * 16777215)
      const material = new THREE.MeshPhongMaterial({
        specular: new THREE.Color(color),
        side: THREE.DoubleSide,
        reflectivity: 0.0,
        color
      })

      const materials = this.viewer.impl.getMaterials()

      materials.addMaterial(
        color.toString(16),
        material,
        true)

      const mesh = new THREE.Mesh(geometry, material)

      mesh.position.x = position.x // -71
      mesh.position.y = position.y // -81
      mesh.position.z = position.z
      mesh.name = name
      mesh.userData = userData
      console.log('mesh.position', mesh.position)
      this.externalExtensionPerson.addPersonToView(mesh)

      if (name === '') {
        name = userData.mac
      }
      this.drawPushpinPerson({
        x: position.x,
        y: position.y,
        z: position.z
      }, userData.mac, name)

      if (this.isProgressiveRendering === false) { // 渐进显示关闭状态下
        this.viewer.impl.invalidate(true, true, true)
      }
    },
    // 人员定位的标签
    drawPushpinPerson(pushpinModelPt, id, name) {
      // console.log('idididid', id)
      // convert 3D position to 2D screen coordination
      var screenpoint = this.viewer.worldToClient(
        new THREE.Vector3(pushpinModelPt.x,
          pushpinModelPt.y,
          pushpinModelPt.z))

      // build the div container
      var randomId = id // makeid();
      $('#personLabel' + randomId).remove()
      var htmlMarker = '<div id="personLabel' + randomId + '" class="personLabel">' + name + '</div>'
      var parent = this.viewer.container
      $(parent).append(htmlMarker)
      $('#personLabel' + randomId).css({
        'pointer-events': 'none',
        'width': '60px',
        'height': '16px',
        'position': 'absolute',
        'overflow': 'hidden',
      })

      // var snap = Snap($('#mysvg' + randomId)[0]);
      var rad = 30
      // set the position of the SVG
      // adjust to make the circle center is the position of the click point
      var $container = $('#personLabel' + randomId)
      $container.css({
        'left': screenpoint.x - rad,
        'top': screenpoint.y - rad
      })

      // store 3D point data to the DOM
      var div = $('#personLabel' + randomId)
      // add radius info with the 3D data
      pushpinModelPt.radius = rad
      var storeData = JSON.stringify(pushpinModelPt)
      div.data('3DData', storeData)
    },
  },

}