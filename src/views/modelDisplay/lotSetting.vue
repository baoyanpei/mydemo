<style lang="scss">
  @import "./lotSetting";

</style>
<template>
  <div id="model-lot-setting" class="model-lot-setting" style="margin: 0px;">
    <div id="viewer-local"></div>
  </div>
</template>

<script>
  import loadJs from '@/utils/loadJs.js'
  import Cookies from 'js-cookie'
  import lodash from 'lodash'
  let Base64 = require('js-base64').Base64

  export default {
    name: 'model-lot-setting',
    components: {
    },
    data() {
      return {

        viewer: null, //new Autodesk.Viewing.Private.GuiViewer3D(element, config);
        // stats: new Stats(),
        globalOffset: null,
        urns: [],
        element: null, //document.getElementById('viewer-local');
        project_id: '',
        modelData: null,
        itemList: [],
        itemCurrentFileIdList: [], //当前显示模型的FILE
        itemCurrentItemIdList: [],
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
        // totalHighFps: 0 // 高速fps累计量
      }
    },
    computed: {
      personInfo() {
        return this.$store.state.person.personInfo
      },
    },
    created() {

    },
    watch: {

    },
    async mounted() {

      await loadJs(`./static/libs/viewer3D/viewer3D.min.js`)
      console.log('./static/libs/viewer3D/viewer3D.min.js')
      const __PROJECT_ID = Cookies.get("PROJECT_ID")
      this.project_id = parseInt(__PROJECT_ID)
      this.init()
      this.openComponentLibraryDialogHandle()
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
          // this.itemCurrentFileIdList.push(item.FILE_ID)
          // this.itemCurrentItemIdList.push(item.ITEM_ID)
        })
        // console.log('itemIDList', itemIDList, itemIDList.join(','))
        await this.getItemInfoListByItemIDs(itemIDList.join(','))
        await this.getUrlAndInitView()


      },
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
          // console.log('_result', _result)
          let _urlList = _result['urlList']
          // let _itemInfoList = _result['itemInfoList']
          if (_urlList.length !== 0) {
            this.loadedModels = []
            // console.log('_result123 _itemInfoList', _itemInfoList)
            this.itemCurrentFileIdList = []
            this.itemCurrentItemIdList = []
            this.itemInfoList.forEach(itemInfo => {
              // console.log('itemInfoitemInfo123',itemInfo)
              this.itemCurrentFileIdList.push(itemInfo.file_id)
              this.itemCurrentItemIdList.push(itemInfo.item_id)
              if (itemInfo.item_id === undefined) {
                itemInfo['item_id'] = itemInfo.id
              }
            })

            await this.init3DView(_urlList, this.itemInfoList)
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

            // 初始化设置 渐进式显示
            this.initProgressiveRendering()
          });

        })
      },
      onLoadedEvent(event) {
        console.log('ononLoadedEvent---123', event)
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
              
            }
            resolve(index)
          }, this.onLoadError);


        })
      },

      initEvent() {
        this.viewer.addEventListener(Autodesk.Viewing.CAMERA_CHANGE_EVENT, (rt) => {
          
          
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
      openComponentLibraryDialogHandle() {
        // 打开视角管理窗口
        const param = {
          show: true,
        }
        // this.$store.dispatch('SetVideoDialog', param).then(() => {}).catch(() => {})
        this.$store.dispatch('ShowComponentLibraryListDialog', param).then(() => {}).catch(() => {})
      },
      

      
    }
  }

</script>
