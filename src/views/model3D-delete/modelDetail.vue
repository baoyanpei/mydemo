<style lang="scss">
  @import "./modelDetail";

</style>
<template>

  <div id="model-detail" class="model-detail">
    <el-dialog :modal="false" custom-class="ryxx-dialog" width="660px" top="2vh" :lock-scroll="true"
      :close-on-click-modal="false" @open="openModelDetailDialogHandle" @close="closeModelDetailDialogHandle"
      :visible.sync="modelDetailDialog.show" title="模型组件">
      <div id="model3dDetailCanvas3d" ref="model3dDetailCanvas3d"></div>
    </el-dialog>
  </div>

</template>

<script>
  import vue from 'vue'
  import moment from 'moment'
  import lodash from 'lodash'
  import {
    Loading
  } from 'element-ui';
  // import Mock from 'mockjs'
  import {
    getOriStr
  } from '@/utils/model3d'
  export default {
    components: {},
    directives: {},
    computed: {
      project_id() {
        return this.$store.state.project.project_id
      },
      modelMap() {
        return this.$store.state.model3d.modelMap
      },
      modelDataMap() {
        return this.$store.state.model3d.modelDataMap
      },
      modelDetailDialog: {
        get: function () {
          return this.$store.state.model3d.modelDetailDialog
        },
        set: function (newValue) {
          this.$store.state.model3d.modelDetailDialog = newValue
        }
      },
    },
    data() {
      return {
        loadingInstance: null,
        loading: false,

        scene: null,
        mouse: null,
        camera: null,
        renderer: null,
        controls: null,
        mainCanvas: null,
      }
    },
    created: function () {


    },
    watch: {
      loading(curVal, oldVal) {
        if (curVal === false) {} else {

        }
      }

    },
    methods: {
      // 打开窗口
      openModelDetailDialogHandle() {
        vue.nextTick(_ => {
          console.log("openModelDetailDialogHandle", this.modelDetailDialog.model)
          if (this.mainCanvas === null) {
            // this.mainCanvas = this.$refs.model3dDetailCanvas3d //
            this.mainCanvas = document.getElementById('model3dDetailCanvas3d')
            console.log("this.mainCanvas", this.mainCanvas)
            //   console.log('this.getBoundingClientRect', this.mainCanvas.getBoundingClientRect())

            //初始化变量
            let fov = 35 //拍摄距离  视野角值越大，场景中的物体越小
            let near = 1 //相机离视体积最近的距离
            let far = 1000 //相机离视体积最远的距离
            let aspect = 620 / 300; //纵横比
            this.scene = new THREE.Scene();
            this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
            this.camera.up = new THREE.Vector3(0, 0, 1); //相机以哪个方向为上方
            this.camera.position.set(-30,0,30);
            this.scene.add(this.camera);

            this.renderer = new THREE.WebGLRenderer({
              antialias: true,
              alpha: true
            });
            this.renderer.setSize(620, 300);
            // document.body.appendChild(renderer.domElement);

            this.mainCanvas.appendChild(this.renderer.domElement);
            this.renderer.setClearColor(0xcccccc, 1.0);

            this.controls = new THREE.MapControls(this.camera, this.renderer.domElement);
            console.log(this.modelDetailDialog)
            this.initLight() //光源
            this.initControls()
            this.initAxes()

            this.animate();

          }
          let _u = this.modelDataMap.get(this.modelDetailDialog.model.name)

          let geomStr = getOriStr(_u.COMPONENT_GEOM)

          const g_geometry = eval(geomStr)

          let _color = _u.COMPONENT_COLOR.substring(2, 8)
          if (_color === '040404') {
            _color = '444444'
          }
          let groundMaterial = new THREE.MeshLambertMaterial({
            color: new THREE.Color(`#${_color}`),
            transparent: true,
            opacity: _u.ORI_OPACITY
          })
          let mesh = new THREE.Mesh(g_geometry, groundMaterial)
          mesh.name = _u.ID
          this.scene.add(mesh)
          // console.log('meshmeshmesh', mesh)
          g_geometry.computeBoundingBox();

          var centroid = new THREE.Vector3();
          centroid.addVectors(g_geometry.boundingBox.min, g_geometry.boundingBox.max);
          centroid.multiplyScalar(0.5);

          centroid.applyMatrix4(mesh.matrixWorld);
          console.log('centroid', centroid, centroid.x)
          g_geometry.center()
        //   this.camera.position.set(-130, 0, 180);
          //   this.camera.position.set(-130, 0, 80);
        //   this.camera.position.set(centroid.x - 130, centroid.y, centroid.z + 80);
        //   this.camera.lookAt(centroid)
          //   this.camera.lookAt(mesh)
          //   this.camera.lookAt(this.scene.position); //设置相机视野中心

        })


      },
      closeModelDetailDialogHandle() {
        console.log('this.scene.children', this.scene.children)
        // var allChildren = this.scene.children;
        // var lastObject = allChildren[allChildren.length - 1];
        // if (lastObject instanceof THREE.Mesh) {
        //   scene.remove(lastObject);
        //   this.numberOfObjects = scene.children.length;
        // }
        // this.scene.remove(this.modelDetailDialog.model)
        this.scene.children.forEach(child => {
          if (child instanceof THREE.Mesh) {
            this.scene.remove(child)
          }

        })
      },
      render() {
        // this.renderRaycasterObj(this.raycaster, this.scene, this.camera, this.mouse); //渲染光投射器投射到的对象
        this.renderer.render(this.scene, this.camera);

      },
      animate() {
        // this.stats.begin();
        this.render();
        // this.stats.end();
        requestAnimationFrame(this.animate);

        // this.controls.update();
        // this.scene.updateMatrixWorld(true);
      },
      initControls() {
        // controls = new THREE.MapControls(camera);
        this.controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
        this.controls.dampingFactor = 1;
        this.controls.screenSpacePanning = true;
        this.controls.minDistance = 0;
        this.controls.maxDistance = 500;
        this.controls.maxPolarAngle = Math.PI / 2;
      },
      //辅助坐标轴
      initAxes() {
        var size = 1000; // - （可选）表示轴的线的大小。默认值为1
        var axesHelper = new THREE.AxesHelper(size);
        axesHelper.name = "axesHelper";
        this.scene.add(axesHelper);
      },
      initLight() {

        let directionalLight = new THREE.DirectionalLight(0xF6CB90, 2); //模拟远处类似太阳的光源
        directionalLight.position.set(30, 50, 70).normalize();
        // directionalLight.position.set(0, 0, 110);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);
        let ambient = new THREE.AmbientLight(0xffffff, 2); //AmbientLight,影响整个场景的光源
        ambient.position.set(0, 0, 0);
        this.scene.add(ambient);

        // this.controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
        // this.controls.dampingFactor = 1;
        // this.controls.screenSpacePanning = true;
        // this.controls.minDistance = 0;
        // this.controls.maxDistance = 1000;
        // this.controls.maxPolarAngle = Math.PI / 2;
      },
    },
    mounted() {

    }
  }

</script>
