<style lang="scss">
  @import "./xcx";

</style>
<template>
  <div class="model-display-xcx" style="margin: 0px;">
    <div id="viewer-local" v-show="tip_message===''" class="viewer-local"></div>
    <div v-if="tip_message!==''" class="tip_message" v-html="tip_message"></div>
  </div>
</template>

<script>
  import loadJs from '@/utils/loadJs.js'
  import {
    setToken
  } from '@/utils/auth'
  export default {
    directives: {},
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
        // point_view_id: '',
        // ViewPointInfo: null,
        token: '',
        // ViewPointType: 2, //2 普通视点
        // modelData: null,
        // itemList: [],
        itemIDList: [],
        itemInfoList: [],
        // loadingSaveViewPoint: false, // 保存视点按钮加载
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
        // MarkupsCore: null,
        // isShowToolbarMarker: false, //视点黑色工具条
        // isShowToolbarMarkerStyle: false, // 视点编辑工具条
        // isShowToolbarRestore: false,
        // isShowToolbarRestore2: false,
        // isShowViewPointArea: false,
        // isShowViewPointThumbArea: false, // 缩略图
        // isShowSaveMarkerArea: false, // 保存视点区域
        // markupsPersist: null,
        // viewerStatePersist: null,
        // nsu: null,
        // styleAttributes: ['stroke-width', 'stroke-color', 'stroke-opacity', 'stroke-linejoin', 'font-family',
        //   'font-style', 'fill-opacity', 'font-size'
        // ],
        // styleObject: null,
        // markerStyle: {
        //   strokeColor: '#FF0000',
        //   strokeWidth: 1,
        //   fontSize: 12
        // },
        saveStatus: null,
        // saveMarkupStatus: null,
        // saveMarkupData: null,
        // startedRotate: false,
        // viewPointName: '', // 视点的标题
        // viewPointTitleName: '', //标题栏显示的视点名字
        // viewPointImgUrl: '',
        // isShowOldViewPoint: false //是否显示的是老的视点
        storage: window.localStorage,
        storageProgressiveRenderingKey: 'Autodesk.Viewing.Private.GuiViewer3D.SavedSettings.progressiveRendering',
        isProgressiveRendering: false, // 模型是否重新渲染，闪烁  又叫渐进式显示 设置中有这个选项
        totalLowFps: 0, // 低速fps累计量
        FPS_LOW_LEVEL: 8, // 低于祯数 为慢
        FPS_HIGH_LEVEL: 15, // 高于祯数 为快
        FPS_LOW_TIMES: 30, // 低速fps累计次数
      }
    },
    computed: {

    },
    created() {

    },
    watch: {

    },
    mounted() {
      
      console.log('this.$route', this.$route.query)

      const __PROJECT_ID = this.$route.query.projectid
      const __ITEMS = this.$route.query.items
      const __ERROR_MESSAGE = this.$route.query.errormsg
      this.access_token = this.$route.query.token
      if (__PROJECT_ID === undefined || __PROJECT_ID === '') {
        this.tip_message = '缺少参数 projectid'
        return
      } else if (__ITEMS === undefined || __ITEMS === '') {
        this.tip_message = '缺少参数 items'
        return
      } else if (this.access_token === undefined || this.access_token === '') {
        this.tip_message = '缺少参数 token'
        return
      }

      console.log('__ERROR_MESSAGE', __ERROR_MESSAGE)

      if (__ERROR_MESSAGE !== undefined && __ERROR_MESSAGE !== '') {
        this.tip_message = __ERROR_MESSAGE + '<br/>' + this.access_token
        return
      }

      this.project_id = parseInt(__PROJECT_ID)
      //   this.point_view_id = parseInt(__POINT_VIEW_ID)
      //   console.log('this', this.project_id, this.point_view_id)
      // await this.getViewpointsById()
      // this.ShowViewPoint()
      //   console.log('__ITEMS', 
      this.itemIDList = __ITEMS.split('|')
      this.init()

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
      async init() {
        await this.loginByXcxToken()


        this.tip_message = "正在读取模型数据..."
        await this.getItemInfoListByItemIDs(this.itemIDList.join(','))
        if (this.itemInfoList.length === 0) {
          this.tip_message =
            `没有查询到相关模型数据，请核对参数<br/>projectid:${this.project_id}<br/>items:${this.itemIDList.join('|')}<br/>token:${this.access_token}`
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
          //   this.ShowViewPoint()
          console.log('init3DView - complete')
          this.initEvent()
        }

      },
      init3DView(modelURLList) {
        return new Promise((resolve, reject) => {
          this.urns = modelURLList
          Autodesk.Viewing.Initializer(this.options, async () => {
            this.element = document.getElementById('viewer-local');
            this.viewer = new Autodesk.Viewing.Private.GuiViewer3D(this.element, this.config);
            // this.subscribeToAllEvents()
            var startedCode = this.viewer.start();
            if (startedCode > 0) {
              console.error('Failed to create a Viewer: WebGL not supported.');
              return;
            }
            let _Plist = []
            // viewer.loadModel("https://lmv-models.s3.amazonaws.com/toy_plane/toy_plane.svf", undefined,
            // onLoadSuccess, onLoadError);
            for (var i = 0; i < modelURLList.length; i++) {
              let p = await this.loadModel(modelURLList[i], i)
              _Plist.push(p)

            }
            Promise.all(_Plist).then(result => {
              console.log("Promise.all", result);
              // _viewPointList.forEach(itemList => {
              //   this.viewPointAllList = [...this.viewPointAllList, ...itemList]
              // })
              resolve()
              // console.log("this.viewPointAllList", this.viewPointAllList);
            })

            // 初始化设置 渐进式显示
            let storageProgressiveRendering = this.storage[this.storageProgressiveRenderingKey]
            if (storageProgressiveRendering === undefined) {
              this.storage[this.storageProgressiveRenderingKey] = this.isProgressiveRendering;
            }
            console.log('this.storage[storageProgressiveRenderingKey]', this.storage[this
              .storageProgressiveRenderingKey])
            this.viewer.setProgressiveRendering(this.isProgressiveRendering)
          });

        })
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
              //unloadModel(model)
              if (!this.viewer.overlays.hasScene('custom-scene')) {
                this.viewer.overlays.addScene('custom-scene');
              }
              this.saveStatus = JSON.stringify(this.viewer.getState());
              this.addCustomToolBar()
              // this.addViewpointToolBar()
            }
            resolve(index)
          }, this.onLoadError);


        })
      },
      onLoadError(event) {
        console.log('fail');
      },
      getModelUrl() {
        let _urlList = []
        // console.log('this.project_id', this.project_id)
        // console.log('this.itemInfoList', this.itemInfoList)
        this.itemInfoList.forEach(itemInfo => {
          // console.log('itemInfo', itemInfo)
          // 服务端地址转换
          // console.log('process.env.BASE_DOMAIN_BIM', process.env.BASE_DOMAIN_BIM)
          // _urlList.push(itemInfo.URL.replace('/www/bim_proj/', process.env.BASE_DOMAIN_BIM_XCX))
          _urlList.push(itemInfo.url.replace('/www/bim_proj/', ''))
          // 本地地址转换
          // _urlList.push(build.ITEM_URL.replace('/www/bim_proj/', '/static/'))
        });
        return _urlList
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
            console.log('_itemList_itemList', _itemList)
            _itemList.forEach(build => {
              this.itemInfoList.push(build)
            });
            console.log('this.itemInfoList', this.itemInfoList)
            resolve()
          })
        })
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
    }
  }

</script>
