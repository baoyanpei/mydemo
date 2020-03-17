<style lang="scss">
  @import "./positionPictureSaveDialog";

</style>
<template>

  <div id="position-picture-save-dialog" class="position-picture-save-dialog">
    <el-dialog :modal="true" :close-on-click-modal="false" width="900px" top="10vh" :lock-scroll="true"
      :visible.sync="PositionPictureSaveDialog.show" @opened="openedSaveDialogHandle" @close="closeSaveDialogHandle"
      :title="dialogTitle" v-el-drag-dialog>
      <div class="oper-area">
        <el-button @click='handleSaveDialogCancel' size="mini">取 消</el-button>
        <el-button type="primary" :loading="loadingSaveViewPoint" @click="handleSaveDialogSubmit" size="mini">保 存
        </el-button>

      </div>
      <div class="position-picture-save-area">
        <div id="viewer-positon-picture-save"></div>
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
        viewer: null, //new Autodesk.Viewing.Private.GuiViewer3D(element, config);
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
        console.log('PositionPictureSaveDialog', this.PositionPictureSaveDialog)
        this.pointViewData = this.PositionPictureSaveDialog.pointViewData
        let _item_ids = this.pointViewData.item_ids
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
            // this.itemCurrentFileIdList = []
            this.itemCurrentItemIdList = []
            this.itemInfoList.forEach(itemInfo => {
              // this.itemCurrentFileIdList.push(itemInfo.file_id)
              this.itemCurrentItemIdList.push(itemInfo.item_id)
              // if (itemInfo.item_id === undefined) {
              //   itemInfo['item_id'] = itemInfo.id
              // }
            })
            // console.log('_urlList', _urlList, this.itemInfoList)
            await this.init3DView(_urlList, this.itemInfoList)
            // this.viewer.addEventListener(
            //   Autodesk.Viewing.AGGREGATE_SELECTION_CHANGED_EVENT,
            //   this.onSelectionChanged
            // );
            this.initEvent()
            this.clearAllViewPointMarkrt()
            this.ShowViewPointMarkerAll()
          }
          resolve()
        })
      },
      getModelUrl() {
        let result = null
        let _urlList = []
        // let _itemInfoList = []
        this.itemInfoList.forEach(itemInfo => {
          // console.log('itemInfo111', itemInfo)
          // 服务端地址转换
          // console.log('process.env.BASE_DOMAIN_BIM', process.env.BASE_DOMAIN_BIM)
          // _urlList.push(itemInfo.url.replace('/www/bim_proj/', process.env.BASE_DOMAIN_BIM))
          _urlList.push(itemInfo.url.replace('/www/bim_proj/', '').replace('/BCP_FILE/', 'BCP_FILE/'))
          // _itemInfoList.push(itemInfo)
          // 本地地址转换
          // _urlList.push(build.ITEM_URL.replace('/www/bim_proj/', '/static/'))
        });
        result = {
          'urlList': _urlList,
          // 'itemInfoList': _itemInfoList
        }
        return result
      },
      init3DView(modelURLList, itemInfoList) {
        return new Promise((resolve, reject) => {
          Autodesk.Viewing.Initializer(this.options, async () => {
            if (this.viewer === null) {
              this.element = document.getElementById('viewer-positon-picture-save');
              this.viewer = new Autodesk.Viewing.Private.GuiViewer3D(this.element, this.config);
              // this.viewer.addEventListener(
              //   Autodesk.Viewing.GEOMETRY_LOADED_EVENT,
              //   this.onLoadedEvent
              // );
              const startedCode = this.viewer.start();
              if (startedCode > 0) {
                console.error('Failed to create a Viewer: WebGL not supported.');
                return;
              }
            }

            let _Plist = []
            // viewer.loadModel("https://lmv-models.s3.amazonaws.com/toy_plane/toy_plane.svf", undefined,
            // onLoadSuccess, onLoadError);
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
              if (!this.viewer.overlays.hasScene('custom-scene-1')) {
                this.viewer.overlays.addScene('custom-scene-1');
              }
              this.saveStatus = JSON.stringify(this.viewer.getState());
              // this.addCustomToolBar()
              // this.addViewpointToolBar()
              // this.showAllViewpointToolBar()
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
      async ShowViewPointMarkerAll() {
        let red = new THREE.Vector4(1, 0, 0, 1);
        // let _viewPointAllList = await this.GetViewpointsDataAll(1)
        // console.log('_viewPointAllList', _viewPointAllList)
        // console.log('this.loadedModels', this.loadedModels)
        this.loadedModels.forEach(model => {
          this.itemInfoList.forEach(itemInfo => {
            let _camera_info = JSON.parse(Base64.decode(this.pointViewData.camera_info))
            let _item_id = itemInfo.item_id
            let _name = this.pointViewData.name
            if (model.item_id === _item_id) {
              let markId = `mark_${_item_id}`
              // 眼睛的位置
              const eyeData = _camera_info.viewport.eye
              var eyeV = new THREE.Vector3(eyeData[0], eyeData[1], eyeData[2]);
              // 添加任务的标注的标签-是标签
              // this.drawViewPointLabel(eyeV, markId, _name, 'dasd')
              this.drawViewPointMarker(eyeV, markId, _name, 'dasd')
            }

          })

          this.viewer.impl.visibilityManager.isolate(-1, model);

        })
        console.log('this.viewer', this.viewer)
        // this.viewer.autocam.cube.cubeRotateTo('top'); 
        let vc = await this.viewer.loadExtension('Autodesk.ViewCubeUi')
        // vc.setViewCube('top');
        vc.setViewCube('left top front');


      },
      drawViewPointMarker(pushpinModelPt, id, name, data) {
        const geom = new THREE.SphereGeometry(1);
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
      handleSaveDialogSubmit() {
        this.clearData()
      },
    }
  }

</script>
