import moment from "moment";
import loadJs from "@/utils/loadJs.js";
let Base64 = require("js-base64").Base64;
export default {
  name: "Lot6-index",
  components: {},
  data() {
    return {
      projID: null,
      tip_message: "",
      nomodel_message: "",
      useFrom: "", // 用途来源  'screen':大屏, 'lot':物联网
      element: null, // document.getElementById('viewer-local');
      viewer: null, // new Autodesk.Viewing.Private.GuiViewer3D(element, config);
      towerGroup: null, // 塔机
      elevatorGroup: null, // 升降机
      sectionGroup: null, // 升降机轨道
      personGroup: null,
      datumMeterMap: new Map(),
      externalExtensionPerson: null,
      globalOffset: null,
      options: {
        env: "Local",
        offline: "true",
        useConsolidation: true,
        useADP: false
      },
      ModelUrlList: [],
      LoadItemIDList: [],
      noModelTip: "",
      towerHeight: 0, // 塔吊高度 28米
      hideDbid: 0, // 需要替换的原始塔吊的id，0为不替换
      showTadiaoInfo: true,
      showShenjiangjiInfo: true,
      showWeatherInfo: true,
      showShuibiaoInfo: true,
      showDianbiaoInfo: true,
      // tdData: {
      //   // 塔吊面板数据
      //   tdgd: 0,
      //   dbjd: "-",
      //   xcjl: "-",
      //   dggd: "-",
      //   sbsj: "-"
      // },
      // sjjData: {
      //   // 升降机面板数据
      //   sjjgd: "-",
      //   sjjlc: "-",
      //   sbsj: "-",
      //   mzt: "-"
      // },
      // weather_data: {
      //   temp: "-",
      //   h: "-",
      //   noise: "-",
      //   wind: "-",
      //   pm10: "-",
      //   pm2_5: "-"
      // },
      // shuibiaoTotalUsed: "-",
      // dianbiaoTotalUsed: "-",
      urns: [],
      config: {
        extensions: [
          // "Autodesk.Viewing.ZoomWindow",
          // "markup3d",
          // "Autodesk.Section"
          // "Autodesk.Viewing.MarkupsCore",
          // "Autodesk.Viewing.AxisHelper"
          // "Viewing.Extension.MeshSelection"
        ],
        disabledExtensions: {
          measure: false,
          section: false
        },
        memory: {
          limit: 32 * 1024 // 32 GB
        }
      },
      storage: window.localStorage,
      storageProgressiveRenderingKey:
        "Autodesk.Viewing.Private.GuiViewer3D.SavedSettings.progressiveRendering",
      isProgressiveRendering: false, // 模型是否重新渲染，闪烁  又叫渐进式显示 设置中有这个选项
      totalLowFps: 0, // 低速fps累计量
      FPS_LOW_LEVEL: 8, // 低于祯数 为慢
      FPS_HIGH_LEVEL: 15, // 高于祯数 为快
      FPS_LOW_TIMES: 50, // 低速fps累计次数

      FamilyListMap: [], // 模型库数据
      LotDeviceList: [], // 已经绑定的物联网设备列表
      LotDeviceModelMap: null, // 所有物联网模型列表
      TajiModelMap: null, // 塔机模型列表
      SjjModelMap: null, // 升降机模型列表
      viewPointCurrentData: null, // 当前的视点数据
      itemsAllMap: new Map(),

      // currentItemIDList: [],
      currentItemList: [],
      currentItemModelList: [], // 当前加载的模型

      cameraInfo: null, // 实时的视点
      allItemList: [], // 所有的模型列表

      isShowDevice: true, // 是否显示设备
      isShowBiaozhu: true, // 是否显示标注
      isShowShuju: true // 是否显示数据
    };
  },
  computed: {},
  watch: {},
  created() {},
  async mounted() {},
  destroyed() {},
  methods: {
    async init(projectId) {
      this.nomodel_message = "";
      this.tip_message = "正在加载模型底层程序...";
      await loadJs(`./static/libs/viewer3D/viewer3D.min.js`);
      console.log("./static/libs/viewer3D/viewer3D.min.js");

      await loadJs(
        `./static/libs/viewer3D/extensions/Viewing.Extension.MeshSelection.js`
      );
      this.tip_message = "";
      console.log("this.useFrom", this.useFrom);
      console.log("lot6-init-init");
      this.projID = projectId;
      if (this.projID === null) {
        return;
      }

      this.showTadiaoInfo = this.isShowShuju;
      this.showShenjiangjiInfo = this.isShowShuju;
      this.showWeatherInfo = this.isShowShuju;
      this.showShuibiaoInfo = this.isShowShuju;
      this.showDianbiaoInfo = this.isShowShuju;

      // 恢复视点的模型
      this.viewPointCurrentData = await this.getViewPointsByType();
      console.log("this.viewPointCurrentData", this.viewPointCurrentData);
      if (this.viewPointCurrentData === null) {
        this.nomodel_message = "当前项目尚未配置物联网建筑模型";
        return;
      }
      await this.init3DView();
      // 获取项目所有的建筑
      this.allItemList = await this.getProjectItemsAll();

      // 获取视点的建筑配置
      this.currentItemList = await this.loadViewPointData();
      await this.loadManyModel();

      // 获取族库map
      this.FamilyListMap = await this.getFamilyList();
      // 获取该项目所有的设备配置
      this.allLotDeviceList = await this.getDeviceConfigList();
      // 获取当前建筑已经配置的设备列表
      this.getLotDeviceList();

      // 加载设备模型
      await this.setLotDeviceModelList();

      // 加载设备标签
      this.addDeviveLabel();

      if (this.useFrom !== "screen") {
        // 初始获取电表水表数据
        await this.initDevlist();
        // 获取物联网设备mqtt数据
        this.$refs.mqttBim.init(this.projID, this.allLotDeviceList);
      }

      // 定位数据
      await this.initExtPerson();
      this.$refs.historyLocation.getLocationHisData(this.projID);
      this.$refs.mqttLocation.init(this.projID);

      // this.initData()

      // 初始化镜头的变化事件
      this.initCameraChangeEvent();
      await this.restoreViewState();
      // 必须先恢复了视点以后才能初始化渐进式显示
      // 初始化设置 渐进式显示
      this.initProgressiveRendering();
    },
    initProgressiveRendering() {
      // 初始化设置 渐进式显示
      let storageProgressiveRendering = this.storage[
        this.storageProgressiveRenderingKey
      ];
      if (storageProgressiveRendering === undefined) {
        this.storage[
          this.storageProgressiveRenderingKey
        ] = this.isProgressiveRendering;
      }
      console.log(
        "this.storage[storageProgressiveRenderingKey]",
        this.storage[this.storageProgressiveRenderingKey]
      );
      this.viewer.setProgressiveRendering(this.isProgressiveRendering);
    },
    initCameraChangeEvent() {
      // 在场景中通过点击添加圆圈标记
      // $(this.viewer.container).bind('click', this.onMouseClick)
      this.viewer.addEventListener(Autodesk.Viewing.CAMERA_CHANGE_EVENT, rt => {
        const _fps = this.viewer.impl.fps();

        // this.avgFps = (this.avgFps + _fps) / 2
        // console.log('avgFps', this.avgFps, this.totalLowFps)
        if (_fps <= this.FPS_LOW_LEVEL) {
          this.totalLowFps++;
        } else if (_fps >= this.FPS_HIGH_LEVEL) {
          if (this.totalLowFps > 0) {
            this.totalLowFps--;
          }
        }
        // console.log(
        //   "当前帧数",
        //   _fps,
        //   "低于",
        //   this.FPS_LOW_LEVEL,
        //   "帧累计次数:",
        //   this.totalLowFps
        // );
        // let storageData = this.storage["lot3-control-" + this.project_id]
        // if (this.isProgressiveRendering === false) {
        if (this.totalLowFps >= this.FPS_LOW_TIMES) {
          this.totalLowFps = 0;
          // this.totalHighFps = 0
          this.isProgressiveRendering = true;
          this.viewer.setProgressiveRendering(this.isProgressiveRendering);
          this.storage[
            this.storageProgressiveRenderingKey
          ] = this.isProgressiveRendering;
          console.log("自动打开渐进式显示");
          this.$message({
            message: "由于您的模型显示不流畅，已经切换为渐进式显示！",
            type: "success"
          });
        }

        // find out all pushpin markups
        // var $eles = $("div[id^='mymk']"),id^='personLabel'
        var $eles = $("div[id^='mymk'],div[id^='personLabel']");
        var DOMeles = $eles.get();

        for (var index in DOMeles) {
          // get each DOM element
          let DOMEle = DOMeles[index];
          let divEle = $("#" + DOMEle.id);
          // get out the 3D coordination
          let val = divEle.data("3DData");
          let pushpinModelPt = JSON.parse(val);
          // get the updated screen point
          let screenpoint = this.viewer.worldToClient(
            new THREE.Vector3(
              pushpinModelPt.x,
              pushpinModelPt.y,
              pushpinModelPt.z
            )
          );
          // update the SVG position.
          // console.log('pushpinModelPt', pushpinModelPt)
          divEle.css({
            left: screenpoint.x - pushpinModelPt.radius,
            top: screenpoint.y - pushpinModelPt.radius
          });
        }
      });

      // drawPushpinLot({
      //   x: -12.590157398363942,
      //   y: -256.6158517922297,
      //   z: -33.46542876355482
      // }, 'lot5', '摄像头');
    },
    onSelectionChanged(event) {
      // console.log('this.viewer', this.viewer)
      // console.log('event1', event)
      let _selections = event.selections;
      console.log("_selections", _selections);
      // this.selectedDbId = _dbIds
      this.selectedDbId = [];
      _selections.forEach(selection => {
        let _dbIdArray = selection.dbIdArray;
        _dbIdArray.forEach(dbId => {
          console.log("dbId", dbId);
          selection.model.getProperties(dbId, elements => {
            var dbid = elements.dbId;
            this.selectedDbId.push(dbid);
            console.log("elements", elements);
            // let min = this.getFragXYZ(dbid)
            // this.drawViewPointLabel(min, 'aaa', 'asd', 'dasd')
          });
        });
      });
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
    addCustomToolBar() {
      // 截屏
      let buttonSnapshot = new Autodesk.Viewing.UI.Button("my-snapshot-button");
      buttonSnapshot.icon.style.backgroundImage =
        "url(./static/icon/ico_restoreMarkup.png)"; // camera

      // 截屏按钮
      buttonSnapshot.onClick = e => {
        // viewer.setViewCube('front')
        // this.snaphot('open')
        this.isProgressiveRendering = !this.isProgressiveRendering;
        this.viewer.setProgressiveRendering(this.isProgressiveRendering);
        this.storage[
          this.storageProgressiveRenderingKey
        ] = this.isProgressiveRendering;

        if (this.isProgressiveRendering === true) {
          this.$message({
            message: "渐进式显示 已经打开！",
            type: "success"
          });
        } else {
          this.$message({
            message: "渐进式显示 已经关闭！",
            type: "success"
          });
        }
      };
      buttonSnapshot.addClass("my-snapshot-button");
      buttonSnapshot.setToolTip(
        "关闭/打开渐进式显示（关闭后拖动和旋转时不闪烁，但可能会影响流畅度）"
      );

      // SubToolbar
      let subToolbar = new Autodesk.Viewing.UI.ControlGroup(
        "my-custom-view-toolbar"
      );
      // subToolbar.addControl(buttonShare)

      // subToolbar.addControl(buttonRestoreMarker)

      subToolbar.addControl(buttonSnapshot);
      // Add subToolbar to main toolbar
      this.viewer.toolbar.addControl(subToolbar);
    },
    addLotToolBar() {
      console.log("addLotToolBar");
      // 设备显示开关
      let buttonEnterLotMode = new Autodesk.Viewing.UI.Button(
        "enter-add-lot-button"
      );
      buttonEnterLotMode.addClass("enter-add-lot-button");
      buttonEnterLotMode.setToolTip("物联网设备模型显示开关");

      if (this.isShowDevice === true) {
        buttonEnterLotMode.icon.style.backgroundImage =
          "url(./static/icon/ico_shebei_b.png)";
      } else {
        buttonEnterLotMode.icon.style.backgroundImage =
          "url(./static/icon/ico_shebei.png)";
      }
      buttonEnterLotMode.onClick = async e => {
        this.isShowDevice = !this.isShowDevice;
        if (this.isShowDevice === true) {
          await this.setLotDeviceModelList();
          if (this.isShowBiaozhu === true) {
            this.showAllDeviceLabel();
          }
          buttonEnterLotMode.icon.style.backgroundImage =
            "url(./static/icon/ico_shebei_b.png)";
        } else {
          this.removeAllDeviceModel();
          buttonEnterLotMode.icon.style.backgroundImage =
            "url(./static/icon/ico_shebei.png)";
        }
      };

      // 标注显示开关
      let buttonLotListDialog = new Autodesk.Viewing.UI.Button(
        "lot-list-dialog-button"
      );
      buttonLotListDialog.addClass("lot-list-dialog-button");
      buttonLotListDialog.setToolTip("物联网设备标签显示开关");
      if (this.isShowBiaozhu === true) {
        buttonLotListDialog.icon.style.backgroundImage =
          "url(./static/icon/ico_biaozhu_b.png)";
      } else {
        buttonLotListDialog.icon.style.backgroundImage =
          "url(./static/icon/ico_biaozhu.png)";
      }

      buttonLotListDialog.onClick = e => {
        this.isShowBiaozhu = !this.isShowBiaozhu;
        if (this.isShowBiaozhu === true) {
          this.showAllPersonLabel();
          this.showAllDeviceLabel();
          buttonLotListDialog.icon.style.backgroundImage =
            "url(./static/icon/ico_biaozhu_b.png)";
        } else {
          // this.removeAllDeviceLabel()
          this.hideAllPersonLabel();
          this.hideAllDeviceLabel();
          buttonLotListDialog.icon.style.backgroundImage =
            "url(./static/icon/ico_biaozhu.png)";
        }
      };

      // 数据显示开关
      let buttonShowShuju = new Autodesk.Viewing.UI.Button("show-shuju-button");
      buttonShowShuju.addClass("show-shuju-button");
      buttonShowShuju.setToolTip("物联网设备数据显示开关");
      if (this.isShowShuju === true) {
        buttonShowShuju.icon.style.backgroundImage =
          "url(./static/icon/ico_shuju_b.png)";
      } else {
        buttonShowShuju.icon.style.backgroundImage =
          "url(./static/icon/ico_shuju.png)";
      }

      buttonShowShuju.onClick = e => {
        this.isShowShuju = !this.isShowShuju;
        this.showTadiaoInfo = this.isShowShuju;
        this.showShenjiangjiInfo = this.isShowShuju;
        this.showWeatherInfo = this.isShowShuju;
        this.showShuibiaoInfo = this.isShowShuju;
        this.showDianbiaoInfo = this.isShowShuju;
        if (this.isShowShuju === true) {
          buttonShowShuju.icon.style.backgroundImage =
            "url(./static/icon/ico_shuju_b.png)";
        } else {
          buttonShowShuju.icon.style.backgroundImage =
            "url(./static/icon/ico_shuju.png)";
        }
      };

      // SubToolbar
      this.ControlLotManager = new Autodesk.Viewing.UI.ControlGroup(
        "my-view-point-toolbar"
      );
      this.ControlLotManager.addControl(buttonEnterLotMode);
      this.ControlLotManager.addControl(buttonLotListDialog);
      if (this.useFrom !== "screen") {
        this.ControlLotManager.addControl(buttonShowShuju);
      }

      // Add subToolbar to main toolbar
      this.viewer.toolbar.addControl(this.ControlLotManager);
    },
    getProjectItemsAll() {
      return new Promise((resolve, reject) => {
        const param = {
          method: "project_items",
          project_id: this.projID
          // access_token: this.access_token
        };
        this.$store.dispatch("GetProjectItems", param).then(_itemList => {
          _itemList.forEach(item => {
            this.itemsAllMap.set(item.id, item);
          });

          resolve(_itemList);
        });
      });
    },
    init3DView() {
      return new Promise((resolve, reject) => {
        // this.urns = modelURLList
        Autodesk.Viewing.Initializer(this.options, async () => {
          this.element = document.getElementById("viewer-local");
          this.viewer = new Autodesk.Viewing.Private.GuiViewer3D(
            this.element,
            this.config
          );

          this.viewer.addEventListener(
            Autodesk.Viewing.GEOMETRY_LOADED_EVENT,
            this.onLoadedEvent
          );

          this.viewer.addEventListener(
            // Autodesk.Viewing.SELECTION_CHANGED_EVENT,
            Autodesk.Viewing.AGGREGATE_SELECTION_CHANGED_EVENT,
            this.onSelectionChanged
          );
          var startedCode = this.viewer.start();
          if (startedCode > 0) {
            console.error("Failed to create a Viewer: WebGL not supported.");
            return;
          }

          if (!this.viewer.overlays.hasScene("custom-scene")) {
            this.viewer.overlays.addScene("custom-scene");
          }
          resolve();
        });
      });
    },
    getViewPointsByType() {
      return new Promise((resolve, reject) => {
        const param = {
          method: "GetViewPoints",
          type: 4, // 物联网的展示页面的视点类型
          project_id: this.projID
        };
        this.$store.dispatch("GetViewPoints", param).then(_viewPointList => {
          console.log("GetViewPoints", _viewPointList);
          let _viewPoint = null;
          if (_viewPointList.length > 0) {
            _viewPoint = _viewPointList[0];
          }

          resolve(_viewPoint);
        });
      });
    },
    loadViewPointData() {
      return new Promise(async (resolve, reject) => {
        let itemList = [];
        if (this.viewPointCurrentData !== null) {
          let _itemIds = this.viewPointCurrentData.item_ids;
          if (_itemIds !== null && _itemIds !== "") {
            let _itemIdlist = JSON.parse(_itemIds);
            if (_itemIdlist.length > 0) {
              _itemIdlist.forEach(_id => {
                let _item = this.itemsAllMap.get(_id);
                itemList.push(_item);
              });
            }
          }
        }
        resolve(itemList);
      });
    },
    async loadManyModel() {
      return new Promise(async (resolve, reject) => {
        // let _result = this.getModelUrl()
        let modelURLList = [];

        this.currentItemList.forEach(itemInfo => {
          modelURLList.push(
            itemInfo.url
              .replace("/www/bim_proj/", "")
              .replace("/BCP_FILE/", "BCP_FILE/")
          );
        });

        if (modelURLList.length === 0) {
          resolve();
        } else {
          let _Plist = [];
          for (var i = 0; i < modelURLList.length; i++) {
            let p = await this.loadBuildModel(
              modelURLList[i],
              this.currentItemList[i],
              i
            );
            _Plist.push(p);
          }
          Promise.all(_Plist).then(result => {
            resolve();
          });
        }
      });
    },
    // getModelUrl() {
    //   let result = null
    //   let _urlList = []
    //   this.currentItemList.forEach(itemInfo => {
    //     _urlList.push(itemInfo.url.replace('/www/bim_proj/', '').replace('/BCP_FILE/', 'BCP_FILE/'))
    //   });
    //   result = {
    //     'urlList': _urlList,
    //   }
    //   return result
    // },
    onLoadedEvent(event) {
      //   console.log('ononLoadedEvent---123', event)
    },
    loadBuildModel(modelURL, itemInfo, index) {
      return new Promise((resolve, reject) => {
        console.log("----------------", index);
        const modelOpts = {
          placementTransform: new THREE.Matrix4(),
          globalOffset: {
            x: 0,
            y: 0,
            z: 0
          }
        };
        this.viewer.loadModel(
          modelURL,
          modelOpts,
          async model => {
            model["item_id"] = itemInfo.item_id;
            this.currentItemModelList.push(model);
            // this.loadedModels.push(model)
            if (index === 0) {
              if (this.useFrom === "screen") {
                // this.viewer.fitToView()
                this.viewer.setBackgroundColor(22, 39, 61, 13, 20, 51);
              } else {
                // this.viewer.fitToView()
                this.viewer.setBackgroundColor(0, 59, 111, 255, 255, 255);
              }
              // this.viewer.setGroundShadow(true)
              this.viewer.setReverseZoomDirection(true); // true 滚动向前为放大
              // this.viewer.setProgressiveRendering(this.isProgressiveRendering)

              this.addLotToolBar();
              this.addCustomToolBar();
            }
            resolve(index);
          },
          this.onLoadError
        );
      });
    },
    getFamilyList() {
      return new Promise((resolve, reject) => {
        const param = {
          method: "family_query",
          project_id: this.projID
          // access_token: this.access_token
        };
        this.$store.dispatch("GetFamilyQuery", param).then(_itemList => {
          let _mapData = new Map();
          _itemList.forEach(itemInfo => {
            _mapData.set(itemInfo.id, itemInfo);
          });
          resolve(_mapData);
        });
      });
    },
    // 获取该项目的设备配置
    getDeviceConfigList() {
      return new Promise((resolve, reject) => {
        this.buildList = [];
        const param = {
          method: "device_config",
          project_id: this.projID
          // buliding_id: this.itemInfoList[0].item_id
        };
        this.$store.dispatch("GetDeviceConfig", param).then(_itemList => {
          console.log("GetDeviceConfig - _itemList", _itemList);

          resolve(_itemList);
        });
      });
    },
    async setLotDeviceModelList() {
      return new Promise(async (resolve, reject) => {
        if (this.isShowDevice === false) {
          resolve();
          return;
        }

        this.LotDeviceModelMap = new Map();
        this.TajiModelMap = new Map();
        this.SjjModelMap = new Map();
        let _Plist = [];
        console.log("this.LotDeviceListthis.LotDeviceList", this.LotDeviceList);
        for (var i = 0; i < this.LotDeviceList.length; i++) {
          const LotDevice = this.LotDeviceList[i];
          if (LotDevice.device_type === 13) {
            // 塔吊
            this.loadTajiModel(LotDevice);
          } else if (LotDevice.device_type === 12) {
            // 升降机
            this.loadSjjModel(LotDevice);
          } else {
            // 其他物联网设备
            let p = await this.loadDeviceModel(LotDevice, i);
            _Plist.push(p);
          }
        }
        Promise.all(_Plist).then(result => {
          resolve();
        });
      });
    },
    loadDeviceModel(itemInfo, index) {
      return new Promise((resolve, reject) => {
        let _familyModel = this.FamilyListMap.get(itemInfo.family_id);

        if (_familyModel === undefined) {
          resolve(-1);
        }
        let _familyLocation = itemInfo.family_location;
        const familyLocation = JSON.parse(_familyLocation);
        console.log("_familyModel_familyModel", _familyModel);
        let _url = _familyModel.file.replace("/BCP_FILE/", "BCP_FILE/");

        const modelOpts = {
          placementTransform: new THREE.Matrix4(),
          globalOffset: {
            x: 0,
            y: 0,
            z: 0
          }
        };
        this.viewer.loadModel(
          _url,
          modelOpts,
          model => {
            model.infoData = _familyModel;
            this.LotDeviceModelMap.set(itemInfo.id, {
              deviceData: itemInfo,
              model: model
            });

            const _x = familyLocation.rotate.x;
            const _y = familyLocation.rotate.y;
            const _z = familyLocation.rotate.z;
            this.RotateModel(model, 1, 0, 0, _x);
            this.RotateModel(model, 0, 1, 0, _y);
            this.RotateModel(model, 0, 0, 1, _z);
            this.MoveModel(
              model,
              familyLocation.position.x,
              familyLocation.position.y,
              familyLocation.position.z
            );

            resolve(index);
          },
          this.onLoadError
        );
      });
    },
    onLoadError(event) {
      console.log("fail");
    },

    loadTajiModel(tajiData) {
      console.log("tajiData", tajiData);
      if (tajiData.family_id > 0) {
        const familyLocation = JSON.parse(tajiData.family_location);
        let towerGroup = new THREE.Group();
        towerGroup.scale.set(
          familyLocation.scale,
          familyLocation.scale,
          familyLocation.scale
        );
        towerGroup.position.set(
          familyLocation.position.x,
          familyLocation.position.y,
          familyLocation.position.z
        );
        // towerGroup.name = `towerGroup${tajiData.id}`;
        modifyTower2(
          towerGroup,
          `towerGroup${tajiData.id}`,
          familyLocation.height,
          familyLocation.rotate.z,
          0,
          0,
          0
        ); // towerGroup,名称，高度，初始化角度大臂角度，小车距离，吊钩线长

        this.viewer.overlays.impl.addOverlay("custom-scene", towerGroup);

        // let _familyModel = this.FamilyListMap.get(tajiData.family_id);
        // towerGroup.infoData = _familyModel;
        this.LotDeviceModelMap.set(tajiData.id, {
          deviceData: tajiData,
          model: towerGroup
        });

        this.TajiModelMap.set(tajiData.device_id, {
          deviceData: tajiData,
          model: towerGroup
        });
      }
    },
    loadSjjModel(sjjData) {
      console.log("sjjData", sjjData);
      if (sjjData.family_id > 0) {
        const familyLocation = JSON.parse(sjjData.family_location);
        let elevatorGroup = new THREE.Group();
        elevatorGroup.scale.set(
          familyLocation.scale,
          familyLocation.scale,
          familyLocation.scale
        );
        elevatorGroup.position.set(
          familyLocation.elevatorPosition.x,
          familyLocation.elevatorPosition.y,
          familyLocation.elevatorPosition.z
        );

        elevatorGroup.rotateZ(
          familyLocation.elevatorRotate.z * (Math.PI / 180)
        );

        modifyElevator(elevatorGroup, `elevatorGroup${sjjData.id}`, 0, false); // 名称，高度，门的开启状态
        this.viewer.overlays.impl.addOverlay("custom-scene", elevatorGroup);

        // 升降机的轨道
        let sectionGroup = new THREE.Group();
        sectionGroup.scale.set(
          familyLocation.scale,
          familyLocation.scale,
          familyLocation.scale
        );

        sectionGroup.position.set(
          familyLocation.sectionPosition.x,
          familyLocation.sectionPosition.y,
          familyLocation.sectionPosition.z
        );

        sectionGroup.rotateZ(familyLocation.sectionRotate.z * (Math.PI / 180));

        this.viewer.overlays.impl.addOverlay("custom-scene", sectionGroup);
        LoadSection(sectionGroup, familyLocation.sectionHeight);

        this.LotDeviceModelMap.set(sjjData.id, {
          deviceData: sjjData,
          elevatorModel: elevatorGroup,
          sectionModel: sectionGroup
        });

        this.SjjModelMap.set(sjjData.device_id, {
          deviceData: sjjData,
          elevatorModel: elevatorGroup,
          sectionModel: sectionGroup
        });
        // this.viewer.impl.invalidate(true, true, true)
      }
    },
    // 清除所有的设备
    removeAllDeviceModel() {
      if (this.LotDeviceModelMap !== null) {
        this.LotDeviceModelMap.forEach((value, key) => {
          console.log("valuevaluevaluevalue", value);
          if (value.deviceData.device_type === 13) {
            this.viewer.overlays.impl.removeOverlay(
              "custom-scene",
              value.model
            );
          } else if (value.deviceData.device_type === 12) {
            this.viewer.overlays.impl.removeOverlay(
              "custom-scene",
              value.elevatorModel
            );
            this.viewer.overlays.impl.removeOverlay(
              "custom-scene",
              value.sectionModel
            );
          } else if (
            value.deviceData.family_id > 0 &&
            value.deviceData.family_id < 999999
          ) {
            this.viewer.unloadModel(value.model);
          }

          // this.viewer.unloadModel(this.viewer.model)
        });
        this.TajiModelMap = null;
        this.SjjModelMap = null;
        this.LotDeviceModelMap = null;
      }
    },
    // 获取当前建筑已经配置的设备列表
    getLotDeviceList() {
      this.LotDeviceList = [];
      this.currentItemList.forEach(item => {
        this.allLotDeviceList.forEach(device => {
          if (item.id === device.buliding_id) {
            this.LotDeviceList.push(device);
          }
        });
      });
    },
    restoreViewState() {
      return new Promise((resolve, reject) => {
        if (this.cameraInfo === null) {
          // this.cameraInfo = this.viewer.getState()
          if (this.viewPointCurrentData !== null) {
            let _cameraInfo = JSON.parse(
              Base64.decode(this.viewPointCurrentData.camera_info)
            );
            if (_cameraInfo !== null && _cameraInfo !== "") {
              this.cameraInfo = _cameraInfo;
            }
          }
        }
        if (this.cameraInfo !== null) {
          setTimeout(() => {
            console.log(
              "restoreStaterestoreStaterestoreStaterestoreState",
              this.cameraInfo
            );
            this.viewer.restoreState(this.cameraInfo); // it fails to restore state
            resolve();
          }, 3000);
          // this.currentItemModelList.forEach(model => {
          //   this.viewer.impl.visibilityManager.isolate(-1, model);
          // })
        }
      });
    },
    MoveModel(model, x, y, z) {
      const thisModel = model; // viewer.getAggregateSelection()[0].model
      const fragCount = thisModel.getFragmentList().fragments.fragId2dbId
        .length;
      for (let fragId = 0; fragId < fragCount; ++fragId) {
        const fragProxy = this.viewer.impl.getFragmentProxy(thisModel, fragId);
        fragProxy.getAnimTransform();
        // const position = new THREE.Vector3(
        //   fragProxy.position.x + x,
        //   fragProxy.position.y + y,
        //   fragProxy.position.z + z
        // );
        const position = new THREE.Vector3(x, y, z);
        fragProxy.position = position;
        fragProxy.updateAnimTransform();
      }
      this.viewer.impl.sceneUpdated(true);
    },
    geWorldBoundingBox(fragIds, fragList) {
      var fragbBox = new THREE.Box3();
      var nodebBox = new THREE.Box3();
      fragIds.forEach(fragId => {
        fragList.getWorldBounds(fragId, fragbBox);
        nodebBox.union(fragbBox);
      });
      return nodebBox;
    },
    rotateFragments(model, fragIdsArray, axis, angle, center) {
      var quaternion = new THREE.Quaternion();
      quaternion.setFromAxisAngle(axis, angle);
      fragIdsArray.forEach((fragId, idx) => {
        var fragProxy = this.viewer.impl.getFragmentProxy(model, fragId);
        fragProxy.getAnimTransform();
        var position = new THREE.Vector3(
          fragProxy.position.x - center.x,
          fragProxy.position.y - center.y,
          fragProxy.position.z - center.z
        );
        position.applyQuaternion(quaternion);
        position.add(center);
        fragProxy.position = position;
        fragProxy.quaternion.multiplyQuaternions(
          quaternion,
          fragProxy.quaternion
        );
        if (idx === 0) {
          var euler = new THREE.Euler();
          euler.setFromQuaternion(fragProxy.quaternion, 0);
          // this.emit('transform.rotate', {
          //     rotation: euler,
          //     model
          // })
        }
        fragProxy.updateAnimTransform();
      });
      this.viewer.impl.sceneUpdated(true);
    },
    RotateModel(model, axisX, axisY, axisZ, angle) {
      const thisModel = model; //viewer.getAggregateSelection()[0].model
      const fragCount = thisModel.getFragmentList().fragments.fragId2dbId
        .length;
      let fragIdsArray = [];
      for (var fragId = 0; fragId < fragCount; ++fragId) {
        fragIdsArray.push(fragId);
      }
      var bBox = this.geWorldBoundingBox(
        fragIdsArray,
        thisModel.getFragmentList()
      );
      var center = new THREE.Vector3(
        (bBox.min.x + bBox.max.x) / 2,
        (bBox.min.y + bBox.max.y) / 2,
        (bBox.min.z + bBox.max.z) / 2
      );

      // var size = Math.max(
      //     bBox.max.x - bBox.min.x,
      //     bBox.max.y - bBox.min.y,
      //     bBox.max.z - bBox.min.z) * 0.8

      var axis = new THREE.Vector3(axisX, axisY, axisZ);
      this.rotateFragments(
        thisModel,
        fragIdsArray,
        axis,
        (angle * Math.PI) / 180,
        center
      );
    },
    getModelBox(model) {
      //   console.log('modelmodelmodelmodel', model)
      const thisModel = model; // viewer.getAggregateSelection()[0].model
      const fragCount = thisModel.getFragmentList().fragments.fragId2dbId
        .length;
      let fragIdsArray = [];
      for (var fragId = 0; fragId < fragCount; ++fragId) {
        fragIdsArray.push(fragId);
      }
      var bBox = this.geWorldBoundingBox(
        fragIdsArray,
        thisModel.getFragmentList()
      );
      // console.log("bBox", model.myData.bbox.min.z);
      // var center = new THREE.Vector3(
      //   (bBox.min.x + bBox.max.x) / 2,
      //   (bBox.min.y + bBox.max.y) / 2,
      //   (bBox.min.z + bBox.max.z) / 2)
      return model.myData.bbox;
    },
    removeAllDeviceLabel() {
      $(".mymlLabel").remove();
    },
    showAllDeviceLabel() {
      $(".mymlLabel").show();
    },
    hideAllDeviceLabel() {
      $(".mymlLabel").hide();
    },
    showAllPersonLabel() {
      $(".personLabel").show();
    },
    hideAllPersonLabel() {
      $(".personLabel").hide();
    },
    addDeviveLabel() {
      this.LotDeviceList.forEach(deviceInfo => {
        // console.log("deviceInfo", deviceInfo);
        let _familyLocation = deviceInfo.family_location;
        const familyLocation = JSON.parse(_familyLocation);

        if (deviceInfo.device_type === 12) {
          familyLocation.position = familyLocation.sectionPosition;
        }
        const _x = familyLocation.position.x;
        const _y = familyLocation.position.y;
        const _z = familyLocation.position.z;

        let _zzz = 0;

        if (this.LotDeviceModelMap !== null) {
          let _modelData = this.LotDeviceModelMap.get(deviceInfo.id);
          // console.log("_modelData_modelData_modelData", _modelData);
          if (_modelData !== undefined) {
            if (deviceInfo.device_type === 13) {
              console.log("计算塔机的标签");
            } else if (deviceInfo.device_type === 12) {
              console.log("计算升降机的标签");
            } else {
              let _model = _modelData.model;
              const _bbox = this.getModelBox(_model);
              _zzz = Math.abs(_bbox.max.z - _bbox.min.z);
            }
          }
        }
        // let _xxx = Math.abs(_bbox.max.x - _bbox.min.x)
        // let _yyy = Math.abs(_bbox.max.y - _bbox.min.y)
        this.drawPushpinLot(
          {
            x: _x,
            y: _y,
            z: _z + _zzz
          },
          deviceInfo.id,
          deviceInfo.device_name,
          deviceInfo
        );
      });
    },
    drawPushpinLot(pushpinModelPt, id, name, data) {
      // this.viewer.loadExtension('IconMarkupExtension', {
      //   icons: [{
      //     dbId: 495,
      //     label: '300C',
      //     css: 'fas fa-thermometer'
      //   }]
      // });
      // console.log('idididid', id)
      // convert 3D position to 2D screen coordination
      const screenpoint = this.viewer.worldToClient(
        new THREE.Vector3(pushpinModelPt.x, pushpinModelPt.y, pushpinModelPt.z)
      );
      const randomId = id; // makeid();
      $("#mymk" + randomId).remove();
      // build the div container

      var htmlMarker =
        '<div id="mymk' + randomId + '" class="mymlLabel">' + name + "</div>";
      var parent = this.viewer.container;
      $(parent).append(htmlMarker);
      if (this.isShowBiaozhu === false) {
        $("#mymk" + randomId).hide();
      }

      $("#mymk" + randomId).css({
        // 'pointer-events': 'none',
        width: "80px",
        // 'height': '16px',
        position: "absolute",
        overflow: "visible"
      });
      $("#mymk" + randomId).click(() => {
        console.log("data", data);
        if (data.device_type === 16) {
          let deviceData = data;
          if (deviceData === undefined) {
            this.$message({
              message: "此摄像头未配置数据",
              type: "error"
            });
          } else if (deviceData.video_url === "") {
            this.$message({
              message: "此摄像头无法直播",
              type: "error"
            });
          } else {
            const param = {
              show: true,
              deviceData: deviceData
            };
            this.$store
              .dispatch("SetVideoDialog", param)
              .then(() => {})
              .catch(() => {});
          }
        }
      });
      // build the svg element and draw a circle
      // $('#mymk' + randomId).append('<svg id="mysvg' + randomId + '"></svg>')

      // var snap = Snap($('#mysvg' + randomId)[0]);
      var rad = 40;
      // set the position of the SVG
      // adjust to make the circle center is the position of the click point
      var $container = $("#mymk" + randomId);
      $container.css({
        left: screenpoint.x - rad,
        top: screenpoint.y - rad
      });

      // store 3D point data to the DOM
      var div = $("#mymk" + randomId);
      // add radius info with the 3D data
      pushpinModelPt.radius = rad;
      var storeData = JSON.stringify(pushpinModelPt);
      div.data("3DData", storeData);
    },
    mqttWeather(data) {
      let _data = JSON.parse(data);
      this.LotDeviceModelMap.forEach(device => {
        const _deviceData = device.deviceData;
        if (_deviceData.device_type === 15) {
          const _station_nbr = `${_data.station}${_data.nbr}`;
          if (_deviceData.device_id === _station_nbr) {
            _data.device_name = _deviceData.device_name;
            _data.station_nbr = _station_nbr;
          }
        }
      });
      this.showHJJCYData(_data);
      // $('#divHJJCY').html(_h)
      // this.$refs.weather.updateData(_data)
    },
    mqttTaDiao(cmd, data) {
      // 塔吊
      console.log("塔吊", cmd, data);
      const _data = JSON.parse(data);
      // console.log('幅度-RRange:', _data.RRange, '高度-Height:', _data.Height, '角度-Angle:', _data.Angle)
      // console.log('RealtimeDataCrane', _data)
      // $("#td_dbjd").html(_data.rotate); // 回转
      // $("#td_xcjl").html(_data.extent); // 幅度
      // $("#td_dggd").html(_data.height); // 吊钩高度
      // $("#td_sbsj").html(moment(_data.created_time).format("HH:mm:ss")); // moment(_data.RTime).format('HH:mm:ss')

      const _tjData = this.TajiModelMap.get(_data.device_id);
      // console.log("_tjData_tjData_tjData_tjData", _tjData);
      if (_tjData.model !== null) {
        const _deviceData = _tjData.deviceData;
        const familyLocation = JSON.parse(_deviceData.family_location);
        let _dgxc = familyLocation.height - _data.height; // 吊钩线长

        modifyTower2(
          _tjData.model,
          `towerGroup${_deviceData.id}`,
          familyLocation.height,
          familyLocation.rotate.z,
          parseInt(_data.rotate),
          parseInt(_data.extent),
          _dgxc
        ); // towerGroup,名称，高度，初始化角度大臂角度，小车距离，吊钩线长

        // console.log("塔吊_data", _data);
        // 刷新模型
        if (this.isProgressiveRendering === false) {
          // 渐进显示关闭状态下
          this.viewer.impl.invalidate(true, true, true);
        }
        _data.device_name = _deviceData.device_name;
        _data.displayHeight = familyLocation.displayHeight;
        this.showTaDiaoData(_data);
        // 名称，高度，大臂角度，小车距离，吊钩线长
      }
    },
    mqttShenJiangJi(cmd, data) {
      // 升降机
      // console.log('升降机', cmd)
      let _data = null;
      switch (cmd) {
        case "RealtimeDataElevator": // 2.11上报升降机实时数据（专用）
          _data = JSON.parse(data);

          console.log(
            "升降机高度",
            `E${_data.HxzId}`,
            _data.Height,
            _data.Height - 91 / 3
          );
          // console.log('RealtimeDataElevator', _data)
          // console.log('高度', _data.Height)
          // 获取数据之后调用方法初始化或者调整状态
          let doorOpen = true;
          if (_data.DoorState === "0") {
            doorOpen = false;
          }

          const _tjData = this.SjjModelMap.get(_data.device_id);
          // console.log("_tjData_tjData_tjData_tjData", _tjData);
          if (_tjData.model !== null) {
            const _deviceData = _tjData.deviceData;
            const familyLocation = JSON.parse(_deviceData.family_location);
            modifyElevator(
              _tjData.elevatorModel,
              `elevatorGroup${_deviceData.id}`,
              _data.Height - 91 / 3,
              doorOpen
            ); // 名称，高度，门的开启状态
          }

          // if (this.elevatorGroup === null) {
          //   return;
          // }

          // viewer.overlays.impl.removeOverlay('custom-scene', elevatorGroup)

          // modifyElevator(
          //   this.levatorGroup,
          //   `E${_data.HxzId}`,
          //   _data.Height - 91 / 3,
          //   doorOpen
          // ); // 名称，高度，门的开启状态

          // 刷新模型
          if (this.isProgressiveRendering === false) {
            // 渐进显示关闭状态下
            this.viewer.impl.invalidate(true, true, true);
          }
          // viewer.overlays.impl.addOverlay('custom-scene', elevatorGroup)
          // viewer.impl.invalidate(true);
          // viewer.overlays.impl.sceneUpdated(true)
          $("#sjj_gd").html(_data.Height);
          $("#sjj_lc").html(_data.Floor);
          $("#sjj_sbsj").html(moment(_data.RTime).format("HH:mm:ss"));
          /*
          0:内外笼门全关
          1:内外笼门全开
          2:仅内笼门开
          3:仅外笼门开
          */
          switch (_data.DoorState) {
            case "0":
              $("#sjj_lmzt").html("内外笼门全关");
              break;
            case "1":
              $("#sjj_lmzt").html("内外笼门全开");
              break;
            case "2":
              $("#sjj_lmzt").html("仅内笼门开");
              break;
            case "3":
              $("#sjj_lmzt").html("仅外笼门开");
              break;
          }

          // this.$refs.taji.updateData(_data)
          // this.$refs.shenjiangji.updateData(_data)
          break;
        case "WorkDataElevator": // 2.11上报升降机工作循环数据（专用）
          _data = JSON.parse(data);
          // console.log('WorkDataElevator', _data)
          // this.$refs.taji.updateData(_data)
          break;
      }
    },
    initPerson(obj) {
      // 收到定位数据以后，被调用
      console.log("objobjobj", obj);
      let _position = {
        x: obj.x / 1000,
        y: obj.y / 1000 + 150,
        z: (obj.layer - 1) * 3.5 + 1.6
      };
      this.addPersonMesh(obj.name, obj, _position);
    },
    initDevlist() {
      return new Promise((resolve, reject) => {
        const param = {
          method: "devlist",
          project_id: this.projID
        };
        this.$store
          .dispatch("QueryDatumMeter", param)
          .then(deviceList => {
            // console.log('QueryDatumMeter - data', data)
            // data.forEach(datum => {
            //   this.datumMeterMap.set(datum.device_id, datum);
            // });
            deviceList.forEach(device => {
              if (device.device_type === 10) {
                // 电表
                // console.log('devicdianbiaoTotalUsede1234', device)
                // this.dianbiaoTotalUsed = device.total_used;
                // $("#divDianBiao" + device.device_id).html(device.total_used);
                this.showDianbiaoData(device);
              } else if (device.device_type === 11) {
                // 水表
                // console.log('shuibiaoTotalUsed', device)
                // this.shuibiaoTotalUsed = device.total_used;
                this.showShuibiaoData(device);
                // $("#divShuiBiao" + device.device_id).html(device.total_used);
              }
            });

            resolve();
            setTimeout(() => {
              this.initDevlist();
            }, 60 * 1000);
          })
          .catch(e => {
            console.log(e);
            resolve();
          });
      });
    },
    initExtPerson() {
      return new Promise((resolve, reject) => {
        console.log("MeshSelectionMeshSelectionMeshSelection");
        this.viewer
          .loadExtension("Viewing.Extension.MeshSelection")
          .then(externalExtension => {
            this.externalExtensionPerson = externalExtension;
            resolve();
          });
      });
    },
    addPersonMesh(name, userData, position) {
      const geometry = new THREE.BoxGeometry(5, 5, 5);

      const color = "#FF0000"; // Math.floor(Math.random() * 16777215)
      const material = new THREE.MeshPhongMaterial({
        specular: new THREE.Color(color),
        side: THREE.DoubleSide,
        reflectivity: 0.0,
        color
      });

      const materials = this.viewer.impl.getMaterials();

      materials.addMaterial(color.toString(16), material, true);

      const mesh = new THREE.Mesh(geometry, material);

      mesh.position.x = position.x; // -71
      mesh.position.y = position.y; // -81
      mesh.position.z = position.z;
      mesh.name = name;
      mesh.userData = userData;
      console.log("mesh.position", mesh.position);
      this.externalExtensionPerson.addPersonToView(mesh);

      if (name === "") {
        name = userData.mac;
      }
      this.drawPushpinPerson(
        {
          x: position.x,
          y: position.y,
          z: position.z
        },
        userData.mac,
        name
      );

      if (this.isProgressiveRendering === false) {
        // 渐进显示关闭状态下
        this.viewer.impl.invalidate(true, true, true);
      }
    },
    // 人员定位的标签
    drawPushpinPerson(pushpinModelPt, id, name) {
      // console.log('idididid', id)
      // convert 3D position to 2D screen coordination
      var screenpoint = this.viewer.worldToClient(
        new THREE.Vector3(pushpinModelPt.x, pushpinModelPt.y, pushpinModelPt.z)
      );

      // build the div container
      var randomId = id; // makeid();
      $("#personLabel" + randomId).remove();
      var htmlMarker =
        '<div id="personLabel' +
        randomId +
        '" class="personLabel">' +
        name +
        "</div>";
      var parent = this.viewer.container;
      $(parent).append(htmlMarker);
      $("#personLabel" + randomId).css({
        "pointer-events": "none",
        width: "60px",
        height: "16px",
        position: "absolute",
        overflow: "hidden"
      });

      // var snap = Snap($('#mysvg' + randomId)[0]);
      var rad = 30;
      // set the position of the SVG
      // adjust to make the circle center is the position of the click point
      var $container = $("#personLabel" + randomId);
      $container.css({
        left: screenpoint.x - rad,
        top: screenpoint.y - rad
      });

      // store 3D point data to the DOM
      var div = $("#personLabel" + randomId);
      // add radius info with the 3D data
      pushpinModelPt.radius = rad;
      var storeData = JSON.stringify(pushpinModelPt);
      div.data("3DData", storeData);
    }
  }
};
