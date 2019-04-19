<style lang="scss">
  @import "./index";

</style>
<template>
  <div id="loT-index" class="loT-index" style="margin: 0px;">
    <div id="loT-index-canvas3d" class="child-host"></div>
    <div id="stat-div-loT" class="stat-div-loT"></div>
    <loadModel v-on:unitAllRemove="unitAllRemove" v-on:unitGroupAddMesh="unitGroupAddMesh"
      v-on:unitGroupAddDB="unitGroupAddDB" v-on:unitRemove="unitRemove" v-on:addLoadingText="addLoadingText"
      v-on:unitTotalAdd="unitTotalAdd"></loadModel>
    <mqttLocation></mqttLocation>
    <div class="model3d-progress">
      <div>加载 {{addedUnit}}/{{totalUnit}} 个组件</div>
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
    <div class="bim-toolbar">
      <!--v-draggable-->
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
          <!-- <el-button @click="addDeviceData">
            <font-awesome-icon icon="magic" size="2x" />
          </el-button> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'
  import Cookies from 'js-cookie'
  import Vue from 'vue'
  import IndexedDB from '../../indexedDB/IndexedDB'
  import {
    // getOriStr,
    getOriMesh
  } from '@/utils/model3d'
  import {
    mapState
  } from 'vuex'
  import loadModel from "./components/loadModel"
  import mqttLocation from "./components/mqttLocation"
  import {
    Loading
  } from 'element-ui';
  import {
    CSS2DRenderer,
    CSS2DObject
  } from 'three-css2drender';
  import $ from 'jquery'
  // const MQTT_USERNAME = 'LOC_messager' // mqtt连接用户名
  // const MQTT_PASSWORD = 'LOC_12342234' // mqtt连接密码 
  const MQTT_USERNAME = 'BIM_messager' // mqtt连接用户名
  const MQTT_PASSWORD = 'bim_msg159' // mqtt连接密码 
  const CLIENT_ID = 'WebClient-' + parseInt(Math.random() * 100000)

  const TOWER_HEIGHT = 75 //塔吊高度

  console.log('12313123123')


  window.onresize = onWindowResize;


  let fov = 35 //75 this.gui.fov //拍摄距离  视野角值越大，场景中的物体越小
  let near = 1 //相机离视体积最近的距离
  let far = 800 //相机离视体积最远的距离
  let aspect = (window.innerWidth) / (window.innerHeight); //纵横比
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
  let personGroup = null
  let towerGroup = null // 塔机
  let elevatorGroup = null // 升降机
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
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  }

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
    mainCanvas = document.getElementById('loT-index-canvas3d')

    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.up = new THREE.Vector3(0, 0, 1); //相机以哪个方向为上方
    camera.position.set(-130, -0, 80);
    camera.position.set(150, 200, 190);
    scene.add(camera);

    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    controls = new THREE.MapControls(camera, renderer.domElement);

    mainCanvas.appendChild(renderer.domElement);
    renderer.setClearColor(0xcccccc, 1);



    labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(window.innerWidth - 40, window.innerHeight - 34);
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
      mqttLocation
      // ModelDetail
    },
    data() {
      return {

        loadtext: '开始加载模型....',
        client: new Paho.MQTT.Client("d1.mq.tddata.net", 8083, CLIENT_ID),
        timerReconnectMqtt: null,
        isConnectMqtt: null, //是否已经连接
        topicUserInfo: '', //订阅用户信息
        topicCount: '', //订阅统计消息
        reconnectTimes: 0, //重连次数

        loader: new THREE.ObjectLoader(),
        modelDB: null,

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
        topicWeather: '', // 天气检测
        topicTJ1: '', // 塔机和升降机推送消息
        topicTJ2: '', // 塔机和升降机推送消息



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
      this.client.onConnectionLost = this.onConnectionLost; //注册连接断开处理事件
      this.client.onMessageArrived = this.onMessageArrived; //注册消息接收处理事件
      IndexedDB.openDB('tbbim', 1, this.modelDB, {
        name: 'model',
        key: 'modelID'
      }, (db) => {
        this.modelDB = db
      })

    },
    watch: {
      project_id(curVal, oldVal) {
        // if (oldVal === null && curVal !== null) {
        //   this.mqttConnect()
        // }
        // if (oldVal !== null) {
        //   this.unsubscribe()
        // }
        // if (curVal !== null) {
        //   this.subscribe()
        // }
      },
      isConnectMqtt(curVal, oldVal) {
        console.log('curValcurVal', curVal)
        if (curVal === false) {
          this.reconnectMqtt()
        } else {
          this.subscribe()
          this.reconnectTimes = 0
          clearTimeout(this.timerReconnectMqtt)
        }
      },
      reconnectTimes(curVal, oldVal) {
        if (oldVal > 0 && curVal === 0) {
          this.info_system = ''
        }
      }
    },

    async mounted() {

      // if (mainCanvas ===null){
      initThree()
      // }

      this.loadingDialog = this.$loading({
        lock: false,
        text: this.loadtext,
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.3)',
        customClass: 'loading-class',
        // target: document.querySelector('.treeDiv')
      });
      // console.log('indexed_ver', this.indexed_ver)
      let _IndexDBDataVer = Cookies.get('IndexDBDataVer')
      // console.log('IndexDBDataVer', _IndexDBDataVer)
      if (this.indexed_ver !== _IndexDBDataVer) {
        await this.clearDB()
        Cookies.set('IndexDBDataVer', this.indexed_ver)
      }
      await this.initDevlist()


      // for (let i = 0, len = this.unitGroups.length; i < len; i++) {
      //   this.unitGroups[i] = new THREE.Group()
      // }

      // // this.initRaycaster()
      this.initMouse()
      // this.removeUnit()


      // window.onresize = this.onWindowResize;
      // for (let i = 0, len = this.unitGroups.length; i < len; i++) {
      //   this.scene.add(this.unitGroups[i])

      //   // if (i !== 0) {
      //   //   this.unitGroups[i].visible = false
      //   // }
      // }


      this.mqttConnect()
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
        elevatorGroup.position.set(80, 23.5, 0);
      };
      modifyElevator(elevatorGroup, "E1", 0, false) //名称，高度，门的开启状态

      this.addDataToDB()
    },
    beforeDestroy() {
      // $('#loT-index-canvas3d').empty()
      // scene.remove(showGroup)
      clearScene()
      console.log('13213scene', scene)
      scene.remove(unitGroups)
      scene.remove(showGroup)
      scene.remove(towerGroup)
      scene.remove(elevatorGroup)
      scene.remove(directionalLight);
      scene.remove(ambient);
      scene.remove(personGroup)
      renderer.dispose()
      renderer = null
      scene = null
      THREE.Cache.clear()
      unitGroups = null
      showGroup = null
      personGroup = null
      towerGroup = null
      elevatorGroup = null
      $('#loT-index-canvas3d').empty()
      mainCanvas = null


      // for (let i = 0, len = showGroup.children.length; i < len; i++) {
      //   console.log('showGroup',showGroup.children[i])
      //   // showGroup.children.splice(i, 1);
      // }
      // for (let i = 0, len = scene.children.length; i < len; i++) {
      //   let allChildren = scene.children[i];
      //   // console.log('allChildren', allChildren)
      //   for (let i = 0, len = allChildren.children.length; i < len; i++) {
      //     let allChildren1 = allChildren.children[i];
      //     console.log('allChildren1', allChildren1)
      //     scene.remove(allChildren1);
      //   }
      //   // var lastObject = allChildren[allChildren.length - 1];
      //   // if (lastObject instanceof THREE.Mesh) {
      //   //   scene.remove(lastObject);
      //   // }

      // }

      // console.log('scene', scene)

      // console.log("beforeDestroy")
      // scene = null
      // renderer.dispose()
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
            // this.$message({
            //   type: 'success',
            //   message: '清理完成!'
            // });
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
      mqttConnect() {
        this.client.connect({
          userName: MQTT_USERNAME,
          password: MQTT_PASSWORD,
          onSuccess: this.onConnect,
          onFailure: this.onFailure,
        }); //连接服务器并注册连接成功处理事件
      },
      onConnectionLost(responseObject) {
        console.log("onConnectionLost", responseObject)
        this.isConnectMqtt = false;
        this.info_system = "通讯断开..."
        if (responseObject.errorCode !== 0) {
          console.log("onConnectionLost:" + responseObject.errorMessage);
          console.log("连接已断开");
        }
      },
      onMessageArrived(message) {
        let obj = JSON.parse(message.payloadString);
        // console.log("收到消息1:" + message.destinationName + message.payloadString);
        // this.initPerson(obj)
        // this.mqttWeather(message.payloadString)

        if (message.destinationName === this.topicWeather) {
          // console.log("收到天气消息:" + message.payloadString);
          this.mqttWeather(message.payloadString)
        } else if (message.destinationName.substring(0, 14) === 'BIM/Sets/zhgd/') { // 塔机和升降机推送消息
          this.mqttTJ(message)
        }

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
        _h = _h + "温度：" + _data.pm10 + "°C &nbsp;&nbsp;&nbsp;&nbsp;"
        _h = _h + "湿度：" + _data.h + "% <br/>"
        _h = _h + "噪声：" + _data.noise + "db &nbsp;&nbsp;&nbsp;&nbsp;"
        _h = _h + "扬尘：" + _data.pm10 + "ug/m <br/>"
        _h = _h + "PM2.5：" + _data.pm2_5 + "ug/m &nbsp;&nbsp;&nbsp;&nbsp;"
        _h = _h + "风速：" + _data.wind + "级 <br/>"
        _h = _h + "<span style='font-size:10px;'>服务器时间：" + moment(_data.cdate).format("HH:mm:ss") + "</span><br/>"

        $('#divHJJCY').html(_h)
        // this.$refs.weather.updateData(_data)

      },
      onConnect() {
        console.log("onConnected");
        this.isConnectMqtt = true;
        // this.client.subscribe(this.topicWeather); //订阅天气检测
      },
      onFailure(eee) {
        this.isConnectMqtt = false;
        this.info_system = "通讯断开..."
        console.log("onFailure", eee);
      },
      reconnectMqtt() {
        console.log('reconnectMqtt')
        this.timerReconnectMqtt = setTimeout(() => {
          if (this.isConnectMqtt === false) {
            this.mqttConnect()
            this.reconnectTimes++
            this.info_system = `重新开始进行通讯连接${this.reconnectTimes}...`
          }
          this.reconnectMqtt()
        }, 5 * 1000)
      },
      subscribe() {
        //BIM/location/10000/#
        if (this.isConnectMqtt === true) {
          // this.topicUserInfo = `BIM/location/${this.project_id}/#` //订阅用户信息
          // this.topicCount = `BIM/location/${this.project_id}/count` //订阅统计消息
          // BIM/door/10001/count

          this.topicWeather = 'BIM/HJ/720/01'
          this.topicTJ1 = 'BIM/Sets/zhgd/DEYE/18090311/#' //塔机和升降机推送消息 BIM/Sets/zhgd/厂家/和匣子编号/cmd
          this.topicTJ2 = 'BIM/Sets/zhgd/DEYE/18090302/#' //塔机和升降机推送消息 BIM/Sets/zhgd/厂家/和匣子编号/cmd
          this.client.subscribe(this.topicWeather); //订阅主题
          this.client.subscribe(this.topicTJ1); //塔机和升降机推送消息
          this.client.subscribe(this.topicTJ2); //塔机和升降机推送消息
          // this.client.subscribe(this.topicCount); //订阅主题
          console.log("订阅成功！")
        }
      },
      unsubscribe() {
        if (this.isConnectMqtt === true && this.topicUserInfo !== '') {
          // 取消老的订阅
          this.client.unsubscribe(this.topicUserInfo); //订阅主题
          this.client.unsubscribe(this.topicCount); //订阅主题
          console.log("取消订阅成功！")
        }
      },
      onWindowResize() {
        // console.log("onWindowResize")
        this.camera.aspect = (window.innerWidth - 40) / (window.innerHeight - 34);
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth - 40, window.innerHeight - 34);
        this.renderer.render(this.scene, this.camera);

      },
      unitAllRemove() {},
      unitGroupAddDB(modelData) {
        // console.log('modelData', modelData)
        this.indexedDBWaitList.set(modelData.modelID, modelData)
        // this.indexedDBWaitList.set(modelData)
      },
      addDataToDB() {
        setTimeout(() => {
          // console.log('===>===>===>===>===>', this.indexedDBWaitList.size)
          let i = 0
          for (let data of this.indexedDBWaitList.values()) {
            i++
            // console.log('===>', data)
            this.worker.postMessage(data); //向worker发送数据
            // worker.onmessage = function (evt) { //接收worker传过来的数据函数
            //   worker.terminate();
            // }
            this.indexedDBWaitList.delete(data.modelID)
            if (i >= 100) {
              break;
            }
          }
          this.addDataToDB()
        }, 5000)
      },
      addLoadingText(loadingTxt) {
        this.loadingDialog.text = loadingTxt
        // this.loadtext = loadingTxt
      },
      unitGroupAddMesh(meshJson, modelID, unit) {

        // console.log('unit', unit)
        if (unit !== null && unit.DEVICE_TYPE !== null && unit.DEVICE_TYPE !== '' && unit.DEVICE_ID !== null && unit
          .DEVICE_ID !== '') {
          // console.log('unitunitunitunit', unit)
          this.deviceMap.set(unit.COMPONENT_NAME, unit)
        }
        // for (let i = 0, len = this.unitGroups.length; i < len; i++) {
        //   this.unitGroups[i].visible = false
        // }

        this.addedUnit = this.addedUnit + 1
        this.loadingDialog.text = `正在加载模型列表${this.addedUnit}/${this.totalUnit}`
        if (meshJson === null || meshJson === '') {
          return
        }
        // if (this.addedUnit < this.totalUnit && this.unitGroups[0].visible == true) {
        //   for (let i = 0, len = this.unitGroups.length; i < len; i++) {
        //     this.unitGroups[i].visible = false
        //   }
        // }
        // console.log('mod', mod)
        // this.modMap.set(_param.modelID, _data)
        // this.percentage = Math.ceil((this.addedUnit / this.totalUnit) * 100)

        let _mesh = this.loader.parse(meshJson)
        // console.log('mod', mod)
        // this.modMap.set(_mesh.id, mod)
        // console.log('result.mesh', _mesh.material.opacity)
        // 模型的透明度
        if (unit.BUILDING_ID === 86 || unit.BUILDING_ID === 88 || unit.BUILDING_ID === 89) {
          if (_mesh.material.opacity === 1) {
            _mesh.material.opacity = 0.3
          }
        }

        // console.log('_mesh', _mesh.name)
        if (unit.BUILDING_ID === 87) {
          showGroup.add(_mesh)
        } else {
          unitGroups.add(_mesh)
          // let _mod = Math.floor(Math.random() * unitGroups.length) //_data.modelID % 10
          // unitGroups[_mod].add(_mesh)
        }



        // scene.add(_mesh)
        // const param = {
        //   modelID: modelID,
        //   meshID: _mesh.id,
        //   groupIndex: _mod
        // }
        // this.$store.dispatch('SetModelIDlist', param).then(() => {
        //   // console.log("this.treeListData", this.treeListData)
        // }).catch((e) => {
        //   console.log("e", e)
        // })

        if (this.addedUnit == this.totalUnit) {
          console.log(123123)

          this.addDeviceData()
          // document.addEventListener('mouseup', (event) => {
          //   // console.log('mouseup')
          //   // unitGroups.visible = true
          //   scene.add(unitGroups)
          //   // for (let i = 0, len = unitGroups.length; i < len; i++) {
          //   //   // if (i !== 0) {
          //   //   unitGroups[i].visible = true
          //   //   // }
          //   // }
          // }, false)
          this.loadingDialog.close()
          // console.log('this.indexedDBWaitList', this.indexedDBWaitList.length)
          // 全部显示
          // scene.add(unitGroups)
          // unitGroups.visible = true

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
      removeUnit() {
        // console.log("this.unitRemoveSet.size", this.unitRemoveSet.size, this.unitRemoveSet)
        if (this.unitRemoveSet.size > 0) {
          for (let gi = 0, len = this.unitGroups.length; gi < len; gi++) {
            let i = 0
            for (let unit of this.unitGroups[gi].children) {
              if (this.unitRemoveSet.has(unit.uuid)) {
                // console.log('uuid', unit.uuid)
                this.unitLoadingSet.delete(unit.name);
                this.unitRemoveSet.delete(unit.uuid);
                // console.log('123123', this.unitGroups)
                this.unitGroups[gi].children.splice(i, 1);
              }
              i++
            }
          }
        }
        this.timeRemove = setTimeout(() => {
          this.removeUnit()
        }, 50)
      },

      initMouse() {
        document.addEventListener('mousedown', (event) => {
          // THREE.Cache.clear()
          // this.unitGroup.visible = false
          // console.log('123')
          // unitGroups.visible = false



          // for (let i = 0, len = unitGroups.length; i < len; i++) {
          //   // if (i !== 0) {
          //   unitGroups[i].visible = false
          //   // }
          // }
          // if (this.projectiveObj) {
          //   let _model = this.modelMap.get(this.projectiveObj.name)
          //   const param = {
          //     show: true,
          //     model: _model
          //   }
          //   // this.$store.dispatch('SetModelDetailDialog', param).then(() => {}).catch(() => {
          //   // })
          // }
        }, false)
      },
      // 初始化 光线投射器
      initRaycaster() {
        // this.raycaster = new THREE.Raycaster(); //光线投射器
        this.mouse = new THREE.Vector2(); //二维向量 
        document.addEventListener('mousemove', (event) => {
          event.preventDefault();
          this.mouse.x = ((event.clientX - this.mainCanvas.getBoundingClientRect().left) / this.mainCanvas
              .offsetWidth) *
            2 - 1;

          this.mouse.y = -((event.clientY - this.mainCanvas.getBoundingClientRect().top) / this.mainCanvas
              .offsetHeight) *
            2 +
            1;

          let standardVector = new THREE.Vector3(this.mouse.x, this.mouse.y, 1); // 标准设备坐标

          // 标准设备坐标转世界坐标
          let worldVector = standardVector.unproject(this.camera);
          // 射线投射方向单位向量(worldVector坐标减相机位置坐标)
          let ray = worldVector.sub(this.camera.position).normalize();
          this.raycaster = new THREE.Raycaster(this.camera.position, this.ray); //光线投射器
          this.raycaster.setFromCamera(this.mouse, this.camera);
          // var vector = new THREE.Vector3(this.mouse.x, this.mouse.y, 0.5).unproject(this.camera);
          // this.raycaster = new THREE.Raycaster(this.camera.position, vector.sub(this.camera.position).normalize());
          if (this.scene.children[4] === undefined) {
            return
          }
          // console.log('this.scene.children[4].children', this.scene.children[14].children)
          // for (let i = 14, len = 14; i <= len; i++) {

          let intersects = this.raycaster.intersectObjects(this.scene.children[14].children, true);
          // console.log('intersects', intersects)
          if (intersects.length > 0) {
            console.log('123')
            if (this.projectiveObj !== null && this.projectiveObj.name !== intersects[0].object) {
              console.log('namename', this.projectiveObj.name)
              // let _model = this.modelMap.get(this.projectiveObj.name)
              // if (_model && _model.material.oldcolor) {
              //   this.projectiveObj.hasChecked = false
              //   this.projectiveObj.material.color = _model.material.oldcolor
              // }
            }
            this.projectiveObj = intersects[0].object
          } else {
            if (this.projectiveObj !== null) {
              // let _model = this.modelMap.get(this.projectiveObj.name)
              // this.projectiveObj.material.color = _model.material.oldcolor
              // this.projectiveObj.hasChecked = false
              // this.projectiveObj = null;
            }
          }
          // }


          // if (this.projectiveObj) {
          //   if (this.projectiveObj.hasChecked) {
          //     this.projectiveObj.hasChecked = false;
          //     let _model = this.modelMap.get(this.projectiveObj.name)
          //     this.projectiveObj.material.color = _model.material.oldcolor
          //   } else {
          //     this.projectiveObj.hasChecked = true;
          //     let _model = this.modelMap.get(this.projectiveObj.name)
          //     this.projectiveObj.material.oldcolor = Object.assign({}, this.projectiveObj.material.color);
          //     this.projectiveObj.material.color = new THREE.Color(0xff00FF, 0.2);
          //   }
          // }

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
        // console.log('showGroup', showGroup)
        // console.log('this.deviceMap', this.deviceMap)
        // for (let i = 0, len = unitGroups.length; i < len; i++) {
        showGroup.children.forEach(mesh => {
          let _device = this.deviceMap.get(mesh.name)
          if (_device !== undefined) {
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
          }
        })
        // }
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
                // console.log('device', device)
                $('#divDianBiao' + device.device_id).html(device.total_used)
              } else if (device.device_type === 11) {
                // console.log('deviceYD10000SB03', device)
                $('#divShuiBiaoYD10000SB03').html(device.total_used)
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
        personGroup.add(lable);
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
        personGroup.add(lable);
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
          let DeviceID = 'YD10000SB03'
          let bbb = this.datumMeterMap.get(DeviceID)
          thisbt.id = "tipShuiBiao"
          thisbt.innerHTML = "<div class='css2-txt-box'>用水量：<span id='divShuiBiao" + DeviceID + "'> " + bbb.total_used +
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
        personGroup.add(_mesh);
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

      }
    }
  }

</script>
