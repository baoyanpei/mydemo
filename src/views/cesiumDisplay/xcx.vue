<style lang="scss">
  @import "./xcx";

</style>
<template>
  <div class="cesium-display-xcx" style="margin: 0px;">
    <div v-if="tip_message!==''" class="not-allow-now" v-html="tip_message"></div>
    <div id="viewer-local"></div>
  </div>
</template>

<script>
  import {
    setToken
  } from '@/utils/auth'
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
        await this.loginByXcxToken()
        await this.getItemInfoListByItemIDs(this.itemIDList)
      },
      getItemInfoListByItemIDs(item_ids) {
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
    }
  }

</script>
