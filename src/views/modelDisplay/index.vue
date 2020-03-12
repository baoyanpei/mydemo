<style lang="scss">
  @import "./index";

</style>
<template>
  <div id="model-display-index" class="model-display-index" style="margin: 0px;">
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
        <el-button type="danger" class="btn-close-view-point" @click="exitRestoreHandle" size="small"
          style="width:130px;">
          <font-awesome-icon icon="times-circle" style="font-size: 12px;" />&nbsp;&nbsp;&nbsp;&nbsp;关&nbsp;&nbsp;&nbsp;闭
        </el-button>
      </div>
      <!-- <img v-bind:src="viewPointImgUrl" class="viewPointImg" /> -->
    </div>

    <div v-if="isShowViewPointArea" class="viewPointTypeArea">
      <font-awesome-icon :icon="['far','bell']" class="iconBell" />
      <span v-if="ViewPointType===2"> 普通视点标注模式</span>
      <span v-if="ViewPointType===1"> 标定项目位置标准视点</span>
    </div>
    <div v-show="isShowViewPointThumbArea" class="viewPointThumbArea" v-drag draggable="true">
      <div class="title">原始视角</div>
      <img v-bind:src="viewPointImgUrl" class="viewPointImg" />
    </div>
    <div v-if="isShowToolbarRestore" class="toolbar-restore">
      <!-- <el-button class="marker-button" title="退出标注">
          <font-awesome-icon icon="sign-out-alt" @click="exitRestoreHandle" />
        </el-button> -->
      <el-button class="marker-button" title="调整视点">
        <font-awesome-icon icon="sync-alt" @click="backToModelModeHandle" />
      </el-button>
      <el-button class="marker-button" title="重新打标">
        <font-awesome-icon icon="marker" @click="enterReMarkerEditMode" />
      </el-button>
    </div>

    <div v-if="isShowToolbarRestore2" class="toolbar-restore2">
      <el-button class="marker-button" title="重新打标">
        <font-awesome-icon icon="marker" @click="enterReMarkerEditMode" />
      </el-button>
    </div>

    <div v-if="isShowToolbarMarker" class="toolbar-marker">
      <el-button class="marker-button" title="新增当前视点">
        <font-awesome-icon :icon="['far','plus-square']" @click="showSaveViewsPointHandle(1)" />
      </el-button>
      <el-button class="marker-button" title="保存当前视点">
        <font-awesome-icon v-if="isSaveViewValid === true" :icon="['far','save']"
          @click="showSaveViewsPointHandle(0)" />
        <font-awesome-icon v-if="isSaveViewValid === false" style="color:grey;" :icon="['far','save']" />
      </el-button>
      <hr />
      <div v-if="ViewPointType === 2">
        <el-button class="marker-button" title="旋转模型">
          <font-awesome-icon icon="sync-alt" @click="exitMarkerHandle" />
        </el-button>
        <hr />
        <el-button class="marker-button" title="矩形">
          <font-awesome-icon :icon="['far','square']" @click="clickMarkerModeHandle('Rectangle')" />
        </el-button>
        <el-button class="marker-button" title="圆形">
          <font-awesome-icon :icon="['far','circle']" @click="clickMarkerModeHandle('Circle')" />
        </el-button>
        <el-button class="marker-button" title="箭头">
          <font-awesome-icon icon="long-arrow-alt-up" @click="clickMarkerModeHandle('Arrow')" />
        </el-button>
        <el-button class="marker-button" title="铅笔">
          <font-awesome-icon icon="signature" @click="clickMarkerModeHandle('Freehand')" />
        </el-button>
        <el-button class="marker-button" title="文字">
          <font-awesome-icon icon="font" @click="clickMarkerModeHandle('Text')" />
        </el-button>
        <hr />
      </div>

      <!-- <el-button class="marker-button" title="云边框">
          <font-awesome-icon icon="cloud" @click="clickMarkerModeHandle('Cloud')" style="font-size: 20px;" />
        </el-button> -->

      <!-- <el-button class="marker-button" title="荧光笔">
          <font-awesome-icon icon="highlighter" @click="clickMarkerModeHandle('Highlight')" />
        </el-button> -->
      <!-- <el-button class="marker-button" title="折线">
          <font-awesome-icon icon="draw-polygon" @click="clickMarkerModeHandle('Polyline')" />
        </el-button> -->
      <!-- <el-button class="marker-button" title="波浪折线">
          <font-awesome-icon icon="highlighter" @click="clickMarkerModeHandle('Polycloud')" />
        </el-button> -->

      <!-- <hr /> -->
      <!-- <el-button class="marker-button" title="截图">
          <font-awesome-icon icon="camera-retro" @click="snaphot('open')" />
        </el-button>
        <el-button class="marker-button" title="下载截图">
          <font-awesome-icon icon="download" @click="snaphot('download')" />
        </el-button> -->


      <el-button class="marker-button" title="视点管理">
        <font-awesome-icon icon="layer-group" @click="openViewPointManageHandle" />
      </el-button>


    </div>

    <markupTools ref="MarkupTools" v-show="isShowToolbarMarkerStyle" v-on:setMarkerMode="setMarkerMode"
      v-on:setMarkerStyle="setMarkerStyle">
    </markupTools>
  </div>
</template>

<script>
  // let element = null; // document.getElementById('viewer-local');
  // let viewer = null; //new Autodesk.Viewing.Private.GuiViewer3D(element, config);
  import markupTools from './components/markupTools'
  import Cookies from 'js-cookie'
  import lodash from 'lodash'
  let Base64 = require('js-base64').Base64
  export default {
    directives: {
      drag(el) {
        let oDiv = el; //当前元素
        let self = this; //上下文
        //禁止选择网页上的文字
        document.onselectstart = function () {
          return false;
        };
        oDiv.onmousedown = function (e) {
          //鼠标按下，计算当前元素距离可视区的距离
          let disX = e.clientX - oDiv.offsetLeft;
          let disY = e.clientY - oDiv.offsetTop;
          document.onmousemove = function (e) {
            //通过事件委托，计算移动的距离
            let l = e.clientX - disX;
            let t = e.clientY - disY;
            //移动当前元素
            oDiv.style.left = l + "px";
            oDiv.style.top = t + "px";
          }
          document.onmouseup = function (e) {
            document.onmousemove = null;
            document.onmouseup = null;
          };
          //return false不加的话可能导致黏连，就是拖到一个地方时div粘在鼠标上不下来，相当于onmouseup失效
          return false;
        };
      }

    },
    name: 'model-display-index',
    components: {
      markupTools
      // TreeArea,
      // ModelDetail
    },
    data() {
      return {
        viewer: null, //new Autodesk.Viewing.Private.GuiViewer3D(element, config);
        globalOffset: null,
        urns: [],
        element: null, //document.getElementById('viewer-local');
        project_id: '',
        token: '',
        ViewPointType: 2, //2 普通视点
        modelData: null,
        itemList: [],
        itemCurrentFileIdList: [], //当前显示模型的FILE
        itemCurrentItemIdList: [],
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
        // isShowSaveMarkerArea: false, // 保存视点区域
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
        // viewPointName: '', // 视点的标题
        viewPointTitleName: '', //标题栏显示的视点名字
        viewPointImgUrl: '',
        isShowOldViewPoint: false, //是否显示的是老的视点
        isSaveViewValid: false, // 保存视点的按钮是否有效
        selectedDbId: [], // 选择的构件id
        ViewPointCurrentData: null, // 当前获取的视点数据
        ControlGroupViewPoint: null, // 视点工具条的index
        ControlGroupShowAllViewPoint: null, // 视点工具条的index
        loadedModels: [],
        phereMesh1: null,
        aaacolor: 0x000000
      }
    },
    computed: {
      ViewPointCurrentShow() { // 视角列表选择的结果
        return this.$store.state.viewPoint.ViewPointCurrentShow
      },
      personInfo() {
        return this.$store.state.person.personInfo
      }

    },
    created() {

    },
    watch: {
      ViewPointCurrentShow: { // 视角列表选择的结果发生改变
        handler: function (newVal, oldVal) {
          console.info('value changed ', newVal)
          this.ViewPointCurrentData = newVal
          this.ShowViewPoint()
          // if (newVal === true) {
          // this.initData()
          // this.getPersonInfo()
          // }

        },
        deep: true
      },
    },
    mounted() {
      const __PROJECT_ID = Cookies.get("PROJECT_ID")
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
          this.itemCurrentFileIdList.push(item.FILE_ID)
          this.itemCurrentItemIdList.push(item.ITEM_ID)
        })
        // console.log('itemIDList', itemIDList, itemIDList.join(','))
        await this.getItemInfoListByItemIDs(itemIDList.join(','))
        await this.getUrlAndInitView()
        

      },
      async getUrlAndInitView() {
        return new Promise(async (resolve, reject) => {
          let _result = this.getModelUrl()
          // console.log('_result', _result)
          let _urlList = _result['urlList']
          let _itemInfoList = _result['itemInfoList']
          if (_urlList.length !== 0) {
            this.loadedModels = []
            // console.log('_result123 _itemInfoList', _itemInfoList)
            _itemInfoList.forEach(itemInfo => {
              if (itemInfo.item_id === undefined) {
                itemInfo['item_id'] = itemInfo.id
              }
            })

            await this.init3DView(_urlList, _itemInfoList)
            // console.log('init3DView - complete')
            this.viewer.addEventListener(
              // Autodesk.Viewing.SELECTION_CHANGED_EVENT,
              Autodesk.Viewing.AGGREGATE_SELECTION_CHANGED_EVENT,
              this.onSelectionChanged
            );
            this.initEvent()
          }
          resolve()
        })
      },
      init3DView(modelURLList, itemInfoList) {
        return new Promise((resolve, reject) => {
          // this.urns = modelURLList
          Autodesk.Viewing.Initializer(this.options, async () => {
            this.element = document.getElementById('viewer-local');
            this.viewer = new Autodesk.Viewing.Private.GuiViewer3D(this.element, this.config);
            // this.subscribeToAllEvents()
            this.viewer.addEventListener(
              // Autodesk.Viewing.SELECTION_CHANGED_EVENT,

              Autodesk.Viewing.GEOMETRY_LOADED_EVENT,
              this.onLoadedEvent
            );
            var startedCode = this.viewer.start();
            if (startedCode > 0) {
              console.error('Failed to create a Viewer: WebGL not supported.');
              return;
            }
            let _Plist = []
            // viewer.loadModel("https://lmv-models.s3.amazonaws.com/toy_plane/toy_plane.svf", undefined,
            // onLoadSuccess, onLoadError);
            for (var i = 0; i < modelURLList.length; i++) {
              let p = await this.loadModel(modelURLList[i], itemInfoList[i], i)
              _Plist.push(p)

            }
            Promise.all(_Plist).then(result => {
              // console.log("Promise.all", result);
              // _viewPointList.forEach(itemList => {
              //   this.viewPointAllList = [...this.viewPointAllList, ...itemList]
              // })
              resolve()
              // console.log("this.viewPointAllList", this.viewPointAllList);
            })
          });

        })
      },
      onLoadedEvent() {
        console.log('ononLoadedEvent', event)
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
          };
          // console.log('iiiiii', index, modelURL)
          this.viewer.loadModel(modelURL, modelOpts, (model) => {
            // console.log('itemInfoitemInfoitemInfo', itemInfo)
            model['item_id'] = itemInfo.item_id
            this.loadedModels.push(model)
            // console.log('this.viewer', this.viewer)
            // console.log('model', model)
            // this.viewer.addEventListener(
            //   Autodesk.Viewing.AGGREGATE_SELECTION_CHANGED_EVENT,
            //   this.onSelectionChanged
            // );
            if (index === 0) {
              this.viewer.setBackgroundColor(0, 59, 111, 255, 255, 255);
              this.viewer.setGroundShadow(false)
              this.viewer.setReverseZoomDirection(true) //true 滚动向前为放大
              //unloadModel(model)
              if (!this.viewer.overlays.hasScene('custom-scene-1')) {
                this.viewer.overlays.addScene('custom-scene-1');
              }
              this.saveStatus = JSON.stringify(this.viewer.getState());
              this.addCustomToolBar()
              this.addViewpointToolBar()
              this.showAllViewpointToolBar()
            }
            resolve(index)
          }, this.onLoadError);


        })
      },
      addCustomToolBar() {
        // 分享按钮
        let buttonShare = new Autodesk.Viewing.UI.Button('my-share-button')
        buttonShare.icon.style.backgroundImage = 'url(./static/icon/share.png)'


        buttonShare.onClick = (e) => {
          // viewer.setViewCube('front')
          const param = {
            show: true,
            modelData: this.modelData,
            project_id: this.project_id,
            share_show_path: 'model/share',
            share_type: 'rvt'
          }
          // this.$store.dispatch('SetVideoDialog', param).then(() => {}).catch(() => {})
          this.$store.dispatch('SetShareDialog', param).then(() => {}).catch(() => {})
        }
        buttonShare.addClass('my-share-button')
        buttonShare.setToolTip('分享')


        // 恢复标注功能
        let buttonRestoreMarker = new Autodesk.Viewing.UI.Button('my-restore-marker-button')
        buttonRestoreMarker.icon.style.backgroundImage = 'url(./static/icon/ico_restoreMarkup.png)'

        buttonRestoreMarker.onClick = (e) => {
          // viewer.setViewCube('front')
          this.restoreMarkups()
        }
        buttonRestoreMarker.addClass('my-restore-marker-button')
        buttonRestoreMarker.setToolTip('恢复标注')

        // 截屏
        let buttonSnapshot = new Autodesk.Viewing.UI.Button('my-snapshot-button')
        buttonSnapshot.icon.style.backgroundImage = 'url(./static/icon/camera.jpg)'

        // 截屏按钮
        buttonSnapshot.onClick = (e) => {
          // viewer.setViewCube('front')
          this.snaphot('open')
        }
        buttonSnapshot.addClass('my-snapshot-button')
        buttonSnapshot.setToolTip('截屏')

        // SubToolbar
        /*
        let subToolbar = new Autodesk.Viewing.UI.ControlGroup('my-custom-view-toolbar')
        subToolbar.addControl(buttonShare)
        */

        // subToolbar.addControl(buttonRestoreMarker)

        // subToolbar.addControl(buttonSnapshot)


        // Add subToolbar to main toolbar
        // this.viewer.toolbar.addControl(subToolbar)
      },
      addViewpointToolBar() {

        // 标注功能 - 普通标注视点
        let buttonMarker = new Autodesk.Viewing.UI.Button('my-marker-button')
        buttonMarker.icon.style.backgroundImage = 'url(./static/icon/ico_marker.png)'

        buttonMarker.onClick = (e) => {
          // viewer.setViewCube('front')
          this.isSaveViewValid = false
          // this.viewer.toolbar.setVisible(false)
          this.viewer.toolbar.removeControl(this.ControlGroupViewPoint)
          this.viewer.toolbar.removeControl(this.ControlGroupShowAllViewPoint)
          this.viewer.overlays.removeScene('custom-scene-2');
          this.enterMarkerEditMode(2)
        }
        buttonMarker.addClass('my-marker-button')
        buttonMarker.setToolTip('普通标注视点')

        // 标注功能 - 标定项目位置标准视点
        let buttonMarker2 = new Autodesk.Viewing.UI.Button('my-marker2-button')
        buttonMarker2.addClass('my-marker2-button')

        // console.log("this.itemList.length", this.itemList.length)
        if (this.itemList.length === 1) {
          buttonMarker2.icon.style.backgroundImage = 'url(./static/icon/ico_markup.png)'
          buttonMarker2.onClick = (e) => {
            // viewer.setViewCube('front')
            // this.viewer.toolbar.setVisible(false)
            this.viewer.toolbar.removeControl(this.ControlGroupViewPoint)
            this.viewer.toolbar.removeControl(this.ControlGroupShowAllViewPoint)
            this.viewer.overlays.removeScene('custom-scene-2');
            this.isSaveViewValid = false
            this.enterMarkerEditMode(1)
          }
          buttonMarker2.setToolTip('标定项目位置标准视点')
        } else {
          buttonMarker2.icon.style.backgroundImage = 'url(./static/icon/ico_markup_grey.png)'
          buttonMarker2.setToolTip('合并模型不能进行位置标注')
        }





        // 视点管理功能
        let buttonViewPoint = new Autodesk.Viewing.UI.Button('my-marker-manager-button')
        buttonViewPoint.icon.style.backgroundImage = 'url(./static/icon/ico_layer3.png)'

        buttonViewPoint.onClick = (e) => {
          // viewer.setViewCube('front')
          this.openViewPointManageHandle()
        }
        buttonViewPoint.addClass('my-marker-manager-button')
        buttonViewPoint.setToolTip('视点管理')

        // SubToolbar
        this.ControlGroupViewPoint = new Autodesk.Viewing.UI.ControlGroup('my-view-point-toolbar')
        this.ControlGroupViewPoint.addControl(buttonMarker)
        this.ControlGroupViewPoint.addControl(buttonMarker2)
        this.ControlGroupViewPoint.addControl(buttonViewPoint)

        // Add subToolbar to main toolbar
        this.viewer.toolbar.addControl(this.ControlGroupViewPoint)

      },
      showAllViewpointToolBar() {
        // this.viewer.setGhosting(0.2)
        // this.viewer.setDisplayEdges(false)
        // 查看所有标注点
        let buttonMarker = new Autodesk.Viewing.UI.Button('show-view-point-button')
        buttonMarker.icon.style.backgroundImage = 'url(./static/icon/ico_show_all_view_points.png)'
        buttonMarker.onClick = (e) => {
          // var geom = new THREE.SphereGeometry(10, 10, 10);
          // var material = new THREE.MeshBasicMaterial({
          //   color: 0x0000FF
          // });
          // this.phereMesh1 = new THREE.Mesh(geom, material);
          // this.phereMesh1.position.set(0, 0, 0);
          // if (!this.viewer.overlays.hasScene('custom-scene-1')) {
          //   this.viewer.overlays.addScene('custom-scene-1');
          // }
          // this.viewer.overlays.addMesh(this.phereMesh1, 'custom-scene-1');


          // window.requestAnimationFrame(this.draw1, 1505);
          this.clearAllViewPointMarkrt()
          this.ShowViewPointMarkerAll()
          // console.log()
          // this.viewer.impl.isolate(-1);
          // this.viewer.isolate(-1);
          // console.log(this.viewer.model)
          // console.log()
          // this.viewer.impl.visibilityManager.isolate(idArray, this.loadedModels[0]);
          // 所有model都虚化显示
          /*
          let red = new THREE.Vector4(1, 0, 0, 1);
          this.loadedModels.forEach(model => {
            this.viewer.impl.visibilityManager.isolate(idArray, model);
            // idArray.forEach(id => {
            //   this.viewer.impl.visibilityManager.show(id, model);
            //   this.viewer.setThemingColor(id, red, model);
            // })
          })
          */
          // this.viewer.select(idArray)
        }
        buttonMarker.addClass('show-view-point-button')
        buttonMarker.setToolTip('查看所有标注点')

        let buttonTaskMarker = new Autodesk.Viewing.UI.Button('show-view-point-task-button')
        buttonTaskMarker.icon.style.backgroundImage = 'url(./static/icon/ico_viewpoint_task.png)'
        buttonTaskMarker.onClick = (e) => {
          this.clearAllViewPointMarkrt()
          this.ShowViewPointTaskMarker()
        }
        buttonTaskMarker.addClass('show-view-point-task-button')
        buttonTaskMarker.setToolTip('查看有任务的视点')

        // 关闭所有标注点
        let buttonCloseAllViewPoint = new Autodesk.Viewing.UI.Button('my-marker-manager-button')
        buttonCloseAllViewPoint.icon.style.backgroundImage = 'url(./static/icon/ico_show_all_view_points_x1.png)'

        buttonCloseAllViewPoint.onClick = (e) => {
          this.clearAllViewPointMarkrt()
        }
        buttonCloseAllViewPoint.addClass('my-marker-manager-button')
        buttonCloseAllViewPoint.setToolTip('关闭所有标注点')

        this.ControlGroupShowAllViewPoint = new Autodesk.Viewing.UI.ControlGroup('show-view-point-toolbar')
        this.ControlGroupShowAllViewPoint.addControl(buttonMarker)
        this.ControlGroupShowAllViewPoint.addControl(buttonTaskMarker)
        this.ControlGroupShowAllViewPoint.addControl(buttonCloseAllViewPoint)



        this.viewer.toolbar.addControl(this.ControlGroupShowAllViewPoint)
      },
      resetIsolateMode() {
        // viewer.setViewCube('front')
        this.loadedModels.map(model => this.viewer.clearThemingColors(model));
        this.viewer.impl.visibilityManager.aggregateIsolate([]);
        $(".mymlLabel").remove()
      },
      initEvent() {
        this.viewer.addEventListener(Autodesk.Viewing.CAMERA_CHANGE_EVENT, (rt) => {

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
      },
      GetViewpointsDataAll() {
        return new Promise((resolve, reject) => {
          let _itemInfoList = this.itemInfoList
          let reqList = []
          let viewPointAllList = []
          for (const item of _itemInfoList) {
            // console.log('item', item)
            let p = this.GetViewpointsByFileId(item)
            reqList.push(p)
          }
          Promise.all(reqList).then(_viewPointList => {
            // console.log("Promise.all", _viewPointList);
            _viewPointList.forEach(itemList => {
              viewPointAllList = [...viewPointAllList, ...itemList]
            })
            // 去处视点列表中'FILE_IDS'和'ID'重复的数据 
            viewPointAllList = lodash.unionBy(viewPointAllList, 'file_ids', 'id')
            resolve(viewPointAllList)
            // console.log("viewPointAllList", viewPointAllList);
          })
        })

      },
      GetViewpointsByFileId(item) {
        return new Promise((resolve, reject) => {
          const param = {
            method: 'GetViewpointsByFileId',
            file_id: item.file_id,
            project_id: this.project_id
          }
          this.$store.dispatch('GetViewpointsByFileId', param).then((_viewPointList) => {
            // console.log('GetViewpointsByFileId - _viewPointList', _viewPointList)
            // this.tipMessage = ""
            // this.viewPointAllList = _viewPointList

            resolve(_viewPointList)
          })

        })
      },
      onLoadError(event) {
        console.log('fail');
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
                var dbid = elements.dbId;
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
      onSelectionChanged1(event) {
        // console.log('this.viewer', this.viewer)
        console.log('event1', event)
        let _dbIds = event.dbIdArray
        console.log('dbIdArray', _dbIds)
        this.selectedDbId = _dbIds
        // Asyncronous method that gets object properties
        // 异步获取模型的属性
        this.viewer.getProperties(_dbIds[0],
          (elements) => {
            var dbid = elements.dbId;
            console.log('elements', elements)
            // let min = this.getFragXYZ(dbid)
            // this.drawViewPointLabel(min, 'aaa', 'asd', 'dasd')


          })
      },
      getFragXYZ(model, dbid) {
        // View里如何获取模型的坐标信息
        var bounds = new THREE.Box3();
        var box = new THREE.Box3();
        // console.log('this.viewer', this.viewer)
        var instanceTree = model.getData().instanceTree;
        var fragList = model.getFragmentList();
        // var instanceTree = this.viewer.impl.model.getData().instanceTree;
        // var fragList = this.viewer.impl.model.getFragmentList();

        instanceTree.enumNodeFragments(dbid, (fragId) => {
          // console.log('fragId:' + fragId);

          //某几何单元的全局坐标系包围盒
          fragList.getWorldBounds(fragId, box)
          //合并计算最终整个构件包围盒
          bounds.union(box);

          //某几何单元的全局坐标系变换矩阵
          //从中读取平移或旋转数值
          //由于构件的几何单元应该都是同步变换，所以这些矩阵初始值应该是一样的
          var fm = new THREE.Matrix4();
          fragList.getWorldMatrix(fragId, fm);
          // console.log('frag matrix:' + JSON.stringify(fm));
        }, true)

        // var tree = this.viewer.impl.model.getData().instanceTree;
        var tree = model.getData().instanceTree;
        var tmpBox = new Float32Array(6);
        tree.getNodeBox(dbid, tmpBox);
        var min = new THREE.Vector3(tmpBox[0], tmpBox[1], tmpBox[2]);
        var max = new THREE.Vector3(tmpBox[3], tmpBox[4], tmpBox[5]);

        var average = new THREE.Vector3((tmpBox[3] + tmpBox[0]) / 2, (tmpBox[4] + tmpBox[1]) / 2, (tmpBox[5] + tmpBox[
          2]) / 2);
        // var max = new THREE.Vector3(tmpBox[3], tmpBox[4], tmpBox[5]);
        // console.log('min,max', min, max, average)
        return average
      },
      drawViewPointMarker(pushpinModelPt, id, name, data) {
        var geom = new THREE.SphereGeometry(0.5);
        var material = new THREE.MeshBasicMaterial({
          color: 0xff0000
        });
        var sphereMesh = new THREE.Mesh(geom, material);
        sphereMesh.position.set(pushpinModelPt.x, pushpinModelPt.y, pushpinModelPt.z);
        if (!this.viewer.overlays.hasScene('custom-scene-2')) {
          this.viewer.overlays.addScene('custom-scene-2');
        }
        this.viewer.overlays.addMesh(sphereMesh, 'custom-scene-2');
      },
      drawViewPointLabel(pushpinModelPt, id, name, data) {
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
      getModelUrl() {
        let result = null
        let _urlList = []
        let _itemInfoList = []
        this.itemInfoList.forEach(itemInfo => {
          console.log('itemInfo111', itemInfo)
          // 服务端地址转换
          // console.log('process.env.BASE_DOMAIN_BIM', process.env.BASE_DOMAIN_BIM)
          // _urlList.push(itemInfo.url.replace('/www/bim_proj/', process.env.BASE_DOMAIN_BIM))
          _urlList.push(itemInfo.url.replace('/www/bim_proj/', '').replace('/BCP_FILE/', 'BCP_FILE/'))
          _itemInfoList.push(itemInfo)
          // 本地地址转换
          // _urlList.push(build.ITEM_URL.replace('/www/bim_proj/', '/static/'))
        });
        result = {
          'urlList': _urlList,
          'itemInfoList': _itemInfoList
        }
        return result
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
            // console.log('_itemList_itemList', _itemList)
            this.itemInfoList = _itemList
            // _itemList.forEach(build => {
            //   this.itemInfoList.push(build)
            //   this.itemList.forEach(item => {
            //     if (item.FILE_ID === build.file_id) {
            //       this.itemInfoList.push(build)
            //     }
            //   })

            // });
            // console.log('this.itemInfoList', this.itemInfoList)
            resolve()
          })
        })
      },
      getItemInfoListByProID(file_ids) {
        // console.log('this.project_id', this.project_id)
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
      snaphot(type) {

        let screenshot = new Image();
        screenshot.onload = () => {
          // this.viewer.loadExtension('Autodesk.Viewing.MarkupsCore').then((markupCore) => {


          let canvas = document.getElementById('snapshot');
          canvas.width = this.viewer.container.clientWidth;
          canvas.height = this.viewer.container.clientHeight;
          let ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(screenshot, 0, 0, canvas.width, canvas.height);
          // console.log('ctx', ctx)
          // console.log('canvas.width, canvas.height', canvas.width, canvas.height, this.markupsExt)
          try {
            this.markupsExt.renderToCanvas(ctx);
          } catch (err) {
            // document.getElementById("demo").innerHTML = err.message;
            console.log('renderToCanvas', err)
          }


          setTimeout(() => {
            switch (type) {
              case "open":
                this.openPicture()
                break;
              case "download":
                this.downloadPicture()
                break;
            }

          }, 1000);
        };

        // Get the full image
        this.viewer.getScreenShot(this.viewer.container.clientWidth, this.viewer.container.clientHeight, function (
          blobURL) {
          screenshot.src = blobURL;
          console.log('blobURL', blobURL)
        });
      },
      enterReMarkerEditMode() {
        this.backToModelModeHandle()
        // this.markupsExt.leaveEditMode();
        // this.markupsExt.hide()
        this.enterMarkerEditMode(this.ViewPointType)
        // this.isShowSaveMarkerArea = false
        this.isShowToolbarRestore2 = false
      },
      enterMarkerEditMode(type) { // type字段：1-基于项目的公共位置视点；2-普通视点

        this.ViewPointType = type
        // var markup;
        // https://forge.autodesk.com/blog/using-autodeskviewingmarkupscore-extension
        this.$store.dispatch('SetViewPointEditMode', {
          isEditMode: true
        }).then(() => {})

        switch (type) {
          case 1: // 1-基于项目的公共位置视点
            this.isShowToolbarMarker = true

            // this.isShowSaveMarkerArea = true
            this.isShowViewPointArea = true
            this.isShowToolbarRestore2 = false
            this.resetIsolateMode()
            break;
          case 2: // 2-普通视点
            this.viewer.loadExtension('Autodesk.Viewing.MarkupsCore').then((markupsExt) => {

              this.isShowToolbarMarker = true

              // this.isShowSaveMarkerArea = true
              this.isShowViewPointArea = true
              this.resetIsolateMode()
              this.isShowToolbarRestore2 = false
              // console.log('this.viewerStatePersist', this.viewerStatePersist)
              this.markupsExt = this.viewer.getExtension("Autodesk.Viewing.MarkupsCore");
              this.markupsExt.enterEditMode();
              this.nsu = Autodesk.Extensions.Markup.Core.Utils
              // console.log('Autodesk', Autodesk, this.markupsExt, this.nsu)
              this.styleObject = this.nsu.createStyleSheet(this.styleAttributes, this.markupsExt.viewer);
              this.setMarkerMode('Rectangle')
              this.setMarkerStyle('#FF0000')

            });
            break;
        }

      },
      backToModelModeHandle() {
        this.markupsExt.leaveEditMode();
        this.markupsExt.hide()
        this.isShowToolbarRestore = false
        if (this.isShowOldViewPoint === true) {
          this.isShowViewPointThumbArea = true
        }

        // this.isShowSaveMarkerArea = true
        this.isShowToolbarRestore2 = true

      },
      exitRestoreHandle() {
        // this.markupsPersist = this.markupsExt.generateData()
        // current view state (zoom, direction, sections)
        // this.viewerStatePersist = this.markupsExt.viewer.getState()
        // this.viewer.toolbar.setVisible(true)
        this.viewer.toolbar.addControl(this.ControlGroupViewPoint)
        this.viewer.toolbar.addControl(this.ControlGroupShowAllViewPoint)
        this.$store.dispatch('SetViewPointEditMode', {
          isEditMode: false
        }).then(() => {})
        this.ViewPointCurrentData = null
        // this.viewPointName = ''
        // console.log('this.markupsExt', this.markupsExt)
        if (this.markupsExt !== undefined) {
          this.markupsExt.leaveEditMode();
          this.markupsExt.hide()
        }

        // this.viewer.restoreState(JSON.parse(this.saveStatus));
        this.isShowToolbarRestore = false
        this.isShowViewPointArea = false
        this.isShowToolbarMarker = false
        this.isShowToolbarMarkerStyle = false
        this.isShowViewPointThumbArea = false
        // this.isShowSaveMarkerArea = false
        this.isShowToolbarRestore2 = false

        this.isShowOldViewPoint = false
      },
      exitMarkerHandle() {
        // this.markupsPersist = this.markupsExt.generateData()
        // current view state (zoom, direction, sections)
        // this.viewerStatePersist = this.markupsExt.viewer.getState()
        this.markupsExt.leaveEditMode();
        this.markupsExt.hide()
        this.isShowToolbarMarker = false
        // this.isShowSaveMarkerArea = false
        this.isShowToolbarMarkerStyle = false
        this.isShowToolbarRestore2 = true
      },

      clickMarkerModeHandle(type) {
        this.isShowToolbarMarkerStyle = true
        this.$refs['MarkupTools'].setToolMainSelected(type)
      },
      setMarkerMode(type) {
        let _EditMode;
        switch (type) {
          case 'Rectangle':
            _EditMode = new Autodesk.Viewing.Extensions.Markups.Core.EditModeRectangle(this.markupsExt)
            break;
          case 'Circle':
            _EditMode = new Autodesk.Viewing.Extensions.Markups.Core.EditModeCircle(this.markupsExt)
            break;
          case 'Arrow':
            _EditMode = new Autodesk.Viewing.Extensions.Markups.Core.EditModeArrow(this.markupsExt)
            break;
          case 'Freehand':
            _EditMode = new Autodesk.Viewing.Extensions.Markups.Core.EditModeFreehand(this.markupsExt)
            break;
          case 'Cloud':
            _EditMode = new Autodesk.Viewing.Extensions.Markups.Core.EditModeCloud(this.markupsExt)
            break;
          case 'Text':
            _EditMode = new Autodesk.Viewing.Extensions.Markups.Core.EditModeText(this.markupsExt)
            break;
          case 'Polyline':
            _EditMode = new Autodesk.Viewing.Extensions.Markups.Core.EditModePolyline(this.markupsExt)
            break;
          case 'Polycloud':
            _EditMode = new Autodesk.Viewing.Extensions.Markups.Core.EditModePolycloud(this.markupsExt)
            break;
          case 'Highlight':
            _EditMode = new Autodesk.Viewing.Extensions.Markups.Core.EditModeHighlight(this.markupsExt)
            break;
        }
        this.markupsExt.changeEditMode(_EditMode)
        // this.setMarkerStyle()
      },
      setMarkerStyle(color) {
        // console.log('setMarkerStyle', this.markerStyle.strokeWidth)
        // this.styleObject['stroke-width'] = this.markerStyle.strokeWidth //设置样式
        this.styleObject['stroke-color'] = color //设置样式
        // this.styleObject['font-size'] = this.markerStyle.fontSize //设置样式
        this.markupsExt.setStyle(this.styleObject); //应用样式
        // this.StrokeWidthLabel = `线条宽度：${this.markerStyle.strokeWidth}px`
        // this.FontSizeLabel = `文字大小：${this.markerStyle.fontSize}号`

      },
      showSaveViewsPointHandle(editType) {
        // type 0 保存，1 新增
        // this.isShowSaveMarkerArea = true
        // 打开视角管理窗口
        if (this.ViewPointType === 1 && this.selectedDbId.length === 0) {
          this.$message({
            message: '请先选择一个构件',
            type: 'error'
          })
          return
        }
        this.SavePositionViewPointHandle(editType)

      },
      openPicture() {
        const img = new Image();
        img.src = document.getElementById('snapshot').toDataURL("image/png");
        // console.log('dada', document.getElementById('snapshot').toDataURL("image/png"))
        const newWin = window.open("", "_blank");
        newWin.document.write(img.outerHTML);
        newWin.document.title = "流程图"
        newWin.document.close();
      },
      downloadPicture() {
        let oA = document.createElement("a");
        oA.download = ''; // 设置下载的文件名，默认是'下载'
        oA.href = document.getElementById('snapshot').toDataURL("image/png");
        document.body.appendChild(oA);
        oA.click();
      },
      saveViewPoint() {
        this.saveStatus = JSON.stringify(this.viewer.getState());

        console.log('saveViewPoint', this.saveStatus)
      },
      restoreViewPoint() {
        this.viewer.restoreState(JSON.parse(this.saveStatus));
      },
      saveMarkups() {

        this.saveMarkupStatus = this.viewer.getState();
        this.saveMarkupData = this.markupsExt.generateData();
        console.log('this.saveMarkupStatus', this.saveMarkupStatus)
        console.log('this.saveMarkupData', this.saveMarkupData)
      },
      restoreMarkups() {
        console.log('restoreMarkups')
        console.log('getCamera()', this.viewer.getCamera())
        if (this.saveMarkupData === null) {
          return
        }
        this.viewer.restoreState(this.saveMarkupStatus); //it fails to restore state
        // this.markupsExt.viewer.impl.invalidate(true);

        setTimeout(() => {
          this.markupsExt.leaveEditMode();
          this.markupsExt.show();
          this.markupsExt.loadMarkups(this.saveMarkupData, 'aaa');
          this.isShowToolbarRestore = true
        }, 1000);


      },
      rotateCamera() {
        if (this.startedRotate) {
          requestAnimationFrame(this.rotateCamera);
        }

        const nav = this.viewer.navigation;
        const up = nav.getCameraUpVector();
        const axis = new THREE.Vector3(0, 0, 1);
        const speed = 5.0 * Math.PI / 180;
        const matrix = new THREE.Matrix4().makeRotationAxis(axis, speed * 0.1);

        let pos = nav.getPosition();
        pos.applyMatrix4(matrix);
        up.applyMatrix4(matrix);
        nav.setView(pos, new THREE.Vector3(0, 0, 0));
        nav.setCameraUpVector(up);
        var viewState = this.viewer.getState();
      },
      rotateModel() {
        console.log('rotateModel')
        this.startedRotate = !this.startedRotate;
        if (this.startedRotate) {
          this.rotateCamera()
        }

      },
      subscribeToAllEvents() {
        for (var key in Autodesk.Viewing) {
          if (key.endsWith("_EVENT")) {
            ((eventName) => {
              this.viewer.addEventListener(
                Autodesk.Viewing[eventName],
                (event) => {
                  if (eventName === 'TOOLBAR_CREATED_EVENT') {
                    console.log(
                      'TOOLBAR_CREATED_EVENTTOOLBAR_CREATED_EVENTTOOLBAR_CREATED_EVENTTOOLBAR_CREATED_EVENTTOOLBAR_CREATED_EVENTTOOLBAR_CREATED_EVENTTOOLBAR_CREATED_EVENT'
                    )
                    this.viewer.unloadExtension('Autodesk.FirstPerson')
                  }
                  // console.log(eventName, event);
                }
              );
            })(key);
          }
        }
      },
      SavePositionViewPointHandle(editType) {

        let screenshot = new Image();
        screenshot.onload = () => {
          // this.viewer.loadExtension('Autodesk.Viewing.MarkupsCore').then((markupCore) => {

          this.viewer.loadExtension('Autodesk.Viewing.MarkupsCore').then((markupsExt) => {
            this.markupsExt = this.viewer.getExtension("Autodesk.Viewing.MarkupsCore");
            let canvas = document.getElementById('snapshot');
            canvas.width = this.viewer.container.clientWidth;
            canvas.height = this.viewer.container.clientHeight;
            let ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(screenshot, 0, 0, canvas.width, canvas.height);
            // console.log('ctx', ctx)
            // console.log('canvas.width, canvas.height', canvas.width, canvas.height, this.markupsExt)
            try {
              this.markupsExt.renderToCanvas(ctx);
            } catch (err) {
              // document.getElementById("demo").innerHTML = err.message;
              console.log('renderToCanvas', err)
            }
            // this.loadingSaveViewPoint = true
            setTimeout(() => {

              // 视点数据
              let saveStatus = JSON.stringify(this.viewer.getState());
              // 标记的svg数据
              console.log('this.markupsExt', this.markupsExt)
              let markupsExtData = ""

              let _pointType = this.ViewPointType
              switch (_pointType) {
                case 2: // 2-普通视点
                  markupsExtData = this.markupsExt.generateData();
                  break;
              }
              // 标记的图片base64数据
              let markupsBase64 = document.getElementById('snapshot').toDataURL("image/png")

              // let markerInfo = {
              //   base64: markupsBase64,
              //   svg: markupsExtData
              // }
              // console.log('markerInfo', markerInfo)
              this.viewPointImgUrl = markupsBase64
              // return
              // let fileIDList = []
              // this.itemList.forEach(item => {
              //   fileIDList.push(item.FILE_ID)
              // })
              console.log('personInfo', this.personInfo)
              const __data = {
                // "method": "SaveViewPoint",
                "editType": editType,
                "type": this.ViewPointType,
                "project_id": this.project_id,
                "name": "",
                "desc": "",
                "file_ids": this.itemCurrentFileIdList.join(','),
                "item_ids": this.itemCurrentItemIdList.join(','),
                "camera_info": Base64.encode(saveStatus),
                "picture_info": markupsBase64,
                "svg_info": Base64.encode(markupsExtData),
                "creator": this.personInfo.person.id,
                "itemInfoList": this.itemInfoList,
                "ViewPointCurrentData": this.ViewPointCurrentData
              }
              // console.log('personInfo', this.personInfo)
              console.log('__data', __data)
              
              const param = {
                show: true,
                // itemInfoList: this.itemInfoList
                data: __data
              }
              // this.$store.dispatch('SetVideoDialog', param).then(() => {}).catch(() => {})
              this.$store.dispatch('ShowViewPointSaveDialog', param).then(() => {}).catch(() => {})

            }, 1000);
          })





        };

        // Get the full image
        this.viewer.getScreenShot(this.viewer.container.clientWidth, this.viewer.container.clientHeight, function (
          blobURL) {
          screenshot.src = blobURL;
          console.log('blobURL', blobURL)
        });





      },
      openViewPointManageHandle() {
        // 打开视角管理窗口
        const param = {
          show: true,
          itemInfoList: this.itemInfoList
        }
        // this.$store.dispatch('SetVideoDialog', param).then(() => {}).catch(() => {})
        this.$store.dispatch('ShowViewPointManagerDialog', param).then(() => {}).catch(() => {})
      },
      // draw1() {

      //   this.aaacolor = this.aaacolor + 1
      //   console.log('111', this.aaacolor.toString(16))
      //   this.phereMesh1.material.color.set(0x00FF00);
      //   window.requestAnimationFrame(this.draw2);

      // },
      // draw2() {

      //   this.aaacolor = this.aaacolor + 1
      //   console.log('111', this.aaacolor.toString(16))
      //   this.phereMesh1.material.color.set(0xFF0000);
      //   window.requestAnimationFrame(this.draw1);

      // },

      //显示视点
      async ShowViewPoint() {
        console.log('ShowViewPoint', this.ViewPointCurrentData)
        console.log('this.itemList', this.itemList)

        let _pointType = this.ViewPointCurrentData.type
        this.isSaveViewValid = true
        // this.viewer.toolbar.setVisible(false)
        this.viewer.toolbar.removeControl(this.ControlGroupViewPoint)
        this.viewer.toolbar.removeControl(this.ControlGroupShowAllViewPoint)
        this.viewer.overlays.removeScene('custom-scene-2')
        this.$store.dispatch('SetViewPointEditMode', {
          isEditMode: true
        }).then(() => {})




        switch (_pointType) {
          case 1: // 1-基于项目的公共位置视点
            // let _itemId = JSON.parse(this.ViewPointCurrentData.item_id)
            // console.log('123213', this.itemCurrentItemIdList, _itemId)
            this.isShowToolbarMarker = true

            this.isShowToolbarMarkerStyle = false
            this.isShowViewPointArea = true
            this.resetIsolateMode()
            // console.log('ViewPointCurrentData', this.ViewPointCurrentData)
            this.ViewPointType = this.ViewPointCurrentData.type
            this.viewPointTitleName = this.ViewPointCurrentData.name
            // this.viewPointName = this.ViewPointCurrentData.name
            this.isShowToolbarRestore = false
            this.isShowToolbarRestore2 = false
            this.isShowViewPointThumbArea = false
            // this.isShowSaveMarkerArea = false

            let camera_info = JSON.parse(Base64.decode(this.ViewPointCurrentData.camera_info))
            // let picBase64 = picture_info.base64
            this.viewPointImgUrl = this.ViewPointCurrentData.pictureFullSrc
            // console.log('camera_info', camera_info)
            this.viewer.restoreState(camera_info); //it fails to restore state
            // markupsExt.viewer.impl.invalidate(true);
            // this.isShowToolbarRestore = true
            this.viewer.setBackgroundColor(0, 59, 111, 255, 255, 255);
            if (this.markupsExt !== undefined) {
              this.markupsExt.clear()
              this.markupsExt.leaveEditMode();
              this.markupsExt.hide()
            }

            break;
          case 2: // 2-普通视点

            let files_id_list = JSON.parse(this.ViewPointCurrentData.file_ids)
            console.log('files_id_list1231231', this.itemCurrentFileIdList, files_id_list)
            if (this.itemCurrentFileIdList.sort().toString() !== files_id_list.sort().toString()) {
              this.itemCurrentFileIdList.forEach(item => {
                this.viewer.unloadModel(this.viewer.model)
              })
              this.itemCurrentFileIdList = files_id_list
              await this.getItemInfoListByProID(files_id_list)
              await this.getUrlAndInitView()

            }
            this.viewer.loadExtension('Autodesk.Viewing.MarkupsCore').then((markupsExt) => {
              this.isShowToolbarMarker = false
              this.isShowToolbarMarkerStyle = false
              this.isShowViewPointArea = true
              this.resetIsolateMode()
              // console.log('ViewPointCurrentData', this.ViewPointCurrentData)
              this.ViewPointType = this.ViewPointCurrentData.type
              this.viewPointTitleName = this.ViewPointCurrentData.name
              // this.viewPointName = this.ViewPointCurrentData.name
              this.markupsExt = this.viewer.getExtension("Autodesk.Viewing.MarkupsCore");
              // console.log('this.markupsExt', this.markupsExt)
              // markupsExt.deleteMarkup()
              this.markupsExt.clear()
              this.markupsExt.leaveEditMode();
              this.markupsExt.hide()
              this.isShowToolbarRestore = false
              this.isShowToolbarRestore2 = false
              this.isShowViewPointThumbArea = false
              // this.isShowSaveMarkerArea = false

              let _marekup_svg = Base64.decode(this.ViewPointCurrentData.svg_info)
              let camera_info = JSON.parse(Base64.decode(this.ViewPointCurrentData.camera_info))
              // let picBase64 = picture_info.base64
              this.viewPointImgUrl = this.ViewPointCurrentData.pictureFullSrc
              // console.log('camera_info', camera_info)
              this.viewer.restoreState(camera_info); //it fails to restore state
              // markupsExt.viewer.impl.invalidate(true);
              this.isShowToolbarRestore = true
              this.viewer.setBackgroundColor(0, 59, 111, 255, 255, 255);
              setTimeout(() => {
                markupsExt.leaveEditMode();
                markupsExt.show();
                markupsExt.loadMarkups(_marekup_svg, 'markup' + this.ViewPointCurrentData.id);
                this.isShowOldViewPoint = true
              }, 1000);
            })
            break;
        }


      },
      // 清除所有的标记点
      clearAllViewPointMarkrt() {
        this.resetIsolateMode()
        this.viewer.overlays.removeScene('custom-scene-2');
      },
      // 显示所有添加的视点
      async ShowViewPointMarkerAll() {
        let red = new THREE.Vector4(1, 0, 0, 1);
        let _viewPointAllList = await this.GetViewpointsDataAll()
        // console.log('_viewPointAllList', _viewPointAllList)
        // console.log('this.loadedModels', this.loadedModels)
        this.loadedModels.forEach(model => {
          let objectSetIDList = []
          _viewPointAllList.forEach(item => {

            let _camera_info = JSON.parse(Base64.decode(item.camera_info))
            let _item_id = item.item_id
            let _name = item.name

            let _objectSetList = _camera_info.objectSet
            // console.log('this.loadedModels', this.loadedModels)
            _objectSetList.forEach(objectIds => {

              let idList = objectIds.id
              if (idList.length > 0) {
                if (model.item_id === _item_id) {
                  idList.forEach(_id => {
                    objectSetIDList.push(_id)

                    // this.viewer.setThemingColor(_id, red, model);
                    let average = this.getFragXYZ(model, _id)
                    let markId = `mark_${item.id}_${_id}`
                    // 添加任务的标注的标签-是标签
                    this.drawViewPointLabel(average, markId, _name, 'dasd')

                    // 添加任务的标注的点 - 是点
                    this.drawViewPointMarker(average, markId, _name, 'dasd')
                  })
                }
              }
            })
          })
          // this.viewer.impl.visibilityManager.isolate(objectSetIDList, model);
          this.viewer.impl.visibilityManager.isolate(-1, model);
          // this.viewer.isolate(-1);

        })
      },
      // 显示有任务的视点
      async ShowViewPointTaskMarker() {
        // console.log('ShowViewPointTaskMarker')
        // console.log('itemInfoList', this.itemInfoList)
        let _viewPointAllList = await this.GetViewpointsDataAll()
        // console.log('_viewPointAllList', _viewPointAllList)
        this.loadedModels.forEach(async model => {
          // let objectSetIDList = []
          let pvids = []
          let _viewPointMap = new Map()
          _viewPointAllList.forEach(viewPoint => {
            // console.log('viewPoint', viewPoint)
            let _item_id = viewPoint.item_id

            if (model.item_id === _item_id && viewPoint.type === 1) {
              pvids.push(viewPoint.id.toString())
              _viewPointMap.set(viewPoint.id.toString(), viewPoint)
            }

          })
          // console.log('pvids', pvids)
          // console.log('_viewPointMap', _viewPointMap)
          let _allTaskDataByPvID = await this.getTaskDataByPvID(pvids)
          _allTaskDataByPvID.forEach(taskData => {
            // console.log('taskData', taskData)
            let _pvData = _viewPointMap.get(taskData.pvid.toString())
            if (_pvData !== undefined) {
              let _name = taskData.title
              let _camera_info = JSON.parse(Base64.decode(_pvData.camera_info))
              let _objectSetList = _camera_info.objectSet
              _objectSetList.forEach(objectIds => {
                let idList = objectIds.id
                if (idList.length > 0) {
                  idList.forEach(_id => {
                    // objectSetIDList.push(_id)
                    // this.viewer.setThemingColor(_id, red, model);
                    let average = this.getFragXYZ(model, _id)
                    let markId = `mark_${_pvData.id}_${_id}`
                    // 任务的标题
                    // this.drawViewPointLabel(average, markId, _name, 'dasd')
                    this.drawViewPointMarker(average, markId, _name, 'dasd')
                  })

                }
              })
            }
            // console.log('_pvData', _pvData)
          })
          // console.log('_allTaskDataByPvID', _allTaskDataByPvID)
          // this.viewer.impl.visibilityManager.isolate(objectSetIDList, model);
          this.viewer.impl.visibilityManager.isolate(-1, model);
          // this.viewer.isolate(-1);

        })
        // let _allTaskData = await this.getTaskData()
        // console.log('_allTaskData', _allTaskData)
      },
      getTaskDataByPvID(pvids) {
        return new Promise((resolve, reject) => {
          const param = {
            method: 'query_task_all',
            project_id: this.project_id,
            pvids: pvids
          }
          this.$store.dispatch('QueryTaskAll', param).then((taskDataList) => {
            // console.log('QueryTaskAll - taskDataList', taskDataList)
            resolve(taskDataList)
          })

        })
      }

    }
  }

</script>
