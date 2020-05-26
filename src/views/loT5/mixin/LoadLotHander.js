import moment from 'moment'
import loadJs from '@/utils/loadJs.js'
import {
  getToken
} from '@/utils/auth'
export default {
  name: 'Lot5-index',
  components: {},
  data() {
    return {
      projID: null,
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
      // datumMeterMap: new Map(),
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
      FPS_LOW_TIMES: 50 // 低速fps累计次数
    }
  },
  computed: {
    // project_id() {
    //   return this.$store.state.project.project_id
    // }
  },
  watch: {
    // project_id(curVal, oldVal) {
    //   console.log('project_idproject_idproject_id', curVal, oldVal)
    //   if (oldVal !== null) {
    //     // this.clearData()
    //     location.reload()

    //   }
    //   if (curVal !== null) {
    //     this.init()
    //   }
    // },
  },
  created() {

  },
  async mounted() {
    console.log('lot5-index-mounted')
    // this.init()
    await loadJs(`./static/libs/viewer3D/viewer3D.min.js`)
    console.log('./static/libs/viewer3D/viewer3D.min.js')
    require('@/script/Viewing.Extension.MeshSelection')

  },
  destroyed() {},
  methods: {
    async init(projectId) {
      console.log('this.useFrom', this.useFrom)
      console.log('lot5-init-init')
      this.projID = projectId
      if (this.projID === null) {
        return
      }
      console.log('lot5init-init-OK')
      this.getModelUrl()
      //   let _token = getToken()
      //   console.log('_token', _token)
      if (this.LoadItemIDList.length !== 0) {
        await this.getItemInfoListByItemIDs()
      }

      console.log('this.ModelUrlList', this.ModelUrlList)
      if (this.ModelUrlList.length !== 0) {
        this.noModelTip = ''

        await this.init3DView()
        await this.initDevlist()
        await this.initExtPerson()
        this.$refs.historyLocation.getLocationHisData(this.projID)
        this.$refs.mqttLocation.init(this.projID)
        this.$refs.mqttBim.init(this.projID, this.datumMeterMap)
        await this.addDevlist()
        this.initData()
        this.initMarker()
      } else {
        this.showTadiaoInfo = false
        this.showShenjiangjiInfo = false
        this.showWeatherInfo = false
        this.showShuibiaoInfo = false
        this.showDianbiaoInfo = false
        this.noModelTip = '当前项目没有模型'
      }
    },
    getItemInfoListByItemIDs() {
      // console.log('this.projID', this.projID)
      return new Promise((resolve, reject) => {
        const param = {
          method: 'GetItemInfoListByItemIDs',
          project_id: this.projID,
          item_id: this.LoadItemIDList.join(',')

        }
        this.$store.dispatch('GetItemInfoListByItemIDs', param).then((_itemList) => {
          console.log('_itemList_itemList', _itemList)
          let _itemMap = new Map()

          _itemList.forEach(item => {
            _itemMap.set(item.item_id, item)
            // this.ModelUrlList.push(item.URL.replace('/www/bim_proj/', process.env.BASE_DOMAIN_BIM))
          })
          this.LoadItemIDList.forEach(itemID => {
            let _itemInfo = _itemMap.get(itemID)
            // this.ModelUrlList.push(_itemInfo.URL.replace('/www/bim_proj/', process.env.BASE_DOMAIN_BIM))
            this.ModelUrlList.push(_itemInfo.url.replace('/www/bim_proj/', ''))
          })
          console.log('this.itemInfoList', this.itemInfoList)
          resolve()
        })
      })
    },
    init3DView() {
      return new Promise((resolve, reject) => {
        // this.urns = this.ModelUrlList

        Autodesk.Viewing.Initializer(this.options, async () => {
          this.element = document.getElementById('viewer-local');
          this.viewer = new Autodesk.Viewing.Private.GuiViewer3D(this.element, this.config)
          let startedCode = this.viewer.start()
          if (startedCode > 0) {
            console.error('Failed to create a Viewer: WebGL not supported.')
            return
          }
          // this.viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, (model) => {
          //   console.log('Autodesk.Viewing.GEOMETRY_LOADED_EVENT', model)
          //   this.viewer.hide(118)
          // })
          let _Plist = []
          // viewer.loadModel("https://lmv-models.s3.amazonaws.com/toy_plane/toy_plane.svf", undefined,
          // onLoadSuccess, onLoadError);
          for (var i = 0; i < this.ModelUrlList.length; i++) {
            let p = await this.loadModel(this.ModelUrlList[i], i)
            _Plist.push(p)
          }

          Promise.all(_Plist).then(result => {
            console.log('Promise.all', result)
            // _viewPointList.forEach(itemList => {
            //   this.viewPointAllList = [...this.viewPointAllList, ...itemList]
            // })
            if (!this.viewer.overlays.hasScene('custom-scene')) {
              this.viewer.overlays.addScene('custom-scene')
            }

            console.log('success')
            this.viewer.addEventListener(
              Autodesk.Viewing.SELECTION_CHANGED_EVENT,
              this.onSelectionChanged
            )


            resolve()
            // console.log("this.viewPointAllList", this.viewPointAllList);
          })

          // 初始化设置 渐进式显示
          let storageProgressiveRendering = this.storage[this.storageProgressiveRenderingKey]
          if (storageProgressiveRendering === undefined) {
            this.storage[this.storageProgressiveRenderingKey] = this.isProgressiveRendering
          }
          console.log('this.storage[storageProgressiveRenderingKey]', this.storage[this.storageProgressiveRenderingKey])
          this.viewer.setProgressiveRendering(this.isProgressiveRendering)
          // viewer.loadModel("https://lmv-models.s3.amazonaws.com/toy_plane/toy_plane.svf", undefined,
          // onLoadSuccess, onLoadError);
          //   for (var i = 0; i < modelURLList.length; i++) {
          //     if (i === 0) {
          //       this.viewer.loadModel(modelURLList[i], undefined, this.onLoadSuccess, this.onLoadError);
          //     }
          //   }

          //   resolve()
        })
      })
    },
    loadModel(modelURL, index) {
      return new Promise((resolve, reject) => {
        console.log('iiiiii', index)
        if (index === 0) {
          this.viewer.loadModel(modelURL, undefined, (resLoadSuccess) => {
            console.log('resLoadSuccess', resLoadSuccess)
            let getModels = this.viewer.impl.modelQueue().getModels()
            this.globalOffset = getModels[0].getData().globalOffset // Get it from first model 
            console.log('globalOffset', this.globalOffset)
            this.viewer.fitToView()
            if (this.useFrom === 'screen') {
              // this.viewer.fitToView()
              this.viewer.setBackgroundColor(22, 39, 61, 13, 20, 51)
            } else {
              // this.viewer.fitToView()
              this.viewer.setBackgroundColor(0, 59, 111, 255, 255, 255)
            }
            this.viewer.setGhosting(0)
            // this.viewer.setGroundShadow(0)
            this.viewer.setReverseZoomDirection(true) // true 滚动向前为放大
            // unloadModel(model)

            // this.saveStatus = JSON.stringify(this.viewer.getState());
            this.addCustomToolBar()
            // this.addViewpointToolBar()
            resolve(index)
          }, this.onLoadError)
        } else {
          let options = {
            globalOffset: this.globalOffset
          }
          this.viewer.loadModel(modelURL, options, (resLoadSuccess) => {
            resolve(index)
          })
        }
      })
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
    onLoadError(event) {
      console.log('fail')
    },
    initData() {
      this.datumMeterMap.forEach(datum => {
        if (datum.device_type === 13) { // 塔机
          // {"pos_x":60,"pos_y":22,"pos_z":0,"height":75,"mqtt":"BIM/Sets/zhgd/DEYE/18090311/#"}
          // $('.divDataTadiao').show()
          this.towerGroup = new THREE.Group()
          this.towerGroup.visible = false
          this.towerGroup.name = 'towerGroup'
          this.towerGroup.scale.set(3, 3, 3)
          console.log('datum.params_json', datum.params_json)

          if (datum.params_json !== '' && datum.params_json != null) {
            let paramsJson = JSON.parse(datum.params_json)
            console.log('paramsJson123', paramsJson)
            console.log('hide_dbid', paramsJson.hide_dbid)
            if (paramsJson.hide_dbid !== undefined) {
              this.hideDbid = paramsJson.hide_dbid
            }

            this.towerHeight = paramsJson.height
            this.tdData.tdgd = this.towerHeight
            this.towerGroup.position.set(paramsJson.pos_x, paramsJson.pos_y, paramsJson.pos_z) // 红 绿
            console.log('this.towerGroupthis.towerGroupthis.towerGroup', this.towerGroup)
            // this.towerGroup.position.set(54, 526, -26) // 红 绿
            modifyTower(this.towerGroup, `T${datum.device_id}`, this.towerHeight + 15, 0, 0, 0) // 名称，高度，大臂角度，小车距离，吊钩线长
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
    initMarker() {
      // console.log('viewer.container', viewer.container)
      // delegate the mouse click event

      // 在场景中通过点击添加圆圈标记
      $(this.viewer.container).bind('click', this.onMouseClick)

      // delegate the event of CAMERA_CHANGE_EVENT
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
          this.storage[this.storageProgressiveRenderingKey] = this.isProgressiveRendering;
          console.log('自动打开渐进式显示')
          this.$message({
            message: '由于您的模型显示不流畅，已经切换为渐进式显示！',
            type: 'success'
          })
        }

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
          let screenpoint = this.viewer.worldToClient(new THREE.Vector3(
            pushpinModelPt.x,
            pushpinModelPt.y,
            pushpinModelPt.z))
          // update the SVG position.
          divEle.css({
            'left': screenpoint.x - pushpinModelPt.radius * 2,
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
    initExtPerson() {
      return new Promise((resolve, reject) => {
        this.viewer.loadExtension('Viewing.Extension.MeshSelection').then(
          (externalExtension) => {
            this.externalExtensionPerson = externalExtension
            resolve()
          }
        )
      })

    },
    getModelUrl() {
      console.log('this.projID', this.projID)
      switch (this.projID) {
        case 10000:
          // this.LoadItemIDList = [100025, 1335, 1337, 1338]
          this.LoadItemIDList = [100025, 1335, 1337, 1338]
          //   _urlList = ['/static/model/qingyang0/3d.svf'];
          // await this.getItemInfoListByItemIDs(itemIDList.join(','))
          //   _urlList = ['/static/model/qingyang0/3d.svf', '/static/model/qingyang-houqingbaozhang/3d.svf',
          //     '/static/model/qingyang-menzheng/3d.svf',
          //     '/static/model/qingyang-bingfang/3d.svf',
          //   ];
          break
        case 10004:
          this.LoadItemIDList = [1351]
          break
        case 10018:
          this.LoadItemIDList = [1351]
          // this.projID = 10004
          break
        case 10020:
          this.LoadItemIDList = [100031]
          // this.projID = 10004
          break
        case 10019: // 兰通棚户区改造项目（二期）
          this.LoadItemIDList = [100052]
          // this.projID = 10004
          break
      }
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
    addDevlist() {
      let _hasDianBiao = false
      this.datumMeterMap.forEach(datum => {
        if (datum.device_type === 11) { // 水表
          this.shuibiaoTotalUsed = datum.total_used
          if (datum.params_json !== '' && datum.params_json !== null) {
            let paramsJson = JSON.parse(datum.params_json)
            if (paramsJson.pos_x !== undefined) {
              this.drawPushpinLot({
                x: paramsJson.pos_x,
                y: paramsJson.pos_y,
                z: paramsJson.pos_z
              }, datum.device_id, `${datum.device_name}`, datum)
            }
          }
        } else if (datum.device_type === 10 && _hasDianBiao === false) { // 电表
          _hasDianBiao = true
          this.dianbiaoTotalUsed = datum.total_used
          if (datum.params_json !== '' && datum.params_json !== null) {
            let paramsJson = JSON.parse(datum.params_json)
            if (paramsJson.pos_x !== undefined) {
              this.drawPushpinLot({
                x: paramsJson.pos_x,
                y: paramsJson.pos_y,
                z: paramsJson.pos_z
              }, datum.device_id, `${datum.device_name}`, datum)
            }
          }
        } else if (datum.device_type === 15) { // 环境检测仪
          if (datum.params_json !== '' && datum.params_json !== null) {
            let paramsJson = JSON.parse(datum.params_json)
            if (paramsJson.pos_x !== undefined) {
              this.drawPushpinLot({
                x: paramsJson.pos_x,
                y: paramsJson.pos_y,
                z: paramsJson.pos_z
              }, datum.device_id, `${datum.device_name}`, datum);
            }

          }

        } else if (datum.device_type === 16 || datum.device_type === 18) { // 摄像头
          if (datum.params_json !== '' && datum.params_json !== null) {
            let paramsJson = JSON.parse(datum.params_json)
            if (paramsJson.pos_x !== undefined) {
              this.drawPushpinLot({
                x: paramsJson.pos_x,
                y: paramsJson.pos_y,
                z: paramsJson.pos_z
              }, datum.device_id, `${datum.device_name}`, datum)
            }
          }
        }
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
    onMouseClick(event) {

      var screenPoint = {
        x: event.clientX,
        y: event.clientY
      }
      console.log('screenPoint', screenPoint)
      // get the selected 3D position of the object

      // viewer canvas might have offset from the webpage.

      let viewer_pos = this.viewer.container.getBoundingClientRect();
      var hitTest = this.viewer.impl.hitTest(screenPoint.x - viewer_pos.x,
        screenPoint.y - viewer_pos.y, true);

      // var hitTest = viewer.impl.hitTest(screenPoint.x, screenPoint.y, true);
      console.log('hitTest', hitTest)
      if (hitTest) {
        let _position = {
          x: hitTest.intersectPoint.x,
          y: hitTest.intersectPoint.y,
          z: hitTest.intersectPoint.z
        }
        // this.drawPushpin(_position)
        console.log('点击位置的坐标', _position)
      }
    },
    mqttWeather(data) {
      // console.log('weather', data)
      const _data = JSON.parse(data)
      // console.log('_data', _data)
      this.weather_data = _data
      // $('#divHJJCY').html(_h)
      // this.$refs.weather.updateData(_data)

    },
    // mqttTaDiao(cmd, data) { // 塔吊
    //   // console.log('塔吊', cmd)
    //   switch (cmd) {
    //     case 'RealtimeDataCrane': // 2.3 上报塔机实时数据（专用）
    //       const _data = JSON.parse(data)
    //       // console.log('幅度-RRange:', _data.RRange, '高度-Height:', _data.Height, '角度-Angle:', _data.Angle)
    //       // console.log('RealtimeDataCrane', _data)
    //       if (this.towerGroup !== null) {
    //         modifyTower(this.towerGroup, `T${_data.HxzId}`, this.towerHeight, _data.Angle, _data.RRange, _data
    //           .Height) // 名称，高度，大臂角度，小车距离，吊钩线长

    //         $("#td_dbjd").html(_data.Angle)
    //         $("#td_xcjl").html(_data.RRange)
    //         $("#td_dggd").html(_data.Height)
    //         $("#td_sbsj").html(moment(_data.RTime).format('HH:mm:ss'))
    //         if (this.projID === 10004) {
    //           if (this.towerGroup !== null && this.towerGroup.visible !== undefined && this.towerGroup.visible === false) {
    //             console.log('this.towerGroup.visible', this.towerGroup.visible)
    //             this.towerGroup.visible = true
    //             // console.log("isNodeVisible", this.viewer.isNodeVisible(118))
    //             this.hideNode(118) // 隐藏一个塔吊
    //           }
    //         }
    //       }
    //       break
    //   }
    // },
    mqttTaDiao(cmd, data) { // 塔吊
      console.log('塔吊', cmd, data)
      const _data = JSON.parse(data)
      // console.log('幅度-RRange:', _data.RRange, '高度-Height:', _data.Height, '角度-Angle:', _data.Angle)
      // console.log('RealtimeDataCrane', _data)
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
        $("#td_dbjd").html(_data.rotate) // 回转
        $("#td_xcjl").html(_data.extent) // 幅度
        $("#td_dggd").html(_data.height) // 吊钩高度
        $("#td_sbsj").html(moment(_data.created_time).format('HH:mm:ss')) // moment(_data.RTime).format('HH:mm:ss')
        // if (this.projID === 10004 || this.projID === 10018 || this.projID === 10019) {
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

        // }
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
    onSelectionChanged(event) {
      // console.log('viewer', viewer)
      console.log('onSelectionChanged - event', event)
      // console.log(" >LJason< 日志：点击位置", viewer.clientToWorld(event.offsetX, event.offsetY, false).intersectPoint);
      // console.log(event.dbIdArray);
      let _dbIds = event.dbIdArray

      // Asyncronous method that gets object properties
      // 异步获取模型的属性
      this.viewer.getProperties(_dbIds[0],
        (elements) => {
          let dbid = elements.dbId;
          console.log('被点击的构件的dbid：', dbid, elements)
        })
    },
    initPerson(obj) {
      console.log('objobjobj', obj)
      let _position = {
        x: obj.x / 1000 - 62,
        y: obj.y / 1000 - 37 + 150,
        z: (obj.layer - 1) * 3.5 + 1.6 - 91
      }
      this.addPersonMesh(obj.name, obj, _position)
    },
    addPersonMesh(name, userData, position) {
      const geometry = new THREE.BoxGeometry(5, 5, 5)

      const color = '#FF0000' //Math.floor(Math.random() * 16777215)
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

      mesh.position.x = position.x //-71
      mesh.position.y = position.y //-81
      mesh.position.z = position.z
      mesh.name = name
      mesh.userData = userData
      console.log('mesh.position', mesh.position)
      this.externalExtensionPerson.addPersonToView(mesh)
      this.drawPushpinPerson({
        x: position.x,
        y: position.y,
        z: position.z
      }, userData.mac, name)
    },
    drawPushpinPerson(pushpinModelPt, id, name) {
      // console.log('idididid', id)
      // convert 3D position to 2D screen coordination
      var screenpoint = this.viewer.worldToClient(
        new THREE.Vector3(pushpinModelPt.x,
          pushpinModelPt.y,
          pushpinModelPt.z))

      // build the div container
      var randomId = id // makeid();
      $('#mymk' + randomId).remove()
      var htmlMarker = '<div id="mymk' + randomId + '" class="mymlLabel">' + name + '</div>'
      var parent = this.viewer.container
      $(parent).append(htmlMarker)
      $('#mymk' + randomId).css({
        'pointer-events': 'none',
        'width': '50px',
        'height': '16px',
        'position': 'absolute',
        'overflow': 'visible',
      })

      // var snap = Snap($('#mysvg' + randomId)[0]);
      var rad = 27
      // set the position of the SVG
      // adjust to make the circle center is the position of the click point
      var $container = $('#mymk' + randomId)
      $container.css({
        'left': screenpoint.x - rad * 2,
        'top': screenpoint.y - rad
      })

      // store 3D point data to the DOM
      var div = $('#mymk' + randomId)
      // add radius info with the 3D data
      pushpinModelPt.radius = rad
      var storeData = JSON.stringify(pushpinModelPt)
      div.data('3DData', storeData)
    },
    drawPushpinLot(pushpinModelPt, id, name, data) {
      // console.log('idididid', id)
      // convert 3D position to 2D screen coordination
      var screenpoint = this.viewer.worldToClient(
        new THREE.Vector3(pushpinModelPt.x,
          pushpinModelPt.y,
          pushpinModelPt.z, ));
      $('#mymk' + randomId).remove()
      // build the div container
      var randomId = id; //makeid();
      var htmlMarker = '<div id="mymk' + randomId + '" class="mymlLabel">' + name + '</div>';
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
      var rad = 27
      // set the position of the SVG
      // adjust to make the circle center is the position of the click point
      var $container = $('#mymk' + randomId)
      $container.css({
        'left': screenpoint.x - rad * 2,
        'top': screenpoint.y - rad
      })

      // store 3D point data to the DOM
      var div = $('#mymk' + randomId)
      // add radius info with the 3D data
      pushpinModelPt.radius = rad
      var storeData = JSON.stringify(pushpinModelPt)
      div.data('3DData', storeData)
    },
    drawPushpin(pushpinModelPt, id, name) {
      // console.log('idididid', id)
      // convert 3D position to 2D screen coordination
      var screenpoint = this.viewer.worldToClient(
        new THREE.Vector3(pushpinModelPt.x,
          pushpinModelPt.y,
          pushpinModelPt.z, ));
      $('#mymk' + randomId).remove()
      // build the div container
      var randomId = id; //makeid();
      var htmlMarker = '<div id="mymk' + randomId + '" class="mymlLabel">' + name + '</div>';
      var parent = this.viewer.container
      $(parent).append(htmlMarker);
      $('#mymk' + randomId).css({
        'pointer-events': 'none',
        'width': '50px',
        'height': '20px',
        'position': 'absolute',
        'overflow': 'visible',
      });

      // build the svg element and draw a circle
      $('#mymk' + randomId).append('<svg id="mysvg' + randomId + '"></svg>')

      //   var snap = Snap($('#mysvg' + randomId)[0]);
      var rad = 7
      //   var circle = snap.paper.circle(14, 14, rad);
      //   circle.attr({
      //     fill: "#FF8888",
      //     fillOpacity: 0.6,
      //     stroke: "#FF0000",
      //     strokeWidth: 1
      //   })

      // set the position of the SVG
      // adjust to make the circle center is the position of the click point
      var $container = $('#mymk' + randomId)
      $container.css({
        'left': screenpoint.x - rad * 2,
        'top': screenpoint.y - rad
      })

      // store 3D point data to the DOM
      var div = $('#mymk' + randomId)
      // add radius info with the 3D data
      pushpinModelPt.radius = rad
      var storeData = JSON.stringify(pushpinModelPt)
      div.data('3DData', storeData)
    },
    hideNode(nodeId) { // 隐藏构件
      let _isNodeVisible = this.viewer.isNodeVisible(nodeId)
      if (_isNodeVisible === true) {
        this.viewer.hide(nodeId)
      }
    },
    aaaa() {
      // if (this.projID === 10004) {
      if (this.towerGroup !== null && this.towerGroup.visible !== undefined && this.towerGroup.visible === false) {
        console.log('this.towerGroup.visible', this.towerGroup.visible)
        this.towerGroup.visible = true
        // console.log("isNodeVisible", this.viewer.isNodeVisible(118))
        let ishide = this.viewer.hide(118)
      }


      // console.log('ishide', ishide,this.viewer.model.id)
      console.log('this.viewer.getHiddenNodes()', this.viewer.getHiddenNodes())
      // }
      return
      this.viewer.overlays.impl.removeOverlay('custom-scene', this.elevatorGroup)
      modifyElevator(this.elevatorGroup, `E18090302`, 30, false) //名称，高度，门的开启状态
      this.viewer.overlays.impl.addOverlay('custom-scene', this.elevatorGroup)
      // viewer.overlays.impl.removeOverlay('custom-scene', elevatorGroup)
      // viewer.refresh(true)
      console.log('-->', this.viewer.impl)
      console.log('aaaa-click')
      return
      let _position = {
        x: 30,
        y: 30,
        z: 0
      }
      let obj = {
        mac: '20-5d-47-6e-55-9e'
      }
      this.addPersonMesh('test', obj, _position)
    },
    bbbb() {
      viewer.overlays.impl.removeOverlay('custom-scene', elevatorGroup)
      modifyElevator(elevatorGroup, `E18090302`, -10, false) //名称，高度，门的开启状态
      viewer.overlays.impl.addOverlay('custom-scene', elevatorGroup)
      return
      console.log('bbbb-click')
      let _position = {
        x: 10,
        y: 10,
        z: 120
      }
      let obj = {
        mac: '20-5d-47-6e-55-9e'
      }
      this.addPersonMesh('test', obj, _position)
    },
    cccc() {
      return
      console.log('ccc-click')
      let obj = {
        mac: '20-5d-47-6e-55-9e'
      }
      $('#mymk' + obj.mac).remove()
      externalExtensionPerson.removePersonFromView(obj)

    }
  },

}
