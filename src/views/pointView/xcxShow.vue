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

        viewPointTitleName: '', //标题栏显示的视点名字
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
      // console.log('this', this.project_id, this.point_view_id)
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
        if (this.ViewPointInfo === null) {
          this.tip_message =
            `没有查询到相关视点数据，请核对参数<br/>projectid:${this.project_id}<br/>projectid:${this.point_view_id}<br/>token:${this.access_token}`
          return
        }

        let files_id_list = JSON.parse(this.ViewPointInfo.file_ids)
        console.log('files_id_list', files_id_list)
        await this.getItemInfoListByProID(files_id_list)
        if (this.itemInfoList.length === 0) {
          this.tip_message =
            `没有符合的模型文件<br/>projectid:${this.project_id}<br/>projectid:${this.point_view_id}<br/>token:${this.access_token}`
          return
        }
        let _urlList = this.getModelUrl()
        // console.log('_urlList', _urlList)
        if (_urlList.length !== 0) {
          await this.init3DView(_urlList)

        }

      },
      onLoadedEvent(event) {
        console.log('ononLoadedEvent', event)
        this.ShowViewPoint()
      },
      onSelectionChanged(event) {
        console.log('event1', event)
        let _selections = event.selections
        console.log('_selections', _selections)
        this.selectedDbId = []
        _selections.forEach(selection => {
          let _dbIdArray = selection.dbIdArray
          _dbIdArray.forEach(dbId => {
            console.log('dbId', dbId)
            selection.model.getProperties(dbId,
              (elements) => {
                var dbid = elements.dbId;
                this.selectedDbId.push(dbid)

              })
          })

        })

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
        this.itemInfoList.forEach(itemInfo => {
          // console.log('itemInfo', itemInfo)
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
        this.itemInfoList = []
        return new Promise((resolve, reject) => {
          const param = {
            method: 'project_items',
            project_id: this.project_id
            // item_id: item_ids

          }
          this.$store.dispatch('GetProjectItems', param).then((_itemList) => {
            console.log('_itemList_itemList', _itemList)
            _itemList.forEach(build => {
              file_ids.forEach(file_id => {
                if (file_id === build.file_id) {
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
        this.ViewPointType = this.ViewPointInfo.type
        let camera_info = JSON.parse(Base64.decode(this.ViewPointInfo.camera_info))
        if (this.ViewPointType === 1) {

          console.log('camera_info', camera_info)
          this.viewer.restoreState(camera_info); //it fails to restore state
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
            console.log('camera_info', camera_info)
            this.viewer.restoreState(camera_info); //it fails to restore state
            this.viewer.setBackgroundColor(0, 59, 111, 255, 255, 255);
            setTimeout(() => {
              markupsExt.leaveEditMode();
              markupsExt.show();
              markupsExt.loadMarkups(_marekup_svg, 'markup' + this.ViewPointInfo.id);
              // this.enterMarkerEditMode()
              this.isShowOldViewPoint = true
            }, 1000);

          })
        }



      }
    }
  }

</script>
