<style lang="scss">
  @import "./xcxShow";

</style>
<template>
  <div class="pointview-xcx-show" style="margin: 0px;">
    <div v-if="tip_message!==''" class="tip_message" v-html="tip_message"></div>
    <div id="viewer-local" v-show="tip_message===''" class="viewer-local"></div>
    <div style="width:100vw; height:100vh;display:none;top:0px;left:0px;">
      <canvas id="snapshot" style="position:absolute;"></canvas>
    </div>
    <div ref="viewPointThumbTopArea"
      v-show="isShowPositionViewPic===true && ViewPointType===1 && viewPointImgTopUrl !==''"
      class="viewPointThumbTopArea">
      <img v-bind:src="viewPointImgTopUrl" class="viewPointImgTop" />
    </div>
    <div ref="viewPointThumbSideArea"
      v-show="isShowPositionViewPic===true && ViewPointType===1 && viewPointImgSideUrl !==''"
      class="viewPointThumbSideArea">
      <img v-bind:src="viewPointImgSideUrl" class="viewPointImgSide" />
    </div>
  </div>
</template>

<script>
  import loadJs from '@/utils/loadJs.js'
  import {
    setToken
  } from '@/utils/auth'
  import Cookies from 'js-cookie'
  let Base64 = require('js-base64').Base64
  export default {
    name: 'point-view-xcx-show',
    components: {},
    data() {
      return {
        access_token: '',
        tip_message: '',
        viewer: null, //new Autodesk.Viewing.Private.GuiViewer3D(element, config);
        globalOffset: null,
        urns: [],
        element: null, //document.getElementById('viewer-local');
        project_id: '',
        point_view_id: '',
        ViewPointInfo: null,
        ViewPointType: 2, //2 普通视点
        itemInfoList: [],
        config: {
          extensions: [
            // "Autodesk.Viewing.ZoomWindow",
            // "markup3d",
            // "Autodesk.Section",
            "Autodesk.Viewing.MarkupsCore",
            // "Autodesk.Viewing.AxisHelper"
          ],
          disabledExtensions: {
            measure: false,
            section: false,
          },
          memory: {
            limit: 32 * 1024 // 32 GB
          }
        },
        options: {
          env: 'Local',
          offline: 'true',
          useConsolidation: true,
          useADP: false
        },
        isShowViewPointArea: false,
        viewPointImgTopUrl: '', // 顶部缩略图
        viewPointImgSideUrl: '', // 侧面缩略图
        viewPointTitleName: '', //标题栏显示的视点名字
        isShowPositionViewPic: true, //是否显示位置截图
        storage: window.localStorage,
        storageProgressiveRenderingKey: 'Autodesk.Viewing.Private.GuiViewer3D.SavedSettings.progressiveRendering',
        isProgressiveRendering: false, // 模型是否重新渲染，闪烁  又叫渐进式显示 设置中有这个选项
        totalLowFps: 0, // 低速fps累计量
        FPS_LOW_LEVEL: 8, // 低于祯数 为慢
        FPS_HIGH_LEVEL: 15, // 高于祯数 为快
        FPS_LOW_TIMES: 30, // 低速fps累计次数

        // objectSetIDs: []
      }
    },
    computed: {

    },
    created() {

    },
    watch: {

    },
    mounted() {
      let __PROJECT_ID = ''
      console.log('this.$route', this.$route.query)
      const __FROM = this.$route.query.from // 此参数不存在则为url 直接打开 xcx_pv_qrcode：小程序视点的二维码

      console.log('__FROM', __FROM)

      if (__FROM === undefined) { // 小程序直接使用url
        __PROJECT_ID = this.$route.query.projectid
        this.access_token = this.$route.query.token
      } else {
        // 二维码使用的url
        __PROJECT_ID = this.$route.query.project_id
        this.access_token = this.$route.query.access_token
      }


      const __POINT_VIEW_ID = this.$route.query.pvid
      const __ERROR_MESSAGE = this.$route.query.errormsg

      if (__PROJECT_ID === undefined || __PROJECT_ID === '') {
        this.tip_message = '缺少参数 projectid'
        return
      } else if (__POINT_VIEW_ID === undefined || __POINT_VIEW_ID === '') {
        this.tip_message = '缺少参数 pvid'
        return
      } else if (this.access_token === undefined || this.access_token === '') {
        this.tip_message = '缺少参数 token或access_token'
        return
      }
      console.log('__ERROR_MESSAGE', __ERROR_MESSAGE)

      if (__ERROR_MESSAGE !== undefined && __ERROR_MESSAGE !== '') {
        this.tip_message = __ERROR_MESSAGE + '<br/>' + this.access_token
        return
      }

      this.project_id = parseInt(__PROJECT_ID)
      this.point_view_id = parseInt(__POINT_VIEW_ID)
      // console.log('this', this.project_id, this.point_view_id)
      this.init()

      if (__FROM !== undefined) { // 小程序直接使用url
        this.setXcxPVQrcodeLogs(__FROM)
      }


    },
    beforeDestroy() {},
    destroyed() {},
    methods: {
      loginByXcxToken() { // 通过小程序的token 登录
        // console.log('this.project_id', this.project_id)
        return new Promise((resolve, reject) => {
          this.$store.dispatch('LoginByXcxToken', {
            access_token: this.access_token
          }).then(() => {

            setToken(this.access_token)
            resolve()
            // this.init()
          })
        })
      },
      setXcxPVQrcodeLogs(from) {

        let _desc = {
          title: '微信扫描视点二维码查看revit模型视点',
          pvid: this.point_view_id,
          from: from // xcx_pv_qrcode
        }
        let param = {
          method: 'person_health',
          project_id: this.project_id,
          oper_type: 4,
          source: 3,
          desc: JSON.stringify(_desc)
        }

        console.log('param', param)
        this.$store.dispatch('SetLogs', param).then((result) => {

        })
      },
      showAllViewpointToolBar() {
        // this.viewer.setGhosting(0.2)
        // this.viewer.setDisplayEdges(false)
        // 查看所有标注点
        let buttonMarker = new Autodesk.Viewing.UI.Button('show-view-point-button')
        buttonMarker.icon.style.backgroundImage = 'url(./static/icon/ico_show_all_view_points.png)'
        buttonMarker.onClick = (e) => {


          this.isShowPositionViewPic = !this.isShowPositionViewPic;

        }
        buttonMarker.addClass('show-view-point-button')
        buttonMarker.setToolTip('查看位置全局图')


        this.ControlGroupShowAllViewPoint = new Autodesk.Viewing.UI.ControlGroup('show-view-point-toolbar')
        this.ControlGroupShowAllViewPoint.addControl(buttonMarker)



        this.viewer.toolbar.addControl(this.ControlGroupShowAllViewPoint)
      },
      async init() {
        await this.loginByXcxToken()


        this.tip_message = "正在读取模型数据..."
        await this.getViewpointsById()
        if (this.ViewPointInfo === null) {
          this.tip_message =
            `没有查询到相关视点数据，请核对参数<br/>projectid:${this.project_id}<br/>projectid:${this.point_view_id}<br/>token:${this.access_token}`
          return
        }

        // let files_id_list = JSON.parse(this.ViewPointInfo.file_ids)
        // console.log('files_id_list', files_id_list)
        const _itemId = this.ViewPointInfo.item_id
        await this.getItemInfoListByItemIDs(_itemId)
        if (this.itemInfoList.length === 0) {
          this.tip_message =
            `没有符合的模型文件<br/>projectid:${this.project_id}<br/>projectid:${this.point_view_id}<br/>token:${this.access_token}`
          return
        }
        this.tip_message = '正在加载模型底层程序...'
        await loadJs(`./static/libs/viewer3D/viewer3D.min.js`)
        console.log('./static/libs/viewer3D/viewer3D.min.js')
        this.tip_message = ""
        let _urlList = this.getModelUrl()
        // console.log('_urlList', _urlList)
        if (_urlList.length !== 0) {
          await this.init3DView(_urlList)
          this.initEvent()
        }

      },
      onLoadedEvent(event) {
        console.log('ononLoadedEvent', event)
        this.ShowViewPoint()
      },
      init3DView(modelURLList) {
        return new Promise((resolve, reject) => {
          this.urns = modelURLList
          Autodesk.Viewing.Initializer(this.options, async () => {
            this.element = document.getElementById('viewer-local');
            this.viewer = new Autodesk.Viewing.Private.GuiViewer3D(this.element, this.config);
            this.viewer.addEventListener(
              Autodesk.Viewing.GEOMETRY_LOADED_EVENT,
              this.onLoadedEvent
            );
            // this.viewer.addEventListener(
            //   // Autodesk.Viewing.SELECTION_CHANGED_EVENT,
            //   Autodesk.Viewing.AGGREGATE_SELECTION_CHANGED_EVENT,
            //   this.onSelectionChanged
            // )
            // this.subscribeToAllEvents()
            var startedCode = this.viewer.start();
            if (startedCode > 0) {
              console.error('Failed to create a Viewer: WebGL not supported.');
              return;
            }
            let _Plist = []

            for (var i = 0; i < modelURLList.length; i++) {
              let p = await this.loadModel(modelURLList[i], i)
              _Plist.push(p)

            }
            Promise.all(_Plist).then(result => {
              console.log("Promise.all", result);

              resolve()
            })


          });

        })
      },
      onSelectionChanged(event) {
        // console.log('this.viewer', this.viewer)
        // console.log('event1', event)
        let _selections = event.selections
        console.log('_selections', _selections)


      },
      loadModel(modelURL, index) {
        return new Promise((resolve, reject) => {
          const modelOpts = {
            placementTransform: new THREE.Matrix4(),
            globalOffset: {
              x: 0,
              y: 0,
              z: 0
            }
          };
          console.log('iiiiii', index)
          this.viewer.loadModel(modelURL, modelOpts, resLoadSuccess => {
            if (index === 0) {
              this.viewer.setBackgroundColor(0, 59, 111, 255, 255, 255);
              this.viewer.setGroundShadow(false)
              this.viewer.setReverseZoomDirection(true) //true 滚动向前为放大
              if (!this.viewer.overlays.hasScene('custom-scene')) {
                this.viewer.overlays.addScene('custom-scene');
              }
              // this.saveStatus = JSON.stringify(this.viewer.getState());
              this.addCustomToolBar()
            }
            resolve(index)
          }, this.onLoadError);


        })
      },
      onLoadError(event) {
        console.log('fail');
      },
      addCustomToolBar() {
        // 渐进式显示
        let buttonProgressiveRendering = new Autodesk.Viewing.UI.Button('my-snapshot-button')
        buttonProgressiveRendering.icon.style.backgroundImage = 'url(./static/icon/ico_restoreMarkup.png)' // camera

        // 截屏按钮
        buttonProgressiveRendering.onClick = (e) => {
          // viewer.setViewCube('front')
          // this.snaphot('open')
          this.isProgressiveRendering = !this.isProgressiveRendering
          this.viewer.setProgressiveRendering(this.isProgressiveRendering)
          this.storage[this.storageProgressiveRenderingKey] = this.isProgressiveRendering;

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
        buttonProgressiveRendering.addClass('my-snapshot-button')
        buttonProgressiveRendering.setToolTip('关闭/打开渐进式显示（关闭后拖动和旋转时不闪烁，但可能会影响流畅度）')
        // SubToolbar
        let subToolbar = new Autodesk.Viewing.UI.ControlGroup('my-custom-view-toolbar')
        subToolbar.addControl(buttonProgressiveRendering)
        this.viewer.toolbar.addControl(subToolbar)
      },
      initEvent() {
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
        })
      },
      getModelUrl() {
        let _urlList = []
        this.itemInfoList.forEach(itemInfo => {
          // 服务端地址转换
          // console.log('process.env.BASE_DOMAIN_BIM', process.env.BASE_DOMAIN_BIM)
          // _urlList.push(itemInfo.URL.replace('/www/bim_proj/', process.env.BASE_DOMAIN_BIM_XCX))
          _urlList.push(itemInfo.url.replace('/www/bim_proj/', '').replace('/BCP_FILE/', 'BCP_FILE/'))
          // 本地地址转换
          // _urlList.push(build.ITEM_URL.replace('/www/bim_proj/', '/static/'))
        });
        return _urlList
      },
      getViewpointsById(item_ids) { // 通过视点ID获取视点信息接口
        return new Promise((resolve, reject) => {
          const param = {
            method: 'GetViewPoints',
            project_id: this.project_id,
            id: this.point_view_id

          }
          this.$store.dispatch('GetViewPoints', param).then((infoDataList) => {
            console.log('GetViewpointsById', infoDataList)
            if (infoDataList.length > 0) {
              this.ViewPointInfo = infoDataList[0]
            }
            resolve()
          })
        })
      },

      getItemInfoListByItemIDs(item_ids) {
        // console.log('this.project_id', this.project_id)
        return new Promise((resolve, reject) => {
          const param = {
            method: 'GetItemInfoListByItemIDs',
            project_id: this.project_id,
            item_id: item_ids

          }
          this.$store.dispatch('GetItemInfoListByItemIDs', param).then((_itemList) => {
            this.itemInfoList = _itemList
            console.log('this.itemInfoList', this.itemInfoList)
            resolve()
          })
        })
      },
      // getItemInfoListByProID(file_ids) {
      //   this.itemInfoList = []
      //   return new Promise((resolve, reject) => {
      //     const param = {
      //       method: 'project_items',
      //       project_id: this.project_id
      //       // item_id: item_ids

      //     }
      //     this.$store.dispatch('GetProjectItems', param).then((_itemList) => {
      //       console.log('_itemList_itemList', _itemList)
      //       _itemList.forEach(build => {
      //         file_ids.forEach(file_id => {
      //           if (file_id === build.file_id) {
      //             this.itemInfoList.push(build)
      //           }
      //         })

      //       });
      //       console.log('this.itemInfoList111', this.itemInfoList)
      //       resolve()
      //     })
      //   })
      // },
      initProgressiveRendering() {
        // 初始化设置 渐进式显示
        let storageProgressiveRendering = this.storage[this.storageProgressiveRenderingKey]
        if (storageProgressiveRendering === undefined) {
          this.storage[this.storageProgressiveRenderingKey] = this.isProgressiveRendering;
        }
        console.log('this.storage[storageProgressiveRenderingKey]', this.storage[this
          .storageProgressiveRenderingKey])
        this.viewer.setProgressiveRendering(this.isProgressiveRendering)

      },
      setSelectedObjectColor(cameraInfo) {
        let _objectSetList = cameraInfo.objectSet
        if (_objectSetList !== undefined && _objectSetList.length > 0) {
          _objectSetList.forEach(_objectSet => {
            let objectSetIDs = _objectSet.id
            if (objectSetIDs.length > 0) {
              const buleColor = new THREE.Vector4(0, 0, 255 / 255, 0.6);
              objectSetIDs.forEach(bdid => {
                this.viewer.setThemingColor(bdid, buleColor, this.viewer.model, false)
              })
            }
          })
        }
      },
      //显示视点
      async ShowViewPoint() {
        console.log('this.ViewPointInfo', this.ViewPointInfo)
        this.ViewPointType = this.ViewPointInfo.type
        let cameraInfo = JSON.parse(Base64.decode(this.ViewPointInfo.camera_info))
        if (this.ViewPointType === 1) {

          console.log('cameraInfo', cameraInfo)
          this.viewer.restoreState(cameraInfo); //it fails to restore state

          const genRandom = (min, max) => (Math.random() * (max - min + 1) | 0) + min;
          // 顶部缩略图
          this.viewPointImgTopUrl = this.ViewPointInfo.top_pic === "" ? "" :
            `/api/bim/bcp/thumbnail.jpg?vpid=${this.ViewPointInfo.id}&project_id=${this.project_id}&w=500&t=top&random=${genRandom(1,1000)}`
          // 侧面缩略图
          this.viewPointImgSideUrl = this.ViewPointInfo.side_pic === "" ? "" :
            `/api/bim/bcp/thumbnail.jpg?vpid=${this.ViewPointInfo.id}&project_id=${this.project_id}&w=500&t=side&random=${genRandom(1,1000)}`

          const width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
          const height = (window.innerHeight > 0) ? window.innerHeight : screen.height;
          console.log('width', width, height)
          const _b2 = 120;
          this.$refs.viewPointThumbSideArea.style.bottom = `${_b2}px`;

          console.log('this.$refs.viewPointThumbSideArea.style.bottom', this.$refs.viewPointThumbSideArea.style
            .bottom)
          let picWidth = (width / 10 * 4) >= 300 ? 300 : width / 10 * 4
          let _b1 = _b2 + picWidth * (140 / 205) + 10 // 140/205 = 图片高宽的比例  10：上下两张图的间距 _b2 最下面那张图离bottom距离
          console.log("->", _b1)
          this.$refs.viewPointThumbTopArea.style.bottom = `${_b1}px`;

          if (this.viewPointImgTopUrl !== '') {
            this.showAllViewpointToolBar()
          }

          this.initProgressiveRendering()
          // this.viewer.disableSelection(true)
          this.setSelectedObjectColor(cameraInfo)

        } else {
          this.viewer.loadExtension('Autodesk.Viewing.MarkupsCore').then((markupsExt) => {
            console.log('ViewPointInfo', this.ViewPointInfo)

            this.viewPointTitleName = this.ViewPointInfo.name
            this.markupsExt = this.viewer.getExtension("Autodesk.Viewing.MarkupsCore");
            console.log('this.markupsExt', this.markupsExt)
            this.markupsExt.clear()
            this.markupsExt.leaveEditMode();
            this.markupsExt.hide()

            let _marekup_svg = Base64.decode(this.ViewPointInfo.svg_info)
            console.log('cameraInfo', cameraInfo)
            this.viewer.restoreState(cameraInfo); //it fails to restore state
            this.viewer.setBackgroundColor(0, 59, 111, 255, 255, 255);


          })
          this.initProgressiveRendering()
        }
      }
    }
  }

</script>
