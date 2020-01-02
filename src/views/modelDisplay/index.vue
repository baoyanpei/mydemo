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
          <el-button type="danger" class="btn-close-view-point" @click="exitRestoreHandle" size="small">关闭</el-button>
        </div>
        <!-- <img v-bind:src="viewPointImgUrl" class="viewPointImg" /> -->
      </div>
      <div v-if="isShowViewPointThumbArea" class="viewPointThumbArea" v-drag draggable="true">
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
  
      <div v-if="isShowSaveMarkerArea" class="view-point-form">
        <el-input v-model="viewPointName" placeholder="请输入视点的标题" style="width: 200px;margin-right:10px;"></el-input>
        <el-button type="warning" :loading="loadingSaveViewPoint" @click="SavePositionViewPointHandle">保存位置视点</el-button>
      </div>
  
      <div v-if="isShowToolbarMarker" class="toolbar-marker">
        <el-button class="marker-button" title="保存当前视点">
          <font-awesome-icon :icon="['far','save']" @click="showSaveViewsPointHandle" />
        </el-button>
        <hr />
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
        <el-button class="marker-button" title="文字">
          <font-awesome-icon icon="font" @click="clickMarkerModeHandle('Text')" />
        </el-button>
        <!-- <hr /> -->
        <!-- <el-button class="marker-button" title="截图">
          <font-awesome-icon icon="camera-retro" @click="snaphot('open')" />
        </el-button>
        <el-button class="marker-button" title="下载截图">
          <font-awesome-icon icon="download" @click="snaphot('download')" />
        </el-button> -->
        <!-- <hr />
        <el-button class="marker-button" title="保存标注">
          <font-awesome-icon icon="save" @click="saveMarkups()" />
        </el-button> -->
        <hr />
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
          console.log('this.itemList', this.itemList)
          let itemIDList = []
          this.itemList.forEach(item => {
            itemIDList.push(item.ITEM_ID)
            this.itemCurrentFileIdList.push(item.FILE_ID)
          })
          console.log('itemIDList', itemIDList, itemIDList.join(','))
          await this.getItemInfoListByItemIDs(itemIDList.join(','))
          // console.log('this.itemInfoList', this.itemInfoList)
          let _urlList = this.getModelUrl()
          // console.log('_urlList', _urlList)
          if (_urlList.length !== 0) {
            await this.init3DView(_urlList)
            console.log('init3DView - complete')
            this.viewer.addEventListener(
              Autodesk.Viewing.SELECTION_CHANGED_EVENT,
              this.onSelectionChanged
            );
  
          } else {
  
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
                this.addCustomToolBar()
                this.addViewpointToolBar()
              } 
              resolve(index)
            }, this.onLoadError);
  
  
          })
        },
        // onLoadSuccess() {
        //   let getModels = this.viewer.impl.modelQueue().getModels()
        //   this.globalOffset = getModels[0].getData().globalOffset; //Get it from first model 
        //   console.log('globalOffset', this.globalOffset)
        //   for (let i = 1; i < this.urns.length; i++) {
  
        //     let options = {
        //       globalOffset: this.globalOffset
        //     }
        //     this.viewer.loadModel(this.urns[i], options);
        //   }
  
        //   // this.viewer.fitToView()
        //   this.viewer.setBackgroundColor(0, 59, 111, 255, 255, 255);
  
        //   if (!this.viewer.overlays.hasScene('custom-scene')) {
        //     this.viewer.overlays.addScene('custom-scene');
        //   }
        //   this.saveStatus = JSON.stringify(this.viewer.getState());
        //   this.addCustomToolBar()
        //   this.addViewpointToolBar()
  
        // },
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
  
          // 标注功能
          let buttonMarker = new Autodesk.Viewing.UI.Button('my-marker-button')
          buttonMarker.icon.style.backgroundImage = 'url(./static/icon/ico_marker.png)'
  
          buttonMarker.onClick = (e) => {
            // viewer.setViewCube('front')
            this.enterMarkerEditMode(2)
          }
          buttonMarker.addClass('my-marker-button')
          buttonMarker.setToolTip('普通标注视点')
  
          // 标注功能
          let buttonMarker2 = new Autodesk.Viewing.UI.Button('my-marker2-button')
          buttonMarker2.icon.style.backgroundImage = 'url(./static/icon/ico_markup.png)'
  
          buttonMarker2.onClick = (e) => {
            // viewer.setViewCube('front')
            this.enterMarkerEditMode(1)
          }
          buttonMarker2.addClass('my-marker2-button')
          buttonMarker2.setToolTip('标定项目位置标准视点')
  
  
          // 视点管理功能
          let buttonViewPoint = new Autodesk.Viewing.UI.Button('my-marker-manager-button')
          buttonViewPoint.icon.style.backgroundImage = 'url(./static/icon/ico_layer3.png)'
  
          buttonViewPoint.onClick = (e) => {
            // viewer.setViewCube('front')
            // this.enterMarkerEditMode()
            this.openViewPointManageHandle()
          }
          buttonViewPoint.addClass('my-marker-manager-button')
          buttonViewPoint.setToolTip('视点管理')
  
          // // 保存视点按钮
          // let buttonViewPointSave = new Autodesk.Viewing.UI.Button('my-view-point-save-button')
          // buttonViewPointSave.icon.style.backgroundImage = 'url(./static/icon/ico_save.png)'
  
  
          // buttonViewPointSave.onClick = (e) => {
          //   this.saveViewPoint()
          // }
          // buttonViewPointSave.addClass('my-view-point-save-button')
          // buttonViewPointSave.setToolTip('保存视点')
  
          // // 载入视点按钮
          // let buttonViewPointRestore = new Autodesk.Viewing.UI.Button('my-view-point-restore-button')
          // buttonViewPointRestore.icon.style.backgroundImage = 'url(./static/icon/ico_restore2.png)'
  
  
          // buttonViewPointRestore.onClick = (e) => {
          //   this.restoreViewPoint()
          // }
          // buttonViewPointRestore.addClass('my-view-point-restore-button')
          // buttonViewPointRestore.setToolTip('恢复视点')
  
          // // 旋转模型
          // let buttonRotate = new Autodesk.Viewing.UI.Button('my-rotate-button')
          // buttonRotate.icon.style.backgroundImage = 'url(./static/icon/ico_rotate.png)'
  
  
          // buttonRotate.onClick = (e) => {
          //   this.rotateModel()
          // }
          // buttonRotate.addClass('my-rotate-button')
          // buttonRotate.setToolTip('旋转模型')
  
          // SubToolbar
          let subToolbar = new Autodesk.Viewing.UI.ControlGroup('my-view-point-toolbar')
          subToolbar.addControl(buttonMarker)
          subToolbar.addControl(buttonMarker2)
  
          subToolbar.addControl(buttonViewPoint)
          // subToolbar.addControl(buttonViewPointSave)
          // subToolbar.addControl(buttonViewPointRestore)
          // subToolbar.addControl(buttonRotate)
  
          // Add subToolbar to main toolbar
          this.viewer.toolbar.addControl(subToolbar)
        },
        onLoadError(event) {
          console.log('fail');
        },
        onSelectionChanged(event) {
          // console.log('this.viewer', this.viewer)
          console.log('event1', event)
          let _dbIds = event.dbIdArray
  
          // Asyncronous method that gets object properties
          // 异步获取模型的属性
          this.viewer.getProperties(_dbIds[0],
            function (elements) {
              var dbid = elements.dbId;
            })
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
        getItemInfoListByItemIDs(item_ids) {
          // console.log('this.project_id', this.project_id)
          return new Promise((resolve, reject) => {
            const param = {
              method: 'GetItemInfoListByItemIDs',
              // project_id: this.project_id,
              item_id: item_ids
  
            }
            this.$store.dispatch('GetItemInfoListByItemIDs', param).then((_itemList) => {
              console.log('_itemList_itemList', _itemList)
              _itemList.forEach(build => {
                this.itemList.forEach(item => {
                  if (item.FILE_ID === build.FILE_ID) {
                    this.itemInfoList.push(build)
                  }
                })
  
              });
              console.log('this.itemInfoList', this.itemInfoList)
              resolve()
            })
          })
        },
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
          this.isShowSaveMarkerArea = false
          this.isShowToolbarRestore2 = false
        },
        enterMarkerEditMode(type) { // type字段：1-基于项目的公共位置视点；2-普通视点
  
          this.ViewPointType = type
          // var markup;
          // https://forge.autodesk.com/blog/using-autodeskviewingmarkupscore-extension
          /*
          EditModeArrow
          EditModeCircle
          EditModeCloud
          EditModeFreehand
          EditModeHighlight
          EditModePen
          EditModePolycloud
          EditModePolyline
          EditModeRectangle
          EditModeText
          */
          this.viewer.loadExtension('Autodesk.Viewing.MarkupsCore').then((markupsExt) => {
  
            this.isShowToolbarMarker = true
            // this.isShowSaveMarkerArea = true
            this.isShowViewPointArea = true
            this.isShowToolbarRestore2 = false
            // console.log('this.viewerStatePersist', this.viewerStatePersist)
            this.markupsExt = this.viewer.getExtension("Autodesk.Viewing.MarkupsCore");
            this.markupsExt.enterEditMode();
            this.nsu = Autodesk.Extensions.Markup.Core.Utils
            // console.log('Autodesk', Autodesk, this.markupsExt, this.nsu)
            this.styleObject = this.nsu.createStyleSheet(this.styleAttributes, this.markupsExt.viewer);
            this.setMarkerMode('Rectangle')
            this.setMarkerStyle('#FF0000')
            // this.StrokeWidthLabel = `线条宽度：${this.markerStyle.strokeWidth}px`
            // this.FontSizeLabel = `文字大小：${this.markerStyle.fontSize}号`
  
            // if (this.viewerStatePersist !== null) {
            //   // 回复先前制作涂丫时的 Viewer 画面的状态
            //   this.markupsExt.viewer.restoreState(this.viewerStatePersist);
            //   this.markupsExt.show()
            //   // 在 MyLayer 图层上重现涂丫
            //   this.markupsExt.loadMarkups(this.markupsPersist, 'MyLayer');
            // } else {
            //   this.markupsExt = this.viewer.getExtension("Autodesk.Viewing.MarkupsCore");
            //   this.markupsExt.enterEditMode();
            // }
          });
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
          // this.isShowViewPointArea = false
        },
        exitRestoreHandle() {
          // this.markupsPersist = this.markupsExt.generateData()
          // current view state (zoom, direction, sections)
          // this.viewerStatePersist = this.markupsExt.viewer.getState()
          this.viewPointName = ''
          this.markupsExt.leaveEditMode();
          this.markupsExt.hide()
          // this.viewer.restoreState(JSON.parse(this.saveStatus));
          this.isShowToolbarRestore = false
          this.isShowViewPointArea = false
          this.isShowToolbarMarker = false
          this.isShowToolbarMarkerStyle = false
          this.isShowViewPointThumbArea = false
          this.isShowSaveMarkerArea = false
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
          this.isShowSaveMarkerArea = false
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
        showSaveViewsPointHandle() {
          this.isShowSaveMarkerArea = true
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
        SavePositionViewPointHandle() {
          // console.log('SavePositionViewPointHandle')
  
          if (this.viewPointName === '') {
            this.$message({
              message: '请输入要保存的视点的标题！',
              type: 'error'
            })
            return
          }
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
              this.loadingSaveViewPoint = true
              setTimeout(() => {
  
                // 视点数据
                let saveStatus = JSON.stringify(this.viewer.getState());
                // 标记的svg数据
                console.log('this.markupsExt', this.markupsExt)
                let markupsExtData = this.markupsExt.generateData();
  
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
                // console.log('fileIDList', fileIDList)
                const param = {
                  "method": "SaveViewPoint",
                  "type": this.ViewPointType,
                  "project_id": this.project_id,
                  "name": this.viewPointName,
                  "desc": "",
                  "file_ids": this.itemCurrentFileIdList.join(','),
                  "camera_info": Base64.encode(saveStatus),
                  "picture_info": markupsBase64,
                  "svg_info": Base64.encode(markupsExtData),
                  "creator": this.personInfo.userid
                }
                // console.log('personInfo', this.personInfo)
                console.log('param', param)
                // return
                this.$store.dispatch('SaveViewPoint', param).then((result) => {
                  console.log('result', result)
                  this.isShowSaveMarkerArea = false
                  this.loadingSaveViewPoint = false
                  this.viewPointTitleName = this.viewPointName
                  this.viewPointName = ""
                  this.$message({
                    message: '视点保存成功！',
                    type: 'success'
                  })
  
                  setTimeout(() => {
  
                    this.$store.dispatch('SetViewPointDataChanged', {}).then((result) => {
  
                    })
                  }, 2500);
  
  
  
                  // resolve()
                })
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
        //显示视点
        async ShowViewPoint() {
          console.log('ShowViewPoint', this.ViewPointCurrentShow)
          console.log('this.itemList', this.itemList)
          /*
          let files_id_list = JSON.parse(this.ViewPointCurrentShow.FILE_IDS)
          console.log('files_id_list', files_id_list)
          console.log('this.itemCurrentFileIdList', this.itemCurrentFileIdList)
          if (this.itemCurrentFileIdList.sort().toString() !== files_id_list.sort().toString()) {
            this.itemCurrentFileIdList.forEach(item => {
              this.viewer.unloadModel(this.viewer.model)
            })
  
  
            this.itemCurrentFileIdList = files_id_list
            // return
            await this.getItemInfoListByProID(files_id_list)
            // console.log('this.itemInfoList', this.itemInfoList)
            let _urlList = this.getModelUrl()
            // console.log('_urlList', _urlList)
            if (_urlList.length !== 0) {
              await this.init3DView(_urlList)
  
              console.log('init3DView - complete')
            }
          }*/
  
          // return
          this.viewer.loadExtension('Autodesk.Viewing.MarkupsCore').then((markupsExt) => {
            this.isShowToolbarMarker = false
            this.isShowToolbarMarkerStyle = false
            this.isShowViewPointArea = true
            console.log('ViewPointCurrentShow', this.ViewPointCurrentShow)
            this.ViewPointType = this.ViewPointCurrentShow.TYPE
            this.viewPointTitleName = this.ViewPointCurrentShow.NAME
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
  
            let _marekup_svg = Base64.decode(this.ViewPointCurrentShow.SVG)
            let camera_info = JSON.parse(Base64.decode(this.ViewPointCurrentShow.CAMERA_INFO))
            // let picBase64 = picture_info.base64
            this.viewPointImgUrl = this.ViewPointCurrentShow.pictureFullSrc
            console.log('camera_info', camera_info)
            this.viewer.restoreState(camera_info); //it fails to restore state
            // markupsExt.viewer.impl.invalidate(true);
            this.isShowToolbarRestore = true
            this.viewer.setBackgroundColor(0, 59, 111, 255, 255, 255);
            setTimeout(() => {
  
  
  
  
              markupsExt.leaveEditMode();
              markupsExt.show();
              markupsExt.loadMarkups(_marekup_svg, 'markup' + this.ViewPointCurrentShow.ID);
              // this.enterMarkerEditMode()
              this.isShowOldViewPoint = true
  
  
  
            }, 1000);
          })
  
  
  
  
  
        }
  
      }
    }
  
  </script>
  