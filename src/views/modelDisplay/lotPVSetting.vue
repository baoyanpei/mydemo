<style lang="scss">
  @import "./lotPVSetting";

</style>
<template>
  <div id="lot-pv-setting" class="lot-pv-setting" style="margin: 0px;">
    <div id="viewer-local"></div>
    <div v-if="isShowViewPointArea" class="viewPointShowArea">
      <div class="viewPointTitle">
        <div class="title">
          <span>物联网场景管理</span>
        </div>
      </div>
    </div>
    <div v-if="isShowToolbarMarker" class="toolbar-marker">
      <el-button class="marker-button" title="保存">
        <font-awesome-icon :icon="['far','save']" />
      </el-button>

      <hr />

      <el-button class="marker-button" title="建筑模型设置">
        <font-awesome-icon icon="layer-group" @click="openLotPVModelListSettingDialogHandle" />
      </el-button>


    </div>
    <lotPVModelListSettingDialog></lotPVModelListSettingDialog>
  </div>
</template>

<script>
  // 构件库列表

  import loadJs from '@/utils/loadJs.js'
  import Cookies from 'js-cookie'
  import lodash from 'lodash'
  let Base64 = require('js-base64').Base64

  import lotPVModelListSettingDialog from '@/views/modelDisplay/lotPVModelListSettingDialog'

  export default {
    name: 'lot-pv-setting',
    components: {
      lotPVModelListSettingDialog
    },
    data() {
      return {

        viewer: null, //new Autodesk.Viewing.Private.GuiViewer3D(element, config);
        urns: [],
        element: null, //document.getElementById('viewer-local');
        project_id: '',
        modelData: null,
        itemList: [],
        itemsAllMap: new Map(),
        itemInfoList: [],
        config: {
          extensions: [
            // "Autodesk.Viewing.ZoomWindow",
            // "markup3d",
            // "Autodesk.Section",
            // "Autodesk.Viewing.MarkupsCore",
            // "Autodesk.Viewing.AxisHelper"
            // 'Autodesk.Viewing.MemoryLimitedDebug'
          ],
          disabledExtensions: {
            measure: false,
            section: false,
          },
          memory: {
            limit: 32 * 1024 // 32 GB
          },
          // loaderExtensions: { svf: "Autodesk.MemoryLimited" },

        },
        options: {
          env: 'Local', // AutodeskDevelopment
          offline: 'true',
          useConsolidation: true,
          useADP: false,
          // consolidationMemoryLimit: 15000 * 1024 * 1024 // 150MB - Optional, defaults to 100MB
        },
        // MarkupsCore: null,
        ControlLotManager: null,
        isShowViewPointArea: true,
        isShowToolbarMarker: true,
        saveStatus: null,
        selectedDbId: [], // 选择的构件id
        loadedModels: [],
        storage: window.localStorage,
        storageProgressiveRenderingKey: 'Autodesk.Viewing.Private.GuiViewer3D.SavedSettings.progressiveRendering',
        isProgressiveRendering: true, // 模型是否重新渲染，闪烁  又叫渐进式显示 设置中有这个选项
        totalLowFps: 0, // 低速fps累计量
        FPS_LOW_LEVEL: 8, // 低于祯数 为慢
        FPS_HIGH_LEVEL: 15, // 高于祯数 为快
        FPS_LOW_TIMES: 50, // 低速fps累计次数

        FamilyListMap: [], // 模型库数据
        LotDeviceList: [], // 已经绑定的物联网设备列表
        LotDeviceModelMap: null, // 物联网模型列表
        // currentDeviceOpType: 0, // 当前设备模型的编辑模式 0:新增模式 1:编辑模式
        currentDeviceModel: null, // 当前正在操作的设备模型
        currentDeviceData: null, // 当前正在操作的设备数据
        currentEditModelName: {
          name: ''
        }, // 当前编辑的模型信息，用于顶部title显示
        currentItemIDList: [],
        currentItemList: []
        // totalHighFps: 0 // 高速fps累计量
      }
    },
    computed: {
      personInfo() {
        return this.$store.state.person.personInfo
      },
      LotPVModelListChange() {
        return this.$store.state.loT.LotPVModelListChange
      },

    },
    created() {

    },
    watch: {
      LotPVModelListChange: {
        handler: function (newVal, oldVal) {
          console.log('LotPVModelListChange ', newVal)
          this.currentItemIDList = newVal

          this.currentItemList.forEach(item => {
            this.viewer.unloadModel(this.viewer.model)
          })

          this.getCurrentItemData(this.currentItemIDList.SelectedItemList)
          console.log('currentItemList', this.currentItemList)

          this.loadManyModel()

        },
        deep: true
      },

    },
    async mounted() {

      await loadJs(`./static/libs/viewer3D/viewer3D.min.js`)
      console.log('./static/libs/viewer3D/viewer3D.min.js')
      const __PROJECT_ID = Cookies.get("PROJECT_ID")
      this.project_id = parseInt(__PROJECT_ID)
      this.init()

    },
    beforeDestroy() {},
    destroyed() {},
    methods: {
      async init() {
        await this.getProjectItemsAll()
        await this.init3DView()

      },
      async loadManyModel() {
        let _result = this.getModelUrl()
        console.log('getModelUrl - result', _result)

        let modelURLList = _result['urlList']
        let _Plist = []
        for (var i = 0; i < modelURLList.length; i++) {
          let p = await this.loadModel(modelURLList[i], this.currentItemList[i], i)
          _Plist.push(p)

        }

        Promise.all(_Plist).then(result => {
          // resolve()
        })
      },
      getProjectItemsAll() {
        return new Promise((resolve, reject) => {
          const param = {
            method: 'project_items',
            project_id: this.project_id,
            // access_token: this.access_token
          }
          this.$store.dispatch('GetProjectItems', param).then((_itemList) => {
            console.log('getProjectItemsAll - _itemList', _itemList)
            _itemList.forEach(item => {
              this.itemsAllMap.set(item.id, item)
            });

            resolve()

          })

        })
      },
      getCurrentItemData(itemIdList) {
        console.log('getCurrentItemData', itemIdList)
        this.currentItemList = []
        itemIdList.forEach(_id => {
          console.log('_id', _id)
          let _item = this.itemsAllMap.get(_id)
          // itemsAllMap.set(item.id, item)
          this.currentItemList.push(_item)
        });

      },
      init3DView(modelURLList, itemInfoList) {
        return new Promise((resolve, reject) => {
          // this.urns = modelURLList
          Autodesk.Viewing.Initializer(this.options, async () => {
            this.element = document.getElementById('viewer-local');
            this.viewer = new Autodesk.Viewing.Private.GuiViewer3D(this.element, this.config);

            this.viewer.addEventListener(
              Autodesk.Viewing.GEOMETRY_LOADED_EVENT,
              this.onLoadedEvent
            );
            var startedCode = this.viewer.start();
            if (startedCode > 0) {
              console.error('Failed to create a Viewer: WebGL not supported.');
              return;
            }
            this.viewer.setBackgroundColor(0, 59, 111, 255, 255, 255);
            // this.viewer.setGroundShadow(true)
            // this.viewer.setReverseZoomDirection(true) //true 滚动向前为放大

          });

        })
      },
      onLoadedEvent(event) {
        console.log('ononLoadedEvent---123', event)
      },
      getModelUrl() {
        let result = null
        let _urlList = []
        // let _itemInfoList = []
        this.currentItemList.forEach(itemInfo => {
          // _urlList.push(itemInfo.url.replace('/www/bim_proj/', process.env.BASE_DOMAIN_BIM))
          _urlList.push(itemInfo.url.replace('/www/bim_proj/', '').replace('/BCP_FILE/', 'BCP_FILE/'))
        });
        result = {
          'urlList': _urlList,
        }
        return result
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
            // this.loadedModels.push(model)
            if (index === 0) {
              this.viewer.setBackgroundColor(0, 59, 111, 255, 255, 255);
              this.viewer.setGroundShadow(true)
              this.viewer.setReverseZoomDirection(true) //true 滚动向前为放大
              this.viewer.setProgressiveRendering(this.isProgressiveRendering)
              // if (!this.viewer.overlays.hasScene('custom-scene-1')) {
              //   this.viewer.overlays.addScene('custom-scene-1');
              // }
              // this.saveStatus = JSON.stringify(this.viewer.getState());
              // this.addCustomToolBar()
              // this.addViewpointToolBar()
              // this.showAllViewpointToolBar()
            }
            resolve(index)
          }, this.onLoadError);


        })
      },
      openLotPVModelListSettingDialogHandle() {
        // 打开构件列表窗口
        const param = {
          show: true,
        }
        this.$store.dispatch('ShowLotPVModelListSettingDialog', param).then(() => {}).catch(() => {})
      }
    }
  }

</script>
