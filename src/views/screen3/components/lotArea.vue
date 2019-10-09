<style lang="scss">
  @import "./lotArea.scss";

</style>

<template>
  <div id="screen-loT5" class="screen-loT5" style="margin: 0px;">
    <mqttBim ref="mqttBim" v-on:mqttWeather="mqttWeather" v-on:mqttTaDiao="mqttTaDiao"
      v-on:mqttShenJiangJi="mqttShenJiangJi"></mqttBim>
    <historyLocation ref="historyLocation" v-on:initPerson="initPerson"></historyLocation>
    <mqttLocation ref="mqttLocation" v-on:initPerson="initPerson"></mqttLocation>
    <div id="viewer-local">
      <div v-if="noModelTip!==''" class="noModelTip">{{noModelTip}}</div>
    </div>
  </div>

</template>

<script>
  import '../../loT4/Viewing.Extension.MeshSelection'
  import moment from 'moment'
  import mqttBim from "../../loT4/components/mqttBim"
  import mqttLocation from "../../loT4/components/mqttLocation"
  import historyLocation from "../../loT4/components/historyLocation"
  // import './Viewing.Extension.PointCloudMarkup/PointCloudMarkup/PointCloudMarkup.js'
  let towerGroup = null // 塔机
  let elevatorGroup = null // 升降机
  let sectionGroup = null // 升降机轨道

  let personGroup = null

  let datumMeterMap = new Map()
  let towerHeight = null;

  let externalExtensionPerson = null

  var globalOffset = null
  let urns = []
  let config = {
    extensions: [
      // "Autodesk.Viewing.ZoomWindow",
      // "markup3d",
      // "Autodesk.Section"
      // "Autodesk.Viewing.MarkupsCore",
      // "Autodesk.Viewing.AxisHelper"
    ],
    disabledExtensions: {
      measure: false,
      section: false,
    },
    memory: {
      limit: 32 * 1024 // 32 GB
    }
  };

  var element = null; // document.getElementById('viewer-local');
  var viewer = null; //new Autodesk.Viewing.Private.GuiViewer3D(element, config);
  var options = {
    env: 'Local',
    offline: 'true',
    useConsolidation: true,
    useADP: false
  };


  async function init3DView(modelURLList) {
    return new Promise((resolve, reject) => {
      urns = modelURLList
      Autodesk.Viewing.Initializer(options, function () {
        element = document.getElementById('viewer-local');
        // viewer = new Autodesk.Viewing.Private.GuiViewer3D(element, config);
        viewer = new Autodesk.Viewing.Viewer3D(element, config);
        var startedCode = viewer.start();
        if (startedCode > 0) {
          console.error('Failed to create a Viewer: WebGL not supported.');
          return;
        }

        // viewer.loadModel("https://lmv-models.s3.amazonaws.com/toy_plane/toy_plane.svf", undefined,
        // onLoadSuccess, onLoadError);
        for (var i = 0; i < modelURLList.length; i++) {
          if (i === 0) {
            viewer.loadModel(modelURLList[i], undefined, onLoadSuccess, onLoadError);
          }

        }

        resolve()
      });

    })

  }

  function onLoadSuccess(event) {
    // 加载其他的组合模型
    let getModels = viewer.impl.modelQueue().getModels()
    globalOffset = getModels[0].getData().globalOffset; //Get it from first model 
    console.log('globalOffset', globalOffset)
    for (var i = 1; i < urns.length; i++) {

      var options = {
        globalOffset: globalOffset
      }
      // viewer.loadModel(path, options);
      viewer.loadModel(urns[i], options);
    }

    viewer.fitToView()
    viewer.setBackgroundColor(22, 39, 61, 13, 20, 51);
    if (!viewer.overlays.hasScene('custom-scene')) {
      viewer.overlays.addScene('custom-scene');
    }
    initData()
    initMarker()

    console.log('success');


    viewer.addEventListener(
      Autodesk.Viewing.SELECTION_CHANGED_EVENT,
      onSelectionChanged
    );

  }


  var onSelectionChanged = function (event) {
    // console.log('viewer', viewer)
    console.log('event', event)
    // console.log(" >LJason< 日志：点击位置", viewer.clientToWorld(event.offsetX, event.offsetY, false).intersectPoint);
    // console.log(event.dbIdArray);
    let _dbIds = event.dbIdArray

    // Asyncronous method that gets object properties
    // 异步获取模型的属性
    viewer.getProperties(_dbIds[0],
      function (elements) {
        var dbid = elements.dbId;
      })


  };

  function onLoadError(event) {
    console.log('fail');
  }

  function initData() {

    datumMeterMap.forEach(datum => {
      // console.log('datum', datum)
      if (datum.device_type === 13) { // 塔机

        // {"pos_x":60,"pos_y":22,"pos_z":0,"height":75,"mqtt":"BIM/Sets/zhgd/DEYE/18090311/#"}
        // $('.divDataTadiao').show()
        towerGroup = new THREE.Group()
        towerGroup.name = "towerGroup";
        towerGroup.scale.set(3, 3, 3)
        let paramsJson = JSON.parse(datum.params_json)
        console.log('paramsJson', paramsJson)
        towerHeight = paramsJson.height
        // this.tdData.tdgd = this.towerHeight
        // towerGroup.position.set(paramsJson.pos_x, paramsJson.pos_y, paramsJson.pos_z); // 红 绿
        towerGroup.position.set(80, 36, -91); // 红 绿

        modifyTower(towerGroup, `T${datum.device_id}`, towerHeight, 0, 0, 0); //名称，高度，大臂角度，小车距离，吊钩线长
        console.log('viewer', viewer)
        viewer.overlays.impl.addOverlay('custom-scene', towerGroup)
      } else if (datum.device_type === 12) { // 升降机
        // $('.divDataShenJiangJi').show()

        elevatorGroup = new THREE.Group()
        elevatorGroup.name = "elevatorGroup";

        elevatorGroup.scale.set(3, 3, 3)
        // modifyElevator(elevatorGroup, `E22332`, 0, false) //名称，高度，门的开启状态

        let paramsJson = JSON.parse(datum.params_json)
        // {"pos_x":78.5,"pos_y":24,"pos_z":0,"mqtt":"BIM/Sets/zhgd/DEYE/18090302/#"}
        // elevatorGroup.position.set(paramsJson.pos_x, paramsJson.pos_y, paramsJson.pos_z);
        elevatorGroup.position.set(181, 34, 0); // y 前后

        // var screenpoint11 = viewer.worldToClient(new THREE.Vector3(0, 0, 0));
        // viewer.worldToClient()
        // console.log('screenpoint11', screenpoint11)
        modifyElevator(elevatorGroup, `E${datum.device_id}`, -91 / 3, false) //名称，高度，门的开启状态
        viewer.overlays.impl.addOverlay('custom-scene', elevatorGroup)
      } else if (datum.device_type === 100) { // 升降机轨道

        sectionGroup = new THREE.Group()
        sectionGroup.name = "sectionGroup";

        sectionGroup.scale.set(3, 3, 3)

        let paramsJson = JSON.parse(datum.params_json)
        // sectionGroup.position.set(paramsJson.pos_x, paramsJson.pos_y, paramsJson.pos_z); // 红 绿
        sectionGroup.position.set(185, 39, -90);
        // console.log('paramsJson.height', paramsJson.height)
        LoadSection(sectionGroup, paramsJson.height)
        viewer.overlays.impl.addOverlay('custom-scene', sectionGroup)

      }
    })

    // viewer.loadExtension('Viewing.Extension.MeshSelection').then(

    // )
  }
  // let viewer = viewer

  function initMarker() {
    viewer.addEventListener(Autodesk.Viewing.CAMERA_CHANGE_EVENT, function (rt) {

      //find out all pushpin markups
      var $eles = $("div[id^='mymk']");
      var DOMeles = $eles.get();

      for (var index in DOMeles) {

        //get each DOM element
        var DOMEle = DOMeles[index];
        var divEle = $('#' + DOMEle.id);
        //get out the 3D coordination
        var val = divEle.data('3DData');
        var pushpinModelPt = JSON.parse(val);
        //get the updated screen point
        var screenpoint = viewer.worldToClient(new THREE.Vector3(
          pushpinModelPt.x,
          pushpinModelPt.y,
          pushpinModelPt.z, ));
        //update the SVG position.
        divEle.css({
          'left': screenpoint.x - pushpinModelPt.radius * 2,
          'top': screenpoint.y - pushpinModelPt.radius
        });
      }
    });

    // drawPushpinLot({
    //   x: -12.590157398363942,
    //   y: -256.6158517922297,
    //   z: -33.46542876355482
    // }, 'lot4', '摄像头');

  }

  function onMouseClick(event) {

    var screenPoint = {
      x: event.clientX,
      y: event.clientY
    };
    console.log('screenPoint', screenPoint)
    //get the selected 3D position of the object

    //viewer canvas might have offset from the webpage.

    let viewer_pos = viewer.container.getBoundingClientRect();
    var hitTest = viewer.impl.hitTest(screenPoint.x - viewer_pos.x,
      screenPoint.y - viewer_pos.y, true);

    // var hitTest = viewer.impl.hitTest(screenPoint.x, screenPoint.y, true);
    console.log('hitTest', hitTest)
    if (hitTest) {
      let _position = {
        x: hitTest.intersectPoint.x,
        y: hitTest.intersectPoint.y,
        z: hitTest.intersectPoint.z
      }
      drawPushpin(_position);
      console.log('_position', _position)
    }
  }

  //generate a random id for each pushpin markup
  // function makeid() {
  //   var text = "";
  //   var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  //   for (var i = 0; i < 5; i++)
  //     text += possible.charAt(Math.floor(Math.random() * possible.length));

  //   return text;
  // }

  // 人员在线的标记
  function drawPushpinPerson(pushpinModelPt, id, name) {
    // console.log('idididid', id)
    //convert 3D position to 2D screen coordination
    var screenpoint = viewer.worldToClient(
      new THREE.Vector3(pushpinModelPt.x,
        pushpinModelPt.y,
        pushpinModelPt.z, ));
    $('#mymk' + randomId).remove()
    //build the div container
    var randomId = id; //makeid();
    var htmlMarker = '<div id="mymk' + randomId + '" class="mymlLabel">' + name + '</div>';
    var parent = viewer.container
    $(parent).append(htmlMarker);
    $('#mymk' + randomId).css({
      'pointer-events': 'none',
      'width': '50px',
      'height': '16px',
      'position': 'absolute',
      'overflow': 'visible',
    });

    // var snap = Snap($('#mysvg' + randomId)[0]);
    var rad = 27;
    //set the position of the SVG
    //adjust to make the circle center is the position of the click point
    var $container = $('#mymk' + randomId);
    $container.css({
      'left': screenpoint.x - rad * 2,
      'top': screenpoint.y - rad
    });

    //store 3D point data to the DOM
    var div = $('#mymk' + randomId);
    //add radius info with the 3D data
    pushpinModelPt.radius = rad;
    var storeData = JSON.stringify(pushpinModelPt);
    div.data('3DData', storeData);
  }
  //
  function drawPushpin(pushpinModelPt, id, name) {
    // console.log('idididid', id)
    //convert 3D position to 2D screen coordination
    var screenpoint = viewer.worldToClient(
      new THREE.Vector3(pushpinModelPt.x,
        pushpinModelPt.y,
        pushpinModelPt.z, ));
    $('#mymk' + randomId).remove()
    //build the div container
    var randomId = id; //makeid();
    var htmlMarker = '<div id="mymk' + randomId + '" class="mymlLabel">' + name + '</div>';
    var parent = viewer.container
    $(parent).append(htmlMarker);
    $('#mymk' + randomId).css({
      'pointer-events': 'none',
      'width': '50px',
      'height': '20px',
      'position': 'absolute',
      'overflow': 'visible',
    });

    //build the svg element and draw a circle
    $('#mymk' + randomId).append('<svg id="mysvg' + randomId + '"></svg>')

    var snap = Snap($('#mysvg' + randomId)[0]);
    var rad = 7;
    var circle = snap.paper.circle(14, 14, rad);
    circle.attr({
      fill: "#FF8888",
      fillOpacity: 0.6,
      stroke: "#FF0000",
      strokeWidth: 1
    });

    //set the position of the SVG
    //adjust to make the circle center is the position of the click point
    var $container = $('#mymk' + randomId);
    $container.css({
      'left': screenpoint.x - rad * 2,
      'top': screenpoint.y - rad
    });

    //store 3D point data to the DOM
    var div = $('#mymk' + randomId);
    //add radius info with the 3D data
    pushpinModelPt.radius = rad;
    var storeData = JSON.stringify(pushpinModelPt);
    div.data('3DData', storeData);
  }
  export default {
    name: 'Lot4-index',
    components: {
      mqttBim,
      historyLocation,
      mqttLocation
    },
    data() {
      return {
        project_id: null,
        noModelTip: '',
        datumMeterMap: new Map(),
        // towerHeight: 0, // 塔吊高度 28米
        showTadiaoInfo: false,
        showShenjiangjiInfo: false,
        showWeatherInfo: false,
        showShuibiaoInfo: false,
        showDianbiaoInfo: false,
        tdData: { // 塔吊面板数据
          tdgd: 0,
          dbjd: '-',
          xcjl: '-',
          dgxc: '-',
          sbsj: '-'
        },
        sjjData: { //升降机面板数据
          sjjgd: '-',
          sjjlc: '-',
          sbsj: '-',
          mzt: '-'
        },
        weather_data: {
          temp: '-',
          h: '-',
          noise: '-',
          wind: '-',
          pm10: '-',
          pm2_5: '-'
        },
        shuibiaoTotalUsed: '-',
        dianbiaoTotalUsed: '-',
      }
    },
    computed: {
      //   project_id() {
      //     return this.$store.state.project.project_id
      //   },
    },
    watch: {
      //   project_id(curVal, oldVal) {
      //     console.log('project_idproject_idproject_id', curVal, oldVal)
      //     if (oldVal !== null) {
      //       // this.clearData()
      //       location.reload()

      //     }
      //     if (curVal !== null) {
      //       //   this.init()
      //     }
      //   },
    },
    created() {

    },
    mounted() {
      console.log('lot4-index-mounted')
    },
    destroyed() {},
    methods: {
      async init(project_id) {
        this.project_id = project_id
        let _urlList = this.getModelUrl()
        if (_urlList.length !== 0) {
          this.noModelTip = ''
          await this.initDevlist()
          await init3DView(_urlList)
          await this.initExtPerson()
          this.$refs.historyLocation.getLocationHisData(this.project_id)
          this.$refs.mqttLocation.init(this.project_id)
          this.$refs.mqttBim.init(this.project_id, this.datumMeterMap)
          await this.addDevlist()
        } else {
          this.showTadiaoInfo = false
          this.showShenjiangjiInfo = false
          this.showWeatherInfo = false
          this.showShuibiaoInfo = false
          this.showDianbiaoInfo = false
          this.noModelTip = '当前项目没有模型'
        }

      },
      initExtPerson() {
        return new Promise((resolve, reject) => {
          viewer.loadExtension('Viewing.Extension.MeshSelection').then(
            function (externalExtension) {
              externalExtensionPerson = externalExtension
              resolve()
            }
          )
        })

      },
      getModelUrl() {
        let _urlList = []
        switch (this.project_id) {
          case 10000:

            // _urlList = ['/static/model/qingyang0/3d.svf'];

            _urlList = ['/static/model/qingyang0/3d.svf', '/static/model/qingyang-houqingbaozhang/3d.svf',
              '/static/model/qingyang-menzheng/3d.svf',
              '/static/model/qingyang-bingfang/3d.svf',
            ];
            break;

          case 10004:
            _urlList = ['/static/model/tianshui/3d.svf'];
            break;

        }
        return _urlList
      },
      initDevlist() {
        return new Promise((resolve, reject) => {
          const param = {
            method: 'devlist',
            project_id: this.project_id
          }
          // this.datumMeterMap = new Map()
          this.$store.dispatch('QueryDatumMeter', param).then((data) => {
            // console.log('QueryDatumMeter - data', data)
            data.forEach(datum => {
              datumMeterMap.set(datum.device_id, datum)
            })
            this.datumMeterMap = datumMeterMap
            this.updateDeviceData()
            resolve()
          }).catch((e) => {
            console.log(e)
            resolve()
          })


        })
      },
      addDevlist() {
        let _hasDianBiao = false
        this.datumMeterMap.forEach(datum => {
          if (datum.device_type === 11) { // 水表

            this.shuibiaoTotalUsed = datum.total_used
            if (datum.params_json !== '' && datum.params_json !== null) {
              let paramsJson = JSON.parse(datum.params_json)
              if (paramsJson.pos_x !== undefined) {
                this.drawPushpinLot({
                  x: paramsJson.pos_x,
                  y: paramsJson.pos_y,
                  z: paramsJson.pos_z
                }, datum.device_id, `${datum.device_name}`, datum);
              }
            }
          } else if (datum.device_type === 10 && _hasDianBiao === false) { // 电表
            _hasDianBiao = true
            this.dianbiaoTotalUsed = datum.total_used
            if (datum.params_json !== '' && datum.params_json !== null) {
              let paramsJson = JSON.parse(datum.params_json)
              if (paramsJson.pos_x !== undefined) {
                this.drawPushpinLot({
                  x: paramsJson.pos_x,
                  y: paramsJson.pos_y,
                  z: paramsJson.pos_z
                }, datum.device_id, `${datum.device_name}`, datum);
              }
            }
          } else if (datum.device_type === 15) { // 环境检测仪
            if (datum.params_json !== '' && datum.params_json !== null) {
              let paramsJson = JSON.parse(datum.params_json)
              if (paramsJson.pos_x !== undefined) {
                this.drawPushpinLot({
                  x: paramsJson.pos_x,
                  y: paramsJson.pos_y,
                  z: paramsJson.pos_z
                }, datum.device_id, `${datum.device_name}`, datum);
              }

            }

          } else if (datum.device_type === 16 || datum.device_type === 18) { // 摄像头
            if (datum.params_json !== '' && datum.params_json !== null) {
              let paramsJson = JSON.parse(datum.params_json)
              if (paramsJson.pos_x !== undefined) {
                this.drawPushpinLot({
                  x: paramsJson.pos_x,
                  y: paramsJson.pos_y,
                  z: paramsJson.pos_z
                }, datum.device_id, `摄像头:${datum.device_name}`, datum);
              }
            }
          }
        })
      },
      updateDeviceData() {
        setTimeout(() => {
          const param = {
            method: 'devlist',
            project_id: this.project_id
          }
          this.$store.dispatch('QueryDatumMeter', param).then((deviceList) => {
            deviceList.forEach(device => {
              // this.datumMeterMap.set(datum.device_id, datum)
              if (device.device_type === 10) { // 电表
                // console.log('devicdianbiaoTotalUsede1234', device)
                this.dianbiaoTotalUsed = device.total_used
                $('#divDianBiao' + device.device_id).html(device.total_used)

              } else if (device.device_type === 11) { // 水表
                // console.log('shuibiaoTotalUsed', device)
                this.shuibiaoTotalUsed = device.total_used
                $('#divShuiBiao' + device.device_id).html(device.total_used)
              }
            })
            this.updateDeviceData()
          }).catch((e) => {
            console.log(e)
          })
        }, 60 * 1000)



      },
      mqttWeather(data) {
        // console.log('weather', data)
        const _data = JSON.parse(data)
        // console.log('_data', _data)
        this.weather_data = _data
        // $('#divHJJCY').html(_h)
        // this.$refs.weather.updateData(_data)

      },
      mqttTaDiao(cmd, data) { //塔吊
        // console.log('塔吊', cmd)
        switch (cmd) {
          case "RealtimeDataCrane": // 2.3 上报塔机实时数据（专用）
            const _data = JSON.parse(data)
            // console.log('幅度-RRange:', _data.RRange, '高度-Height:', _data.Height, '角度-Angle:', _data.Angle)
            // console.log('RealtimeDataCrane', _data)
            if (towerGroup !== null) {
              modifyTower(towerGroup, `T${_data.HxzId}`, this.towerHeight, _data.Angle, _data.RRange, _data
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
            modifyElevator(elevatorGroup, `E${_data.HxzId}`, _data.Height - (91 / 3), doorOpen) //名称，高度，门的开启状态

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
      initPerson(obj) {
        console.log('objobjobj', obj)
        let _position = {
          x: obj.x / 1000 - 62,
          y: obj.y / 1000 - 37 + 150,
          z: (obj.layer - 1) * 3.5 + 1.6 - 91
        }
        this.addPersonMesh(obj.name, obj, _position)
      },
      addPersonMesh(name, userData, position) {
        const geometry = new THREE.BoxGeometry(5, 5, 5)

        const color = '#FF0000' //Math.floor(Math.random() * 16777215)
        const material = new THREE.MeshPhongMaterial({
          specular: new THREE.Color(color),
          side: THREE.DoubleSide,
          reflectivity: 0.0,
          color
        })

        const materials = viewer.impl.getMaterials()

        materials.addMaterial(
          color.toString(16),
          material,
          true)

        const mesh = new THREE.Mesh(geometry, material)

        mesh.position.x = position.x; //-71
        mesh.position.y = position.y; //-81
        mesh.position.z = position.z;
        mesh.name = name;
        mesh.userData = userData
        console.log('mesh.position', mesh.position)
        externalExtensionPerson.addPersonToView(mesh)
        drawPushpinPerson({
          x: position.x,
          y: position.y,
          z: position.z
        }, userData.mac, name);


      },
      drawPushpinLot(pushpinModelPt, id, name, data) {
        // console.log('idididid', id)
        //convert 3D position to 2D screen coordination
        var screenpoint = viewer.worldToClient(
          new THREE.Vector3(pushpinModelPt.x,
            pushpinModelPt.y,
            pushpinModelPt.z, ));
        $('#mymk' + randomId).remove()
        //build the div container
        var randomId = id; //makeid();
        var htmlMarker = '<div id="mymk' + randomId + '" class="mymlLabel">' + name + '</div>';
        var parent = viewer.container
        $(parent).append(htmlMarker);
        $('#mymk' + randomId).css({
          // 'pointer-events': 'none',
          'width': '80px',
          // 'height': '16px',
          'position': 'absolute',
          'overflow': 'visible',
        });
        $('#mymk' + randomId).click(() => {
          console.log('data', data)
          if (data.device_type === 16) {
            let deviceData = data
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
        })


        //build the svg element and draw a circle
        // $('#mymk' + randomId).append('<svg id="mysvg' + randomId + '"></svg>')

        // var snap = Snap($('#mysvg' + randomId)[0]);
        var rad = 27;
        //set the position of the SVG
        //adjust to make the circle center is the position of the click point
        var $container = $('#mymk' + randomId);
        $container.css({
          'left': screenpoint.x - rad * 2,
          'top': screenpoint.y - rad
        });

        //store 3D point data to the DOM
        var div = $('#mymk' + randomId);
        //add radius info with the 3D data
        pushpinModelPt.radius = rad;
        var storeData = JSON.stringify(pushpinModelPt);
        div.data('3DData', storeData);
      },
      aaaa() {
        console.log('aaaa-click')

        let _position = {
          x: 30,
          y: 30,
          z: 0
        }
        let obj = {
          mac: '20-5d-47-6e-55-9e'
        }
        this.addPersonMesh('test', obj, _position)
      },
      bbbb() {
        console.log('bbbb-click')
        let _position = {
          x: 10,
          y: 10,
          z: 120
        }
        let obj = {
          mac: '20-5d-47-6e-55-9e'
        }
        this.addPersonMesh('test', obj, _position)
      },
      cccc() {
        console.log('ccc-click')
        let obj = {
          mac: '20-5d-47-6e-55-9e'
        }
        $('#mymk' + obj.mac).remove()
        externalExtensionPerson.removePersonFromView(obj)

      }
    },

  }

</script>
