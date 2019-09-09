<style lang="scss">
  @import "./index";

</style>
<template>
  <div class="loT4-index">
    <mqttBim v-on:mqttWeather="mqttWeather" v-on:mqttTaDiao="mqttTaDiao" v-on:mqttShenJiangJi="mqttShenJiangJi">
    </mqttBim>
    <div id="viewer-local">
      <div v-if="noModelTip!==''" class="noModelTip">{{noModelTip}}</div>
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
    <div v-show="showWeatherInfo" class="divDataWeather">
      <!-- <img class='iconTipClose' src='/static/icon/closeIcon.png' @click="closeInfoAreaHandle(3)" title="关闭" /> -->
      <div style="padding-bottom: 5px;font-size: 14px;">环境检测仪</div>
      <div>温度：<span>{{weather_data.temp}}</span> °C</div>
      <div>湿度：<span>{{weather_data.h}}</span> %</div>
      <div>噪声：<span>{{weather_data.noise}}</span> db</div>
      <div>扬尘：<span>{{weather_data.pm10}}</span> ug/m</div>
      <div>PM2.5：<span>{{weather_data.pm2_5}}</span> ug/m</div>
      <div>风速：<span>{{ weather_data.wind }}</span> 级</div>
    </div>
  </div>
</template>

<script>
  import './Viewing.Extension.MeshSelection'
  import moment from 'moment'
  // import './Viewing.Extension.PointCloudMarkup/PointCloudMarkup/PointCloudMarkup.js'
  let towerGroup = null // 塔机
  let elevatorGroup = null // 升降机
  let sectionGroup = null // 升降机轨道

  let datumMeterMap = new Map()
  let towerHeight = null;
  import mqttBim from "./components/mqttBim"
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


  function init3DView(modelURL) {

    Autodesk.Viewing.Initializer(options, function () {
      element = document.getElementById('viewer-local');
      viewer = new Autodesk.Viewing.Private.GuiViewer3D(element, config);
      var startedCode = viewer.start();
      if (startedCode > 0) {
        console.error('Failed to create a Viewer: WebGL not supported.');
        return;
      }

      // viewer.loadModel("https://lmv-models.s3.amazonaws.com/toy_plane/toy_plane.svf", undefined,
      // onLoadSuccess, onLoadError);
      viewer.loadModel(modelURL, undefined, onLoadSuccess, onLoadError);
      // viewer.loadModel("/static/model/tianshui/3d.svf", undefined, onLoadSuccess, onLoadError);


    });
  }

  function onLoadSuccess(event) {
    viewer.fitToView()
    viewer.setBackgroundColor(0, 59, 111, 255, 255, 255);
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
    console.log('viewer', viewer)
    console.log('event', event)
    // console.log(" >LJason< 日志：点击位置", viewer.clientToWorld(event.offsetX, event.offsetY, false).intersectPoint);
    // console.log(event.dbIdArray);
    let _dbIds = event.dbIdArray

    // Asyncronous method that gets object properties
    // 异步获取模型的属性
    viewer.getProperties(_dbIds[0],
      function (elements) {
        console.log('elements', elements)
        // var totalMass = 0;
        // for (var i = 0; i < elements.length; i++) {
        //     totalMass += elements[i].properties[0].displayValue;
        // }
        // console.log(totalMass);


        var dbid = elements.dbId;
        /*

        var bounds = new THREE.Box3();
        var box = new THREE.Box3();
        var instanceTree = viewer.overlays.impl.model.getData().instanceTree;
        var fragList = viewer.overlays.impl.model.getFragmentList();

        instanceTree.enumNodeFragments(dbid, (fragId) => {
          console.log('fragId:' + fragId);

          //某几何单元的全局坐标系包围盒
          fragList.getWorldBounds(fragId, box)
          //合并计算最终整个构件包围盒
          bounds.union(box);

          //某几何单元的全局坐标系变换矩阵
          //从中读取平移或旋转数值
          //由于构件的几何单元应该都是同步变换，所以这些矩阵初始值应该是一样的
          var fm = new THREE.Matrix4();
          fragList.getWorldMatrix(fragId, fm);
          console.log('frag matrix:' + JSON.stringify(fm));
        }, true)
        */
        var tree = viewer.overlays.impl.model.getData().instanceTree;
        var tmpBox = new Float32Array(6);
        tree.getNodeBox(dbid, tmpBox);

        var min = new THREE.Vector3(tmpBox[0], tmpBox[1], tmpBox[2]);
        var max = new THREE.Vector3(tmpBox[3], tmpBox[4], tmpBox[5]);
        let _x = (max.x - min.x) / 2;
        let _y = (max.y - min.y) / 2;
        let _z = (max.z - min.z) / 2;
        console.log(_x, _y, _z)
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
        towerGroup.position.set(80, 36, -127); // 红 绿

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
        elevatorGroup.position.set(230, 45, 30);
        modifyElevator(elevatorGroup, `E${datum.device_id}`, 0, false) //名称，高度，门的开启状态
        viewer.overlays.impl.addOverlay('custom-scene', elevatorGroup)
      } else if (datum.device_type === 100) { // 升降机轨道

        sectionGroup = new THREE.Group()
        sectionGroup.name = "sectionGroup";

        sectionGroup.scale.set(3, 3, 3)

        let paramsJson = JSON.parse(datum.params_json)
        // sectionGroup.position.set(paramsJson.pos_x, paramsJson.pos_y, paramsJson.pos_z); // 红 绿
        sectionGroup.position.set(234, 50, -127);
        LoadSection(sectionGroup, paramsJson.height)
        viewer.overlays.impl.addOverlay('custom-scene', sectionGroup)

      } else if (datum.device_type === 16 || datum.device_type === 18) { // 摄像头
        if (datum.params_json !== '' && datum.params_json !== null) {
          let paramsJson = JSON.parse(datum.params_json)
          if (paramsJson.pos_x !== undefined) {
            console.log(datum.device_type, paramsJson.pos_x)
            // this.addCameraDeviceLabel(datum)

            viewer.loadExtension('Viewing.Extension.MeshSelection').then(
              function (externalExtension) {

                const geometry = new THREE.BoxGeometry(
                  10,
                  2,
                  10)

                const color = Math.floor(Math.random() * 16777215)

                // const material = new THREE.MeshPhongMaterial({
                //   specular: new THREE.Color(color),
                //   side: THREE.DoubleSide,
                //   reflectivity: 0.0,
                //   color
                // })
                var material = new THREE.MeshPhongMaterial({
                  map: THREE.ImageUtils.loadTexture('/static/icon/zhaji.gif')
                });
                const materials = viewer.impl.getMaterials()

                materials.addMaterial(
                  color.toString(16),
                  material,
                  true)

                // var loader = new THREE.TextureLoader();

                // var texture = loader.load("/static/icon/wifiDevice.png");


                // loader.load(
                //   // resource URL
                //   '/static/icon/wifiDevice.png',

                //   // onLoad callback
                //   function (texture) {
                //     // in this example we create the material when the texture is loaded
                //     var material = new THREE.MeshBasicMaterial({
                //       map: texture
                //     });
                //   },

                //   // onProgress callback currently not supported
                //   undefined,

                //   // onError callback
                //   function (err) {
                //     console.error('An error happened.');
                //   }
                // );

                // var material = new THREE.MeshBasicMaterial({
                //   color: 0xff0000,
                //   map: texture
                // });
                const mesh = new THREE.Mesh(geometry, material)

                mesh.position.x = -71
                mesh.position.y = -81
                mesh.position.z = -1.1
                // mesh['userData'] = Math.random() * 10 + 5.0
                // this.viewer.impl.scene.add(mesh)

                // this.viewer.impl.sceneUpdated(true)
                externalExtension.sayHello('Bob', mesh)
              }
            )
          }
        }
      }
    })

    // viewer.loadExtension('Viewing.Extension.MeshSelection').then(

    // )
  }
  // let viewer = viewer

  function initMarker() {
    console.log('viewer.container', viewer.container)
    //delegate the mouse click event

    // 在场景中通过点击添加圆圈标记
    // $(viewer.container).bind("click", onMouseClick);

    //delegate the event of CAMERA_CHANGE_EVENT
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

    drawPushpin({
      x: -67.44389071112374,
      y: -80.14724222255938,
      z: -1.148294448852539
    });
  }

  function onMouseClick(event) {

    var screenPoint = {
      x: event.clientX,
      y: event.clientY
    };

    //get the selected 3D position of the object

    //viewer canvas might have offset from the webpage.

    let viewer_pos = viewer.container.getBoundingClientRect();
    var hitTest = viewer.impl.hitTest(screenPoint.x - viewer_pos.x,
      screenPoint.y - viewer_pos.y, true);

    var hitTest = viewer.impl.hitTest(screenPoint.x, screenPoint.y, true);
    console.log('hitTest', hitTest)
    if (hitTest) {
      drawPushpin({
        x: hitTest.intersectPoint.x,
        y: hitTest.intersectPoint.y,
        z: hitTest.intersectPoint.z
      });
    }
  }

  //generate a random id for each pushpin markup
  function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }

  function drawPushpin(pushpinModelPt) {

    //convert 3D position to 2D screen coordination
    var screenpoint = viewer.worldToClient(
      new THREE.Vector3(pushpinModelPt.x,
        pushpinModelPt.y,
        pushpinModelPt.z, ));

    //build the div container
    var randomId = makeid();
    var htmlMarker = '<div id="mymk' + randomId + '"></div>';
    var parent = viewer.container
    $(parent).append(htmlMarker);
    $('#mymk' + randomId).css({
      'pointer-events': 'none',
      'width': '10px',
      'height': '10px',
      'position': 'absolute',
      'overflow': 'visible'
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
      'left': screenpoint.x - rad * 2 - 40,
      'top': screenpoint.y - rad - 35
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
      mqttBim
    },
    data() {
      return {
        noModelTip: '',
        // towerHeight: 0, // 塔吊高度 28米
        showTadiaoInfo: true,
        showShenjiangjiInfo: true,
        showWeatherInfo: true,
        showShuibiaoInfo: true,
        showDianbiaoInfo: true,
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
        
      }
    },
    computed: {
      project_id() {
        return this.$store.state.project.project_id
      },
    },
    watch: {
      project_id(curVal, oldVal) {
        console.log('project_idproject_idproject_id', curVal, oldVal)
        if (oldVal !== null) {
          // this.clearData()
          location.reload()

        }
        if (curVal !== null) {
          this.init()


        }

      },
    },
    created() {

    },
    mounted() {
      console.log('lot4-index-mounted')
      // init3DView()

    },
    destroyed() {
      // window.removeEventListener('hashchange', this.afterQRScan)
    },
    methods: {
      async init() {
        let _url = this.getModelUrl()
        if (_url !== '') {
          this.noModelTip = ''
          await this.initDevlist()
          init3DView(_url)
        } else {
          this.noModelTip = '当前项目没有模型'
        }

      },
      getModelUrl() {
        let _url = ''
        switch (this.project_id) {
          case 10000:
            _url = '/static/model/qingyang/3d.svf';
            break;

          case 10004:
            _url = '/static/model/tianshui/3d.svf';
            break;

        }
        return _url
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
            resolve()
          }).catch((e) => {
            console.log(e)
            resolve()
          })


        })
      },
      mqttWeather(data) {
        // console.log('weather', data)
        const _data = JSON.parse(data)
        console.log('_data', _data)
        /*
        let _h = "环境检测仪<br/>"
        _h = _h + "温度：" + _data.temp + "°C &nbsp;&nbsp;&nbsp;&nbsp;"
        _h = _h + "湿度：" + _data.h + "% <br/>"
        _h = _h + "噪声：" + _data.noise + "db &nbsp;&nbsp;&nbsp;&nbsp;"
        _h = _h + "扬尘：" + _data.pm10 + "ug/m <br/>"
        _h = _h + "PM2.5：" + _data.pm2_5 + "ug/m &nbsp;&nbsp;&nbsp;&nbsp;"
        _h = _h + "风速：" + _data.wind + "级 <br/>"
        _h = _h + "<span style='font-size:10px;'>服务器时间：" + moment(_data.cdate).format("HH:mm:ss") + "</span><br/>"
        */
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
            modifyElevator(elevatorGroup, `E${_data.HxzId}`, _data.Height, doorOpen) //名称，高度，门的开启状态

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
    },

  }

</script>
