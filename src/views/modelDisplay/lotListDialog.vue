<style lang="scss">
  @import "./lotListDialog";

</style>
<template>

  <div id="lot-list-dialog" class="lot-list-dialog">
    <el-dialog :modal="false" width="300px" top="10vh" left="100" :lock-scroll="true" :close-on-click-modal="false"
      :close-on-press-escape="true" :visible.sync="LotListDialog.show" @opened="openedDialogHandle"
      @close="closeDialogHandle" :title="dialogTitle" v-el-drag-dialog>

      <div class="component-library-list">
        <div v-show="tipMessage!==''" class="tip-message">{{tipMessage}}</div>

      </div>

    </el-dialog>
  </div>

</template>

<script>
  let Base64 = require('js-base64').Base64

  import {
    Loading
  } from 'element-ui';

  export default {
    components: {},
    directives: {},
    data() {
      return {
        loadingFull: false,
        dialogTitle: '物联网设备库',
        tipMessage: '',
      }
    },
    computed: {
      project_id: {
        get: function () {
          return this.$store.state.project.project_id
        },
        set: function (newValue) {
          this.$store.state.project.project_id = newValue
        }
      },
      LotListDialog: {
        get: function () {
          return this.$store.state.loT.LotListDialog
        },
        set: function (newValue) {
          this.$store.state.loT.LotListDialog = newValue
        }
      },

    },
    props: {

    },
    created: function () {

    },
    mounted() {
      // const __PROJECT_ID = Cookies.get("PROJECT_ID")
      // this.project_id = parseInt(__PROJECT_ID)

    },
    watch: {


    },
    methods: {
      clearData() {

      },
      openedDialogHandle() {
        // this.tipMessage = "正在查询ComponentLibraryListDialog"
        console.log('this.LotListDialog', this.LotListDialog)

        this.getDeviceConfigList()
      },
      closeDialogHandle() {
        this.clearData()
      },

      getDeviceConfigList() {
        return new Promise((resolve, reject) => {
          this.buildList = []
          const param = {
            method: 'device_config',
            project_id: this.project_id,
            // access_token: this.access_token
          }
          this.$store.dispatch('GetDeviceConfig', param).then((_itemList) => {
            console.log('GetDeviceConfig - _itemList', _itemList)

            resolve()
          })

        })
      },
    }
  }

</script>
