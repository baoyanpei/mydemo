<style lang="scss">
  @import "./xcx";
  @import "./main";
  @import "../../script/Bentley/Bentley.css";
  @import "../../script/Cesium/Widgets/widgets.css";

</style>
<template>
  <div class="cesium-display-xcx" style="margin: 0px;">
    <div id="cesiumDiv" v-show="tip_message===''" class="viewer-local"></div>
    <div v-if="tip_message!==''" class="tip_message" v-html="tip_message"></div>
  </div>
</template>

<script>
  import {
    setToken
  } from '@/utils/auth'
  import loadJs from '@/utils/loadJs.js'
  var App;
  export default {
    directives: {},
    name: 'cesium-display-xcx',
    components: {},
    data() {
      return {
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
          await loadJs(`./static/libs/App_CCWebViewer2/scripts/Cesium/Cesium.js`)
          App = require('@/script/App/App.js');
          var _config = {
            "units": "metric",
            // "url": "/static/Scene/Production.json",
            "url": _urlList[0],
            "name": ""
          }

          App.main.run('cesiumDiv', _config, this.callback);
          this.tip_message = ""
        } else {
          this.tip_message = '分享的模型已不存在或ID不正确'
        }
      },
      callback(userError) {
        if (userError !== undefined) {
          this.tip_message = "模型加载出错：" + userError
        }
        console.log('11122233', userError)
      },
      getProjectFiles(item_ids) {
        // console.log('this.project_id', this.project_id)
        return new Promise((resolve, reject) => {
          const param = {
            method: 'project_files',
            project_id: this.project_id,
            file_type: 4,
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
