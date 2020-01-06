<style lang="scss">
  @import "./xcxShow";

</style>
<template>
  <div class="pointview-xcx-show" style="margin: 0px;">
    <div v-if="tip_message!==''" class="not-allow-now" v-html="tip_message"></div>
    <div id="viewer-local"></div>
    <div style="width:100vw; height:100vh;display:none;top:0px;left:0px;">
      <canvas id="snapshot" style="position:absolute;"></canvas>
    </div>
    <div v-if="isShowViewPointArea" class="viewPointShowArea">
      <div class="viewPointTitle">
        <div class="title">
          <span v-if="ViewPointType===2">普通视点</span>
          <span v-if="ViewPointType===1">标定项目位置标准视点</span>
          <span v-show="viewPointTitleName!==''">> {{viewPointTitleName}}</span> </div>
      </div>
      <!-- <img v-bind:src="viewPointImgUrl" class="viewPointImg" /> -->
    </div>
  </div>
</template>

<script>
  // let element = null; // document.getElementById('viewer-local');
  // let viewer = null; //new Autodesk.Viewing.Private.GuiViewer3D(element, config);
  import {
    setToken
  } from '@/utils/auth'
  import Cookies from 'js-cookie'
  let Base64 = require('js-base64').Base64
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
        point_view_id: '',
        ViewPointInfo: null,
        token: '',
        ViewPointType: 2, //2 普通视点
        modelData: null,
        itemList: [],
        itemInfoList: [],
        loadingSaveViewPoint: false, // 保存视点按钮加载
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
        MarkupsCore: null,
        isShowToolbarMarker: false, //视点黑色工具条
        isShowToolbarMarkerStyle: false, // 视点编辑工具条
        isShowToolbarRestore: false,
        isShowToolbarRestore2: false,
        isShowViewPointArea: false,
        isShowViewPointThumbArea: false, // 缩略图
        isShowSaveMarkerArea: false, // 保存视点区域
        markupsPersist: null,
        viewerStatePersist: null,
        nsu: null,
        styleAttributes: ['stroke-width', 'stroke-color', 'stroke-opacity', 'stroke-linejoin', 'font-family',
          'font-style', 'fill-opacity', 'font-size'
        ],
        styleObject: null,
        markerStyle: {
          strokeColor: '#FF0000',
          strokeWidth: 1,
          fontSize: 12
        },
        saveStatus: null,
        saveMarkupStatus: null,
        saveMarkupData: null,
        startedRotate: false,
        viewPointName: '', // 视点的标题
        viewPointTitleName: '', //标题栏显示的视点名字
        viewPointImgUrl: '',
        isShowOldViewPoint: false //是否显示的是老的视点
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
      const __POINT_VIEW_ID = this.$route.query.pvid
      this.access_token = this.$route.query.token
      if (__PROJECT_ID === undefined || __PROJECT_ID === '') {
        this.tip_message = '缺少参数 projectid'
        return
      } else if (__POINT_VIEW_ID === undefined || __POINT_VIEW_ID === '') {
        this.tip_message = '缺少参数 pvid'
        return
      } else if (this.access_token === undefined || this.access_token === '') {
        this.tip_message = '缺少参数 token'
        return
      }

      this.project_id = parseInt(__PROJECT_ID)
      this.point_view_id = parseInt(__POINT_VIEW_ID)
      console.log('this', this.project_id, this.point_view_id)
      // await this.getViewpointsById()
      // this.ShowViewPoint()

      
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
        await this.getViewpointsById()

        let files_id_list = JSON.parse(this.ViewPointInfo.FILE_IDS)
        console.log('files_id_list', files_id_list)
        await this.getItemInfoListByProID(files_id_list)

        let _urlList = this.getModelUrl()
        // console.log('_urlList', _urlList)
        if (_urlList.length !== 0) {
          await this.init3DView(_urlList)
          this.ShowViewPoint()
          console.log('init3DView - complete')
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
              // this.addCustomToolBar()
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
          _urlList.push(itemInfo.URL.replace('/www/bim_proj/', process.env.BASE_DOMAIN_BIM))
          // 本地地址转换
          // _urlList.push(build.ITEM_URL.replace('/www/bim_proj/', '/static/'))
        });
        return _urlList
      },
      getViewpointsById(item_ids) { // 通过视点ID获取视点信息接口
        // console.log('this.project_id', this.project_id)
        return new Promise((resolve, reject) => {
          const param = {
            method: 'GetViewpointsById',
            // project_id: this.project_id,
            id: this.point_view_id

          }
          this.$store.dispatch('GetViewpointsById', param).then((infoDataList) => {
            console.log('GetViewpointsById', infoDataList)
            if (infoDataList.length > 0) {
              this.ViewPointInfo = infoDataList[0]
            }
            resolve()
          })
        })
      },

      // getItemInfoListByItemIDs(item_ids) {
      //   // console.log('this.project_id', this.project_id)
      //   return new Promise((resolve, reject) => {
      //     const param = {
      //       method: 'GetItemInfoListByItemIDs',
      //       // project_id: this.project_id,
      //       item_id: item_ids

      //     }
      //     this.$store.dispatch('GetItemInfoListByItemIDs', param).then((_itemList) => {
      //       console.log('_itemList_itemList', _itemList)
      //       _itemList.forEach(build => {
      //         this.itemList.forEach(item => {
      //           if (item.FILE_ID === build.FILE_ID) {
      //             this.itemInfoList.push(build)
      //           }
      //         })

      //       });
      //       console.log('this.itemInfoList', this.itemInfoList)
      //       resolve()
      //     })
      //   })
      // },
      getItemInfoListByProID(file_ids) {
        // console.log('this.project_id', this.project_id)
        this.itemInfoList = []
        return new Promise((resolve, reject) => {
          const param = {
            method: 'GetItemInfoListByProID',
            project_id: this.project_id
            // item_id: item_ids

          }
          this.$store.dispatch('GetItemInfoListByProID', param).then((_itemList) => {
            console.log('_itemList_itemList', _itemList)
            _itemList.forEach(build => {
              file_ids.forEach(file_id => {
                if (file_id === build.FILE_ID) {
                  this.itemInfoList.push(build)
                }
              })

            });
            console.log('this.itemInfoList111', this.itemInfoList)
            resolve()
          })
        })
      },
      //显示视点
      async ShowViewPoint() {
        console.log('ShowViewPoint', this.ViewPointCurrentShow)
        console.log('this.ViewPointInfo', this.ViewPointInfo)
        this.viewer.loadExtension('Autodesk.Viewing.MarkupsCore').then((markupsExt) => {
          this.isShowToolbarMarker = false
          this.isShowToolbarMarkerStyle = false
          this.isShowViewPointArea = true
          console.log('ViewPointInfo', this.ViewPointInfo)
          this.ViewPointType = this.ViewPointInfo.TYPE
          this.viewPointTitleName = this.ViewPointInfo.NAME
          this.markupsExt = this.viewer.getExtension("Autodesk.Viewing.MarkupsCore");
          console.log('this.markupsExt', this.markupsExt)
          // markupsExt.deleteMarkup()
          this.markupsExt.clear()
          this.markupsExt.leaveEditMode();
          this.markupsExt.hide()
          this.isShowToolbarRestore = false
          this.isShowToolbarRestore2 = false
          this.isShowViewPointThumbArea = false
          this.isShowSaveMarkerArea = false

          let _marekup_svg = Base64.decode(this.ViewPointInfo.SVG)
          let camera_info = JSON.parse(Base64.decode(this.ViewPointInfo.CAMERA_INFO))
          // let picBase64 = picture_info.base64
          this.viewPointImgUrl = this.ViewPointInfo.pictureFullSrc
          console.log('camera_info', camera_info)
          this.viewer.restoreState(camera_info); //it fails to restore state
          // markupsExt.viewer.impl.invalidate(true);
          this.isShowToolbarRestore = true
          this.viewer.setBackgroundColor(0, 59, 111, 255, 255, 255);
          setTimeout(() => {
            markupsExt.leaveEditMode();
            markupsExt.show();
            markupsExt.loadMarkups(_marekup_svg, 'markup' + this.ViewPointInfo.ID);
            // this.enterMarkerEditMode()
            this.isShowOldViewPoint = true
          }, 1000);
        })
      }
    }
  }

</script>
