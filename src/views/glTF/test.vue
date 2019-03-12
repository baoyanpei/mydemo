<style lang="scss">
  @import "./test";

</style>
<template>
  <div class="glTF-test" style="margin: 0px;">
    <div id="model3d-index-canvas3d"></div>


    <p id="loading">loading......</p>
  </div>
</template>

<script>
  // let camera;
  // let renderer;
  let scene, camera, renderer, controls, guiControls;
  let stats;
  import {
    mapState
  } from 'vuex'
  import {
    Loading
  } from 'element-ui';
  export default {
    directives: {},
    name: 'glTF-test',
    components: {
      // ModelDetail
    },
    data() {
      return {

      }
    },
    computed: {

    },
    created() {

    },
    watch: {

    },
    mounted() {
      stats = initStats();

      /* 场景 */
      function initScene() {

        scene = new THREE.Scene();

      }

      /* 相机 */
      function initCamera() {

        camera = new THREE.PerspectiveCamera(15, window.innerWidth / window.innerHeight, 1, 1000);
        // camera.position.set(5, 0, 10);
        camera.position.set(-130, 0, 80);
        camera.lookAt(new THREE.Vector3(0, 0, 0));

      }

      /* 渲染器 */
      function initRender() {

        renderer = new THREE.WebGLRenderer({
          antialias: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x0E3866);
        var mainCanvas = document.getElementById('model3d-index-canvas3d')
        mainCanvas.appendChild(renderer.domElement);

        // document.body.appendChild(renderer.domElement);

      }

      /* 灯光 */
      function initLight() {

        scene.add(new THREE.AmbientLight(0xffffff));

      }

      /* 控制器 */
      function initControls() {
          
        controls = new THREE.MapControls(camera, renderer.domElement);
        controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
        controls.dampingFactor = 1;
        controls.screenSpacePanning = true;
        controls.minDistance = 0;
        controls.maxDistance = 500;
        controls.maxPolarAngle = Math.PI / 2;

        // controls = new THREE.OrbitControls(camera, renderer.domElement);

        /* 属性参数默认 */

      }

      /* 调试插件 */
      function initGui() {

        guiControls = new function () {

        };

        let controls = new dat.GUI({
          width: 200
        });

      }

      /* 场景中的内容 */
      function initContent() {

        // 加载 glTF 格式的模型
        let loader = new THREE.GLTFLoader(); /*实例化加载器*/

        loader.load('../static/gltf/floor2.gltf', function (obj) {
          //   scene.scale.set(.1, .1, .1);
          console.log("1111", obj);
          obj.scene.position.y = 1;
          scene.add(obj.scene);
          document.getElementById('loading').style.display = 'none';

        }, function (xhr) {
          console.log(xhr);
          //   console.log((xhr.loaded / xhr.total * 100) + '% loaded111');

        }, function (error) {

          console.log('load error!' + error);

        })

      }

      /* 性能插件 */
      function initStats() {

        let stats = new Stats();

        document.body.appendChild(stats.domElement);

        return stats;

      }

      /* 窗口变动触发 */
      function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);

      }

      /* 数据更新 */
      function update() {

        stats.update();

      }

      /* 初始化 */
      function init() {

        initScene();
        initCamera();
        initRender();
        initLight();
        initControls();
        initContent();
        initGui();

        /* 监听事件 */
        window.addEventListener('resize', onWindowResize, false);

        document.addEventListener('mousedown', onDocumentMouseDown);


      }

      function onDocumentMouseDown(event) {
        console.log(scene.children[1].children[0].children[0].children)
        event.preventDefault();
        var mouse3D = new THREE.Vector3((event.clientX / window.innerWidth) * 2 - 1,
          -(event.clientY / window.innerHeight) * 2 + 1,
          0.5);
        var raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse3D, camera);
        var intersects = raycaster.intersectObjects(scene.children[1].children[0].children[0].children);
        console.log(intersects)
        if (intersects.length > 0) {
          intersects[0].object.material.color.setHex(Math.random() * 0xffffff);
        }
      }

      /* 循环渲染 */
      function animate() {

        requestAnimationFrame(animate);
        renderer.render(scene, camera);
        update();

      }

      console.log("three init start...");

      init();
      animate();

      console.log("three init send...");



      //   var loader = new THREE.GLTFLoader();
      //   loader.load('/static/gltf/houqing-floor2/houqing-floor2.gltf', function (gltf) {
      //     gltf.scene.scale.set(.1, .1, .1);
      //     scene.add(gltf.scene);
      //   });
    },
    beforeDestroy() {},
    destroyed() {},
    methods: {

    }
  }

</script>
