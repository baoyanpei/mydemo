<style lang="scss">
  @import "./positionPictureSaveDialog";

</style>
<template>

  <div id="position-picture-save-dialog" class="position-picture-save-dialog">
    <el-dialog :modal="true" :close-on-click-modal="false" width="900px" top="10vh" :lock-scroll="true"
      :visible.sync="PositionPictureSaveDialog.show" @opened="openedSaveDialogHandle" @close="closeSaveDialogHandle"
      :title="dialogTitle" v-el-drag-dialog>
      <el-row :gutter="20">
        <el-col :span="3">
          <span style="line-height: 40px;padding-left: 15px;font-weight: 600;font-size: 12px;">标记点的大小:</span>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple" style="padding:0px;">
            <el-slider v-model="GeometrySize" :max="10" :min="1" :step="1" :marks="marks" show-stops
              @change="changeGeometrySizeHandle"></el-slider>
          </div>
        </el-col>
        <el-col :span="9">
          <div class="grid-content bg-purple">
            &nbsp;
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <div class="oper-area">
              <el-button @click='handleSaveDialogCancel' size="mini">取 消</el-button>
              <el-button type="primary" :loading="loadingSaveViewPoint" @click="handleSaveDialogSubmit" size="mini">保 存
              </el-button>

            </div>
          </div>
        </el-col>
      </el-row>
      <!-- <div class="param-area">
        <div class="block">

        </div>
      </div> -->

      <div class="position-picture-save-area">
        <div id="viewer-positon-picture-save">
          <div v-if="inittips" class="inittips">正在初始化，请耐心等待......</div>
        </div>
      </div>
      <div style="width:100vw; height:100vh;display:none;top:0px;left:0px;">
        <canvas id="snapshotPositionPictureSave" style="position:absolute;"></canvas>
      </div>
    </el-dialog>
  </div>

</template>

<script>
  import {
    getToken
  } from '@/utils/auth'
  export default {
    components: {},
    directives: {},
    data() {
      return {
        dialogTitle: '编辑位置信息',
        inittips: false,
        loading: false,
        type: 1, // type 1 俯视图 2 侧视图
        GeometrySize: 5, // 标记点的尺寸
        marks: {
          1: '小',
          10: '大'
        },
        viewer: null, //new Autodesk.Viewing.Private.GuiViewer3D(element, config);
        markupsExt: null,
        options: {
          env: 'Local',
          offline: 'true',
          useConsolidation: true,
          useADP: false
        },
        config: {
          extensions: [
            // "Autodesk.Viewing.ZoomWindow",
            // "markup3d",
            // "Autodesk.Section",
            "Autodesk.Viewing.MarkupsCore",
            // "Autodesk.Viewing.AxisHelper"
          ],
          disabledExtensions: {
            measure: true,
            section: true,
          },
          memory: {
            limit: 32 * 1024 // 32 GB
          }
        },
        loadingSaveViewPoint: false, // 保存视点按钮加载
        pointViewData: null, // 传递过来的视点数据
        itemInfoList: [], // item的列表
        // itemCurrentFileIdList: [], //当前显示模型的FILE
        itemCurrentItemIdList: [],
        saveStatus: null,
      }
    },
    computed: {
      project_id: {
        get: function () {
          return this.$store.state.project.project_id
        },
        set: function (newValue) {
          this.$store.state.project.project_id = newValue
        }
      },
      PositionPictureSaveDialog: {
        get: function () {
          return this.$store.state.viewPoint.PositionPictureSaveDialog
        },
        set: function (newValue) {
          this.$store.state.viewPoint.PositionPictureSaveDialog = newValue
        }
      },
    },
    props: {

    },
    created: function () {

    },
    mounted() {

    },
    watch: {

    },
    methods: {
      clearData() {
        // this.viewer.shutdown();
        this.inittips = false
        try {
          if (this.viewer !== null) {

            this.clearAllViewPointMarkrt()
            this.viewer.removeEventListener(Autodesk.Viewing.CAMERA_CHANGE_EVENT)
            this.itemCurrentItemIdList.forEach(async item => {
              await this.viewer.unloadModel(this.viewer.model)
            })
            // this.viewer.tearDown()

            // this.viewer.uninitialize()
          }
        } catch (err) {
          console.log('error2020317', err)
        }



      },
      handleSaveDialogCancel() {
        this.closeSaveDialogHandle()
      },
      closeSaveDialogHandle() {
        this.clearData()
        const param = {
          show: false,
        }
        this.$store.dispatch('ShowPositionPictureSaveDialog', param).then(() => {}).catch(() => {})

      },
      async openedSaveDialogHandle() {
        if (this.viewer === null) {
          this.inittips = true
        }
        this.loadingSaveViewPoint = true
        console.log('PositionPictureSaveDialog', this.PositionPictureSaveDialog)
        this.pointViewData = this.PositionPictureSaveDialog.pointViewData
        let _item_ids = this.pointViewData.item_ids
        this.type = this.PositionPictureSaveDialog.type
        await this.getItemInfoListByItemIDs(_item_ids)
        await this.getUrlAndInitView()
        
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
            resolve()
          })
        })
      },
      async getUrlAndInitView() {
        return new Promise(async (resolve, reject) => {
          let _result = this.getModelUrl()
          console.log('_result', _result)
          let _urlList = _result['urlList']
          if (_urlList.length !== 0) {
            this.loadedModels = []
            this.itemCurrentItemIdList = []
            this.itemInfoList.forEach(itemInfo => {
              this.itemCurrentItemIdList.push(itemInfo.item_id)

            })
            await this.init3DView(_urlList, this.itemInfoList)
            this.initEvent()
            this.clearAllViewPointMarkrt()
            this.ShowViewPointMarkerAll()
            this.setViewCube()

          }
          resolve()
        })
      },
      getModelUrl() {
        let result = null
        let _urlList = []
        // let _itemInfoList = []
        this.itemInfoList.forEach(itemInfo => {
          // 服务端地址转换
          // _urlList.push(itemInfo.url.replace('/www/bim_proj/', process.env.BASE_DOMAIN_BIM))
          _urlList.push(itemInfo.url.replace('/www/bim_proj/', '').replace('/BCP_FILE/', 'BCP_FILE/'))
          // 本地地址转换
          // _urlList.push(build.ITEM_URL.replace('/www/bim_proj/', '/static/'))
        });
        result = {
          'urlList': _urlList,
        }
        return result
      },
      init3DView(modelURLList, itemInfoList) {
        return new Promise((resolve, reject) => {
          Autodesk.Viewing.Initializer(this.options, async () => {
            if (this.viewer === null) {
              this.inittips = false
              this.element = document.getElementById('viewer-positon-picture-save');
              this.viewer = new Autodesk.Viewing.Private.GuiViewer3D(this.element, this.config);
              this.viewer.addEventListener(
                // Autodesk.Viewing.SELECTION_CHANGED_EVENT,

                Autodesk.Viewing.GEOMETRY_LOADED_EVENT,
                this.onLoadedEvent
              );
              const startedCode = this.viewer.start();

              if (startedCode > 0) {
                console.error('Failed to create a Viewer: WebGL not supported.');
                return;
              }
            }

            let _Plist = []
            for (var i = 0; i < modelURLList.length; i++) {
              let p = await this.loadModel(modelURLList[i], itemInfoList[i], i)
              _Plist.push(p)

            }
            Promise.all(_Plist).then(result => {
              resolve()
            })
          });

        })
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
          this.viewer.loadModel(modelURL, modelOpts, (model) => {
            model['item_id'] = itemInfo.item_id
            this.loadedModels.push(model)
            if (index === 0) {

              this.viewer.setBackgroundColor(0, 59, 111, 255, 255, 255);
              this.viewer.setGroundShadow(false)
              this.viewer.setReverseZoomDirection(true) //true 滚动向前为放大
              this.viewer.fitToView()
              if (!this.viewer.overlays.hasScene('custom-scene-1')) {
                this.viewer.overlays.addScene('custom-scene-1');
              }
              this.saveStatus = JSON.stringify(this.viewer.getState());
            }
            resolve(index)
          }, this.onLoadError);


        })
      },
      initEvent() {
        this.viewer.addEventListener(Autodesk.Viewing.CAMERA_CHANGE_EVENT, (rt) => {

          // find out all pushpin markups
          const $eles = $("div[id^='mymk']")
          const DOMeles = $eles.get()

          for (let index in DOMeles) {

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
              'left': screenpoint.x - pushpinModelPt.radius * 2 + 10,
              'top': screenpoint.y - pushpinModelPt.radius - 10
            })
          }
        })
      },
      onLoadedEvent() {
        console.log('ononLoadedEvent', event)
        this.loadingSaveViewPoint = false
      },
      // 清除所有的标记点
      clearAllViewPointMarkrt() {
        this.resetIsolateMode()
        this.viewer.overlays.removeScene('custom-scene-2');
      },

      resetIsolateMode() {
        // viewer.setViewCube('front')
        this.loadedModels.map(model => this.viewer.clearThemingColors(model));
        this.viewer.impl.visibilityManager.aggregateIsolate([]);
        $(".mymlLabel").remove()
      },
      // 显示所有添加的视点
      ShowViewPointMarkerAll() {
        let red = new THREE.Vector4(1, 0, 0, 1);
        this.loadedModels.forEach(model => {
          this.itemInfoList.forEach(itemInfo => {
            let _camera_info = JSON.parse(Base64.decode(this.pointViewData.camera_info))
            let _item_id = itemInfo.item_id
            let _name = this.pointViewData.name
            if (model.item_id === _item_id) {
              let markId = `mark_${_item_id}`
              // 眼睛的位置
              const eyeData = _camera_info.viewport.eye
              const eyeV = new THREE.Vector3(eyeData[0], eyeData[1], eyeData[2]);
              this.drawViewPointMarker(eyeV, markId, _name, 'dasd')
            }

          })

          this.viewer.impl.visibilityManager.isolate(-1, model);

        })


      },
      drawViewPointMarker(pushpinModelPt, id, name, data) {
        const geom = new THREE.SphereGeometry(this.GeometrySize);
        const material = new THREE.MeshBasicMaterial({
          color: 0xff0000
        });
        var sphereMesh = new THREE.Mesh(geom, material);
        sphereMesh.position.set(pushpinModelPt.x, pushpinModelPt.y, pushpinModelPt.z);
        if (!this.viewer.overlays.hasScene('custom-scene-2')) {
          this.viewer.overlays.addScene('custom-scene-2');
        }
        this.viewer.overlays.addMesh(sphereMesh, 'custom-scene-2');
      },
      changeGeometrySizeHandle(value) {
        console.log('changeGeometrySizeHandle', value)
        this.clearAllViewPointMarkrt()
        this.ShowViewPointMarkerAll()
      },
      async setViewCube() {
        let vc = await this.viewer.loadExtension('Autodesk.ViewCubeUi')
        switch (this.type) {
          case 1:
            setTimeout(() => {
              vc.setViewCube('top');
            }, 1000);
            break;
          case 2:
            setTimeout(() => {
              vc.setViewCube('left top front');
            }, 1000);
            break;
        }
      },
      // openPicture() {
      //   const img = new Image();
      //   img.src = document.getElementById('snapshotPositionPictureSave').toDataURL("image/png");
      //   // console.log('dada', document.getElementById('snapshot').toDataURL("image/png"))
      //   const newWin = window.open("", "_blank");
      //   newWin.document.write(img.outerHTML);
      //   newWin.document.title = "截图"
      //   newWin.document.close();
      // },
      handleSaveDialogSubmit() {
        this.loadingSaveViewPoint = true
        let screenshot = new Image();
        screenshot.onload = () => {
          this.viewer.loadExtension('Autodesk.Viewing.MarkupsCore').then((markupsExt) => {
            this.markupsExt = this.viewer.getExtension("Autodesk.Viewing.MarkupsCore");
            let canvas = document.getElementById('snapshotPositionPictureSave');
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

          });


          setTimeout(() => {
            this.loadingSaveViewPoint = false
            // this.openPicture()
            let markupsBase64 = document.getElementById('snapshotPositionPictureSave').toDataURL("image/png")
            // console.log(markupsBase64)

            const param = {
              markupsBase64: markupsBase64,
              type: this.type
            }
            this.$store.dispatch('GetPositionPictureSaveData', param).then(() => {
              this.closeSaveDialogHandle()
            }).catch(() => {})

          }, 1000);
        };

        // Get the full image
        this.viewer.getScreenShot(this.viewer.container.clientWidth, this.viewer.container.clientHeight, function (
          blobURL) {
          screenshot.src = blobURL;
          console.log('blobURL', blobURL)
        });
      },
    }
  }

</script>
