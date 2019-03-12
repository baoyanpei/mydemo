<style lang="scss">
  @import "./index";

</style>
<template>
  <div class="model3d-index" style="margin: 0px;">
    <div id="model3d-index-canvas3d"></div>
    <div id="stat-div"></div>
    <TreeArea id="TreeArea" v-on:unitAllRemove="unitAllRemove" v-on:unitGroupAddMesh="unitGroupAddMesh" v-on:unitRemove="unitRemove"
      v-on:unitTotalAdd="unitTotalAdd" v-on:unitTotalRemove="unitTotalRemove"></TreeArea>

    <div class="model3d-progress">
      <div>加载 {{addedUnit}}/{{totalUnit}} 个组件</div>
      <el-progress :percentage="percentage" color="#6ac044" :show-text="showText"></el-progress>

    </div>

  </div>
</template>

<script>
  // let camera;
  // let renderer;
  // var offscreen = null;
  // var db;
  // var worker = new Worker('offscreencanvas.js')
  import IndexedDB from '../../indexedDB/IndexedDB'
  import {
    // getOriStr,
    getOriMesh
  } from '@/utils/model3d'
  import {
    mapState
  } from 'vuex'
  import TreeArea from "./components/treeArea"
  import {
    Loading
  } from 'element-ui';
  export default {
    directives: {},
    name: 'model3D-index',
    components: {
      TreeArea,
      // ModelDetail
    },
    data() {
      return {
        loader: new THREE.ObjectLoader(),
        modelDB: null,
        stats: new Stats(),
        renderEnabled: true,
        projectiveObj: null,
        mainCanvas: null,
        raycaster: null,
        objects: [],
        scene: null,
        mouse: null,
        camera: null,
        renderer: null,
        controls: null,
        unitLoadingSet: new Set(), // 模型加载数组 
        unitGroups: [
          new THREE.Group(),
          new THREE.Group(),
          new THREE.Group(),
          new THREE.Group(),
          new THREE.Group(),
          new THREE.Group(),
          new THREE.Group(),
          new THREE.Group(),
          new THREE.Group(),
          new THREE.Group()
        ],
        // unitGroup: new THREE.Group(),
        // unitGroup2: new THREE.Group(),
        // unitGroup3: new THREE.Group(),
        // unitGroup4: new THREE.Group(),
        // unitGroup5: new THREE.Group(),
        // unitGroup6: new THREE.Group(),
        // unitGroup7: new THREE.Group(),
        // unitGroup8: new THREE.Group(),
        // unitGroup9: new THREE.Group(),
        // unitGroup10: new THREE.Group(),
        unitRemoveSet: new Set(), // 删除队列

        showText: true,

        percentage: 0,
        totalUnit: 0,
        addedUnit: 0,

        datGui: null,
        gui: {
          fov: 15, //灯光y轴的位置
          position_x: -130,
          position_y: 0,
          position_z: 80,
          save: null,
          load: null,
          clear: null
        },
        saveData: null

      }
    },
    computed: {
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

    },
    mounted() {
      if (typeof (Worker) !== "undefined") {
        console.log(12343)
      } else {
        console.log(123)
      }

      this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
      // document.body.appendChild(this.stats.dom);
      document.getElementById('stat-div').appendChild(this.stats.dom);

      // let controls1 = new function () {
      //   this.获取camera参数 = () => {
      //     console.log("获取当前carame 参数")
      //     // const tc = this.camera.clone();
      //     console.log('this.camera', this.camera)
      //   }
      // };

      // 初始化GUI
      // this.initGUI()

      //初始化变量
      // let fov = this.gui.fov //拍摄距离  视野角值越大，场景中的物体越小
      let near = 1 //相机离视体积最近的距离
      let far = 1000 //相机离视体积最远的距离
      let aspect = (window.innerWidth - 40) / (window.innerHeight - 34); //纵横比
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(this.gui.fov, aspect, near, far);
      this.camera.up = new THREE.Vector3(0, 0, 1); //相机以哪个方向为上方

      this.camera.position.set(this.gui.position_x, this.gui.position_y, this.gui.position_z);
      // this.camera.position.set(-130, 0, 80);
      // this.camera.position.set(-100,0,10);
      this.scene.add(this.camera);


      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
      });
      this.renderer.setSize(window.innerWidth - 40, window.innerHeight - 34);
      this.renderer.setFaceCulling(THREE.CullFaceFront, THREE.FrontFaceDirectionCW);
      // document.body.appendChild(renderer.domElement);
      // this.mainCanvas = document.getElementById('myCanvas')

      // offscreen = htmlCanvas.ControlToOffscreen()

      this.mainCanvas = document.getElementById('model3d-index-canvas3d')
      this.mainCanvas.appendChild(this.renderer.domElement);
      // offscreen.appendChild(this.renderer.domElement);
      // worker.postMessage({canvas:offscreen},[offscreen])
      this.renderer.setClearColor(0xcccccc, 1.0);

      this.controls = new THREE.MapControls(this.camera, this.renderer.domElement);

      this.initLight() //光源
      this.initControls()
      this.initAxes()
      this.initRaycaster()
      this.removeUnit()
      // this.loadUnit()

      window.onresize = this.onWindowResize;
      this.animate();
      this.scene.add(this.unitGroups[0])
      this.scene.add(this.unitGroups[1])
      this.scene.add(this.unitGroups[2])
      this.scene.add(this.unitGroups[3])
      this.scene.add(this.unitGroups[4])
      this.scene.add(this.unitGroups[5])
      this.scene.add(this.unitGroups[6])
      this.scene.add(this.unitGroups[7])
      this.scene.add(this.unitGroups[8])
      this.scene.add(this.unitGroups[9])



    },
    beforeDestroy() {
      console.log("beforeDestroy")
      clearTimeout(this.timeoutid)
      clearTimeout(this.timeRemove)
    },
    destroyed() {},
    methods: {
      render() {
        if (this.renderEnabled === true) {
          // this.renderRaycasterObj(this.raycaster, this.scene, this.camera, this.mouse); //渲染光投射器投射到的对象
          // console.log("fov", this.gui.fov);
          // console.log("this.scene", JSON.stringify(this.scene.toJSON()))
          // this.camera.fov = this.gui.fov;
          // this.camera.position.x = this.gui.position_x;
          // this.camera.position.y = this.gui.position_y;
          // this.camera.position.z = this.gui.position_z;
          // this.camera.updateProjectionMatrix();
          // this.controls.update();
          this.renderer.render(this.scene, this.camera);
        }
      },
      initGUI() {
        this.datGui = new dat.GUI();
        this.datGui.add(this.gui, "fov", 0, 100);
        this.datGui.add(this.gui, "position_x", -180, 180);
        this.datGui.add(this.gui, "position_y", -180, 180);
        this.datGui.add(this.gui, "position_z", -180, 180);
        this.gui.save = () => {
          console.log('this.unitGroup', this.unitGroup)
          this.unitGroup.visible = !this.unitGroup.visible
        }
        this.gui.clear = () => {
          this.scene = new THREE.Scene()
          this.unitGroup = new THREE.Group()
          this.scene.add(this.camera);
          this.scene.add(this.unitGroup)
          this.initLight()
        }
        this.gui.load = () => {
          console.log("load")

          var loadedGeometry = JSON.parse(this.saveData);
          var loader = new THREE.ObjectLoader();
          console.log('loadedGeometry', loadedGeometry)
          this.scene = loader.parse(loadedGeometry);
          this.controls = new THREE.MapControls(this.camera, this.renderer.domElement);


        }
        this.datGui.add(this.gui, 'save');
        this.datGui.add(this.gui, 'clear');
        this.datGui.add(this.gui, 'load');
        this.datGui.domElement.style = 'position:absolute;top:100px;left:50px';
      },
      animate() {
        this.stats.begin();
        this.render();

        this.stats.end();
        requestAnimationFrame(this.animate);

        // this.controls.update();
        // this.scene.updateMatrixWorld(true);
      },
      onWindowResize() {
        // console.log("onWindowResize")
        this.camera.aspect = (window.innerWidth - 40) / (window.innerHeight - 34);
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth - 40, window.innerHeight - 34);
        this.renderer.render(this.scene, this.camera);
      },
      unitAllRemove() {
        // console.log('this.renderer', this.renderer)
        // if (this.renderer !== null) {
        //   console.log("clear")
        //   this.renderer.clear()
        // }

      },
      unitGroupAddMesh(meshJson, modelID) {
        // for (let i = 0, len = this.unitGroups.length; i < len; i++) {
        //   this.unitGroups[i].visible = false
        // }

        this.addedUnit = this.addedUnit + 1
        // if (this.addedUnit < this.totalUnit && this.unitGroups[0].visible == true) {
        //   for (let i = 0, len = this.unitGroups.length; i < len; i++) {
        //     this.unitGroups[i].visible = false
        //   }
        // }

        this.percentage = Math.ceil((this.addedUnit / this.totalUnit) * 100)
        let _mod = Math.floor(Math.random() * 10) //_data.modelID % 10
        let _mesh = this.loader.parse(meshJson)
        this.unitGroups[_mod].add(_mesh)


        const param = {
          modelID: modelID,
          meshID: _mesh.id,
          groupIndex: _mod
        }
        this.$store.dispatch('SetModelIDlist', param).then(() => {
          // console.log("this.treeListData", this.treeListData)
        }).catch((e) => {
          console.log("e", e)
        })

        // if (this.addedUnit == this.totalUnit && this.unitGroups[0].visible == false) {
        //   for (let i = 0, len = this.unitGroups.length; i < len; i++) {
        //     this.unitGroups[i].visible = true
        //   }
        // }
      },
      unitTotalAdd(addTotal) {
        this.totalUnit = this.totalUnit + addTotal
        // if (this.totalUnit == 1) {
        //   console.log('aaaaaa')
        //   for (let i = 0, len = this.unitGroups.length; i < len; i++) {
        //     this.unitGroups[i].visible = false
        //   }
        // }

      },
      unitTotalRemove() {
        this.percentage = 0
        this.totalUnit = 0
        this.addedUnit = 0
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
      loadUnit() {
        if (this.unitLoadingSet.size > 0) {
          this.renderEnabled = true
          // if (this.loadCurrentRemain > 40) {
          //   console.log("123123123123123123")
          //   this.timeoutid = setTimeout(() => {
          //     this.loadUnit()
          //   }, 800)
          //   return
          // }
          let loader = new THREE.ObjectLoader()
          let modelDB = null;
          // IndexedDB.openDB('tbbim', 1, modelDB, {
          //   name: 'model',
          //   key: 'modelID'
          // }, (db) => {
          for (let i = 0, len = this.unitGroups.length; i < len; i++) {
            this.unitGroups[i].visible = false
          }
          // this.loadCurrentRemain = 0
          for (let unitID of this.unitLoadingSet) {



            this.unitLoadingSet.delete(unitID);
            let modelDB = this.modelDB;
            IndexedDB.getData(modelDB, 'model', unitID, (_data) => {
              this.addedUnit = this.addedUnit + 1
              this.percentage = Math.ceil((this.addedUnit / this.totalUnit) * 100)
              if (_data) {
                let mesh = loader.parse(_data.mesh)
                let _mod = _data.modelID % 10
                this.unitGroups[_mod].add(mesh)
              }
            });
            // this.loadCurrentRemain = this.loadCurrentRemain + 1
            // if (this.loadCurrentRemain > 40) {
            //   console.log("1231312")

            //   break;
            // }
          }

          // })

        } else {
          if (this.totalUnit !== 0 && this.totalUnit === this.addedUnit) {
            console.log(123, this.modelMap)
            // this.modelMap.forEach(mesh => {
            //   let _mod = mesh.id % 10
            //   this.unitGroups[_mod].add(mesh)
            // })
            THREE.Cache.clear()
            this.totalUnit = 999
            this.addedUnit = 0

            for (let i = 0, len = this.unitGroups.length; i < len; i++) {
              this.unitGroups[i].visible = true
            }
          }
          // this.renderEnabled = false
        }
        this.timeoutid = setTimeout(() => {
          this.loadUnit()
        }, 100)
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
      initControls() {
        // controls = new THREE.MapControls(camera);
        this.controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
        this.controls.dampingFactor = 1;
        this.controls.screenSpacePanning = true;
        this.controls.minDistance = 0;
        this.controls.maxDistance = 500;
        this.controls.maxPolarAngle = Math.PI / 2;
        // this.controls.autoRotate = true;
      },
      //辅助坐标轴
      initAxes() {
        var size = 1000; // - （可选）表示轴的线的大小。默认值为1
        var axesHelper = new THREE.AxesHelper(size);
        axesHelper.name = "axesHelper";
        this.scene.add(axesHelper);
      },
      // 初始化 光线投射器
      initRaycaster() {
        // this.raycaster = new THREE.Raycaster(); //光线投射器
        this.mouse = new THREE.Vector2(); //二维向量 
        document.addEventListener('mousemove', (event) => {
          event.preventDefault();
          this.mouse.x = ((event.clientX - this.mainCanvas.getBoundingClientRect().left) / this.mainCanvas.offsetWidth) *
            2 - 1;

          this.mouse.y = -((event.clientY - this.mainCanvas.getBoundingClientRect().top) / this.mainCanvas.offsetHeight) *
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
          // var intersects = this.raycaster.intersectObjects(this.scene.children[4].children, true);
          // if (intersects.length > 0) {
          //   if (this.projectiveObj !== null && this.projectiveObj.name !== intersects[0].object) {
          //     let _model = this.modelMap.get(this.projectiveObj.name)
          //     if (_model && _model.material.oldcolor) {
          //       this.projectiveObj.hasChecked = false
          //       this.projectiveObj.material.color = _model.material.oldcolor
          //     }
          //   }
          //   this.projectiveObj = intersects[0].object
          // } else {
          //   if (this.projectiveObj !== null) {
          //     let _model = this.modelMap.get(this.projectiveObj.name)
          //     this.projectiveObj.material.color = _model.material.oldcolor
          //     this.projectiveObj.hasChecked = false
          //     this.projectiveObj = null;
          //   }
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
        document.addEventListener('mousedown', (event) => {
          // console.log('mousedown')
          THREE.Cache.clear()
          // this.unitGroup.visible = false

          for (let i = 0, len = this.unitGroups.length; i < len; i++) {
            if (i !== 0) {
              this.unitGroups[i].visible = false
            }
          }

          if (this.projectiveObj) {
            let _model = this.modelMap.get(this.projectiveObj.name)
            const param = {
              show: true,
              model: _model
            }
            // this.$store.dispatch('SetModelDetailDialog', param).then(() => {}).catch(() => {

            // })
          }
        }, false)

        document.addEventListener('mouseup', (event) => {
          // console.log('mouseup')
          for (let i = 0, len = this.unitGroups.length; i < len; i++) {
            if (i !== 0) {
              this.unitGroups[i].visible = true
            }
          }
        }, false)
      },
      initLight() {
        let directionalLight = new THREE.DirectionalLight(0xF6CB90, 2); //模拟远处类似太阳的光源
        directionalLight.position.set(30, 50, 70).normalize();
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);
        let ambient = new THREE.AmbientLight(0xffffff, 2); //AmbientLight,影响整个场景的光源
        ambient.position.set(0, 0, 0);
        this.scene.add(ambient);
      },
    }
  }

</script>
