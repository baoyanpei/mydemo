<style lang="scss">
  @import "./lotArea.scss";

</style>
<template>
  <div id="screen-loT" class="screen-loT" style="margin: 0px;">
    <div id="screen-loT-canvas3d" class="child-host"></div>
    <div id="stat-div-loT" class="stat-div-loT"></div>
    <loadModel v-on:unitAllRemove="unitAllRemove" v-on:unitGroupAddMesh="unitGroupAddMesh"
      v-on:unitGroupAddDB="unitGroupAddDB" v-on:unitRemove="unitRemove" v-on:addLoadingText="addLoadingText"
      v-on:unitTotalAdd="unitTotalAdd"></loadModel>
    <mqttLocation v-on:initPerson="initPerson"></mqttLocation>
    <mqttBim v-on:mqttWeather="mqttWeather" v-on:mqttTJ="mqttTJ"></mqttBim>
    <div class="model3d-progress">
      <!-- <div>加载 {{addedUnit}}/{{totalUnit}} 个组件</div> -->
      <div>{{loadingText}}</div>
      <!-- <el-progress :percentage="percentage" color="#6ac044" :show-text="showText"></el-progress> -->

    </div>
    <div class="divDataTadiao">
      <div style="padding-bottom: 5px;font-size: 14px;">塔吊</div>
      <div>塔吊高度：<span id="td_tdgd">{{tdData.tdgd}}</span> 米</div>
      <div>大臂角度：<span id="td_dbjd">{{tdData.dbjd}}</span> 度</div>
      <div>小车距离：<span id="td_xcjl">{{tdData.xcjl}}</span> 米</div>
      <div>吊钩线长：<span id="td_dgxc">{{tdData.dgxc}}</span> 米</div>
      <div>上报时间：<span id="td_sbsj">{{tdData.sbsj}}</span></div>
    </div>
    <div class="divDataShenJiangJi">
      <div style="padding-bottom: 5px;font-size: 14px;">升降机</div>
      <div>高度：<span id="sjj_gd">{{sjjData.sjjgd}}</span> 米</div>
      <div>楼层：<span id="sjj_lc">{{sjjData.sjjlc}}</span> 层</div>
      <div>笼门状态：<span id="sjj_lmzt">{{sjjData.mzt}}</span> </div>
      <div>上报时间：<span id="sjj_sbsj">{{sjjData.sbsj}}</span></div>
    </div>
    <!-- <div class="bim-toolbar">
      <div class="bim-toolbar1">
        <div>
          <el-tooltip class="item" effect="dark" content="清理数据缓存" placement="top">
            <el-button @click="personInoutDialogHandle">
              <font-awesome-icon icon="magic" size="2x" />
            </el-button>
          </el-tooltip>
        </div>
      </div>

      <div class="bim-toolbar2">
        <div>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>
  import moment from 'moment'
  import Cookies from 'js-cookie'
  import Vue from 'vue'
  import IndexedDB from '../../../indexedDB/IndexedDB'
  import {
    // getOriStr,
    getOriMesh
  } from '@/utils/model3d'
  import {
    mapState
  } from 'vuex'
  import loadModel from "../../loT/components/loadModel2"
  import mqttLocation from "../../loT/components/mqttLocation"
  import mqttBim from "../../loT/components/mqttBim"
  import {
    Loading
  } from 'element-ui';
  import {
    CSS2DRenderer,
    CSS2DObject
  } from 'three-css2drender';
  import $ from 'jquery'
  // const MQTT_USERNAME = 'BIM_messager' // mqtt连接用户名
  // const MQTT_PASSWORD = 'bim_msg159' // mqtt连接密码 
  // const CLIENT_ID = 'WebClient-' + parseInt(Math.random() * 100000)

  const TOWER_HEIGHT = 75 //塔吊高度
  // console.log('12313123123')
  //   window.onresize = onWindowResize;
  const AreaWidth = 1020
  const AreaHeight = 510
  let fov = 35 //75 this.gui.fov //拍摄距离  视野角值越大，场景中的物体越小
  let near = 1 //相机离视体积最近的距离
  let far = 800 //相机离视体积最远的距离
  let aspect = (AreaWidth) / (AreaHeight); //纵横比
  let scene = null
  let camera = null
  let stats = new Stats()
  stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
  // document.body.appendChild(this.stats.dom);

  let directionalLight = null
  let ambient = null
  let renderer = null

  let controls = null
  // var walls = new THREE.Group();
  // let unitGroups = new Array(20)
  let showGroup = null
  let unitGroups = null
  let deviceGroup = null
  let personGroup = null

  let towerGroup = null // 塔机
  let elevatorGroup = null // 升降机
  let sectionGroup = null // 升降机轨道
  let labelRenderer = null


  function animate() {
    stats.begin();
    render();
    stats.end();
    requestAnimationFrame(animate);
    if (controls) {
      controls.update();
    }
    if (scene !== null) {
      scene.updateMatrixWorld(true);
    }

  };

  //   function onWindowResize() {
  //     if (renderer !== null) {
  //       camera.aspect = window.innerWidth / window.innerHeight;
  //       camera.updateProjectionMatrix();
  //       renderer.setSize(window.innerWidth, window.innerHeight);
  //       renderer.render(scene, camera);
  //     }

  //   }

  //光源
  function initLight() {
    directionalLight = new THREE.DirectionalLight(0xF6CB90, 2); //模拟远处类似太阳的光源
    directionalLight.position.set(30, 50, 70).normalize();
    directionalLight.castShadow = true;
    ambient = new THREE.AmbientLight(0xffffff, 2); //AmbientLight,影响整个场景的光源
    ambient.position.set(0, 0, 0);

    scene.add(directionalLight);
    scene.add(ambient);
  }

  function initControls() {
    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 1;
    controls.screenSpacePanning = true;
    controls.minDistance = 0;
    controls.maxDistance = 500;
    controls.maxPolarAngle = Math.PI / 2;

  }

  //辅助坐标轴
  function initAxes() {
    let size = 1000; // - （可选）表示轴的线的大小。默认值为1
    let axesHelper = new THREE.AxesHelper(size);
    axesHelper.name = "axesHelper";
    scene.add(axesHelper);
  }

  //窗口变动触发的函数
  //   function onWindowResize() {
  //     camera.aspect = window.innerWidth / window.innerHeight;
  //     camera.updateProjectionMatrix();
  //     renderer.setSize(window.innerWidth, window.innerHeight);
  //     renderer.render(scene, camera);
  //   }

  function render() {
    if (renderer !== null) {
      renderer.render(scene, camera);
    }

    if (scene != null && labelRenderer !== null) {
      labelRenderer.render(scene, camera);
    }

  }

  function clearScene() {
    // 从scene中删除模型并释放内存
    console.log('scene', scene)
    let len = scene.children.length
    console.log('len', len)
    if (len > 0) {
      for (var i = 0; i < len; i++) {
        var currObj = scene.children[i];

        // 判断类型
        if (currObj.type === 'Group') {
          console.log('currObj', currObj)
          var children = currObj.children;
          deleteGroup(currObj);
          console.log('currObj1', currObj)
          // for (var i = 0; i < children.length; i++) {
          //   // console.log('children', children[i])
          //   deleteGroup(children[i]);
          //   // console.log('21312313',currObj,children[i])
          //   currObj.remove(children[i])
          // }

        } else {
          deleteGroup(currObj);
        }
        // scene.remove(currObj);
      }
    }
  }

  //go
  // 删除group，释放内存
  function deleteGroup(group) {
    //console.log(group);
    if (!group) return;
    // 删除掉所有的模型组内的mesh
    group.traverse(function (item) {
      if (item instanceof THREE.Mesh) {

        item.geometry.dispose(); // 删除几何体
        item.material.dispose(); // 删除材质
      }

    });
  }



  let mainCanvas = null


  // initAxes()

  animate();

  function initThree() {
    console.log('mainCanvas', mainCanvas)
    scene = new THREE.Scene();
    // if (mainCanvas === null) {
    //初始化变量
    mainCanvas = document.getElementById('screen-loT-canvas3d')

    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.up = new THREE.Vector3(0, 0, 1); //相机以哪个方向为上方
    camera.position.set(-130, -0, 80);
    camera.position.set(150, 200, 190);
    scene.add(camera);

    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
    renderer.setSize(AreaWidth, AreaHeight);
    controls = new THREE.MapControls(camera, renderer.domElement);

    mainCanvas.appendChild(renderer.domElement);
    renderer.setClearColor(0xcccccc, 1);



    labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(AreaWidth, AreaHeight);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.pointerEvents = 'none';
    labelRenderer.domElement.style.top = 0;
    mainCanvas.appendChild(labelRenderer.domElement);
    // this.labelRenderer.setSize(window.innerWidth, window.innerHeight);


    // var buildingGroup = {}
    unitGroups = new THREE.Group()
    unitGroups.name = "unitGroups"
    scene.add(unitGroups)
    showGroup = new THREE.Group()
    showGroup.name = "showGroup"
    scene.add(showGroup)
    deviceGroup = new THREE.Group()
    deviceGroup.name = "deviceGroup";
    scene.add(deviceGroup)

    personGroup = new THREE.Group()
    personGroup.name = "personGroup";
    scene.add(personGroup)
    // unitGroups.visible = false
    // scene.add(walls)
    // for (let i = 0, len = unitGroups.length; i < len; i++) {
    //   unitGroups[i] = new THREE.Group()

    //   scene.add(unitGroups[i])
    //   unitGroups[i].visible = false
    // }


    document.getElementById('stat-div-loT').appendChild(stats.dom);
    initLight()
    initControls()
    // // initAxes()

    // animate();
    // }

  }

  export default {
    directives: {},
    name: 'model3D-index',
    components: {
      loadModel,
      mqttLocation,
      mqttBim
      // ModelDetail
    },
    data() {
      return {
        loadtext: '开始加载模型....',
        loader: new THREE.ObjectLoader(),
        modelDB: null,
        loadingText: '',
        renderEnabled: true,
        projectiveObj: null,
        mainCanvas: null,
        raycaster: null,
        mouse: null,

        unitLoadingSet: new Set(), // 模型加载数组 
        unitRemoveSet: new Set(), // 删除队列

        showText: true,

        percentage: 0,
        totalUnit: 0,
        addedUnit: 0,

        saveData: null,
        lablePosisionList: {},
        modMap: new Map(),
        towerHeight: TOWER_HEIGHT, // 塔吊高度 28米

        deviceMap: new Map(),
        datumMeterMap: new Map(),
        tdData: {
          tdgd: TOWER_HEIGHT,
          dbjd: '-',
          xcjl: '-',
          dgxc: '-',
          sbsj: '-'
        },
        sjjData: {
          sjjgd: '-',
          sjjlc: '-',
          sbsj: '-',
          mzt: '-'
        },
        indexedDBWaitList: new Map(),
        worker: new Worker("/static/workIndexedDB.js"),
        lablePosisionList: {},
      }
    },
    computed: {
      indexed_ver() {
        return this.$store.state.project.indexed_ver
      },
      project_id() {
        return this.$store.state.project.project_id
      },
      modelMap() {
        return this.$store.state.model3d.modelMap
      },
    },
    created() {
      IndexedDB.openDB('tbbim', 1, this.modelDB, {
        name: 'model',
        key: 'modelID'
      }, (db) => {
        this.modelDB = db
      })

    },
    watch: {
      project_id(curVal, oldVal) {

      },
    },

    async mounted() {

      // if (mainCanvas ===null){
      initThree()
      // }

      // this.loadingDialog = this.$loading({
      //   lock: false,
      //   text: this.loadtext,
      //   spinner: 'el-icon-loading',
      //   background: 'rgba(0, 0, 0, 0.3)',
      //   customClass: 'loading-class',
      //   target: document.querySelector('.screen-loT')
      // });
      // console.log('indexed_ver', this.indexed_ver)
      let _IndexDBDataVer = Cookies.get('IndexDBDataVer')
      // console.log('IndexDBDataVer', _IndexDBDataVer)
      if (this.indexed_ver !== _IndexDBDataVer) {
        await this.clearDB()
        Cookies.set('IndexDBDataVer', this.indexed_ver)
      }
      await this.initDevlist()

      this.initMouse()


      // window.onresize = this.onWindowResize;

      // this.mqttConnect()
      towerGroup = new THREE.Group() // 塔机
      towerGroup.name = "towerGroup";
      if (scene) {
        scene.add(towerGroup)
        towerGroup.position.set(60, 22, 0); // 红 绿
        modifyTower(towerGroup, "T1", this.towerHeight, 0, 0, 0); //名称，高度，大臂角度，小车距离，吊钩线长
      };


      elevatorGroup = new THREE.Group() // 升降机
      elevatorGroup.name = "elevatorGroup";
      if (scene) {
        scene.add(elevatorGroup)
        elevatorGroup.position.set(78.5, 24, 0);
      };
      modifyElevator(elevatorGroup, "E1", 0, false) //名称，高度，门的开启状态

      sectionGroup = new THREE.Group() // 升降机轨道
      sectionGroup.name = "sectionGroup";
      if (scene) {
        scene.add(sectionGroup)
        sectionGroup.position.set(80, 26, 0); // 红 绿
      };
      LoadSection(sectionGroup,67)

      this.addDataToDB()
    },
    beforeDestroy() {
      // $('#screen-loT-canvas3d').empty()
      // scene.remove(showGroup)
      clearScene()
      console.log('13213scene', scene)
      scene.remove(unitGroups)
      scene.remove(showGroup)
      scene.remove(towerGroup)
      scene.remove(elevatorGroup)
      scene.remove(sectionGroup)
      scene.remove(directionalLight);
      scene.remove(ambient);
      scene.remove(deviceGroup)
      scene.remove(personGroup)
      renderer.dispose()
      renderer = null
      scene = null
      THREE.Cache.clear()
      unitGroups = null
      showGroup = null
      deviceGroup = null
      personGroup = null
      towerGroup = null
      elevatorGroup = null
      sectionGroup = null
      $('#screen-loT-canvas3d').empty()
      mainCanvas = null
      clearTimeout(this.timeRemove)
    },
    destroyed() {},
    methods: {
      clearDB() {
        return new Promise((resolve, reject) => {
          let modelDB = null
          IndexedDB.openDB('tbbim', 1, modelDB, {
            name: 'model',
            key: 'modelID'
          }, (db) => {
            modelDB = db
            IndexedDB.clearData(modelDB, 'model')
            // console.log('清理完成')
            resolve()
          })
        })
      },
      initDevlist() {
        return new Promise((resolve, reject) => {
          const param = {
            method: 'devlist',
            project_id: 10000
          }
          this.$store.dispatch('QueryDatumMeter', param).then((data) => {
            // console.log('QueryDatumMeter - data', data)
            data.forEach(datum => {
              this.datumMeterMap.set(datum.device_id, datum)
            })
            resolve()
          }).catch((e) => {
            console.log(e)
            resolve()
          })


        })
      },
      mqttTJ(data) {
        // console.log('mqttTJ', data)
        const _destinationName = data.destinationName
        const _payloadString = data.payloadString

        //destinationNameArray => ["BIM", "Sets", "zhgd", "DEYE", "18090311", "RealtimeDataCrane"]
        const destinationNameArray = _destinationName.split('/')
        // console.log('destinationNameArray', destinationNameArray)
        const TJNO = destinationNameArray[4] //黑匣子编号
        const _cmd = destinationNameArray[5] //指令
        switch (TJNO) {
          case "18090311": // 塔吊
            // console.log('塔吊', data)
            this.mqttTaDiao(_cmd, _payloadString)
            break;
          case "18090302": // 升降机
            // console.log('升降机', data)
            this.mqttShenJiangJi(_cmd, _payloadString)
            break;
        }
      },
      mqttTaDiao(cmd, data) { //塔吊
        // console.log('塔吊', cmd)
        switch (cmd) {
          case "RealtimeDataCrane": // 2.3 上报塔机实时数据（专用）
            const _data = JSON.parse(data)
            // console.log('幅度-RRange:', _data.RRange, '高度-Height:', _data.Height, '角度-Angle:', _data.Angle)
            // console.log('RealtimeDataCrane', _data)
            if (towerGroup !== null) {
              modifyTower(towerGroup, "T1", this.towerHeight, _data.Angle, _data.RRange, _data
                .Height); //名称，高度，大臂角度，小车距离，吊钩线长

              $("#td_dbjd").html(_data.Angle)
              $("#td_xcjl").html(_data.RRange)
              $("#td_dgxc").html(_data.Height)
              $("#td_sbsj").html(moment(_data.RTime).format("HH:mm:ss"))
            }



            break
        }
      },
      mqttShenJiangJi(cmd, data) { //升降机
        // console.log('升降机', cmd)
        let _data = null
        switch (cmd) {
          case "RealtimeDataElevator": // 2.11上报升降机实时数据（专用）
            _data = JSON.parse(data)
            // console.log('RealtimeDataElevator', _data)
            // console.log('高度', _data.Height)
            // 获取数据之后调用方法初始化或者调整状态
            let doorOpen = true
            if (_data.DoorState === '0') {
              doorOpen = false
            }
            if (elevatorGroup === null) {
              return
            }
            modifyElevator(elevatorGroup, "E1", _data.Height, doorOpen) //名称，高度，门的开启状态

            $("#sjj_gd").html(_data.Height)
            $("#sjj_lc").html(_data.Floor)
            $("#sjj_sbsj").html(moment(_data.RTime).format("HH:mm:ss"))
            /*
            0:内外笼门全关
            1:内外笼门全开
            2:仅内笼门开
            3:仅外笼门开
            */
            switch (_data.DoorState) {
              case "0":
                $("#sjj_lmzt").html('内外笼门全关')
                break;
              case "1":
                $("#sjj_lmzt").html('内外笼门全开')
                break;
              case "2":
                $("#sjj_lmzt").html('仅内笼门开')
                break;
              case "3":
                $("#sjj_lmzt").html('仅外笼门开')
                break;
            }

            // this.$refs.taji.updateData(_data)
            // this.$refs.shenjiangji.updateData(_data)
            break
          case "WorkDataElevator": // 2.11上报升降机工作循环数据（专用）
            _data = JSON.parse(data)
            // console.log('WorkDataElevator', _data)

            // this.$refs.taji.updateData(_data)
            break
        }
      },
      mqttWeather(data) {
        // console.log('weather', data)
        const _data = JSON.parse(data)
        // console.log('_data', _data)
        let _h = "环境检测仪<br/>"
        _h = _h + "温度：" + _data.temp + "°C &nbsp;&nbsp;&nbsp;&nbsp;"
        _h = _h + "湿度：" + _data.h + "% <br/>"
        _h = _h + "噪声：" + _data.noise + "db &nbsp;&nbsp;&nbsp;&nbsp;"
        _h = _h + "扬尘：" + _data.pm10 + "ug/m <br/>"
        _h = _h + "PM2.5：" + _data.pm2_5 + "ug/m &nbsp;&nbsp;&nbsp;&nbsp;"
        _h = _h + "风速：" + _data.wind + "级 <br/>"
        _h = _h + "<span style='font-size:10px;'>服务器时间：" + moment(_data.cdate).format("HH:mm:ss") + "</span><br/>"

        $('#divHJJCY').html(_h)
        // this.$refs.weather.updateData(_data)

      },
      //   onWindowResize() {
      //     // console.log("onWindowResize")
      //     this.camera.aspect = (window.innerWidth - 40) / (window.innerHeight - 34);
      //     this.camera.updateProjectionMatrix();
      //     this.renderer.setSize(window.innerWidth - 40, window.innerHeight - 34);
      //     this.renderer.render(this.scene, this.camera);

      //   },
      unitAllRemove() {},
      unitGroupAddDB(modelData) {
        // console.log('modelData', modelData)
        this.indexedDBWaitList.set(modelData.modelID, modelData)
        // this.indexedDBWaitList.set(modelData)
      },
      addDataToDB() {
        setTimeout(() => {
          let i = 0
          for (let data of this.indexedDBWaitList.values()) {
            i++
            this.worker.postMessage(data); //向worker发送数据
            // worker.onmessage = function (evt) { //接收worker传过来的数据函数
            //   worker.terminate();
            // }
            this.indexedDBWaitList.delete(data.modelID)
            if (i >= 20) {
              break;
            }
          }
          this.addDataToDB()
        }, 8000)
      },
      addLoadingText(loadingTxt) {
        // this.loadingDialog.text = loadingTxt
        this.loadingText = loadingTxt
        // this.loadtext = loadingTxt
      },
      unitGroupAddMesh(_mesh, modelID, unit) {
        this.addedUnit = this.addedUnit + 1
        // this.loadingDialog.text = `正在加载模型列表${this.addedUnit}/${this.totalUnit}`
        this.loadingText = `正在加载模型列表${this.addedUnit}/${this.totalUnit}`
        if (_mesh === null || _mesh === '') {

        } else {

          // 模型的透明度
          if (unit.BUILDID !== 87) {
            if (_mesh.material.opacity === 1) {
              _mesh.material.opacity = 0.3
            }
          }

          if (unit.BUILDID === 87) {
            showGroup.add(_mesh)
          } else {
            unitGroups.add(_mesh)
          }
          if (unit !== null && unit.DEVICE_TYPE !== null && unit.DEVICE_TYPE !== '' && unit.DEVICE_ID !== null && unit
            .DEVICE_ID !== '') {
            this.deviceMap.set(unit.NAME, {
              'unit': unit,
              'mesh': _mesh
            })
          }
        }

        if (this.addedUnit == this.totalUnit) {
          this.addDeviceData()
          this.loadingText = `加载完成 ${this.addedUnit}/${this.totalUnit}`
          // this.loadingDialog.close()
        }
      },
      unitTotalAdd(addTotal) {
        this.totalUnit = this.totalUnit + addTotal
        // if (this.totalUnit == 1) {
        //   console.log('aaaaaa')
        //   for (let i = 0, len = unitGroups.length; i < len; i++) {
        //     unitGroups[i].visible = false
        //   }
        // }

      },

      unitRemove(unit) {
        // console.log('unit123', unit)

        const _data = this.modelMap.get(unit.ID)
        if (_data === undefined) {
          return;
        }
        const _meshID = _data.meshID
        const _groupIndex = _data.groupIndex
        let i = 0
        // console.log('this.unitGroups[gi].children', this.unitGroups[gi].children)
        const _unitGroup = this.unitGroups[_groupIndex]
        for (let mesh of _unitGroup.children) {
          if (mesh.id === _meshID) {
            _unitGroup.children.splice(i, 1);
            break;
          }
          i++
        }

      },

      initMouse() {
        document.addEventListener('mousedown', (event) => {


        }, false)
      },
      personInoutDialogHandle() {
        this.$confirm('此操作将清除浏览器数据库中缓存的模型数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let modelDB = null
          IndexedDB.openDB('tbbim', 1, modelDB, {
            name: 'model',
            key: 'modelID'
          }, (db) => {
            modelDB = db
            IndexedDB.clearData(modelDB, 'model')
            // console.log('清理完成')
            this.$message({
              type: 'success',
              message: '清理完成!'
            });
          })

        }).catch(() => {

        });
      },
      addDeviceData() {
        console.log('this.deviceMap', this.deviceMap)
        // console.log('showGroup', showGroup)
        let i = 0
        this.deviceMap.forEach(data => {
          // console.log('data', data, i++)
          let _device = data.unit
          let mesh = data.mesh
          // let _device = this.deviceMap.get(mesh.name)
          // // console.log('_device', _device)
          // 摄像头
          if (_device.DEVICE_TYPE === 16) {
            this.addCameraLabel(mesh, _device)
          } else if (_device.DEVICE_TYPE === 10) { // 电表
            this.addTxtBox(mesh, _device)
            this.addLabel1(mesh, _device, 'dianbiao.png')
          } else if (_device.DEVICE_TYPE === 11) { // 水表
            this.addTxtBox(mesh, _device)
            this.addLabel1(mesh, _device, 'shuibiao.png')
          } else if (_device.DEVICE_TYPE === 15) { // 环境检测仪
            this.addTxtBox(mesh, _device)
            this.addLabel1(mesh, _device, 'huanjinjianceyi.png')
          }
        })
        this.updateDeviceData()
      },
      updateDeviceData() {
        setTimeout(() => {
          const param = {
            method: 'devlist',
            project_id: 10000
          }
          this.$store.dispatch('QueryDatumMeter', param).then((deviceList) => {
            deviceList.forEach(device => {
              // this.datumMeterMap.set(datum.device_id, datum)
              if (device.device_type === 10) {
                // console.log('device1234', device)
                $('#divDianBiao' + device.device_id).html(device.total_used)
              } else if (device.device_type === 11) {
                // console.log('deviceYD10000SB03', device)
                $('#divShuiBiao' + device.device_id).html(device.total_used)
                // $('#divShuiBiaoYD10000SB03').html(device.total_used)
              }
            })
            this.updateDeviceData()
          }).catch((e) => {
            console.log(e)
          })
        }, 60 * 1000)



      },
      addCameraLabel(_mesh, device) {

        let deviceData = this.datumMeterMap.get(device.DEVICE_ID)
        let thisbt = document.createElement('img');

        if (deviceData === undefined) {
          thisbt.className = 'loTLabelNoData'
        } else if (deviceData.video_url === '') {
          thisbt.className = 'loTLabelNoData'
        } else {
          thisbt.className = 'loTLabel'
        }

        thisbt.style.pointerEvents = 'auto'
        // thisbt.style.marginTop = '-1em';
        thisbt.title = _mesh.name
        thisbt.onclick = () => {
          // alert('现场浇注楼梯:楼梯:540159 Run 1')
          if (deviceData === undefined) {
            this.$message({
              message: '此摄像头未配置数据',
              type: 'error'
            })
          } else if (deviceData.video_url === '') {
            this.$message({
              message: '此摄像头无法直播',
              type: 'error'
            })
          } else {
            const param = {
              show: true,
              deviceData: deviceData
            }
            this.$store.dispatch('SetVideoDialog', param).then(() => {}).catch(() => {})
          }
        }
        thisbt.src = "/static/videocamera3.png";

        let lable = new CSS2DObject(thisbt);
        lable.name = _mesh.name + "_b";
        _mesh.geometry.computeBoundingBox();
        let centroid = new THREE.Vector3();
        centroid.addVectors(_mesh.geometry.boundingBox.min, _mesh.geometry.boundingBox.max);
        centroid.multiplyScalar(0.5);
        centroid.applyMatrix4(_mesh.matrixWorld);
        lable.position.copy(centroid)
        deviceGroup.add(lable);
      },
      showHideTip(device_type) {
        let _obj = null
        switch (device_type) {
          case 10:
            _obj = $("#tipDianBiao")
            break;
          case 11:
            _obj = $("#tipShuiBiao")
            break;
          case 15:
            _obj = $("#tipHJJCY")
            break;
        }
        if (_obj !== null) {
          if (_obj.is(":visible") == true) {
            _obj.hide()
          } else {
            _obj.show()
          }
        }
      },
      addLabel1(_mesh, device, pic_url) {

        let thisbt = document.createElement('img');

        thisbt.className = 'loTLabel1'
        thisbt.style.pointerEvents = 'auto'
        // thisbt.style.marginTop = '-1em';
        thisbt.title = _mesh.name
        thisbt.onclick = () => {
          console.log('name', _mesh.name, device.DEVICE_TYPE)
          this.showHideTip(device.DEVICE_TYPE)

          // let _mesh1 = scene.getObjectByName(_mesh.name + "_b", true)
          // _mesh1.visible = false
          // console.log('type', type, _mesh1)


        }
        thisbt.src = `/static/${pic_url}` //"shuibiao.png";

        let lable = new CSS2DObject(thisbt);
        lable.name = _mesh.name + "_b";
        _mesh.geometry.computeBoundingBox();
        let centroid = new THREE.Vector3();
        centroid.addVectors(_mesh.geometry.boundingBox.min, _mesh.geometry.boundingBox.max);
        centroid.multiplyScalar(0.5);
        centroid.applyMatrix4(_mesh.matrixWorld);
        lable.position.copy(centroid)
        deviceGroup.add(lable);
      },
      addTxtBox(_mesh, device) {
        let thisbt = document.createElement('div');
        if (device.DEVICE_TYPE === 10) {
          let aaa = this.datumMeterMap.get(device.DEVICE_ID)
          // console.log('aaa', aaa)
          thisbt.innerHTML = "<div class='css2-txt-box'>用电量：<span id='divDianBiao" + device.DEVICE_ID + "'> " + aaa
            .total_used +
            "</span> 度</div><img id='iconCloseDianBiao' class='iconTipClose' src='/static/icon/closeIcon.png'/>"
          thisbt.id = "tipDianBiao"
        } else if (device.DEVICE_TYPE === 11) {
          // 水表
          // let DeviceID = 'YD10000SB03'
          let bbb = this.datumMeterMap.get(device.DEVICE_ID)
          thisbt.id = "tipShuiBiao"
          thisbt.innerHTML = "<div class='css2-txt-box'>用水量：<span id='divShuiBiao" + device.DEVICE_ID + "'> " + bbb
            .total_used +
            "</span> 吨</div><img id='iconCloseShuiBiao' class='iconTipClose' src='/static/icon/closeIcon.png'/>"
        } else if (device.DEVICE_TYPE === 15) {
          let _h = "<div class='css2-txt-box2'>"
          _h = _h + "<span id='divHJJCY'> 环境检测仪 </span>"
          _h = _h + "</div><img id='iconCloseHJJCY' class='iconTipClose' src='/static/icon/closeIcon.png'/>"
          thisbt.id = "tipHJJCY"
          thisbt.innerHTML = _h
        }


        thisbt.className = 'css2-txt-flag'
        thisbt.style.pointerEvents = 'auto'
        thisbt.style.marginTop = '-3em';
        thisbt.onclick = () => {

        }
        thisbt.src = "http://admin.yidebim.com/bim2/static/videocamera3.png";
        let lable = new CSS2DObject(thisbt);
        lable.name = _mesh.name + "_b";
        _mesh.geometry.computeBoundingBox();
        let centroid = new THREE.Vector3();
        centroid.addVectors(_mesh.geometry.boundingBox.min, _mesh.geometry.boundingBox.max);
        centroid.multiplyScalar(0.5);
        centroid.applyMatrix4(_mesh.matrixWorld);
        lable.position.copy(centroid)
        _mesh.add(lable)
        deviceGroup.add(_mesh);
        setTimeout(() => {
          $("#iconCloseDianBiao").click(() => {
            this.showHideTip(10)
          });
          $("#iconCloseShuiBiao").click(() => {
            this.showHideTip(11)
          });
          $("#iconCloseHJJCY").click(() => {
            this.showHideTip(15)
          });
        }, 3000);

      },
      initPerson(obj) {
        // if (obj.name=="84:0d:8e:81:d4:3c"){
        //     obj.name = "x";
        //     editPerson(obj)
        //     obj.name = "x1";
        //     obj.x = obj.x1;
        //     obj.y = obj.y1;
        //     editPerson(obj)
        // }
        //editPerson(obj)
        // obj.name = obj.name + "_1";
        obj.x = obj.x1;
        obj.y = obj.y1;
        this.editPerson(obj)
      },
      editPerson(obj) {
        let ex = personGroup.getObjectByName(obj.name, true)
        if (ex) {
          // ex.position.x = obj.x/1000-20.8;
          ex.position.x = obj.x / 1000;
          // ex.position.y = obj.y/1000-38.9;
          ex.position.y = obj.y / 1000;
          let thisb = $('#' + obj.labid)[0];
          if (thisb != undefined) {
            thisb.innerText = obj.name + ' -- ' + obj.datatime.substr(11, 5);
          }
        } else {
          let personGeometry = new THREE.SphereGeometry(0.2);
          //颜色根据传入的信息变化（白，蓝，黄，红）
          let hatColor = Math.floor(Math.random() * 4.99) + 1;
          switch (hatColor) {
            case 1:
              var personMaterial = new THREE.MeshLambertMaterial({
                color: 0x00FFFF
              });
              break;
            case 2:
              var personMaterial = new THREE.MeshLambertMaterial({
                color: 0xFF0000
              });
              break;
            case 3:
              var personMaterial = new THREE.MeshLambertMaterial({
                color: 0x0000FF
              });
              break;
            case 4:
              var personMaterial = new THREE.MeshLambertMaterial({
                color: 0x00FF00
              });
              break;
            default:
              var personMaterial = new THREE.MeshLambertMaterial({
                color: 0xFFFF00
              });
          }
          //var personMaterial = new THREE.MeshLambertMaterial({color: 0xFFFFFF});
          //var personMaterial = new THREE.MeshLambertMaterial({color: obj.hatColor});
          let person = new THREE.Mesh(personGeometry, personMaterial);
          person.geometry.verticesNeedUpdate = true;
          person.geometry.normalsNeedUpdate = true;

          // 创建DIV跟随
          let thisbt = document.createElement('button');
          thisbt.className = 'locationLabel'
          thisbt.style.marginTop = '-1em';
          thisbt.innerText = obj.name + ' -- ' + obj.datatime.substr(11, 5);
          thisbt.id = obj.labid;
          thisbt.style.pointerEvents = 'auto'
          thisbt.onclick = async () => {
            // 查询用户详细信息
            // console.log('obj', obj)
            // let mac = 
            const _personInfoList = await this.getPersonInfo(obj.mac)
            console.log('_personInfoList', _personInfoList)
            if (_personInfoList.length === 0) {
              this.$message({
                message: '未查询到此人员信息',
                type: 'error'
              })
            } else {
              let _personInfo = _personInfoList[0]
              const param = {
                show: true,
                ..._personInfo
              }
              this.$store.dispatch('SetPersonInfoDialog', param).then(() => {}).catch(() => {

              })
            }

          }


          // console.log('thisbt', thisbt)
          let lable = new CSS2DObject(thisbt);
          // console.log('lable', lable)
          // lable.position.copy(ex.position);
          // console.log('lable', lable)

          let pName = Math.round(obj.x / 500) + ',' + Math.round(obj.y / 500)

          lable.position.z = this.getLablePosition(pName);

          lable.name = obj.name + "_b";

          //Z坐标来自于所属楼层的Z坐标中心点
          person.position.z = (obj.layer - 1) * 3.5 + 1.6;
          //X,Y坐标来自于传入数据
          person.position.x = obj.x / 1000;
          person.position.y = obj.y / 1000;
          //name来自于传入的数据
          person.name = obj.name;
          person.add(lable)
          //person.visible = inBuilding(person,boxes[floorIndex-1]);
          personGroup.add(person);
        }
      },

      getLablePosition(a) {
        let z
        if (this.lablePosisionList.hasOwnProperty(a)) {
          z = this.lablePosisionList[a][this.lablePosisionList[a].length - 1] + 0.5
          this.lablePosisionList[a].push(z)
        } else {
          z = 0.5;
          this.lablePosisionList[a] = [z]
        }
        return z
      },
      getPersonInfo(mac) {
        return new Promise((resolve, reject) => {

          const param = {
            method: 'query_person',
            project_id: 10000,
            mac: mac
          }
          this.$store.dispatch('QueryProjectPerson', param).then((data_list) => {
            console.log("-data-->", data_list)
            resolve(data_list)
          }).catch(() => {
            resolve([])
          })
        })
      }
    }
  }

</script>
