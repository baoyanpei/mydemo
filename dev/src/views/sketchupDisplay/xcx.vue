<style lang="scss">
  @import "./xcx";

</style>
<template>
  <div class="sketchup-display-xcx" style="margin: 0px;">
    <div id="viewer-local" v-show="tip_message===''" class="viewer-local"></div>
    <div v-if="tip_message!==''" class="tip_message" v-html="tip_message"></div>
    <el-progress v-if="isLoadingModel" :percentage="loadModelPercentage" class="load-model-ercentage"></el-progress>
  </div>
</template>

<script>
  import {
    setToken
  } from '@/utils/auth'
  import loadJs from '@/utils/loadJs.js'
  let element = null;
  let camera, scene, renderer;
  let geometry, material, mesh;
  let pointLight;
  let controls;
  let model;
  let loader;

  let manager; // = new THREE.LoadingManager();



  function init() {
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    // camera.position = new THREE.Vector3(0, 1000, 1000);
    camera.position.set(0, 1000, 1000);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    scene = new THREE.Scene();
    scene.add(model);

    pointLight = new THREE.PointLight(0xffffff);
    // pointLight.position = new THREE.Vector3(0, 1000, 0);
    pointLight.position.set(0, 1000, 0);
    scene.add(pointLight);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xadc0d0, 0.99);
    element = document.getElementById('viewer-local');
    element.appendChild(renderer.domElement);
    initControls();
  }

  /* 控制器 */
  function initControls() {

    controls = new THREE.OrbitControls(camera, renderer.domElement);


    /* 属性参数 */
    // controls.enableDamping = true; // 启用动态阻尼时需要一个动画循环
    // controls.dampingFactor = 0.30;

    // controls.screenSpacePanning = false; // 若为 true 则可以平移

    // controls.maxDistance = 400;
    // controls.minDistance = 100;

    // controls.maxPolarAngle = Math.PI / 2.2;
    // controls.autoRotate = false;

  }

  function render() {
    requestAnimationFrame(render);
    // model.rotation.y += 0.002;
    renderer.render(scene, camera);
  }

  function onWindowResize() {
    // 重新设置相机宽高比例
    camera.aspect = window.innerWidth / window.innerHeight;
    // 更新相机投影矩阵
    camera.updateProjectionMatrix();
    // 重新设置渲染器渲染范围
    // webGLRenderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  }
  window.addEventListener('resize', onWindowResize);
  export default {
    directives: {},
    name: 'sketchup-display-xcx',
    components: {},
    data() {
      return {
        isLoadingModel: false,
        loadModelPercentage: 0,
        access_token: '',
        tip_message: '',
        project_id: '',
        itemIDList: [],
        itemInfoList: [],


      }
    },
    computed: {

    },
    created() {

    },
    watch: {

    },
    mounted() {

      console.log('this.$route', this.$route.query)

      const __PROJECT_ID = this.$route.query.projectid
      const __ITEMS = this.$route.query.items
      const __ERROR_MESSAGE = this.$route.query.errormsg
      this.access_token = this.$route.query.token
      if (__PROJECT_ID === undefined || __PROJECT_ID === '') {
        this.tip_message = '缺少参数 projectid'
        return
      } else if (__ITEMS === undefined || __ITEMS === '') {
        this.tip_message = '缺少参数 items'
        return
      } else if (this.access_token === undefined || this.access_token === '') {
        this.tip_message = '缺少参数 token'
        return
      }

      console.log('__ERROR_MESSAGE', __ERROR_MESSAGE)

      if (__ERROR_MESSAGE !== undefined && __ERROR_MESSAGE !== '') {
        this.tip_message = __ERROR_MESSAGE + '<br/>' + this.access_token
        return
      }

      this.project_id = parseInt(__PROJECT_ID)

      this.itemIDList = [__ITEMS] // 单个 多个则使用 __ITEMS.split('|') 这个模型类型不支持多个
      this.init()

    },
    beforeDestroy() {},
    destroyed() {},
    methods: {
      loginByXcxToken() { // 通过小程序的token 登录
        // console.log('this.project_id', this.project_id)
        return new Promise((resolve, reject) => {
          this.$store.dispatch('LoginByXcxToken', {
            access_token: this.access_token
          }).then(() => {

            setToken(this.access_token)
            resolve()
            // this.init()
          })
        })
      },
      async init() {
        this.tip_message = "正在读取模型数据..."
        await this.loginByXcxToken()
        await this.getProjectFiles(this.itemIDList)
        let _urlList = this.getModelUrl()
        console.log('_urlList', _urlList)
        if (_urlList.length !== 0) {

          this.tip_message = '正在加载模型底层程序...'
          await loadJs(`./static/libs/model3d/three.min.js`)
          console.log('./static/libs/model3d/three.min.js')

          await loadJs(`./static/libs/model3d/ColladaLoader.js`)
          console.log('./static/libs/model3d/ColladaLoader.js')
          await loadJs(`./static/libs/model3d/OrbitControls.js`)
          console.log('./static/libs/model3d/OrbitControls.js')

          let _sketchupUrl = _urlList[0]
          // 加载测试模型
          this.tip_message = '正在读取模型，请耐心等候'
          manager = new THREE.LoadingManager();
          manager.onProgress = function (item, loaded, total) {
            // console.log("----->", item, loaded, total);
            // this.tip_message = '正在读取材质，请耐心等候'
            // var percentComplete = loaded / total * 100;
            // this.loadModelPercentage = Math.round(percentComplete, 2);
          };

          loader = new THREE.ColladaLoader(manager);

          console.log('loader', loader)
          let _tempUrlArray = _sketchupUrl.split('/');
          _tempUrlArray.pop()
          console.log('_temp', _tempUrlArray)
          loader.resourcePath = _tempUrlArray.join('/') + "/"
          loader.options.convertUpAxis = true;
          this.isLoadingModel = true;
          loader.load(_sketchupUrl, (collada) => {
            console.log('loadloadloadload')

            model = collada.scene;

            model.scale.x = model.scale.y = model.scale.z = 1;
            model.updateMatrix();


            init();
            this.tip_message = ""
            render();
          }, (xhr) => {
            if (xhr.lengthComputable) {
              var percentComplete = xhr.loaded / xhr.total * 100;
              this.loadModelPercentage = Math.round(percentComplete, 2);
              console.log(Math.round(percentComplete, 2) + '% downloaded');
              if (this.loadModelPercentage >= 100) {
                this.tip_message = '正在初始化模型...'
                this.isLoadingModel = false;
              }
            }
          }, (xhr) => {

            console.log('error', xhr)
          });
        } else {
          this.tip_message = '分享的模型已不存在或ID不正确'
        }
      },

      getProjectFiles(item_ids) {
        // console.log('this.project_id', this.project_id)
        return new Promise((resolve, reject) => {
          const param = {
            method: 'project_files',
            project_id: this.project_id,
            file_type: 3,
            file_ids: item_ids

          }
          this.$store.dispatch('GetProjectFiles', param).then((_itemList) => {
            console.log('_itemList_itemList', _itemList)
            _itemList.forEach(build => {
              this.itemInfoList.push(build)
            });
            console.log('this.itemInfoList', this.itemInfoList)
            resolve()
          })
        })
      },
      getModelUrl() {
        let _urlList = []
        this.itemInfoList.forEach(itemInfo => {
          _urlList.push(itemInfo.url)
        });
        return _urlList
      },
    }
  }

</script>
