<style lang="scss">
  @import "./xcx";

</style>
<template>
  <div class="cad-display-xcx" style="margin: 0px;">
    <div id="viewer-local" v-show="tip_message===''" class="viewer-local"></div>
    <div v-if="tip_message!==''" class="tip_message" v-html="tip_message"></div>
  </div>
</template>

<script>
  import {
    setToken
  } from '@/utils/auth'
  import loadJs from '@/utils/loadJs.js'
  var App;
  export default {
    directives: {},
    name: 'cad-display-xcx',
    components: {},
    data() {
      return {
        access_token: '',
        tip_message: '',
        project_id: '',
        viewer: null, //new Autodesk.Viewing.Private.GuiViewer3D(element, config);
        globalOffset: null,
        urns: [],
        element: null, //document.getElementById('viewer-local');

        itemIDList: [],
        itemInfoList: [],

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
        }

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

      this.itemIDList = [__ITEMS] // 单个 多个则使用 __ITEMS.split('|') 这个模型类型不支持多个
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
        this.tip_message = "正在读取模型数据..."
        await this.loginByXcxToken()
        await this.getProjectFiles(this.itemIDList)
        let _urlList = this.getModelUrl()
        console.log('_urlList', _urlList)
        if (_urlList.length !== 0) {

          this.tip_message = '正在加载模型底层程序...'
          await loadJs(`./static/libs/viewer3D/viewer3D.min.js`)
          console.log('./static/libs/viewer3D/viewer3D.min.js')
          this.tip_message = ""
          await this.init3DView(_urlList)
          //   this.ShowViewPoint()
          console.log('init3DView - complete')
        //   this.initEvent()

          
        } else {
          this.tip_message = '分享的模型已不存在或ID不正确'
        }
      },
      init3DView(modelURLList) {
        return new Promise((resolve, reject) => {
          this.urns = modelURLList
          Autodesk.Viewing.Initializer(this.options, () => {
            this.element = document.getElementById('viewer-local');
            this.viewer = new Autodesk.Viewing.Private.GuiViewer3D(this.element, this.config);
            this.viewer.unloadExtension('Autodesk.FirstPerson')
            var startedCode = this.viewer.start();
            if (startedCode > 0) {
              console.error('Failed to create a Viewer: WebGL not supported.');
              return;
            }
            // viewer.loadModel("https://lmv-models.s3.amazonaws.com/toy_plane/toy_plane.svf", undefined,
            // onLoadSuccess, onLoadError);
            for (var i = 0; i < modelURLList.length; i++) {
              if (i === 0) {
                this.viewer.loadModel(modelURLList[i], undefined, this.onLoadSuccess, this.onLoadError);
              }
            }
            resolve()
            this.viewer.setProgressiveRendering(true)
          });

        })
      },
      onLoadSuccess() {
        let getModels = this.viewer.impl.modelQueue().getModels()
        this.globalOffset = getModels[0].getData().globalOffset; //Get it from first model 
        console.log('globalOffset', this.globalOffset)
        for (let i = 1; i < this.urns.length; i++) {

          let options = {
            globalOffset: this.globalOffset
          }
          this.viewer.loadModel(this.urns[i], options);
        }

        this.viewer.fitToView()

        this.viewer.setBackgroundColor(32, 40, 48, 32, 40, 48);
        // AutoCAD drawings are commonly displayed with white lines on a black background. Setting reverse swaps (just) these two colors.
        this.viewer.setSwapBlackAndWhite(true)
        this.viewer.setReverseZoomDirection(true) //true 滚动向前为放大
        // this.viewer.setDefaultNavigationTool("pan")
        console.log('getDefaultNavigationToolName()', this.viewer.getDefaultNavigationToolName())
        // //锁定所有查看方式
        this.viewer.setNavigationLock(true)
        // When navigation is locked, certain operations (for example, orbit, pan, or fit-to-view) are disabled.
        //只启用平移方式setNavigationLockSettings(settings)
        this.viewer.setNavigationLockSettings({
          "pan": true,
          "zoom": true,
          "roll": true
        })
        console.log('success');
      },
      onLoadError(event) {
        console.log('fail');
      },
      getProjectFiles(item_ids) {
        // console.log('this.project_id', this.project_id)
        return new Promise((resolve, reject) => {
          const param = {
            method: 'project_files',
            project_id: this.project_id,
            file_type: 2,
            file_ids: item_ids

          }
          this.$store.dispatch('GetProjectFiles', param).then((_itemList) => {
            console.log('_itemList_itemList', _itemList)
            _itemList.forEach(build => {
              this.itemInfoList.push(build)
            });
            console.log('this.itemInfoList', this.itemInfoList)
            resolve()
          })
        })
      },
      getModelUrl() {
        let _urlList = []
        this.itemInfoList.forEach(itemInfo => {
          _urlList.push(itemInfo.url.replace('/', ''))
        });
        return _urlList
      },
    }
  }

</script>
